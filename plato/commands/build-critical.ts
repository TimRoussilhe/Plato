import { generate } from 'critical';
import { minify } from 'html-minifier-terser';
import fse from 'fs-extra';

export default (filename: string, dest: string) => {
  return new Promise<void>(async (resolve, reject) => {
    let criticalHTML = '';
    try {
      const { css, html, uncritical } = await generate({
        inline: true,
        base: 'build/',
        src: filename,
        width: 1600,
        height: 900,
      });

      criticalHTML = html;
    } catch (err) {
      console.log('caught error from criticalHTML: ', err);
    }

    // You now have critical-path CSS as well as the modified HTML.
    // Works with and without target specified.
    // You now have critical-path CSS
    // Works with and without dest specified
    minify(criticalHTML, {
      removeComments: true,
      // collapseWhitespace: true,
      conservativeCollapse: true,
    })
      .then((html) => {
        fse.writeFileSync(dest, html, {
          encoding: 'utf8',
          flag: 'w',
        });
        resolve();
      })
      .catch((err) => {
        // sometime the render of critical will come out to early / truncated and will error out,
        // so in this case we want to just write the original file
        console.log('skip write FILE BUG', err);
        resolve();
        // reject(err);
      });
  });
};
