const chokidar = require('chokidar');
const buildPage = require('./buildPage.js');
const routes = require('../shared/routes/routes.js');
const realRoutes = require('../shared/routes/real_routes.json');

// Something to use when events are received.
let log = console.log.bind(console);

// Initialize watcher.
let watcher = chokidar.watch('./shared/templates/', {
	ignored: /(^|[\/\\])\../,
	persistent: true,
});

watcher.add('./shared/partials/');

watcher
	.on('add', (path) => log(`File ${path} has been added`))
	.on('change', (path, stats) => {
		const activeRoutes = routes.getRoutesByTemplatePath(path);
		// console.log('activeRoutes', activeRoutes);
		log('activeRoutes');
		if (activeRoutes !== null){

			for (let page of activeRoutes) {
				buildPage(page).catch((err)=>{
					console.log('ERRROR', err);
					process.exit(1);
				});
			}

		} else {
			// change from a partial => rebuild everything
			// TODO : check if change is not happening in an unlink template
			console.log('TEST TEST TEST');
			log('TEST TEST TEST');

			for (let page of realRoutes.routes) {
				buildPage(page)
					.then(() => console.log('RESOLVED'))
					.catch((err)=>{
						console.log('errrrrofdsklmn', err);
						process.exit(1);
					});
			}

		}
		log(`File ${path} has been changed`);
	})
	.on('error', (error) => log(`Watcher error: ${error}`))
;
