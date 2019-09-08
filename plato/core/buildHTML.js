const Twig = require('twig'); // Twig module
Twig.cache(false);

const fse = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');

const chalk = require('chalk');
const log = console.log;
const print = chalk.grey;

const config = require('../../site-config.js');

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

		fse.mkdirs(destPath)
			.catch((err) => {
				reject(err);
			});

		let data;
		try {
			data = fse.readJsonSync(siteDir + 'data/' + page.json);
		} catch (err) {
			reject(new Error(err));
		}

		const templatePath = path.resolve(`./shared/templates/${page.template}.twig`);
		const exists = fse.existsSync(templatePath);
		if (!exists) reject(new Error('Template file does not exists'));

		Twig.renderFile(templatePath, {
			data,
			mode,
			globalData
		}, (err, html) => {
			if (err) {
				reject(new Error(err));
			}
			html; // compiled string

			Twig.renderFile(path.resolve('./shared/templates/layout.twig'), {
				html,
				config,
				data,
				mode,
				manifest,
				globalData: JSON.stringify(globalData)
			}, (err, html) => {

				if (err) {
					reject(new Error(err));
				}

				fse.writeFile(`${destPath}${fileName}`, html)
					.then(() => {
						log(print(` HTML Built : ${destPath}${fileName}`));
						resolve(`${destPath}${fileName}`);
					})
					.catch((err) => {
						reject(err);
					});
			});
		});
	});
};
