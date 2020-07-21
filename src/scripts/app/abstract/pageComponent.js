import AbstractDOMComponent from 'abstract/component';
import { gsap, Cubic } from 'gsap';
import store from 'store';

/**
 * PageComponent: Defines a page
 * @extends AbstractDOMComponent
 * @constructor
 */
class PageComponent extends AbstractDOMComponent {
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
