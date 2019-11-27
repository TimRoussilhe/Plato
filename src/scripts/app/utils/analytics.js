import { GA_ID } from 'constants/analytics';

/**
 * Init analytics by loading the Google scripts.
 * Doesn not track on process.env.DEV
 * @constructor
 */
class Analytics {
	constructor(options = {}) {
		this.gaID = options.gaID ? options.gaID : GA_ID;
		this.isCreated = false;
		// this.canTrack = !process.env.DEV;
		this.canTrack = true;

		this.init();
	}

	init() {
		if (!this.canTrack) return;

		(function(i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			(i[r] =
				i[r] ||
				function() {
					(i[r].q = i[r].q || []).push(arguments);
				}),
				(i[r].l = 1 * new Date());
			(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m);
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		this.create();
	}

	create() {
		if (window.ga == undefined || this.isCreated) return;

		this.isCreated = true;
		window.ga('create', this.gaID, 'auto');
	}

	trackPage(options = {}) {
		if (window.ga == undefined || !this.canTrack) return;
		this.create();

		Object.keys(options).length ? ga('send', 'pageview', options) : ga('send', 'pageview');
	}

	trackEvent(event) {
		if (window.ga == undefined || !this.canTrack) return;
		this.create();

		if (event.category == undefined) {
			console.log('GA:: You have to provide a category', event);
			return;
		}

		if (event.action == undefined) {
			console.log('GA:: You have to provide an action', event);
			return;
		}

		const category = event.category;
		const action = event.action;
		const label = event.label || null;
		// value can only be numerical
		const value = event.value || null;

		ga('send', 'event', category, action, label, value);
	}
}

export let analytics = null;
export let trackEvent = null;
export let trackPage = null;

export function configureAnalytics(options = {}) {
	analytics = new Analytics(options);
	trackEvent = analytics.trackEvent.bind(analytics);
	trackPage = analytics.trackPage.bind(analytics);
	return analytics;
}
