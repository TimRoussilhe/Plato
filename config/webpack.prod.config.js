const path = require('path');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const WebpackChunkHash = require('webpack-chunk-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const appEntryPoint = path.join(__dirname, '../src/scripts/app/index.js');
const outputPath = path.join(__dirname, '../build/assets/');
// const publicPath = path.join(__dirname, '../build/assets');
const reportPath = path.join(__dirname, '../reports/plain-report.txt');
// const filename = 'bundle.min.js';

const devTool = false;
// 'hidden-source-map';

// devTool = 'inline-source-map';
// console.log('\n ---- WEBPACK ----\n \n running in production \n');

// console.log(path.join(' running webpack in ', __dirname));
// console.log(' filename: ' + filename);
// console.log(' devTool: ' + devTool);
// console.log(' outputPath path ' + outputPath + '\n');

const entryPoints = appEntryPoint;

module.exports = {
	node: {
		fs: 'empty',
	},
	mode: 'production',
	entry: entryPoints,

	// if multiple outputs, use [name] and it will use the name of the entry point, and loop through them
	output: {
		path: outputPath,
		filename: 'js/[name].[chunkhash].js',
		chunkFilename: 'js/[name].[chunkhash].js',
		publicPath: '/assets/',
	},

	optimization: {
		// splitChunks:{
		// 	cacheGroups: {
		// 		default: false,
		// 		vendors: false,
		// 		// vendor chunk
		// 		vendor: {
		// 		// name of the chunk
		// 			name: 'vendor',
		// 			// async + async chunks
		// 			chunks: 'all',
		// 			// import file path containing node_modules
		// 			test: /node_modules/,
		// 			// priority
		// 			priority: 20,
		// 		},
		// 		// common chunk
		// 		common: {
		// 			name: 'common',
		// 			minChunks: 2,
		// 			chunks: 'async',
		// 			priority: 10,
		// 			reuseExistingChunk: true,
		// 			enforce: true,
		// 		},
		// 	},
		// },
		noEmitOnErrors: true,
		concatenateModules: true,
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions:{
					compress: {
						drop_console: true,
						warnings: false,
					},
					ie8: false,
					keep_classnames: false,
					keep_fnames: false,
					output: {
						comments: false,
					},
				},
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					safe: true,
					// we disable to use autoprefixer
					autoprefixer: {disable: true},
					discardComments: {
						removeAll: true,
					},
				},
			}),
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'css/[name].[contenthash].css',
		}),
		new WebpackBundleSizeAnalyzerPlugin(reportPath),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		new WebpackChunkHash(),
		new ManifestPlugin({
			publicPath: '/assets/',
		}),
		// new SWPrecacheWebpackPlugin(
		// 	{
		// 		cacheId: 'plato',
		// 		dontCacheBustUrlsMatching: /\.\w{8}\./,
		// 		// filename: 'service-worker.js',
		// 		filepath: './build/service-worker.js',
		// 		minify: true,
		// 		navigateFallback: publicPath + 'index.html',
		// 		staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
		// 	}
		// ),
		new WorkboxPlugin.GenerateSW(),
	],

	// make 'zepto' resolve to your local copy of the library
	// i. e. through the resolve.alias option
	// will be included in the bundle, no need to add and load vendor
	resolve: {
		extensions: ['.js', '.json', '.twig', '.html'],
		modules: [
			'src/scripts/app/',
			'src/scripts/vendors/',
			'shared/',
			'public/assets/',
			'node_modules',
		],
	},

	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				use: 'babel-loader',
			},
			{test: /\.twig$/, use: 'twig-loader'},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [require('autoprefixer')({browsers: ['> 3%', 'last 3 versions']})],
						},
					},
					'sass-loader',
				],
			},
		],
	},

	stats: {
		// Nice colored output
		colors: true,
	},

	// Create Sourcemaps for the bundle
	devtool: devTool,

};
