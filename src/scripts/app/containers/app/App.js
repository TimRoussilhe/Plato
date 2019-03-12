// Abstract
import Base from 'abstract/base';

// Containers
import Layout from 'containers/layout/Layout';

// dynamic import
function getComponent(chunkName, path) {
	return new Promise((resolve, reject) => {
		const ComponentName = path.charAt(0).toUpperCase() + path.slice(1);
		console.log('ComponentName', ComponentName);

		import(/* webpackChunkName: "[request]" */ `containers/${path}/${ComponentName}`)
			.then(({default: Page}) => {
				resolve(Page);
			})
			.catch((error) => reject('An error occurred while loading the component'));
	});
}

// Constants
// Selector
import {getRoute} from './selectors';

// Actions
import {setAnimating, setPage, setOldPage} from './actions';
import store from 'store';

class App extends Base {
	constructor(props) {
		super(props);

		this.prevLocation = null;
		this.location = null;
		this.layout = null;
		this.loader = null;
		this.page = null;
		this.oldPage = null;

		this.storeEvents = {
			'app.location': (location, prevLocation) => this.onLocationChanged(location, prevLocation),
		};
	}

	init() {
		this.layout = new Layout();

		// return layout promise
		return this.layout.init();
	}

	onLocationChanged(location, prevLocation) {
		console.log('onLocationChanged', location);

		this.prevLocation = prevLocation;
		if (location !== prevLocation) {
			this.location = location;
			this.routing(location, false);
		}
	}

	async routing(location, fromSamePage = false) {
		console.log('-------------- routing ---------------');

		let Page = null;
		const currentRoute = getRoute(location);

		try {
			const PageAsync = await getComponent(currentRoute.template, currentRoute.template);
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
		// IF THERE IS STILL AN OLDPAGE HERE IT MEANS SOMETHING BEEN WRONG
		// SO WE JUST KILL IT
		// USUALLY HAPPENS IF USER PLAY WITH BROWSER BACK ARROWS WHILE ANIMATING
		if (this.oldPage) {
			this.oldPage.dispose();
			this.oldPage = null;
			this.page.dispose();
			this.page = null;
			console.log('KILL PAGE !!!!!!');
		}

		if (this.page) {
			this.oldPage = this.page;
			store.dispatch(setOldPage(this.oldPage));
		}

		// Define first page and pass el if the page el is allready in the dom
		this.page = new Page({
			el: el ? el : null,
			endPoint: currentRoute && currentRoute.json ? currentRoute.json : null,
		});

		store.dispatch(setPage(this.page));

		// Init the next page now
		this.page.init().then(() => {
			console.log('ON PAGE INIT');

			// Resize the current page for position
			this.layout.triggerResize();

			if (this.oldPage) {
				console.log('HIDE OLD PAGE', this.oldPage);
				this.oldPage.hide().then(() => {
					console.log('OLD PAGE HIDDEN');
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
			// if (!this.getState().get('app').get('appLoaded')) this.dispatch(setAppLoaded(true));
			console.log('CURRENT PAGE SHOW');

			store.dispatch(setAnimating(false));

			// at this point, dispose
			if (this.oldPage) {
				console.log('dispose again?');
				this.oldPage.dispose();
				this.oldPage = null;
			}
		});
	}
}

export default App;
