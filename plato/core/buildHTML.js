const template = require('art-template');
const fse = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
const reporter = require('../utils/reporter');

const config = require('../../site-config.js');

// A function that returns a promise to resolve into the data //fetched from the API or an error
let artTemplatePromise = (templatePath, data) => {
	return new Promise((resolve, reject) => {
		try {
			let htmlArt = template(templatePath, data);
			resolve(htmlArt);
		} catch (ex) {
			reject(ex);
		}
	});
};

module.exports = (page, manifest, mode = 'development', siteDir, globalData) => {
	return new Promise((resolve, reject) => {
		const distPath = siteDir;

		let destPath;
		let fileName = page.fileName || 'index.html';
		if (page.id === 'index' || page.id === '404') {
			destPath = distPath;
		} else {
			try {
				destPath = path.join(distPath, page.url, '/');
			} catch (err) {
				reject(new Error(err));
			}
		}

		fse.mkdirs(destPath).catch(err => {
			reject(err);
		});

		let data = {};
		if (page.json) {
			try {
				data = fse.readJsonSync(siteDir + 'data/' + page.json);
			} catch (err) {
				reject(new Error(err));
			}
		}

		const templatePath = path.resolve(`./shared/templates/${page.template}.art`);
		const exists = fse.existsSync(templatePath);
		if (!exists) reject(new Error('Template file does not exists'));

		artTemplatePromise(templatePath, {
			data,
			mode,
			globalData,
		})
			.then(html => {
				globalData.serverData = data;
				artTemplatePromise(path.resolve('./shared/templates/layout.art'), {
					html,
					config,
					data,
					mode,
					manifest,
					globalData: JSON.stringify(globalData),
				})
					.then(html => {
						fse
							.writeFile(`${destPath}${fileName}`, html)
							.then(() => {
								reporter.info(`Page Built : ${destPath}${fileName}`);
								resolve(`${destPath}${fileName}`);
							})
							.catch(err => {
								reject(err);
							});
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
};
