module.exports = ( ctx ) => ({
	plugins: {
		autoprefixer: {
			browsers: [
				'last 3 versions',
				'iOS >= 9',
				'Safari >= 9',
				'not ie <= 10',
			],
		},
		cssnano:  {
			preset: ['default', {
				discardComments: {
					removeAll: true,
				},
			}],
		},
	},
});
