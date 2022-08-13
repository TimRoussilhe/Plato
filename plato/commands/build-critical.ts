import critical from 'critical';
import { minify } from 'html-minifier';
import fse from 'fs-extra';

export default (filename, dest) => {
	return new Promise<void>((resolve, reject) => {
		critical.generate(
			{
				inline: true,
				base: 'build/',
				src: filename,
				width: 1600,
				height: 900,
			},
			(err, { css, html, uncritical }) => {
				// You now have critical-path CSS as well as the modified HTML.
				// Works with and without target specified.
				if (err) reject(err);

				// console.log('html', html);

				let result;
				try {
					// You now have critical-path CSS
					// Works with and without dest specified
					result = minify(html, {
						removeAttributeQuotes: true,
						collapseWhitespace: true,
						preserveLineBreaks: true,
						conservativeCollapse: true,
						removeComments: true,
					});
				} catch (err) {
					reject(err);
				}
				try {
					fse.writeFileSync(dest, result, {
						encoding: 'utf8',
						flag: 'w',
					});
				} catch (err) {
					reject(err);
				}

				resolve();
			}
		);
	});
};
