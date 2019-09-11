const path = require('path');

module.exports = {
	siteTitle: 'Plato',
	siteTitleShort: 'Plato Plato',
	siteDescription: 'Super Duper Static Site generator',
	siteUrl: 'https://github.com/TimRoussilhe/Plato/',
	metaSiteName: 'Plato',
	metaTwitterName: '@timroussilhe',
	metaImage: 'https://media1.giphy.com/media/eLudircQfgGEU/giphy.gif?cid=3640f6095c0e8e92753069696f5d90c5',
	metaImageTwitter: 'https://media1.giphy.com/media/eLudircQfgGEU/giphy.gif?cid=3640f6095c0e8e92753069696f5d90c5',
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
