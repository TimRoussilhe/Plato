import Page from 'abstract/page.js';
import Template from 'templates/about.art';

class AboutContainer extends Page {
	constructor(props) {
		super(props);

		this.template = Template;
	}
}

export default AboutContainer;
