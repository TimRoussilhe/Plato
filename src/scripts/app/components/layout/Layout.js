import DOMComponent from 'abstract/component';
import store from 'store';

// Containers
import Header from 'containers/header/Header';

import { debounce } from 'utils/misc';

class Layout extends DOMComponent {
	constructor(props) {
		super(props);

		this.scrollTicket = false;

		this.header = null;

		this.el = document.documentElement;

		this.storeEvents = {
			'app.location': (location, prevLocation) => this.onLocationUpdate(location, prevLocation),
			'app.page': page => this.onPageUpdate(page),
			'app.meta': (newVal, oldVal) => this.setMeta(newVal, oldVal),
		};
	}

	initDOM() {
		this.$content = this.el.querySelector('#content');
		this.$title = this.el.querySelector('head > title');
		this.$metaDescription = this.el.querySelector('head > meta[name=description]');

		// if you need to remove fastclick event of an element
		// just add needsclick as a class
		// const needsClick = FastClick.prototype.needsClick;
		// FastClick.prototype.needsClick = function(target) {
		//     return needsClick.apply(this, arguments);
		// };
		// FastClick.attach(this.el);
	}

	onDOMInit() {
		const aInitPromises = [];

		this.header = new Header({
			el: document.getElementById('main-nav'),
		});

		aInitPromises.push(this.header.init());

		// scroll top
		window.scrollTo(0, 0);

		Promise.all(aInitPromises).then(() => {
			super.onDOMInit();
		});
	}

	bindEvents() {
		window.addEventListener(
			'orientationchange',
			debounce(() => {
				this.actions.resize(window);
			}, 300),
			false
		);

		window.addEventListener(
			'resize',
			debounce(() => {
				this.actions.setOrientation(window);
				this.actions.resize(window);
			}, 300),
			false
		);

		this.actions.resize(window);

		// enable a flag to grab scroll position during update
		// window.addEventListener('scroll', () => {
		// 	this.scrollTicket = true;
		// }, false);

		// Actually, unsubscribe to any this.events to avoid any double trigger because of body
		// this.unbindEvents();
	}

	onUpdate() {
		if (this.scrollTicket) {
			this.scrollTicket = false;
			const scrollObj = {
				x: window.scrollX || window.pageXOffset,
				y: window.scrollY || window.pageYOffset,
			};
		}
	}

	showComponent() {
		if (this.state.isShown) return;

		setTimeout(() => {
			super.showComponent();
		}, 0);
	}

	triggerResize() {
		window.dispatchEvent(new Event('resize'));
	}

	setMeta(meta, oldMeta) {
		this.$title.textContent = meta.title;
		this.$metaDescription.textContent = meta.description;
	}

	onLocationUpdate(location) {
		this.el.setAttribute('location', location);

		// Analytics single app page view
		if (window.gtag) {
			const routes = store.getState().app.routes;
			let pagePath = '/';
			routes.forEach(route => {
				if (route.id === location) pagePath = route.url;
			});

			gtag('config', 'UA-XXX', {
				page_title: location,
				page_path: pagePath,
			});
		}
	}

	onPageUpdate(page) {
		this.el.setAttribute('type', page.type);
	}

	resize() {
		if (!this.state.isShown) return;
	}
}

export default Layout;
