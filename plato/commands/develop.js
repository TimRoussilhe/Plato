const fse = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../../config/webpack.dev.config');
const port = 9090;
const opn = require('opn');

const srcPath = './src';
const distDataPath = './public/data';
const siteDir = './public/';

const buildHTML = require('../core/buildHTML');
const { createPages } = require('../core/createPages');
const { saveRemoteDataFromSource, updateRoutes } = require('../core/saveData');

const routes = require('../../shared/routes/routes.js');
const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

// check if node API is used and if so, check if createPages is used
const nodeAPI = require('../../plato-node');

// report
const reporter = require('../utils/reporter');

function copyAssetToPublicFolder(path) {
	const publicPath = path.replace('src/', 'public/');
	fse
		.copy(path, publicPath)
		.then(() => reporter.log('📗 File Copied: ' + path))
		.catch(err => {
			reporter.failure('Error during asset copy : ' + err);
		});
}

module.exports = async function develop(verbose, open) {
	reporter.verbose = verbose;

	let globalActivity = reporter.activity('Plato Develop', '🤔');
	globalActivity.start(true);

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

	activity.end();

	/**
	 * Build dynamic routes file
	 * And save remote date from the static route file
	 */
	activity = reporter.activity('Build Routes and save remote Data from Static routes', '🛣️');
	activity.start();

	// add static routes to final_routes
	// save remote endpoint for static routes
	try {
		await updateRoutes(routes.routes);
	} catch (err) {
		reporter.failure('Error during updating routes: ' + err);
	}

	// save remote endpoint for static routes
	try {
		for (const route of routes.routes) {
			if (route.data) await saveRemoteDataFromSource(route.data, route.json, siteDir + 'data/');
		}
	} catch (err) {
		reporter.failure('Error during saving static file: ' + err);
	}
	activity.end();

	/**
	 * Get Pages data from Plato Node API getStaticPagesProps method
	 */
	activity = reporter.activity('Create Pages from Plato API', '🤖');
	activity.start(true);
	let pagesProps;
	try {
		if (nodeAPI && nodeAPI.getStaticPagesProps) {
			pagesProps = await nodeAPI.getStaticPagesProps();
		}
	} catch (err) {
		reporter.info('Error during getStaticPagesProps call');
	}

	/**
	 * Create Pages from pagesProps
	 */
	try {
		if (pagesProps && pagesProps.length > 0) {
			await createPages(pagesProps, siteDir);
		}
	} catch (err) {
		reporter.error('Error during page creation ' + err);
	}

	// check if node API is used and if so, check if createGlobalData is used
	let globalData = null;
	try {
		if (nodeAPI && nodeAPI.createGlobalData) {
			globalData = await nodeAPI.createGlobalData();
		}
	} catch (err) {
		reporter.info('No API found');
	}
	activity.end();

	/**
	 * Add Watchers
	 * Watcher for assets
	 * Watcher for templates change
	 */
	// Initialize watcher for template files
	let watcher = chokidar.watch('./shared/templates/', {
		ignored: /(^|[\/\\])\../,
		persistent: true,
	});
	watcher
		.on('add', path => reporter.log(`File ${path} has been added`))
		.on('change', path => {
			const activeRoutes = routes.getRoutesByTemplatePath(path);
			if (activeRoutes !== null) {
				for (let page of activeRoutes) {
					buildHTML(page, null, 'development', siteDir, globalData).catch(console.error);
				}
			} else {
				// change from a partial => rebuild everything
				// TODO : check if change is not happening in an unlink template
				for (let page of finalRoutes.routes) {
					buildHTML(page, null, 'development', siteDir, globalData).catch(err => {
						reporter.log(`Error: ${err}`);
					});
				}
			}
			reporter.log(`File ${path} has been changed`);
		});

	watcher.add('./shared/partials/');

	// Initialize watcher for assets files
	let watcherAsset = chokidar.watch('./src/assets/', {
		ignored: /(^|[\/\\])\../,
		persistent: true,
		ignoreInitial: true,
	});

	watcherAsset.on('add', path => copyAssetToPublicFolder(path));
	watcherAsset.on('change', path => copyAssetToPublicFolder(path));

	/**
	 * Build static HTML
	 */
	activity = reporter.activity('Build Static site', '🚀');
	activity.start();
	const finalRoutes = fse.readJsonSync(routeDestPath);

	try {
		for (let page of finalRoutes.routes) {
			await buildHTML(page, null, 'development', siteDir, globalData);
		}
	} catch (err) {
		reporter.failure('Error during page generation: ' + err);
	}
	activity.end();

	//TODO: provide dynamicRewrite support via API
	let dynamicRewrite = [];
	// dynamicRewrite.push({ from: '/furniture/*', to: '/furniture/' });

	const options = {
		port,
		hot: true,
		headers: {
			'Cache-Control': 'max-age=0',
		},
		host: 'localhost',
		allowedHosts: 'all',
		historyApiFallback: {
			rewrites: dynamicRewrite,
		},
		static: {
			directory: 'public',
			watch: true,
			serveIndex: true,
		},
	};
	const compiler = webpack(webpackConfig);
	const server = new WebpackDevServer(options, compiler);

	const runServer = async () => {
		console.log('Starting server...');
		await server.start();
		reporter.displayUrl('Development server started', 'http://localhost:' + port);
		if (open) opn('http://localhost:' + port);
	};

	runServer();
};
