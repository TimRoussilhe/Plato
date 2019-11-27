import store from 'store';
import watch from 'redux-watch';

/**
 * Component: Defines a component with basic methods
 * @constructor
 */
class Base {
	set promises(newPromises) {
		if (!this._promises) this._promises = {};
		for (const promise in newPromises) {
			if ({}.hasOwnProperty.call(newPromises, promise)) {
				this._promises[promise] = newPromises[promise];
			}
		}
	}

	get promises() {
		return this._promises;
	}

	set state(state) {
		if (!this._state) this._state = {};
		for (const subState in state) {
			if ({}.hasOwnProperty.call(subState, state)) {
				this._state[subState] = state[subState];
			}
		}
	}

	get state() {
		return this._state;
	}

	set storeEvents(storeEvents) {
		for (const objectPath in storeEvents) {
			if (!storeEvents[objectPath]) continue;
			this._storeEvents[objectPath] = storeEvents[objectPath];
		}
		this.subscribe();
	}

	get storeEvents() {
		return this._storeEvents;
	}

	constructor() {
		/**
		 * Object as associative array of all the <promises> objects
		 * @type {Object}
		 */
		this._promises = {};

		/**
		 * Object as associative array of the state
		 * @type {Object}
		 */
		this.state = {};

		/**
		 * Object as associative array of all <watcher> objects
		 * @type {Object}
		 */
		this._storeEvents = {};

		/**
		 * Object as associative array of all <subscriptions> objects
		 * @type {Object}
		 */
		this.subscriptions = {};

		this.promises = {
			init: {
				resolve: null,
				reject: null,
			},
		};

		this.state = {
			isInit: false,
		};
	}

	/**
	 * Init
	 * @return {Promise} A Promise the component is init
	 */
	init() {
		return new Promise((resolve, reject) => {
			this.promises.init.resolve = resolve;
			this.promises.init.reject = reject;

			const { isInit } = this.state;

			if (isInit) {
				this.promises.init.reject();
				return;
			}

			this.initComponent();
		});
	}

	initComponent() {
		this.onInit();
	}

	/**
	 * Once the component is init
	 */
	onInit() {
		this.setState({ isInit: true });
		this.promises.init.resolve();
	}

	setState(partialState = {}, callback, needRender = false) {
		if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState !== null) {
			console.error(
				'setState(...): takes an object of state variables to update or a ' +
					'function which returns an object of state variables.'
			);
			return;
		}

		for (const key in partialState) {
			if ({}.hasOwnProperty.call(partialState, key)) {
				this.state[key] = partialState[key];
			}
		}

		if (callback) callback();
		if (needRender) this.render();
	}

	subscribe(o) {
		// When an object is givin for a specific subscription
		if (o) {
			if (this.subscriptions[o.path]) {
				this.subscriptions[o.path]();
			}

			let method = o.cb;

			if (typeof method !== 'function') method = this[method];
			if (!method) return;

			this._storeEvents[o.path] = method;

			const watcher = watch(store.getState, o.path);
			this.subscriptions[o.path] = store.subscribe(watcher(method));

			return;
		}

		for (const path in this.storeEvents) {
			if ({}.hasOwnProperty.call(this.storeEvents, path)) {
				if (!this.storeEvents[path]) continue;
				if (this.subscriptions[path]) this.subscriptions[path]();

				let method = this.storeEvents[path];

				if (typeof method !== 'function') method = this[method];
				if (!method) continue;

				const watcher = watch(store.getState, path);
				this.subscriptions[path] = store.subscribe(watcher(method));
			}
		}
	}

	unsubscribe(path_ = null) {
		if (path_) {
			if (this.subscriptions[path_]) {
				this.subscriptions[path_]();
				delete this.subscriptions[path_];
			}
			return;
		}

		for (const path in this.subscriptions) {
			if (!this.subscriptions[path]) continue;

			// To unsubscribe the change listener, invoke the function returned by subscribe.
			// Ex : let unsubscribe = store.subscribe(handleChange)
			// unsubscribe()
			this.subscriptions[path]();
		}
		this.subscriptions = {};
	}

	dispatch(action) {
		store.dispatch(action);
	}

	dispose() {
		this.unsubscribe();
	}

	resize() {}
}

export default Base;
