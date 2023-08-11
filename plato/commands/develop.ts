import fse from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import opn from 'opn';

import { Routes, Route } from '../@types/route.js';

import config from '../../site-config.js';
import webpackConfig from '../../config/webpack.dev.config.js';

import buildHTML from '../core/buildHTML.js';
import { createPages } from '../core/createPages.js';
import { saveRemoteDataFromSource } from '../core/saveData.js';
import { updateRoutes } from '../core/updateRoutes.js';
import createWatchers from './develop-watchers.js';

import reporter from '../utils/reporter.js';
const port = 9090;

export default async function develop(verbose: boolean = false, open: boolean = false) {
  reporter.verbose = verbose;

  // Grab static routes
  const staticRoutes = config.staticRoutes as Route[];

  let globalActivity = reporter.activity('Plato Develop', '🤔');
  globalActivity.start(true);

  /**
   * Clean repo
   * Empty directories and move source files
   */
  let activity = reporter.activity('Cleaning Repo', '🧽');
  activity.start();

  // clear destination folder
  fse.emptyDirSync(global.siteDir);

  // remove real_routes files
  fse.emptyDirSync(global.routeDest);

  // copy assets folder
  fse.copySync(path.resolve(global.srcPath, './.htaccess'), path.resolve(global.siteDir, './.htaccess'));
  fse.copySync(path.resolve(global.srcPath, './assets'), path.resolve(global.siteDir, './assets'));
  fse.copySync(path.resolve(global.srcPath, './data'), path.resolve(global.siteDir, './data'));

  activity.end();

  /**
   * Build dynamic routes file
   * And save remote date from the static route file
   */
  activity = reporter.activity('Build Routes and save remote Data from Static routes', '🛣️');
  activity.start();

  // add static routes to final_routes
  // save remote endpoint for static routes
  try {
    await updateRoutes(staticRoutes);
  } catch (err) {
    reporter.failure('Error during updating routes: ', err as string);
  }

  // save remote endpoint for static routes
  try {
    for (const route of staticRoutes) {
      if (route.dataSource) await saveRemoteDataFromSource(route.dataSource, route.json, global.siteDir + '/data/');
    }
  } catch (err) {
    reporter.failure('Error during saving static file: ', err as string);
  }
  activity.end();

  /**
   * Get Pages data from Plato Node API getStaticPagesProps method
   */
  activity = reporter.activity('Create Pages from Plato API', '🤖');
  activity.start(true);

  let pagesProps: Route[] = [];
  try {
    const { getStaticPagesProps } = await import('./../../plato-node.js');
    if (getStaticPagesProps) {
      //TODO: add validation on user data
      pagesProps = await getStaticPagesProps();
    }
  } catch (err) {
    reporter.failure('Error during getStaticPagesProps call', err as string);
  }

  /**
   * Create Pages from pagesProps
   */
  let finalRoutes: Routes = { routes: [] };
  if (pagesProps && pagesProps.length > 0) {
    try {
      finalRoutes = await createPages(pagesProps, global.siteDir);
    } catch (err) {
      reporter.failure('Error during page creation ', err as string);
    }
  }

  // on plato complete Hook
  try {
    const { onPageCreatedHook } = await import('./../../plato-node.js');

    if (onPageCreatedHook) {
      await onPageCreatedHook();
    }
  } catch (err) {
    console.log('Error during onPageCreatedHook: ' + err);
  }

  // check if node API is used and if so, check if createGlobalData is used
  let globalData = {};
  try {
    const { createGlobalData } = await import('./../../plato-node.js');
    if (createGlobalData) {
      globalData = await createGlobalData();
    }
  } catch (err) {
    reporter.failure('Error createGlobalData ', err as string);
  }
  activity.end();

  /**
   * Build static HTML
   */
  activity = reporter.activity('Build Static site', '🚀');
  activity.start();

  try {
    for (let page of finalRoutes.routes) {
      await buildHTML(page, null, 'development', global.siteDir, globalData);
    }
  } catch (err) {
    reporter.failure('Error during page generation: ', err as string);
  }
  activity.end();

  /**
   * Create file watchers to rebuild HTML when templates changes
   */
  createWatchers(finalRoutes.routes, globalData);

  //TODO: provide dynamicRewrite support via API
  let dynamicRewrite: any[] = [];
  // dynamicRewrite.push({ from: '/furniture/*', to: '/furniture/' });

  const options = {
    port,
    hot: true,
    headers: {
      'Cache-Control': 'max-age=0',
    },
    host: 'localhost',
    allowedHosts: 'all',
    historyApiFallback: {
      rewrites: dynamicRewrite,
    },
    static: {
      directory: 'public',
      watch: true,
      serveIndex: true,
    },
  };

  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(options, compiler);
  globalActivity.end();

  const runServer = async () => {
    await server.start();
    reporter.displayUrl('Development server started', 'http://localhost:' + port);
    if (open) opn('http://localhost:' + port);
  };

  runServer();
}
