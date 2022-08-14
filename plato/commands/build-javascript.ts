import webpack from 'webpack';
import webpackConfig from '../../config/webpack.prod.config.js';

export default async (env: string) => {
	return new Promise<void>((resolve, reject) => {
		webpack(webpackConfig(env)).run((err, stats) => {
			if (err) {
				console.error(err.stack || err);
				reject(err);
				return;
			}

			if (stats) {
				const info = stats.toJson();

				if (stats.hasErrors()) {
					console.error(info.errors);
					reject(err);
					return;
				}

				if (stats.hasWarnings()) {
					console.warn(info.warnings);
				}
			}

			resolve();
		});
	});
};
