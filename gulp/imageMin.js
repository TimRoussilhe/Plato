const imagemin = require('gulp-imagemin');

module.exports = (gulp, $) => {
	return () => {
		gulp.src('public/assets/images/**/*.*')
			.pipe(imagemin())
			.pipe(gulp.dest('build/assets/images'));
	};
};
