import fse from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import opn from 'opn';

import webpackConfig from '../../config/webpack.dev.config.js';
import buildHTML from '../core/buildHTML.js';
import { createPages } from '../core/createPages.js';
import { saveRemoteDataFromSource, updateRoutes } from '../core/saveData.js';
import { getRoutesByTemplatePath } from '../utils/routes.js';
import reporter from '../utils/reporter.js';

// check if node API is used and if so, check if createPages is used
import { createGlobalData, getStaticPagesProps } from './../../plato-node.js';

const port = 9090;

function copyAssetToPublicFolder(path) {
	const publicPath = path.replace('src/', 'public/');
	fse
		.copy(path, publicPath)
		.then(() => reporter.log('📗 File Copied: ' + path))
		.catch((err) => {
			reporter.failure('Error during asset copy : ', err);
		});
}

export default async function develop(verbose, open) {
	reporter.verbose = verbose;

	// Grab static routes
	let rawdata = fse.readFileSync(path.resolve(global.appRoot, './shared/routes.json'));
	const staticRoutes = JSON.parse(rawdata).staticRoutes;

	let globalActivity = reporter.activity('Plato Develop', '🤔');
	globalActivity.start(true);

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
		await updateRoutes(staticRoutes);
	} catch (err) {
		reporter.failure('Error during updating routes: ', err);
	}

	// save remote endpoint for static routes
	try {
		for (const route of staticRoutes) {
			if (route.data) await saveRemoteDataFromSource(route.data, route.json, global.siteDir + '/data/');
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
	 * Create Pages from pagesProps
	 */
	let finalRoutes;
	if (pagesProps && pagesProps.length > 0) {
		try {
			finalRoutes = await createPages(pagesProps, global.siteDir);
		} catch (err) {
			reporter.failure('Error during page creation ', err);
		}
	}

	// check if node API is used and if so, check if createGlobalData is used
	let globalData = null;
	try {
		if (createGlobalData) {
			globalData = await createGlobalData();
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
		.on('add', (path) => reporter.log(`File ${path} has been added`))
		.on('change', (path) => {
			const activeRoutes = getRoutesByTemplatePath(finalRoutes.routes, path);
			if (activeRoutes !== null) {
				for (let page of activeRoutes) {
					buildHTML(page, null, 'development', global.siteDir, globalData).catch(console.error);
				}
			} else {
				// change from a partial => rebuild everything
				// TODO : check if change is not happening in an unlink template
				for (let page of finalRoutes.routes) {
					buildHTML(page, null, 'development', global.siteDir, globalData).catch((err) => {
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

	watcherAsset.on('add', (path) => copyAssetToPublicFolder(path));
	watcherAsset.on('change', (path) => copyAssetToPublicFolder(path));

	/**
	 * Build static HTML
	 */
	activity = reporter.activity('Build Static site', '🚀');
	activity.start();

	try {
		for (let page of finalRoutes.routes) {
			await buildHTML(page, null, 'development', global.siteDir, globalData);
		}
	} catch (err) {
		reporter.failure('Error during page generation: ', err);
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
}
