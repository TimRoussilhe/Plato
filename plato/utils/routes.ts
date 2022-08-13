export function getRoutesByTemplatePath(routes, templatePath) {
	const testRegexp = templatePath.split('/').slice(-1);
	const name = testRegexp[0].substring(0, testRegexp[0].lastIndexOf('.')) || testRegexp[0];
	let activeRoutes: any[] = [];

	for (let route of routes) {
		if (route.template === name) activeRoutes.push(route);
	}

	if (activeRoutes.length > 0) return activeRoutes;
	return null;
}
