import fse from 'fs-extra';
import path from 'path';
import template from 'art-template';

import reporter from '../utils/reporter.js';
import config from '../../site-config.js';
import { Route } from '../@types/route.js';

// Set ART FILTERS
import { filters } from '../../shared/templates/filters/index.js';
for (let [key, value] of Object.entries(filters)) {
	// @ts-expect-error
	template.defaults.imports[key] = value;
}

// A function that returns a promise to resolve into the data //fetched from the API or an error
let artTemplatePromise = (templatePath: string, data: {}) => {
	return new Promise<string>((resolve, reject) => {
		try {
			let htmlArt = template(templatePath, data);
			resolve(htmlArt);
		} catch (ex) {
			reject(ex);
		}
	});
};

function writeFileWithDirectory(dirPath: string, contents: string) {
	return new Promise<void>((resolve, reject) => {
		// return value is a Promise resolving to the first directory created
		fse
			.mkdirp(path.dirname(dirPath))
			.then(() => {
				fse.writeFile(dirPath, contents);
				resolve();
			})
			.catch((err) => reject(err));
	});
}

export default (
	page: Route,
	manifest: string | null,
	mode = 'development',
	siteDir: string,
	globalData: { serverData?: {} }
) => {
	return new Promise((resolve, reject) => {
		let destPath: string = '';
		// this will be provided to critical
		let source: string;

		// needed to genere 404.html
		let fileName = page.fileName || 'index.html';
		if (page.id === 'index' || page.id === '404') {
			destPath = path.join(siteDir, '/');
			source = fileName;
		} else {
			try {
				destPath = path.join(siteDir, page.url, '/');
				source = `${page.url}/${fileName}`;
			} catch (err) {
				reject(err);
			}
		}

		fse.mkdirs(destPath).catch((err: string) => {
			reject(err);
		});

		let data = {};
		if (page.json) {
			try {
				data = fse.readJsonSync(path.resolve(siteDir, './data/', page.json));
			} catch (err) {
				reject(err);
			}
		}

		const templatePath = path.resolve(global.appRoot, `./shared/templates/${page.template}.art`);
		const exists = fse.existsSync(templatePath);
		if (!exists) reject(new Error('Template file does not exists'));

		artTemplatePromise(templatePath, {
			data,
			globalData,
		})
			.then((html) => {
				// adding serverData for the first render here
				globalData.serverData = data;
				artTemplatePromise(path.resolve('./shared/templates/layout.art'), {
					html,
					config,
					data,
					mode,
					manifest,
					globals: globalData,
					globalDataString: JSON.stringify(globalData),
					location: page.id,
					type: page.template,
				})
					.then((html) => {
						writeFileWithDirectory(path.resolve(destPath, fileName), html)
							.then(() => {
								reporter.info(`Page Built : ${destPath}${fileName}`);
								resolve(source);
							})
							.catch((err) => {
								reject(err);
							});
					})
					.catch((err) => reject(err));
			})
			.catch((err) => reject(err));
	});
};
