const critical = require('critical');
const minify = require('html-minifier').minify;
const fse = require('fs-extra');

module.exports = async (filename)=> {
	console.log('filename', filename);

	return new Promise((resolve, reject) => {
		critical.generate({
			base: 'build/',
			inline: true,
			src: filename,
			// dest: filename,
			// Minify critical-path CSS when inlining
			minify: true,
			width: 1600,
			height: 1000,
		}, (err, output) => {

			// You now have critical-path CSS
			// Works with and without dest specified
			let result = minify(output, {
				removeAttributeQuotes: true,
				collapseWhitespace: true,
				preserveLineBreaks: true,
				conservativeCollapse: true,
				removeComments: true,
			});
			fse.writeFileSync(filename, result, {encoding:'utf8', flag:'w'});
			resolve();
		});
	});

};
