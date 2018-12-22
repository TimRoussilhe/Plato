import store from 'store';
import {uniqueId, result, isFunction, bind, remove} from 'lodash-es';
import SVGS from 'jsons/svgs.json';
import Base from './base';

const delegateEventSplitter = /^(\S+)\s*(.*)$/;

/**
 * Component: Defines a component with basic methods
 * @constructor
 */

class Component extends Base {

	set events(events) {
		for (const event in events) {
			const uid = uniqueId('e');
			events[event].uid = uid;
			this._events[event] = events[event];
		}

		// for now we disable it here to avoid too many call
		// and let the render naturally call the evetns delegation
		// this.delegateEvents();
	}

	get events() {
		return this._events;
	}

	set promises(newPromises) {
		if (!this._promises) this._promises = {};
		for (const promise in newPromises) {
			this._promises[promise] = newPromises[promise];
		}
	}
	get promises() {
		return this._promises;
	}

	set states(states) {
		for (const state in states) {
			this._states[state] = states[state];
		}
	}

	get states() {
		return this._states;
	}

	constructor(props) {

		super(props);

		/**
			 * Object as associative array of all the <handlers> objects
			 * @type {Object}
			 */
		this.handlers = {};

		/**
			 * Object as associative array of all the <DOM.events> objects
			 * @type {Object}
			 */
		this._events = {};
		this.delegatedEvents = [];

			 /**
     * Object as associative array of all the <promises> objects
     * @type {Object}
     */
		this._promises = {
			init: {
				resolve: null,
				reject: null,
			},
			show: {
				resolve: null,
				reject: null,
			},
			hidden: {
				resolve: null,
				reject: null,
			},
		};

		/**
			 * Object as associative array of all the states
			 * @type {Object}
			 */
		this._states = {};

		/**
		 * Object as associative array of all the timelines
		 * @type {Object}
		 */
		this.TL = {};

		/**
     * uniqueId
     * @type {String}
     */
		this.cid = uniqueId('component');

		this.props = props;
		this.states = {
			canUpdate: false,
			isInit: false,
			isAnimating: false,
			isShown: false,
		};

		/**
		* El
		* If el is passed from parent, this means the DOM is allready render
		and we just need to scope it
		* @type {DOM}
		*/

		this.el = props.el ? props.el : null;
		this.template = props.template ? props.template : null;

		this.data = props.data ? props.data : this.data;
		this.actions = props.actions ? props.actions : {};

		this.events = {
			'click a': (e) => this.hyperlink(e),
		};

	}

	/**
	 * Init the component.
	 * Override and trigger onInit when we have to wait for computer procesing, like canvas initialization for instance.
	 */
	initComponent() {
		this.render();
	}

	/**
	 * Call render function if you wanna change the component
	 * based on states/data
	 */
	render() {
		// Default components just need to scope a piece of DOM from constructor
		this.setElement();
		setTimeout(() => this.onRender(), 0);
	}

	/**
	 * Render your component
	 * This is where we scope the main elements
	 */
	setElement() {
		console.log('this.el', this.el);

		if (this.el === null && this.template === null) {
			console.error('You must provide a template or an el to scope a component. Creating an empty div instead');
			this.el = document.createElement('div');
		}

		if (this.el !== null) {
			return;
		}

		if (this.template !== null) {
			this.renderTemplate();
			return;
		}
	}

	/**
	 * Render your template
	 */
	renderTemplate() {
		console.log('renderTemplate');

		const html = this.template({
			data:this.data,
			svgs: SVGS,
		});

		// String to DOM Element
		let wrapper= document.createElement('div');
		wrapper.innerHTML= html;
		this.el = wrapper.firstChild;

	}

	onRender() {
		console.log('onRender');

		this.initDOM();
		this.setupDOM();
		this.initTL();
		this.delegateEvents();
		setTimeout(() => this.onDOMInit(), 0);
	}

	/**
     * Init all your DOM elements here
     */
	initDOM() {}

	/**
     * Setup your DOM elements here ( for example defaut style before animation )
     */
	setupDOM() {}

	/**
	 * Init the Timeline here
	 */
	initTL() {}

	onDOMInit() {
		this.bindEvents();
		this.onInit();
	}

	/**
	 * Bind your events here
	 */
	bindEvents() {}

	/**
	 * Unbind yout events here
	 */
	unbindEvents() {}

	/**
	 * Set callbacks, where `this.events` is a hash of
	 *
	 * *{"event selector": "callback"}*
	 *
	 *  {
	 *      'mousedown .title':  'edit',
	 *      'click .button':     'save',
	 *      'click .open':       function(e) { ... }
	 *   }
	 * @param {Object} Events Objcets
	 */
	delegateEvents(events) {

		events || (events = result(this, 'events'));
		if (!events) return this;
		this.undelegateEvents();
		for (let key in events) {
			let method = events[key];
			if (!isFunction(method)) method = this[method];
			if (!method) continue;
			let match = key.match(delegateEventSplitter);
			console.log('method.uid', method.uid);

			this.delegate(match[1], match[2], bind(method, this), method.uid);
		}
		return this;
	}

	/**
     * Add a single event listener to the view's element (or a child element
     * using `selector`). This only works for delegate-able events: not `focus`,
     * `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
     */
	delegate(eventName, selector, listener, uid) {

		if (this.el){

			if (selector){
				const items = [...this.el.querySelectorAll(selector)];
				if (items.length > 0 ) items.forEach((item) => item.addEventListener(eventName, listener) );
			} else {
				this.el.addEventListener(eventName, listener);
			}

			this.delegatedEvents.push({
				uid: uid,
				eventName: eventName,
				selector: selector,
				listener: listener,
			});
		}
		return this;
	}

	// Clears all callbacks previously bound to the view by `delegateEvents`.
	// You usually don't need to use this, but may wish to if you have multiple
	// views attached to the same DOM element.
	undelegateEvents() {

		if (this.el){
			this.delegatedEvents.forEach((element) => {
				this.undelegate(element.eventName, element.selector, element.listener, element.uid);
			});
		}

		return this;
	}

	// A finer-grained `undelegateEvents` for removing a single delegated event.
	// `selector` and `listener` are both optional.
	undelegate(eventName, selector, listener, uid) {

		if (this.el){
			if (selector){
				const items = [...this.el.querySelectorAll(selector)];
				if (items.length > 0 ) items.forEach((item) => item.removeEventListener(eventName, listener) );
			} else {
				this.el.removeEventListener(eventName, listener);
			}
		}

		// remove event from array based on uid
		remove(this.delegatedEvents, (event) => {
			return event.uid === uid;
		});

		return this;
	}

	/**
	 * Update
     *
	 */
	update() {
		if (this.states.canUpdate) this.onUpdate();
	}

	/**
	 * Called on scroll
	 */
	onScroll() {}

	/**
	 * Called on update
	 */
	onUpdate() {}

	/**
	 * Called on resize
     * In our scenario this will listen to the GlobalStore Events
	 */
	onResize() {}

	/**
	 * Show the component
	 */
	show() {
		return new Promise((resolve, reject) => {
			this.promises.show.resolve = resolve;
			this.promises.show.reject = reject;
			this.setState({isAnimating: true, canUpdate: true});
			this.showComponent();
		});
	}

	showComponent() {
		this.onShown();
	}

	/**
		 * The component is shown
		 */
	onShown() {
		this.setState({isShown: true, isAnimating: false});
		this.promises.show.resolve();
	}

	/**
	 * Hide the component
	 */
	hide() {
		return new Promise((resolve, reject) => {
			this.promises.hidden.resolve = resolve;
			this.promises.hidden.reject = reject;
			this.setState({isAnimating: true});
			this.hideComponent();
		});
	}

	hideComponent() {
		this.onHidden();
	}

	/**
	 * The component is shown
	 */
	onHidden() {
		this.setState({isAnimating: false, isShown: false, canUpdate: false});
		this.promises.hidden.resolve();
	}

	hyperlink(e) {
		console.log('hyperlink');

		const isAnimating = store.getState().app.isAnimating;
		if (isAnimating){
			e.preventDefault();
		}

	}

	/**
	 * Kill a timeline by name
	 * @param {string} name of the timeline stocked in this.TL.
	 */
	killTL(name) {
		if (this.TL[name] === undefined || this.TL[name] === null) return;

		let tl = this.TL[name];

		tl.stop();
		tl.kill();
		tl.clear();
		tl = null;

		this.TL[name] = null;
	}

	/**
	 * Kill all the timelines
	 */
	destroyTL() {
		for (const name in this.TL) {
			if (this.TL[name]) this.killTL(name);
		}
		this.TL = {};
	}

	/**
	 * Dispose the component
	 */
	dispose() {
		this.setState({isInit: false, isShown: false, canUpdate: false});
		this.unbindEvents();
		this.handlers = {};
		this.promises = {};

		this.undelegateEvents();
		this.destroyTL();

		this.el.parentNode.removeChild(this.el);
		this.el = null;
		this._events = {};
		// this.events = {};
		super.dispose();
		// TODO Check this to make sure event are properly removed
	}
}

export default Component;
