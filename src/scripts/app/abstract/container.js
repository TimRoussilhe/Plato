/**
 * Container: Handles actions and data for a component
 * @constructor
 */

import Base from './base';

class AbstractContainer extends Base {

	constructor(options = {}) {

		console.log('options', options);
		super(options);

		/**
    * Component asociated to the container
    * @type {Object}
    */
		this.component = null;

		/**
		* Component Class
		* @type {Object}
		*/
		this.ComponentClass = null;

		/**
		* Data Object
		* @type {Object}
		*/
		this.data = null;

		/**
		* Options Object
		* @type {Object}
		*/
		this.options = null;

		this.options = options;
		this.data = options.data ? options.data : null;
		this.options.actions = options.actions ? options.actions : {};

		// /**
		// * El
		// * @type {DOM}
		// */

		this.promises = {
			init: {
				resolve: null,
				reject: null,
			},
			data: {
				resolve: null,
				reject: null,
			},
		};

		this.states = {
			canUpdate: false,
			isInit: false,
			isAnimating: false,
			isShown: false,
		};

	}

	getComponent() {
		return this.component;
	}

	initComponent() {
		this.getData().then(() => {
			this.initActions();
			this.initData();

			this.options.data = this.data;

			this.component = new this.ComponentClass(this.options);
			this.component.init().then(() => {
				this.onInit();
			});
		});
	}

	getData() {
		return new Promise((resolve, reject) => {
			this.promises.data.resolve = resolve;
			this.promises.data.reject = reject;

			this.fetchData();
		});
	}

	fetchData() {
		this.promises.data.resolve();
	}

	// If we went to parse and do something with the data
	initData() {}

	// Reference any actions here to pass to the component after
	initActions() {}

	resize() {
		return this.component.resize();
	}

	show() {
		return this.component.show();
	}

	hide() {
		return this.component.hide();
	}

	dispose() {
		this.component.dispose();
		this.component = null;
		super.dispose();
		return this;
	}

	reRender() {
		this.hide().then(() => {
			this.dispose();
			this.init().then(() => {
				this.show();
			});
		});
	}
}

export default AbstractContainer;
