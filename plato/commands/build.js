const fse = require('fs-extra');
const path = require('path');

// const config = require('../../site-config.js');

const srcPath = './src';
const distPath = './build';
const distDataPath = './build/data';

// report
const report = require('../utils/reporter');

function reportFailure(msg, err) {
	report.log('');
	report.panic(msg, err);
}

const routes = require('../../shared/routes/routes.json');
const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

const buildHTML = require('../core/buildHTML');
const {saveRemoteDataFromSource, updateRoutes} = require('../core/saveData');
const buildProductionBundle = require('./build-javascript.js');
const buildCritical = require('./build-critical.js');

const files = [];
const siteDir = './build/';

module.exports = async function build() {

	let globalActivity;
	globalActivity = report.activityTimer(
		'Plato Build',
	);
	globalActivity.start();

	let activity;
	activity = report.activityTimer(
		'Cleaning Repo',
	);
	activity.start();

	// clear destination folder
	fse.emptyDirSync(distPath);
	fse.emptyDirSync(distDataPath);

	// remove real_routes files
	fse.removeSync('./shared/routes/real_routes.json');

	// copy assets folder
	fse.copySync(`${srcPath}/.htaccess`, `${distPath}/.htaccess`);
	fse.copySync(`${srcPath}/assets`, `${distPath}/assets`);
	fse.copySync(`${srcPath}/data`, `${distPath}/data`);

	// add static routes to final_routes
	await updateRoutes(routes.staticRoutes);
	activity.end();

	activity = report.activityTimer(
		'Save remote Data',
	);
	activity.start();
	// save remote endpoint for static routes
	try {

		for (const route of routes.staticRoutes) {
			if (route.data) saveRemoteDataFromSource(route.data, route.json, siteDir + 'data/');
		}

	} catch (err){
		reportFailure('Error during saving static file: '+err);
	}
	activity.end();


	activity = report.activityTimer(
		'Create Pages from Plato API',
	);
	activity.start();
	// check if node API is used and if so check if createPages is used
	try {

		let nodeAPI = require('../../plato-node');
		if (nodeAPI && nodeAPI.createPages){
			await nodeAPI.createPages(siteDir + 'data/');
		}

	} catch (err) {
		console.log('No API found: '+err);
	}
	activity.end();


	activity = report.activityTimer(
		'Build Javascript',
	);
	activity.start();
	// Build Javascript and CSS Production Bundle
	// Return the manifest with files and ther hashed path.
	const manifestFile = await buildProductionBundle().catch((err) => {
		reportFailure('Generating JavaScript bundles failed', err);
	});
	activity.end();


	activity = report.activityTimer(
		'Build HTML:',
	);
	activity.start();
	const finalRoutes = fse.readJsonSync(routeDestPath);
	try {

		for (let page of finalRoutes.routes) {
			const filename = await buildHTML(page, manifestFile, 'production', siteDir);
			files.push(filename);
		}

	} catch (err){
		reportFailure('Error during page generation: '+err);
	}
	activity.end();


	activity = report.activityTimer(
		'Build Critical CSS and minify HTML',
	);
	activity.start();

	for (const file of files) {
		await buildCritical(file);
	}
	activity.end();
	globalActivity.end();

};
