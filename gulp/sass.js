// Compile sass into CSS & auto-inject into browsers
const fs = require('fs');
const options = JSON.parse(fs.readFileSync('./postcss-options.json'));

const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

const sass = require('gulp-sass');

module.exports = (gulp, $) => {
	return () => {
		return gulp.src('./src/css/app.scss')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sass({
				includePaths: 'node_modules',
			}))
			.pipe(sourcemaps.write())
			.pipe(autoprefixer(options.autoprefixer))
			.pipe(gulp.dest('./public/assets/css/'))
			.pipe(browserSync.stream());
	};
};
