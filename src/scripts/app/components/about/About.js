import AbstractPageComponent from 'abstract/Pagecomponent';
import Tpl from 'templates/about.art';

class About extends AbstractPageComponent {
	constructor(props) {
		super(props);

		this.template = Tpl;
	}

	dispose() {
		super.dispose();
	}
}

export default About;
