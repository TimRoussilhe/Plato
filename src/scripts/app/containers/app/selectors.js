import store from 'store';

export const getRoute = (location, params = null) => {
	const routes = store.getState().app.routes;
	let currentRoute = null;

	for (let key in routes) {
		if (!routes.hasOwnProperty(key)) continue;

		let route = routes[key];
		if (route.id === location) currentRoute = route;
	}

	return currentRoute;
};

export const getRouteByURL = href => {
	const routes = store.getState().app.routes;

	let currentRoute = null;
	for (let key in routes) {
		if (!routes.hasOwnProperty(key)) continue;

		let route = routes[key];
		if (route.url === href) {
			currentRoute = route;
			break;
		}
	}

	return currentRoute;
};
