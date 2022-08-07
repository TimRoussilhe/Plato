const path = require('path');
const webpack = require('webpack');
const SizePlugin = require('size-plugin');

const appEntryPoint = path.join(__dirname, '../src/scripts/index.js');
const outputPath = path.join(__dirname, '../public/assets/js/');
const filename = 'bundle.js';
const entryPoints = appEntryPoint;

module.exports = {
	mode: 'development',
	entry: entryPoints,

	// if multiple outputs, use [name] and it will use the name of the entry point, and loop through them
	output: {
		path: outputPath,
		filename: filename,
		publicPath: '/assets/js/',
		chunkFilename: '[name].bundle.js',
	},

	optimization: {
		emitOnErrors: true,
	},

	plugins: [new SizePlugin(), new webpack.HotModuleReplacementPlugin()],

	// i. e. through the resolve.alias option
	// will be included in the bundle, no need to add and load vendor
	resolve: {
		extensions: ['.js', '.json', '.art', '.html'],
		modules: ['src/scripts/', 'src/scripts/vendors/', 'shared/', 'public/assets/', 'node_modules'],
	},

	module: {
		rules: [
			// copy fonts for us, this is needed to avoid webpack renaing the font via css-loader
			// https://webpack.js.org/guides/asset-modules/
			{
				test: /\.(woff(2)?|ttf|eot)$/,
				type: 'asset/resource',
				generator: {
					filename: './../fonts/[name][ext]',
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{ test: /\.art$/, use: 'art-template-loader' },
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								ident: 'postcss',
								plugins: () => [require('autoprefixer')],
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},

	stats: {
		// Nice colored output
		colors: true,
	},

	// Create Sourcemaps for the bundle
	devtool: 'eval-source-map',
};
