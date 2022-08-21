import store from 'store';
import Base from './base.js';
import uniqueId from 'utils/uniqueId.js';

/**
 * Component: Defines a component with basic methods
 * @constructor
 */

class Component extends Base {
  constructor(props) {
    super(props);

    /**
     * Object as associative array of all the <handlers> objects
     * @type {Object}
     */
    this.handlers = {};

    /**
     * Object as associative array of all the <promises> objects
     * @type {Object}
     */
    this.promises = {
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
     * Object as associative array of all the timelines
     * @type {Object}
     */
    this.TL = {};

    /**
     * Object as associative array of all the timers
     * Meant to be used with gsap delayedCall timers.
     * @type {Object}
     */
    this.timers = {};

    /**
     * uniqueId
     * @type {String}
     */
    this.cid = uniqueId('component');

    this.props = props;
    this.state = {
      canUpdate: false,
      isAnimating: false,
      isShown: false,
    };

    /**
		* El
		* If el is passed from parent, this means the DOM is already render
		and we just need to scope it
		* @type {DOM}
		*/
    this.el = props.el ? props.el : null;
    this.template = props.template ? props.template : null;
    this.data = props.data ? props.data : this.data;
  }

  /**
   * Init the component.
   * Override and trigger onInit when we have to wait for computer processing, like canvas initialization for instance.
   */
  initComponent() {
    this.render();
  }

  /**
   * Call render function if you wanna change the component
   * based on state/data
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
    const html = this.template({ data: this.data });

    // String to DOM Element
    let wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    this.el = wrapper.firstChild;
  }

  onRender() {
    if (this.el) {
      const links = this.el.querySelectorAll('a');
      links.forEach((link) => link.addEventListener('click', this.handleHyperLink));
    }

    this.initDOM();
    this.setupDOM();
    this.initTL();
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
    this.setState({
      canUpdate: true,
    });
  }

  /**
   * Bind your events here
   */
  bindEvents() {}

  /**
   * Unbind your events here
   */
  unbindEvents() {}

  /**
   * Update
   *
   */
  update() {
    if (this.state.canUpdate) this.onUpdate();
  }

  /**
   * Called on update
   */
  onUpdate() {}

  /**
   * Show the component
   */
  show() {
    return new Promise((resolve, reject) => {
      this.promises.show.resolve = resolve;
      this.promises.show.reject = reject;
      this.setState({
        isAnimating: true,
      });
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
    this.setState({
      isShown: true,
      isAnimating: false,
    });
    this.promises.show.resolve();
  }

  /**
   * Hide the component
   */
  hide() {
    return new Promise((resolve, reject) => {
      this.promises.hidden.resolve = resolve;
      this.promises.hidden.reject = reject;
      this.setState({
        isAnimating: true,
      });
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
    this.setState({
      isAnimating: false,
      isShown: false,
      canUpdate: false,
    });
    this.promises.hidden.resolve();
  }

  handleHyperLink = (e) => this.hyperlink(e);

  hyperlink(e) {
    const isAnimating = store.getState().app.isAnimating;
    if (isAnimating) {
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

    tl.pause();
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
   * Kill all the timers
   * When using gsap.delayedCall()
   */
  destroyTimers() {
    for (const name in this.timers) {
      if (this.timers[name]) this.timers[name].kill();
    }
    this.timers = {};
  }

  /**
   * Dispose the component
   */
  dispose() {
    this.setState({
      isInit: false,
      isShown: false,
      canUpdate: false,
    });
    this.unbindEvents();

    this.handlers = {};
    this.promises = {};

    this.destroyTL();
    this.destroyTimers();

    const links = this.el.querySelectorAll('a');
    links.forEach((link) => link.removeEventListener('click', this.handleHyperLink));

    this.el.parentNode.removeChild(this.el);
    this.el = null;
    super.dispose();
  }
}

export default Component;
