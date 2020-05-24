// Abstract
import Base from 'abstract/base';

// Containers
import Layout from 'containers/layout/Layout';

// dynamic import
// function getComponent(chunkName, path) {
// 	return new Promise((resolve, reject) => {
// 		const ComponentName = path.charAt(0).toUpperCase() + path.slice(1);
// 		import(/* webpackChunkName: "[request]" */ `containers/${path}/${ComponentName}`)
// 			.then(({default: Page}) => {
// 				resolve(Page);
// 			})
// 			.catch((error) => reject('An error occurred while loading the component'));
// 	});
// }

// not so dynamic import
function pageLoader(chunkName, path) {
	return new Promise((resolve, reject) => {
		const ComponentName = path.charAt(0).toUpperCase() + path.slice(1);
		switch (ComponentName) {
			case 'Homepage':
				return import(/* webpackPrefetch: true */ /* webpackChunkName: "Homepage" */ 'containers/homepage/Homepage')
					.then(({ default: Page }) => {
						resolve(Page);
					})
					.catch(error => reject('An error occurred while loading the component'));
			case 'About':
				return import(/* webpackPrefetch: true */ /* webpackChunkName: "About" */ 'containers/about/About')
					.then(({ default: Page }) => {
						resolve(Page);
					})
					.catch(error => reject('An error occurred while loading the component'));
			case 'Notfound':
				return import(/* webpackPrefetch: true */ /* webpackChunkName: "Notfound" */ 'containers/notfound/Notfound')
					.then(({ default: Page }) => {
						resolve(Page);
					})
					.catch(error => reject('An error occurred while loading the component'));
		}
	});
}

// Constants
// Selector
import { getRoute } from './selectors';

// Actions
import { setAnimating, setPage, setOldPage, setGlobalData } from './actions';
import store from 'store';

class App extends Base {
	constructor(props) {
		super(props);

		this.prevLocation = null;
		this.location = null;
		this.layout = null;
		// this.loader = null;

		this.page = null;
		this.oldPage = null;

		this.storeEvents = {
			'app.location': (location, prevLocation) => this.onLocationChanged(location, prevLocation),
		};
	}

	init() {
		// grab server data
		const data = JSON.parse(document.getElementById('__PLATO_DATA__').innerHTML);

		if (data) {
			store.dispatch(setGlobalData(data));
		}
		this.layout = new Layout();

		// return layout promise
		return this.layout.init();
	}

	onLocationChanged(location, prevLocation) {
		this.prevLocation = prevLocation;
		if (location !== prevLocation) {
			this.location = location;
			this.routing(location, false);
		}
	}

	async routing(location) {
		console.log('-------------- routing ---------------', location);

		let Page = null;
		const currentRoute = getRoute(location);

		try {
			// const PageAsync = await getComponent(currentRoute.template, currentRoute.template);
			// we use template to define page Type
			const PageAsync = await pageLoader(currentRoute.template, currentRoute.template);
			Page = PageAsync;
		} catch (error) {
			console.error(error);
		}

		store.dispatch(setAnimating(true));

		// First Render from the server
		let el = null;
		if (this.oldPage === null && this.page === null) {
			el = document.getElementsByClassName('page-wrapper')[0];
		}

		// SAFETY HERE
		// IF THERE IS STILL AN OLD PAGE HERE IT MEANS SOMETHING BEEN WRONG
		// SO WE JUST KILL IT
		// USUALLY HAPPENS IF USER PLAY WITH BROWSER BACK ARROWS WHILE ANIMATING
		if (this.oldPage) {
			this.oldPage.dispose();
			this.oldPage = null;
			this.page.dispose();
			this.page = null;
			console.log('KILL PAGE !!!!!!');

			// This will just reload the page actually.
			window.location.assign(window.location.href);
		}

		if (this.page) {
			this.oldPage = this.page;
			store.dispatch(setOldPage(this.oldPage));
		}

		// Define first page and pass el if the page el is already in the dom
		this.page = new Page({
			el: el ? el : null,
			endPoint: currentRoute && currentRoute.json ? currentRoute.json : null,
			type: currentRoute && currentRoute.template ? currentRoute.template : null,
		});

		// Init the next page now
		this.page.init().then(() => {
			store.dispatch(setPage(this.page));

			// Resize the current page for position
			this.layout.triggerResize();

			if (this.oldPage) {
				this.oldPage.hide().then(() => {
					this.oldPage.dispose();
					this.oldPage = null;
					this.showPage();
				});
			} else {
				this.showPage();
			}
		});
	}

	showPage() {
		// Show next
		this.page.show().then(() => {
			store.dispatch(setAnimating(false));

			// at this point, dispose
			if (this.oldPage) {
				this.oldPage.dispose();
				this.oldPage = null;
			}
		});
	}
}

export default App;
