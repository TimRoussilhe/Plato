const fse = require('fs-extra');
const path = require('path');

// const config = require('../../site-config.js');

const srcPath = './src';
const distPath = './build';
const distDataPath = './build/data';

const routes = require('../../shared/routes/routes.json');
const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

const buildPageFromRoutes = require('../buildPage.js');
const {saveRemoteDataFromSource, updateRoutes} = require('../saveData.js');
const createPages = require('../createPages.js');
const buildProductionBundle = require('./build-javascript.js');
const buildCritical = require('./build-critical.js');

const files = [];
const siteDir = './build/';

module.exports = async function build() {

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

	// save remote endpoint for static routes
	try {

		for (const route of routes.staticRoutes) {
			if (route.data) saveRemoteDataFromSource(route.data, route.json, siteDir + 'data/');
		}

	} catch (err){
		console.log('Error during saving static file: '+err);
		process.exit(1);
	}

	await createPages.createPages(siteDir + 'data/');

	// Build Javascript and CSS Production Bundle
	// Return the manifest with files and ther hashed path.
	const manifestFile = await buildProductionBundle().catch((err) => {
		console.log('Generating JavaScript bundles failed', err);
	});

	const finalRoutes = fse.readJsonSync(routeDestPath);
	try {

		for (let page of finalRoutes.routes) {
			const filename = await buildPageFromRoutes(page, manifestFile, 'production', siteDir);
			files.push(filename);
		}

	} catch (err){
		console.log('Error during page generation: '+err);
		process.exit(1);
	}

	for (const file of files) {
		await buildCritical(file);
	}

};
