import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/homepage.twig';

// Constants

// Utils

// Selectors

// Actions

// Lib

class Homepage extends AbstractPageComponent {
	constructor(props) {
		super(props);
		this.template = Tpl;
	}

	dispose() {
		super.dispose();
	}

}

export default Homepage;
