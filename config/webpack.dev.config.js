const path = require('path');
const webpack = require('webpack');
const devTool = 'source-map';
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const notifier = require('node-notifier');
const SizePlugin = require('size-plugin');

const appEntryPoint = path.join(__dirname, '../src/scripts/app/index.js');
const outputPath = path.join(__dirname, '../public/assets/js/');
const filename = 'bundle.js';

// console.log('appEntryPoint', appEntryPoint);
// console.log('outputPath', outputPath);

// console.log('\n ---- WEBPACK ---- \n \n running in development \n');
// console.log(path.join(' running webpack in ', __dirname));
// // console.log(' filename: ' + filename);
// console.log(' devTool: ' + devTool);
// console.log(' outputPath path ' + outputPath + '\n');

const entryPoints = appEntryPoint;

module.exports = {
	/*
	ENTRY
	If you pass a string: The string is resolved to a module which is loaded upon startup.
	If you pass an array: All modules are loaded upon startup. The last one is exported.
	If you pass an object: Multiple entry bundles are created. The key is the chunk name. The value can be a string or an array.
	*/
	node: {
		fs: 'empty'
	},

	mode: 'development',
	entry: entryPoints,

	// if multiple outputs, use [name] and it will use the name of the entry point, and loop through them
	output: {
		path: outputPath,
		filename: filename,
		publicPath: '/assets/js/',
		chunkFilename: '[name].bundle.js'
	},

	optimization: {
		noEmitOnErrors: true // NoEmitOnErrorsPlugin
	},

	plugins: [
		new SizePlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
				DEV: process.env.NODE_ENV !== 'production',
				IS_BROWSER: true
			}
		}),
		new FriendlyErrorsWebpackPlugin({
			onErrors: (severity, errors) => {
				if (severity !== 'error') return;

				const error = errors[0];
				notifier.notify({
					title: 'Compilation Failed',
					message: severity + ': ' + error.name,
					subtitle: error.file || ''
				});
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new HardSourceWebpackPlugin()
	],

	// i. e. through the resolve.alias option
	// will be included in the bundle, no need to add and load vendor
	resolve: {
		extensions: ['.js', '.json', '.twig', '.html'],
		modules: ['src/scripts/app/', 'src/scripts/vendors/', 'shared/', 'public/assets/', 'node_modules']
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{ test: /\.twig$/, use: 'twig-loader' },
			{ test: /\.art$/, use: 'art-template-loader' },
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader',
						// singleton is important here. On dev it will wait for CSS to be appended to start JS
						options: {
							singleton: true
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [require('autoprefixer')]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},

	stats: {
		// Nice colored output
		colors: true
	},

	// Create Sourcemaps for the bundle
	devtool: devTool

	// devServer: {
	// 	contentBase: './public',
	// 	port: 8080,
	// 	hot: true,
	// 	inline: true,
	// },
};
