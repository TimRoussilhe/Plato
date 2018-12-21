var filesToJson = require('gulp-files-to-json');
var svgmin = require('gulp-svgmin');

module.exports = (gulp, $) => {
	return () => {
		return gulp.src('./public/assets/svgs/**/*.svg')
			.pipe(svgmin({
				plugins: [
					{
						convertStyleToAttrs: true
					},
					{
						removeStyleElement: true
					},
					{
						removeXMLNS: true
					},
					{
						removeXMLNS: true
					},
					{
						cleanupIDs: true
					}
				]
			}))
			.pipe(filesToJson('svgs.json'))
			.pipe(gulp.dest('./shared/jsons'));
	};
};

