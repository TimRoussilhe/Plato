import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

import { WebpackBundleSizeAnalyzerPlugin } from 'webpack-bundle-size-analyzer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appEntryPoint = path.join(__dirname, '../src/scripts/index.js');
const outputPath = path.join(__dirname, '../build/assets/');
const reportPath = path.join(__dirname, '../reports/plain-report.txt');

import { babelLegacyLoaderRules } from './babel.legacy.config.js';
const entryPoints = appEntryPoint;

export default (env) => {
	const envPlugins = [];
	if (env && env.bundleSize)
		envPlugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				generateStatsFile: 'true',
			})
		);

	if (env !== 'legacy') {
		envPlugins.push(new WebpackBundleSizeAnalyzerPlugin(reportPath));
		envPlugins.push(
			new WebpackManifestPlugin({
				publicPath: '/assets/',
			})
		);
	}

	return {
		mode: 'production',
		entry: entryPoints,

		// if multiple outputs, use [name] and it will use the name of the entry point, and loop through them
		output: {
			path: outputPath,
			filename: env !== 'legacy' ? 'js/[name].[contenthash].js' : 'js/legacy.js',
			chunkFilename: env !== 'legacy' ? 'js/[name].[contenthash].js' : 'js/[name].[contenthash]-legacy.js',
			publicPath: '/assets/',
		},

		optimization: {
			emitOnErrors: false,
			concatenateModules: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: true,
							dead_code: true,
						},
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
			new webpack.optimize.ModuleConcatenationPlugin(),
			...envPlugins,
		],
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
						filename: './fonts/[name][ext]',
					},
				},
				...(env !== 'legacy'
					? [
							{
								test: /\.js?$/,
								exclude: /node_modules/,
								use: 'babel-loader',
							},
					  ]
					: [babelLegacyLoaderRules]),
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
