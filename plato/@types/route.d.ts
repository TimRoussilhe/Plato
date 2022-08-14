export interface Route {
	url: string;
	id: string;
	template: string;
	json: string;
	// dynamic filename (useful for 404)
	fileName?: string;
	data?: object;
	// data source for static routes
	dataSource?: string;
}

export interface Routes {
	routes: Array<Route>;
}
