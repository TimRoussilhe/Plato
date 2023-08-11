// We import the config here to avoid order issue
// In Node modules are hoisted before
// but dotenv needs to be preloaded
// https://stackoverflow.com/a/63541230
import 'dotenv/config';

import program from 'commander';
import develop from './commands/develop.js';
import build from './commands/build.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .command('develop')
  .option('-v, --verbose', 'output extra debugging')
  .option('-o, --open', 'open dev')
  .description('Develop website')
  // create global path data that will be used across our scripts
  .action(() => {
    global.appRoot = path.resolve(__dirname + './../');
    global.srcPath = path.resolve(global.appRoot, './src/');
    global.siteDir = path.resolve(global.appRoot, './public/');
    global.routeDest = path.resolve(global.appRoot, './.plato/');
  })
  .action((cmdObj: any) => {
    develop(cmdObj.verbose, cmdObj.open);
  });

program
  .command('build')
  .option('-v, --verbose', 'output extra debugging')
  .option('-o, --open', 'open local http server to QA build')
  // create global path data that will be used across our scripts
  .action(() => {
    global.appRoot = path.resolve(__dirname + './../');
    global.srcPath = path.resolve(global.appRoot, './src/');
    global.siteDir = path.resolve(global.appRoot, './build/');
    global.routeDest = path.resolve(global.appRoot, './.plato/');
  })
  .action((cmdObj: any) => {
    build(cmdObj.verbose, cmdObj.open);
  });

program.parse(process.argv);
