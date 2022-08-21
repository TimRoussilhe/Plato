import Lethargy from 'lethargy';

/* eslint-disable */
class ScrollPrevent {
  constructor() {
    this.blockDelta = false;
    this.currentDeltaY = 0;

    this.lethargy = new Lethargy.Lethargy();

    this.cb = null;
    this.el = null;

    this.UP = 'UP';
    this.DOWN = 'DOWN';

    this.date = Date.now();
  }

  watch(el, cb) {
    this.cb = cb;
    this.el = el;

    this.bindEvents();
  }

  approveScroll(e) {
    if (e === null) return;

    const date = Date.now();

    if (this.lethargy.check(e) !== false && date - this.date > 200) {
      this.date = date;
      const direction = e.deltaY >= 0 ? this.DOWN : this.UP;

      this.cb({
        deltaY: this.currentDeltaY,
        direction: direction,
      });
    }
  }

  bindEvents() {
    if (!this.el) return;

    this.el.addEventListener('mousewheel', () => this.approveScroll(), false);
    this.el.addEventListener('wheel', () => this.approveScroll(), false);
  }

  unbindEvents() {
    if (!this.el) return;

    this.el.removeEventListener('mousewheel', () => this.approveScroll(), false);
    this.el.removeEventListener('wheel', () => this.approveScroll(), false);
  }

  dispose() {
    this.unbindEvents();
  }
}

export default ScrollPrevent;
