import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/about.twig';


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
