import Page from 'abstract/page';
import Template from 'templates/about.art';

class AboutContainer extends Page {
	constructor(props) {
		super(props);

		this.template = Template;
	}
}

export default AboutContainer;
