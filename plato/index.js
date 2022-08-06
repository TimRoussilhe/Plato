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
	.option('-v, --verbose', 'output extra debugging')
	.option('-o, --open', 'open local http server to QA build')
	.action(cmdObj => {
		const script = require('./commands/build');
		script(cmdObj.verbose, cmdObj.open);
	});

program.parse(process.argv);
