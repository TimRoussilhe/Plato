const config = {
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
  staticRoutes: [
    {
      id: 'index',
      url: '/',
      template: 'homepage',
      json: 'index.json',
    },
    {
      id: 'about',
      url: '/about-no-data',
      template: 'about',
    },
    {
      id: 'about',
      url: '/about',
      template: 'about',
      json: 'about.json',
    },
    {
      id: 'pokemon',
      url: '/pokemon',
      template: 'about',
      dataSource: 'https://pokeapi.co/api/v2/pokemon/?limit=6',
      json: 'pokemon.json',
    },
    {
      id: '404',
      fileName: '404.html',
      url: '/error',
      template: 'notfound',
      json: '404.json',
    },
  ],
};

export default config;
