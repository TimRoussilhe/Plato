const fse = require('fs-extra');
const webpack = require('webpack');
const webpackConfig = require('../../config/webpack.prod.config');

module.exports = async () => {
	return new Promise((resolve, reject) => {
		webpack(webpackConfig()).run((err, stats) => {
			if (err) {
				console.error(err.stack || err);
				if (err.details) {
					console.error(err.details);
				}
				reject(err);
				return;
			}

			const info = stats.toJson();

			if (stats.hasErrors()) {
				console.error(...info.errors);
				reject(err);
				return;
			}

			if (stats.hasWarnings()) {
				console.warn(info.warnings);
			}

			const manifest = fse.readJsonSync('./build/assets/manifest.json');

			resolve(manifest);
		});
	});
};
