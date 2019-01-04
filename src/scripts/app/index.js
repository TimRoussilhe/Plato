
import {isMobile, isTablet} from 'utils/is';
import App from 'containers/app/App';
import Router from 'router';
import {setDeviceType} from 'containers/app/actions';
import store from 'store';
import 'whatwg-fetch';
import {cleanURL} from 'helpers/cleanURL';
import './../../css/app.scss';

class Entry {

	constructor() {
		console.log('--- APP TEST TEST ---');
		console.log('\n\n\n');
		this.app = null;
	}

	init() {
		console.log('init');
		const router = Router.configureRoute();
		this.app = new App();
		// custom Detectizr setup
		const root = document.documentElement;

		console.log('isMobile', isMobile());
		console.log('isMobile', isTablet());

		isMobile() && root.classList.add('isMobile');
		isTablet() && root.classList.add('isTablet');

		let deviceType = 'desktop';
		if (isMobile()) deviceType = 'mobile';
		if (isTablet()) deviceType = 'tablet';

		store.dispatch(setDeviceType(deviceType));

		Router.initRouter().then(() => {
			this.app.init()
				.then(() => {
					console.log('init then');
					router.start();
				});
		});

	}
}
console.log('location', location);

(function() {
	const {hostname, port} = location;
	if (hostname !== 'localhost' && port!==8080 && 'serviceWorker' in navigator) {
		navigator.serviceWorker.register('/assets/service-worker.js');
	}
})();

(function() {
	cleanURL(window.location.href.split('?')[0]);
})();

// initialize the APP do not make a global reference to it.
const entry = new Entry();
export default entry;
document.addEventListener('DOMContentLoaded', () => entry.init());

