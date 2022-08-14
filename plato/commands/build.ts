import fse from 'fs-extra';
import path from 'path';
import opn from 'opn';
import connect from 'connect';
import serveStatic from 'serve-static';

import { Routes, Route } from '../@types/route.js';

import reporter from '../utils/reporter.js';
import { saveRemoteDataFromSource } from '../core/saveData.js';
import { updateRoutes } from '../core/updateRoutes.js';
import { createPages } from '../core/createPages.js';
import buildHTML from '../core/buildHTML.js';
import buildProductionBundle from './build-javascript.js';
import buildCritical from './build-critical.js';

import config from './../../site-config.js';
// check if node API is used and if so, check if createPages is used
import { createGlobalData, getStaticPagesProps } from './../../plato-node.js';

export default async function build(verbose = false, open = false) {
	reporter.verbose = verbose;

	// Grab static routes from config
	const staticRoutes = config.staticRoutes as Route[];

	let globalActivity = reporter.activity('Plato Build', '🤔');
	globalActivity.start();

	/**
	 * Clean repo
	 * Empty directories and move source files
	 */
	let activity = reporter.activity('Cleaning Repo', '🧽');
	activity.start();

	// clear destination folder
	fse.emptyDirSync(global.siteDir);

	// remove real_routes files
	fse.emptyDirSync(global.routeDest);

	// copy assets folder
	fse.copySync(path.resolve(global.srcPath, './.htaccess'), path.resolve(global.siteDir, './.htaccess'));
	fse.copySync(path.resolve(global.srcPath, './assets'), path.resolve(global.siteDir, './assets'));
	fse.copySync(path.resolve(global.srcPath, './data'), path.resolve(global.siteDir, './data'));

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
		reporter.failure('Error during updating routes: ', err as string);
	}

	// save remote endpoint for static routes
	try {
		for (const route of staticRoutes) {
			if (route.dataSource) await saveRemoteDataFromSource(route.dataSource, route.json, global.siteDir + '/data/');
		}
	} catch (err) {
		reporter.failure('Error during saving static file: ', err as string);
	}
	activity.end();

	/**
	 * Get Pages data from Plato Node API getStaticPagesProps method
	 */
	activity = reporter.activity('Create Pages from Plato API', '🤖');
	activity.start(true);

	let pagesProps: Route[] = [];
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
	let finalRoutes: Routes = { routes: [] };
	try {
		if (pagesProps && pagesProps.length > 0) {
			finalRoutes = await createPages(pagesProps, global.siteDir);
		}
	} catch (err) {
		reporter.error('Error during page creation ' + err);
	}

	// check if node API is used and if so, check if createGlobalData is used
	let globalData = {};
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
		reporter.failure('Generating JavaScript bundles failed', err as string);
	});

	activity.end();

	/**
	 * Build legacy javascript using webpack
	 */
	activity = reporter.activity('Build Legacy Javascript', '👴');
	activity.start();
	await buildProductionBundle('legacy').catch((err) => {
		reporter.failure('Generating Legacy JavaScript bundles failed', err as string);
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
		reporter.failure('Error during page generation: ', err as string);
	}
	activity.end();

	activity = reporter.activity('Build Critical CSS and minify HTML', '🎨');
	activity.start();

	function startNewJob(): Promise<void> {
		const file = files.pop(); // NOTE: mutates file array
		if (!file) {
			// no more new jobs to process (might still be jobs currently in process)
			return Promise.resolve();
		}
		const dest = path.join(global.siteDir, file);
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
