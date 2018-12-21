import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/index.twig';

// Constants

// Utils

// Selectors

// Actions

// Lib

class Homepage extends AbstractPageComponent {
	constructor(options) {
		super(options);

		this.template = Tpl;

	}

	dispose() {
		super.dispose();
	}

}

export default Homepage;
