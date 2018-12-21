const dest = 'build/';

module.exports = (gulp, $) => {
	return () => {
		gulp.src('public/index.php').pipe(gulp.dest(dest));
		gulp.src('public/.htaccess').pipe(gulp.dest(dest));
		gulp.src('public/assets/fonts/**/*.*').pipe(gulp.dest(dest + 'assets/fonts'));
		gulp.src('public/assets/videos/**/*.*').pipe(gulp.dest(dest + 'assets/videos'));
		gulp.src('public/assets/favicon/**/*.*').pipe(gulp.dest(dest + 'assets/favicon'));
		gulp.src('public/assets/jsons/**/*.*').pipe(gulp.dest(dest + 'assets/jsons'));
		gulp.src('public/assets/*.*').pipe(gulp.dest(dest + 'assets/'));
	};
};
