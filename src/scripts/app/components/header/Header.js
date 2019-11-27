import AbstractDOMComponent from 'abstract/component';

class Header extends AbstractDOMComponent {
	constructor(props) {
		super(props);

		this.events = {
			'click .logo': () => this.clickHome(),
		};

		this.storeEvents = {
			'app.location': (location, prevLocation) => this.setActiveLink(location, prevLocation),
		};
	}

	clickHome() {
		console.log('clickHome');
	}

	initDOM() {
		this.$logo = this.el.querySelector('.logo');
		this.$navItems = this.el.querySelectorAll('.menu li a');
	}

	setActiveLink(location) {
		this.resetCurrentNavItem();

		let $currentNavItem = null;
		[...this.$navItems].forEach(navItem => {
			if (navItem.dataset.page === location) $currentNavItem = navItem.parentNode;
		});

		// if no nav item SKIP. this would happen when rendering legacy and 404.
		if ($currentNavItem === null) return;

		$currentNavItem.classList.add('active');
	}

	resetCurrentNavItem() {
		[...this.$navItems].forEach(navItem => {
			navItem.parentNode.classList.remove('active');
		});
	}
}

export default Header;
