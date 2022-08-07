import { isMobile, isTablet } from 'utils/is';
import App from 'app/App';
import Router from 'router';

import { setDeviceType } from 'app/actions';
import store from 'store';

import { cleanURL } from 'utils/cleanURL';
import { loadScript, browserSupportsAllFeatures } from 'utils/loadScript';

import './../css/app.scss';

// add Art Template filters
import runtime from 'art-template/lib/runtime';
import filters from 'templates/filters/';
for (let [key, value] of Object.entries(filters)) {
	runtime[key] = value;
}

class Entry {
	constructor() {
		console.log('--- APP STARTED ---');
		console.log('\n\n\n');
		this.app = null;
	}

	init() {
		const router = Router.configureRoute();
		this.app = new App();
		const root = document.documentElement;

		isMobile() && root.classList.add('isMobile');
		isTablet() && root.classList.add('isTablet');

		let deviceType = 'desktop';
		if (isMobile()) deviceType = 'mobile';
		if (isTablet()) deviceType = 'tablet';

		store.dispatch(setDeviceType(deviceType));

		Router.initRouter().then(() => {
			this.app.init().then(() => {
				router.start();
			});
		});
	}
}

(function () {
	cleanURL(window.location.href.split('?')[0]);
})();

if (browserSupportsAllFeatures()) {
	// Browsers that support all features run `main()` immediately.
	main();
} else {
	// All other browsers loads polyfills and then run `main()`.
	loadScript('https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js', main);
}

function main(err) {
	// Initiate all other code paths.
	// If there's an error loading the polyfills, handle that
	// case gracefully and track that the error occurred.

	// initialize the APP do not make a global reference to it.
	const entry = new Entry();
	entry.init();
}
