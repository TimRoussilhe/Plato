import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/about.twig';


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
