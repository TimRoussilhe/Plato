const template = require('art-template');

const filters = require('../../shared/templates/filters');
for (let [key, value] of Object.entries(filters)) {
	template.defaults.imports[key] = value;
}

const fse = require('fs-extra');
const path = require('path');
const reporter = require('../utils/reporter');
const mkdirp = require('mkdirp');

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

const getDirName = require('path').dirname;
function writeFileWithDirectory(path, contents, cb) {
	return new Promise((resolve, reject) => {
		// return value is a Promise resolving to the first directory created
		mkdirp(getDirName(path))
			.then(made => {
				fse.writeFile(path, contents);
				resolve();
			})
			.catch(err => reject(err));
	});
}

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
			globalData,
		})
			.then(html => {
				// adding serverData for the first render here
				globalData.serverData = data;
				artTemplatePromise(path.resolve('./shared/templates/layout.art'), {
					html,
					config,
					data,
					mode,
					manifest,
					globals: globalData,
					globalData: JSON.stringify(globalData),
					location: page.id,
					type: page.template,
				})
					.then(html => {
						writeFileWithDirectory(`${destPath}${fileName}`, html)
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
