const fse = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../../config/webpack.dev.config');
const port = 9090;
const opn = require('opn');

const srcPath = './src';
const distPath = './public';
const distDataPath = './public/data';

const buildHTML = require('../core/buildHTML');
const {saveRemoteDataFromSource, updateRoutes} = require('../core/saveData');

const routes = require('../../shared/routes/routes.js');
const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

// Something to use when events are received.
let log = console.log.bind(console);
const siteDir = './public/';

// report
const report = require('../utils/reporter');

function reportFailure(msg, err) {
	report.log('');
	report.panic(msg, err);
}

function copyAssetToPublicFolder(path) {
	const publicPath = path.replace('src/', 'public/');
	fse
		.copy(path, publicPath)
		.then(() => report.log('📗 File Copied: ' + path))
		.catch((err) => {
			reportFailure('Error during asset copy : ' + err);
		});
}

module.exports = async function develop() {
	let globalActivity;
	globalActivity = report.activityTimer('Plato Develop');
	globalActivity.start();

	let activity;
	activity = report.activityTimer('Cleaning Repo');
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
	activity.end();

	activity = report.activityTimer('Build Routes and saving remote Data from Static routes');
	activity.start();

	// add static routes to final_routes
	// save remote endpoint for static routes
	try {
		await updateRoutes(routes.routes);
	} catch (err) {
		reportFailure('Error during updating routes: ' + err);
	}

	// save remote endpoint for static routes
	try {
		for (const route of routes.routes) {
			if (route.data) await saveRemoteDataFromSource(route.data, route.json, siteDir + 'data/');
		}
	} catch (err) {
		reportFailure('Error during saving static file: ' + err);
	}
	activity.end();

	activity = report.activityTimer('Create Pages from Plato API');
	activity.start();
	// check if node API is used and if so check if createPages is used
	try {
		let nodeAPI = require('../../plato-node');
		if (nodeAPI && nodeAPI.createPages) {
			await nodeAPI.createPages(siteDir + 'data/');
		}
	} catch (err) {
		console.log('No API found: ' + err);
	}
	activity.end();

	activity = report.activityTimer('Build Static site');
	activity.start();
	const finalRoutes = fse.readJsonSync(routeDestPath);
	try {
		for (let page of finalRoutes.routes) {
			await buildHTML(page, null, 'development', siteDir);
		}
	} catch (err) {
		reportFailure('Error during page generation: ' + err);
	}
	activity.end();

	// Initialize watcher for template files
	let watcher = chokidar.watch('./shared/templates/', {
		ignored: /(^|[\/\\])\../,
		persistent: true,
	});

	watcher.add('./shared/partials/');

	watcher
		.on('add', (path) => log(`File ${path} has been added`))
		.on('change', (path, stats) => {
			const activeRoutes = routes.getRoutesByTemplatePath(path);
			if (activeRoutes !== null) {
				for (let page of activeRoutes) {
					buildHTML(page, null, 'development', siteDir).catch(console.error);
				}
			} else {
				// change from a partial => rebuild everything
				// TODO : check if change is not happening in an unlink template
				for (let page of finalRoutes.routes) {
					buildHTML(page, null, 'development', siteDir).catch((err) => {
						log(`Error: ${err}`);
					});
				}
			}
			log(`File ${path} has been changed`);
		});

	// Initialize watcher for assets files
	let watcherAsset = chokidar.watch('./src/assets/', {
		ignored: /(^|[\/\\])\../,
		persistent: true,
		ignoreInitial: true,
	});

	watcherAsset.on('add', (path) => copyAssetToPublicFolder(path));
	watcherAsset.on('change', (path) => copyAssetToPublicFolder(path));

	const options = {
		contentBase: './public',
		publicPath: '/assets/js/',
		port,
		hot: true,
		inline: true,
		host: 'localhost',
		disableHostCheck: true,
		noInfo: true,
		watchContentBase: true,
		watchOptions: {
			poll: true,
		},
	};

	WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);
	const compiler = webpack(webpackConfig);
	const server = new WebpackDevServer(compiler, options);

	server.listen(port, 'localhost', function(err) {
		if (err) {
			console.log(err);
		} else {
			globalActivity.end();
			opn('http://localhost:' + port);
		}
	});
};
