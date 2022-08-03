const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appEntryPoint = path.join(__dirname, '../src/scripts/app/index.js');
const outputPath = path.join(__dirname, '../build/assets/');
const reportPath = path.join(__dirname, '../reports/plain-report.txt');

const entryPoints = appEntryPoint;

module.exports = env => {
	const envPlugins = [];
	if (env && env.bundleSize)
		envPlugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				generateStatsFile: 'true',
			})
		);

	return {
		mode: 'production',
		entry: entryPoints,

		// if multiple outputs, use [name] and it will use the name of the entry point, and loop through them
		output: {
			path: outputPath,
			filename: 'js/[name].[contenthash].js',
			chunkFilename: 'js/[name].[contenthash].js',
			publicPath: '/assets/',
		},

		optimization: {
			emitOnErrors: false,
			concatenateModules: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						warnings: false,
						compress: {
							drop_console: true,
						},
						ie8: false,
						keep_classnames: false,
						keep_fnames: false,
						output: {
							comments: false,
						},
					},
				}),
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: [
							'default',
							{
								discardComments: { removeAll: true },
							},
						],
					},
				}),
			],
			moduleIds: 'deterministic',
		},

		plugins: [
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: 'css/[name].[contenthash].css',
			}),
			new WebpackBundleSizeAnalyzerPlugin(reportPath),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new WebpackManifestPlugin({
				publicPath: '/assets/',
			}),
			...envPlugins,
		],
		resolve: {
			extensions: ['.js', '.json', '.art', '.html'],
			modules: ['src/scripts/app/', 'src/scripts/vendors/', 'shared/', 'public/assets/', 'node_modules'],
		},

		module: {
			rules: [
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{ test: /\.art$/, use: 'art-template-loader' },
				{
					test: /\.scss$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
				},
			],
		},

		stats: {
			// Nice colored output
			colors: true,
		},

		devtool: false,
	};
};
