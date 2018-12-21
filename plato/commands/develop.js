const fse = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../../config/webpack.dev.config');
const port = 8080;
const opn = require('opn');

const srcPath = './src';
const distPath = './public';
const distDataPath = './public/data';

const buildPage = require('../buildPage.js');
const {saveRemoteDataFromSource, updateRoutes} = require('../saveData.js');
const createPages = require('../createPages.js');

const routes = require('../../shared/routes/routes.js');
const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

// Something to use when events are received.
let log = console.log.bind(console);
const siteDir = './public/';

module.exports = async function develop() {

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
	// save remote endpoint for static routes
	try {

		await updateRoutes(routes.routes);

	} catch (err){
		console.log('Error during updating routes: '+err);
		process.exit(1);
	}

	// save remote endpoint for static routes
	try {

		for (const route of routes.routes) {
			if (route.data) saveRemoteDataFromSource(route.data, route.json, siteDir + 'data/');
		}

	} catch (err){
		console.log('Error during saving static file: '+err);
		process.exit(1);
	}

	try {

		await createPages.createPages(siteDir + 'data/');

	} catch (err){
		console.log('Error during creating pages: '+err);
		process.exit(1);
	}

	const finalRoutes = fse.readJsonSync(routeDestPath);
	try {

		for (let page of finalRoutes.routes) {
			await buildPage(page, null, 'development', siteDir);
		}

	} catch (err){
		console.log('Error during page generation: '+err);
		process.exit(1);
	}

	// Initialize watcher.
	let watcher = chokidar.watch('./shared/templates/', {
		ignored: /(^|[\/\\])\../,
		persistent: true,
	});

	watcher.add('./shared/partials/');

	watcher
		.on('add', (path) => log(`File ${path} has been added`))
		.on('change', (path, stats) => {
			const activeRoutes = routes.getRoutesByTemplatePath(path);
			if (activeRoutes !== null){

				for (let page of activeRoutes) {
					buildPage(page, null, 'development', siteDir).catch(console.error);
				}

			} else {
			// change from a partial => rebuild everything
			// TODO : check if change is not happening in an unlink template
				for (let page of finalRoutes.routes) {
					buildPage(page, null, 'development', siteDir).catch((err) => {
						log(`Error: ${err}`);
						process.exit(1);
					});
				}

			}
			log(`File ${path} has been changed`);
		});

	const options = {
		contentBase: './public',
		publicPath: '/assets/js/',
		port,
		hot: true,
		inline: true,
		host: 'localhost',
		watchContentBase: true,
		watchOptions: {
			poll: true,
		},
	};

	WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);
	const compiler = webpack(webpackConfig);
	const server = new WebpackDevServer(compiler, options);

	server.listen(port, 'localhost', function(err) {
		if (err){
			console.log(err);
		} else {
			opn('http://localhost:' + port);
		}
	});

};
