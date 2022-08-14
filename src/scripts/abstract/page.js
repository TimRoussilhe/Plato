import AbstractDOMComponent from 'abstract/component.js';
import { gsap, Cubic } from 'gsap';
import store from 'store';

import { JSON_ENDPOINTS } from 'constants/config.js';
import { getRoute } from './../app/selectors.js';
import Cache from './../app/Cache.js';

// Actions
import { setMeta } from './../app/actions.js';

/**
 * PageComponent: Defines a page
 * @extends AbstractDOMComponent
 * @constructor
 */
class PageComponent extends AbstractDOMComponent {
	constructor(props) {
		super(props);
		this.type = props.type || 'default';
		/**
		 * Data Object
		 * @type {Object}
		 */
		this.data = props.data ? props.data : {};

		this.promises = {
			data: {
				resolve: null,
				reject: null,
			},
		};
	}

	initComponent() {
		this.getData().then(() => {
			this.initData();
			super.initComponent();
		});
	}

	getData() {
		return new Promise((resolve, reject) => {
			this.promises.data.resolve = resolve;
			this.promises.data.reject = reject;

			this.fetchData();
		});
	}

	initData() {
		if (this.data.meta) {
			store.dispatch(setMeta(this.data.meta));
		}
		this.props.data = this.data;
	}

	fetchData() {
		const endPoint = this.props.endPoint;

		if (!endPoint) {
			this.promises.data.resolve();
			return;
		}

		const { oldPage, location } = store.getState().app;
		const currentRoute = getRoute(location);

		if (oldPage) {
			const url = JSON_ENDPOINTS + this.props.endPoint;

			const data = Cache.has(currentRoute.id) ? Cache.getData(currentRoute.id) : null;
			if (data) {
				if (Promise.resolve(data) == data) {
					data.then(() => {
						this.setData(Cache.getData(currentRoute.id));
					});
				} else {
					this.setData(data);
				}
			} else {
				fetch(url)
					.then((response) => {
						return response.json();
					})
					.then((json) => {
						this.setData(json);
						Cache.set(currentRoute.id, json);
					})
					.catch((ex) => {
						this.promises.data.reject();
					});
			}
		} else {
			const { globalData } = store.getState().app;
			if (globalData && globalData.serverData) {
				this.setData(globalData.serverData);
				// Save server data in the Cache
				Cache.set(currentRoute.id, globalData.serverData);
			} else {
				// probably not needed since serverData will always be defined from the server side
				this.promises.data.reject();
			}
		}
	}

	setData(data) {
		this.data = data;
		this.promises.data.resolve();
	}

	setupDOM() {
		gsap.set(this.el, { autoAlpha: 0 });
	}

	initTL() {
		this.TL.show = new gsap.timeline({ paused: true, onComplete: () => this.onShown() });
		this.TL.show.to(this.el, 0.3, { autoAlpha: 1, ease: Cubic.easeOut });

		this.TL.hide = new gsap.timeline({ paused: true, onComplete: () => this.onHidden() });
		this.TL.hide.to(this.el, 0.3, { autoAlpha: 0, ease: Cubic.easeOut });
	}

	onDOMInit() {
		// append to main container
		const { oldPage } = store.getState().app;
		if (oldPage) {
			this.el.classList.add('next-page');
		}
		document.getElementById('content').appendChild(this.el);
		super.onDOMInit();
	}

	showComponent() {
		setTimeout(() => {
			this.TL.show.play(0);
		}, 0);
	}

	hideComponent() {
		setTimeout(() => {
			this.TL.hide.play(0);
		}, 0);
	}
}

export default PageComponent;
