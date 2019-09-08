const critical = require('critical');
const minify = require('html-minifier').minify;
const fse = require('fs-extra');

module.exports = (filename) => {

	return new Promise((resolve, reject) => {

		const source = filename.replace('build/', '');

		critical.generate({
			base: 'build/',
			inline: true,
			src: source,
			// dest: filename,
			// Minify critical-path CSS when inlining
			minify: true,
			width: 1600,
			height: 1200,
		}, (err, output) => {

			if (err) {
				reject(err);
			}

			// You now have critical-path CSS
			// Works with and without dest specified
			let result = minify(output, {
				removeAttributeQuotes: true,
				collapseWhitespace: true,
				preserveLineBreaks: true,
				conservativeCollapse: true,
				removeComments: true,
			});
			fse.writeFileSync(filename, result, {
				encoding: 'utf8',
				flag: 'w'
			});
			resolve();
		});
	});

};
