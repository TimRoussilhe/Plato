import DOMComponent from 'abstract/component.js';
import store from 'store';

// Containers
import Header from 'components/header/Header.js';

// Actions
import { setOrientation, calculateResponsiveState } from './actions.js';

import { debounce } from 'utils/misc.js';
import { Prefetch } from './Prefetch.js';

class Layout extends DOMComponent {
	constructor(props) {
		super(props);

		this.header = null;
		this.el = document.documentElement;

		this.storeEvents = {
			'app.location': (location, prevLocation) => this.onLocationUpdate(location, prevLocation),
			'app.page': (page) => this.onPageUpdate(page),
			'app.meta': (newVal, oldVal) => this.setMeta(newVal, oldVal),
		};

		this.prefect = new Prefetch();
	}

	initDOM() {
		this.$title = this.el.querySelector('head > title');
		this.$metaDescription = this.el.querySelector('head > meta[name=description]');

		this.$metaOGTitle = this.el.querySelector('head > meta[property="og:title"]');
		this.$metaOGDescription = this.el.querySelector('head > meta[property="og:description"]');
		this.$metaOGImage = this.el.querySelector('head > meta[property="og:image"]');
		this.$metaTwitterTitle = this.el.querySelector('head > meta[name="twitter:title"]');
		this.$metaTwitterDescription = this.el.querySelector('head > meta[name="twitter:description"]');
		this.$metaTwitterImage = this.el.querySelector('head > meta[name="twitter:image"]');
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
				this.dispatch(setOrientation(window));
				this.dispatch(calculateResponsiveState(window));
			}, 300),
			false
		);

		window.addEventListener(
			'resize',
			debounce(() => {
				this.dispatch(calculateResponsiveState(window));
			}, 300),
			false
		);

		this.dispatch(calculateResponsiveState(window));
		this.prefect.bindPrefetch();
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

	setMeta(meta) {
		const { oldPage } = store.getState().app;

		if (!oldPage) {
			return;
		}

		if (meta.title) {
			this.$title.textContent = meta.title;
			this.$metaOGTitle.setAttribute('content', meta.title);
			this.$metaTwitterTitle.setAttribute('content', meta.title);
		}
		if (meta.description) {
			this.$metaDescription.setAttribute('content', meta.description);
			this.$metaOGDescription.setAttribute('content', meta.description);
			this.$metaTwitterDescription.setAttribute('content', meta.description);
		}
		if (meta.shareImage) {
			this.$metaOGImage.setAttribute('content', meta.shareImage);
			this.$metaTwitterImage.setAttribute('content', meta.shareImage);
		}
	}

	onLocationUpdate(location) {
		this.el.setAttribute('location', location);

		// Analytics single app page view
		if (window.gtag) {
			const routes = store.getState().app.routes;
			let pagePath = '/';
			routes.forEach((route) => {
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
		this.prefect && this.prefect.resetPrefetch();
	}

	resize() {
		if (!this.state.isShown) return;
	}
}

export default Layout;
