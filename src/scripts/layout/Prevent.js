/**
 * Make sure the browser supports `history.pushState`.
 */
const pushState = () => !window.history.pushState;

/**
 * Make sure there is an `el` and `href`.
 */
const exists = ({ el, href }) => !el || !href;

/**
 * If the user is pressing ctrl + click, the browser will open a new tab.
 */
const newTab = ({ event }) => event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

/**
 * If the link has `_blank` target.
 */
const blank = ({ el }) => el.hasAttribute('target') && el.target === '_blank';

/**
 * If the link has download attribute.
 */
const download = ({ el }) => el.getAttribute && typeof el.getAttribute('download') === 'string';

/**
 * If the links contains [data-transition-prevent] or [data-transition-prevent="self"].
 */
const preventSelf = ({ el }) => el.hasAttribute('data-prevent');

export class Prevent {
	constructor() {
		this.suite = [];
		this.tests = new Map();

		this.init();
	}

	init() {
		// Add defaults
		this.add('pushState', pushState);
		this.add('exists', exists);
		this.add('newTab', newTab);
		this.add('blank', blank);
		this.add('download', download);
		this.add('preventSelf', preventSelf);
	}

	add(name, check, suite = true) {
		this.tests.set(name, check);
		suite && this.suite.push(name);
	}

	/**
	 * Run individual test
	 */
	run(name, el, event, href) {
		return this.tests.get(name)({
			el,
			event,
			href,
		});
	}

	/**
	 * Run test suite
	 */
	checkLink(el, event, href) {
		return this.suite.some((name) => this.run(name, el, event, href));
	}
}
