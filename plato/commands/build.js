const fse = require('fs-extra');
const path = require('path');

const connect = require('connect');
const serveStatic = require('serve-static');

const srcPath = './src';
// const distPath = './build';
const distDataPath = './build/data';

// report
const reporter = require('../utils/reporter');
const routes = require('../../shared/routes/routes.json');
const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

const buildHTML = require('../core/buildHTML');
const { saveRemoteDataFromSource, updateRoutes } = require('../core/saveData');
const buildProductionBundle = require('./build-javascript.js');
const buildCritical = require('./build-critical.js');

const files = [];
const siteDir = './build/';

module.exports = async function build(verbose, open) {
	reporter.verbose = verbose;

	let globalActivity;
	globalActivity = reporter.activity('Plato Build', '🤔');
	globalActivity.start();

	/**
	 * Clean repo
	 * Empty directories and move source files
	 */
	let activity = reporter.activity('Cleaning Repo', '🧽');
	activity.start();

	// clear destination folder
	fse.emptyDirSync(siteDir);
	fse.emptyDirSync(distDataPath);

	// remove real_routes files
	fse.removeSync('./shared/routes/real_routes.json');

	// copy assets folder
	fse.copySync(`${srcPath}/.htaccess`, `${siteDir}/.htaccess`);
	fse.copySync(`${srcPath}/assets`, `${siteDir}/assets`);
	fse.copySync(`${srcPath}/data`, `${siteDir}/data`);

	// add static routes to final_routes
	await updateRoutes(routes.staticRoutes);
	activity.end();

	/**
	 * Save remote date from the static route file
	 */
	activity = reporter.activity('Save remote Data', '🛣️');
	activity.start();
	// save remote endpoint for static routes
	try {
		for (const route of routes.staticRoutes) {
			if (route.data) saveRemoteDataFromSource(route.data, route.json, siteDir + 'data/');
		}
	} catch (err) {
		reporter.failure('Error during saving static file: ' + err);
	}
	activity.end();

	/**
	 * Create Pages from Plato Node API createPages method
	 */
	activity = reporter.activity('Run Plato Node API', '🤖');
	activity.start();
	// check if node API is used and if so check if createPages is used
	let nodeAPI = require('../../plato-node');

	try {
		if (nodeAPI && nodeAPI.createPages) {
			await nodeAPI.createPages(siteDir + 'data/');
		}
	} catch (err) {
		console.log('No API found: ' + err);
	}

	// check if node API is used and if so, check if createGlobalData is used
	let globalData;
	try {
		if (nodeAPI && nodeAPI.createGlobalData) {
			globalData = await nodeAPI.createGlobalData();
		}
	} catch (err) {
		console.log('No API found: ' + err);
	}

	activity.end();

	/**
	 * Build production javascript using webpack
	 */
	activity = reporter.activity('Build Javascript', '📁');
	activity.start();
	// Build Javascript and CSS Production Bundle Return the manifest with files and
	// their hashed path.
	const manifestFile = await buildProductionBundle().catch(err => {
		reporter.failure('Generating JavaScript bundles failed', err);
	});

	activity.end();

	activity = reporter.activity('Build HTML', '💻');
	activity.start();
	const finalRoutes = fse.readJsonSync(routeDestPath);
	try {
		for (let page of finalRoutes.routes) {
			const filename = await buildHTML(page, manifestFile, 'production', siteDir, globalData);
			files.push(filename);
		}
	} catch (err) {
		reporter.failure('Error during page generation: ' + err);
	}
	activity.end();

	activity = reporter.activity('Build Critical CSS and minify HTML', '🎨');
	activity.start();

	function startNewJob() {
		const file = files.pop(); // NOTE: mutates urls array
		if (!file) {
			// no more new jobs to process (might still be jobs currently in process)
			return Promise.resolve();
		}
		return buildCritical(file)
			.then(() => {
				// Then call to see if there are more jobs to process
				reporter.info(`Critical Built : ${file}`);
				return startNewJob();
			})
			.catch(err => reporter.failure('Error during Critical generation: ' + err));
	}
	// how many jobs do we want to handle in paralell?
	// Below, 3:
	await Promise.all([startNewJob(), startNewJob(), startNewJob()]).catch(err =>
		reporter.failure('Error during Critical generations: ' + err)
	);

	activity.end();
	globalActivity.end();

	// open HTTP server serving our local files
	if (open) {
		const port = 8080;
		connect()
			.use(serveStatic(siteDir))
			.listen(port, function() {
				reporter.displayUrl(`Server running on ${port}`, 'http://localhost:' + port);
				opn('http://localhost:' + port);
			});
	}
};
