const routes = require('./routes.json');

class Routes {
	constructor(routes) {
		this.routes = routes.staticRoutes;
	}

	getRouteByUrl(url) {
		for (let id in this.routes) {
			if (this.routes[id].url === url || this.routes[id].url === '/' + url || this.routes[id].url === '/' + url + '/') {
				return this.routes[id];
			}
		}
		return null;
	}

	getRouteByID(id_) {
		for (let id in this.routes) {
			if (id === id_) return this.routes[id];
		}
		return null;
	}

	getRoutesByTemplatePath(templatePath) {
		const testRegexp = templatePath.split('/').slice(-1);
		const name = testRegexp[0].substring(0, testRegexp[0].lastIndexOf('.')) || testRegexp[0];
		let routes = [];

		for (let route of this.routes) {
			if (route.template === name) routes.push(route);
		}

		if (routes.length > 0) return routes;
		return null;
	}
}

module.exports = new Routes(routes);
