const fse = require('fs-extra');
const webpack = require('webpack');
const webpackConfig = require('../../config/webpack.prod.config');

module.exports = async ()=> {

	return new Promise((resolve, reject) => {

		console.log('START PROCESSING!');

		webpack(webpackConfig).run((err, stats) => {
			if (err || stats.hasErrors()) {
				console.log('stats.hasErrors()', stats.hasErrors());
				console.log('stats', stats);
				console.log('err', err);
				reject(err);
				return;
			}
			// Done processing
			console.log('DONE PROCESSING!');
			const manifest = fse.readJsonSync('./build/assets/manifest.json');

			resolve(manifest);
		});
	});

};
