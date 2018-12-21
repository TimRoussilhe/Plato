import AbstractPageContainer from 'abstract/Pagecontainer';
import About from 'components/about/About';

class AboutContainer extends AbstractPageContainer {

	constructor(options) {
		super(options);

		this.ComponentClass = About;

	}

	initData() {

		super.initData();
	}

}

export default AboutContainer;
