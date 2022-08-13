import fse from 'fs-extra';
import path from 'path';
import opn from 'opn';
import connect from 'connect';
import serveStatic from 'serve-static';

// report
import reporter from '../utils/reporter.js';
import buildHTML from '../core/buildHTML.js';
import { saveRemoteDataFromSource, updateRoutes } from '../core/saveData.js';
import { createPages } from '../core/createPages.js';
import buildProductionBundle from './build-javascript.js';
import buildCritical from './build-critical.js';

// check if node API is used and if so, check if createPages is used
import { createGlobalData, getStaticPagesProps } from './../../plato-node.js';

export default async function build(verbose, open) {
	reporter.verbose = verbose;

	// Grab static routes
	let rawdata = fse.readFileSync(path.resolve(global.appRoot, './shared/routes.json'));
	const staticRoutes = JSON.parse(rawdata).staticRoutes;

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
	fse.emptyDirSync(global.siteDir);
	fse.emptyDirSync(path.resolve(global.siteDir, './data'));

	// remove real_routes files
	fse.emptyDirSync(global.routeDest);

	// copy assets folder
	fse.copySync(`${global.srcPath}/.htaccess`, `${global.siteDir}/.htaccess`);
	fse.copySync(`${global.srcPath}/assets`, `${global.siteDir}/assets`);
	fse.copySync(`${global.srcPath}/data`, `${global.siteDir}/data`);

	// add static routes to final_routes
	await updateRoutes(staticRoutes);
	activity.end();

	/**
	 * Save remote date from the static route file
	 */
	activity = reporter.activity('Save remote Data', '🛣️');
	activity.start();
	// save remote endpoint for static routes
	try {
		for (const route of staticRoutes) {
			if (route.data) saveRemoteDataFromSource(route.data, route.json, global.siteDir + '/data/');
		}
	} catch (err) {
		reporter.failure('Error during saving static file: ', err);
	}
	activity.end();

	/**
	 * Get Pages data from Plato Node API getStaticPagesProps method
	 */
	activity = reporter.activity('Create Pages from Plato API', '🤖');
	activity.start(true);
	let pagesProps;
	try {
		if (getStaticPagesProps) {
			pagesProps = await getStaticPagesProps();
		}
	} catch (err) {
		reporter.info('Error during getStaticPagesProps call');
	}

	/**
	 * Create Pages from Plato Node API getStaticPagesProps method
	 */
	let finalRoutes;
	try {
		if (pagesProps && pagesProps.length > 0) {
			finalRoutes = await createPages(pagesProps, global.siteDir);
		}
	} catch (err) {
		reporter.error('Error during page creation ' + err);
	}

	// check if node API is used and if so, check if createGlobalData is used
	let globalData;
	try {
		if (createGlobalData) {
			globalData = await createGlobalData();
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
	await buildProductionBundle('').catch((err) => {
		reporter.failure('Generating JavaScript bundles failed', err);
	});

	activity.end();

	/**
	 * Build legacy javascript using webpack
	 */
	activity = reporter.activity('Build Legacy Javascript', '👴');
	activity.start();
	await buildProductionBundle('legacy').catch((err) => {
		reporter.failure('Generating Legacy JavaScript bundles failed', err);
	});

	activity.end();

	activity = reporter.activity('Build HTML', '💻');
	activity.start();

	// manifest created by webpack prod build
	const files: any[] = [];
	const manifestFile = fse.readJsonSync('./build/assets/manifest.json');
	try {
		for (let page of finalRoutes.routes) {
			const filename = await buildHTML(page, manifestFile, 'production', global.siteDir, globalData);
			files.push(filename);
		}
	} catch (err) {
		reporter.failure('Error during page generation: ', err);
	}
	activity.end();

	activity = reporter.activity('Build Critical CSS and minify HTML', '🎨');
	activity.start();

	function startNewJob() {
		const file = files.pop(); // NOTE: mutates file array
		if (!file) {
			// no more new jobs to process (might still be jobs currently in process)
			return Promise.resolve();
		}
		const dest = path.join(global.siteDir, file);
		console.log('dest', dest);
		return buildCritical(file, dest)
			.then(() => {
				// Then call to see if there are more jobs to process
				reporter.info(`Critical Built : ${file}`);
				return startNewJob();
			})
			.catch((err) => reporter.failure('Error during Critical generation: ', err));
	}
	// how many jobs do we want to handle in paralell?
	// Below, 3:
	await Promise.all([startNewJob(), startNewJob(), startNewJob()]).catch((err) =>
		reporter.failure('Error during Critical generations: ', err)
	);

	activity.end();
	globalActivity.end();

	// open HTTP server serving our local files
	if (open) {
		const port = 8080;
		connect()
			.use(serveStatic(global.siteDir))
			.listen(port, function () {
				reporter.displayUrl(`Server running on ${port}`, 'http://localhost:' + port);
				opn('http://localhost:' + port);
			});
	}
}
