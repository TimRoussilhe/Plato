const path = require('path');

module.exports = {
	siteTitle: 'Plato',
	siteTitleShort: 'Plato Plato',
	siteDescription: 'Super Duper Static Site generator',
	siteUrl: 'https://www.plato.com',
	themeColor: '#000',
	backgroundColor: '#fff',
	pathPrefix: null,
	logo: path.resolve(__dirname, 'src/images/icon.png'),
	social: {
		twitter: 'Plato',
		fbAppId: '550534890534809345890',
	},
	preload: [
		{
			type: 'font',
			href: '/assets/fonts/UntitledSans-Regular.woff2',
			format: 'woff2',
		},
	],
};
