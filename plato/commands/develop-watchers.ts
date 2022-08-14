import fse from 'fs-extra';
import chokidar from 'chokidar';

import buildHTML from '../core/buildHTML.js';
import { Route } from '../@types/route.js';
import { getRoutesByTemplatePath } from '../utils/routes.js';

import reporter from '../utils/reporter.js';

function copyAssetToPublicFolder(path: string) {
	const publicPath = path.replace('src/', 'public/');
	fse
		.copy(path, publicPath)
		.then(() => reporter.log('📗 File Copied: ' + path))
		.catch((err: string) => {
			reporter.failure('Error during asset copy : ', err);
		});
}

export default function createWatchers(routes: Route[], globalData: object) {
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
			const activeRoutes = getRoutesByTemplatePath(routes, path);
			if (activeRoutes !== null) {
				for (let page of activeRoutes) {
					buildHTML(page, null, 'development', global.siteDir, globalData).catch(console.error);
				}
			} else {
				// change from a partial => rebuild everything
				// TODO : check if change is not happening in an unlink template
				for (let page of routes) {
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
}
