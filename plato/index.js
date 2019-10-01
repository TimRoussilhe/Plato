// Things that the back-end / Static site generator needs to do: DEV RUN 1)
// Fetch all remote data and build local json 2) Build routes config file 3)
// Build dynamic routes file 4) Build all static pages 5) Start dev server 6)
// start watching files WATCH 1) Watch /templates and /pages and rebuild if
// needed 2) Watch Layout and partials and rebuild all page if changed 3) Dev
// server BUILD RUN 1) Fetch all remote data and build local json 2) Build
// routes config file 3) Build dynamic routes file 4) Build Final JS and CSS and
// manifest 4) Build all static pages using the final manifest 5) Critical CSS
// 6) Minify HTML HOOKS AND PUBLIC API UpdateData BuildPage CreatePage/Route

// TODO PROJET: DEV MODE 1) Fix JS 2) Templating etc... 3) test mobX 4) Simplify
// JS : pages structure 5) See for templates BUILD MODE ADD MIDDLEWARE SUPPORT
// TO REWRITE DATA TEST DEPLOY AND NETLIFY BACKLOG

// - add preload and prefetch
// - add Meta support back
// - add context from CreatePage ( example blog )
// - Images!
// - add middleware supports

// - test circleci

const program = require('commander');

program
	.command('develop')
	.option('-v, --verbose', 'output extra debugging')
	.option('-o, --open', 'open dev')
	.description('Develop website')
	.action(cmdObj => {
		const script = require('./commands/develop');
		script(cmdObj.verbose, cmdObj.open);
	});

program
	.command('build')
	.description('Build website')
	.option('-sic, --skip-image-compression <skipImageCompression>', 'Skip compression of image assets (default: false)')
	.action(() => {
		const script = require('./commands/build');
		script();
	});

program.parse(process.argv);
