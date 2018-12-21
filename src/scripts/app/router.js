import page from 'page';
import store from 'store';
import realRoutes from 'routes/real_routes.json';
// import routes from 'routes/routes.json';

const routes = realRoutes.routes;

// Actions
import {navigate, setRoutes} from 'containers/app/actions';

// Selectors

// Constants
// import {
// 	HOMEPAGE,
// 	ABOUT,
// 	NOT_FOUND,
// } from 'constants/locations';

// Utils
// import {MAIN_ENDPOINT} from 'constants/config';
import {isString} from 'utils/is';

// import qs from 'utils/query-string';

// import {setHotspotsList} from 'containers/experience/actions';

// const routesFn = {
// 	ROOT: (ctx) => {
// 		// Roots redirect to the current lang for example
// 	},
// 	HOMEPAGE: (ctx) => {
// 		console.log('index navigate');
// 		console.log('ctx.params', ctx.params);
// 		store.dispatch(navigate(HOMEPAGE, ctx.params));
// 	},
// 	ABOUT: (ctx) => {
// 		console.log('about navigate');
// 		store.dispatch(navigate(ABOUT, ctx.params));
// 	},
// 	NOT_FOUND: (ctx) => {
// 		console.log('404!');
// 		store.dispatch(navigate(NOT_FOUND, ctx.params));
// 	},
// };

class Router {

	constructor() {
		// this.routesFn = routesFn;
	}

	preRouting(ctx, next){

		// here the path will contains query parameter so we can remove them suing this :
		// const path = this.getPathFromUrl(ctx.path);
		// if (path === '/'){}

		// Example if there's a query string
		// ctx.query = qs.parse(window.location.search.slice(1));

		// store.dispatch(setQuery(ctx.query));
		next();
	};

	initRouter() {

		return new Promise((resolve, reject) => {

			store.dispatch(setRoutes(routes));

			// Setup routing from Routes JSON
			for (let key in routes) {

				if (!routes.hasOwnProperty(key)) continue;
				let route = routes[key];

				page(route.url, (ctx, next) => this.preRouting(ctx, next), (ctx) => {
					store.dispatch(navigate(route.id, ctx.params));
				});

			}

			// 404
			page('*', (ctx, next) => this.preRouting(ctx, next), (ctx)=>{
				store.dispatch(navigate('404', ctx.params));
			});
			resolve();

		});

	}

	configureRoute(options = {}) {
		if (options.base) page.base(options.base);
		return page;
	}

	getPathFromUrl(url) {
		return url.split('?')[0];
	}

	/**
	 * Navigate using the router
	 */
	navigate(url, options = {}) {

		if (!isString(url)) return false;
		// if absolute, make sure to add the root
		if (url.indexOf(window.location.origin) >= 0) {
			url = url.replace(window.location.origin, '');
		}

		const re = new RegExp(/^.*\//);
		const rootUrl = re.exec(window.location.href);

		// If internal
		if (url.indexOf(rootUrl) >= 0) {
			// make it relative
			url = url.replace(window.location.origin, '');
			url = url.replace(rootUrl, '');
		}

		page('/' + url);
	}

}
const router = new Router();
export default router;
