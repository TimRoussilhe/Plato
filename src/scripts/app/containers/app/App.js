// Abstract
import Base from 'abstract/Base';

// Containers
import Layout from 'containers/layout/Layout';
// import HomepageContainer from 'containers/homepage/Homepage';
// import AboutContainer from 'containers/about/About';
// import NotFoundContainer from 'containers/not-found/NotFound';
import DefaultPage from 'abstract/Pagecomponent';

function getComponent(chunkName, path) {

	return import(/* webpackChunkName: "`${chunkName}`" */ 'containers/homepage/Homepage').then(({default: HomepageContainer}) => {
		// let element = document.createElement('div');

		// element.innerHTML = _.join(['Hello', 'webpack'], ' ');
		console.log('component loaded', HomepageContainer);
		return HomepageContainer;

	}).catch((error) => 'An error occurred while loading the component');
}

// getComponent().then((Component) => {
// 	const home = new Component();
// 	console.log('home', home);

// 	// document.body.appendChild(component);
// });
// const page = 'Homepage';

// import( /* webpackChunkName: "[request]" */ `containers/homepage/${page}` ).then( ( data ) => {
// 	console.log( data );
// } );
// import( 'containers/about/About' ).then( ( data ) => {
// 	console.log( data );
// } );
// import( 'containers/not-found/NotFound' ).then( ( data ) => {
// 	console.log( data );
// } );

// Constants
import {HOMEPAGE, ABOUT, NOT_FOUND} from 'constants/locations';

// Selector
import {getRoute} from './selectors';

// Actions
import {setAnimating, setPage, setOldPage} from './actions';
// import {showModal} from 'containers/modal/actions';
import store from 'store';
// import watch from 'redux-watch';

class App extends Base {

	constructor(options) {

		super(options);

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
		let Page = null;

		// switch (location) {
		// case HOMEPAGE: Page = AboutContainer; break;
		// case ABOUT: Page = AboutContainer; break;
		// case NOT_FOUND: Page = NotFoundContainer; break;
		// default: Page = DefaultPage;
		// }

		// const page = 'Homepage';

		const PageAsync = await getComponent();
		console.log('PageAsync', PageAsync);
		Page = PageAsync;
		// import( /* webpackChunkName: "[request]" */ `containers/homepage/${page}` ).then( ( data ) => {
		// 	console.log( data );
		// } );

		if (Page === null) {
			console.error('Error: page is null');
			return;
		}
		store.dispatch(setAnimating(true));

		// First Render from the server
		let el = null;
		if (this.oldPage === null && this.page === null) {
			el = document.getElementsByClassName('page-wrapper')[0];
		}

		const currentRoute = getRoute(location);

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
				this.oldPage.hide()
					.then(() => {
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

	showPage(){
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
