import AbstractPageComponent from 'abstract/pageComponent';
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
