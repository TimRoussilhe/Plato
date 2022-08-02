const critical = require('critical');
const minify = require('html-minifier').minify;
const fse = require('fs-extra');

module.exports = filename => {
	return new Promise(async (resolve, reject) => {
		const source = filename.replace('build/', '');

		const { css, html, uncritical } = await critical.generate({
			inline: true,
			base: 'build/',
			src: source,
			width: 1600,
			height: 900,
		});

		let result;
		try {
			// You now have critical-path CSS
			// Works with and without dest specified
			result = minify(css, {
				removeAttributeQuotes: true,
				collapseWhitespace: true,
				preserveLineBreaks: true,
				conservativeCollapse: true,
				removeComments: true,
			});
		} catch (err) {
			reject(err);
		}

		fse.writeFileSync(filename, result, {
			encoding: 'utf8',
			flag: 'w',
		});
		resolve();
	});
};
