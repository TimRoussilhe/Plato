const path = require('path');

module.exports = {
	siteTitle: 'Dipsea',
	siteTitleShort: 'Dipsea Stories',
	siteDescription: 'Sexy audio stories that set the mood and spark your imagination',
	siteUrl: 'https://www.dipseastories.com',
	themeColor: '#000',
	backgroundColor: '#fff',
	pathPrefix: null,
	logo: path.resolve(__dirname, 'src/images/icon.png'),
	social: {
		twitter: 'Dipsea',
		fbAppId: '966242223397117',
	},
	preload:[
		{
			type:'font',
			href:'/assets/fonts/UntitledSans-Regular.woff2',
			format: 'woff2',
		},
	],
};
