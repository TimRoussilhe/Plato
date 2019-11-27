import AbstractPageComponent from 'abstract/pageComponent';
import Tpl from 'templates/homepage.art';

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

	onInit() {
		super.onInit();
	}

	dispose() {
		super.dispose();
	}
}

export default Homepage;
