/**
 * Container: Handles actions and data for a component
 * @constructor
 */

import Base from './base';

class AbstractContainer extends Base {
	constructor(props = {}) {
		super(props);

		/**
		 * Component associated to the container
		 * @type {Object}
		 */
		this.component = null;

		/**
		 * Component Class
		 * @type {Object}
		 */
		this.ComponentClass = null;

		/**
		 * Props Object
		 * @type {Object}
		 */
		this.props = props;

		/**
		 * Data Object
		 * @type {Object}
		 */
		this.data = props.data ? props.data : {};

		/**
		 * Actions Object
		 * @type {Object}
		 */
		this.props.actions = props.actions ? props.actions : {};

		// /**
		// * El
		// * @type {DOM}
		// */

		this.promises = {
			data: {
				resolve: null,
				reject: null
			}
		};
	}

	getComponent() {
		return this.component;
	}

	initComponent() {
		this.getData().then(() => {
			this.initActions();
			this.initData();

			this.component = new this.ComponentClass(this.props);
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
