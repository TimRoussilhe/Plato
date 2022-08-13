export const babelLegacyLoaderRules = {
	test: /\.js$/,
	exclude: /node_modules/,

	loader: 'babel-loader',
	options: {
		presets: [
			[
				'@babel/preset-env',
				{
					useBuiltIns: 'usage',
					targets: {
						esmodules: false,
					},
					corejs: 3,
				},
			],
		],
	},
};
