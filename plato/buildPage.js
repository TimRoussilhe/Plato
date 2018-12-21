const Twig = require('twig'); // Twig module
Twig.cache(false);

const fse = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');

const config = require('../site-config.js');

module.exports = (page, manifest, mode = 'development', siteDir) => {

	return new Promise((resolve, reject) => {

		const distPath = siteDir;

		let destPath;
		let fileName = page.fileName || 'index.html';
		if (page.id === 'index' || page.id === '404'){
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
			data = fse.readJsonSync(siteDir + 'data/'+ page.json);
		} catch (err) {
			reject(new Error(err));
		}

		let templatePath;
		try {
			templatePath = path.resolve(`./shared/templates/${page.template}.twig`);
		} catch (err) {
			reject(new Error(err));
		}

		Twig.renderFile(templatePath, {data, mode}, (err, html) => {
			if (err){
				reject(new Error(err));
			}
			html; // compiled string

			Twig.renderFile(path.resolve('./shared/templates/layout.twig'), {html, config, data, mode, manifest}, (err, html) => {

				if (err){
					reject(new Error(err));
				}

				fse.writeFile(`${destPath}${fileName}`, html)
					.then(() => resolve(`${destPath}${fileName}`))
					.catch((err) => {

						reject(err);
					});
			});
		});
	});
};
