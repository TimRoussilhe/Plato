import AbstractPageContainer from 'abstract/pageContainer';
import About from 'components/about/About';

class AboutContainer extends AbstractPageContainer {
	constructor(props) {
		super(props);

		this.ComponentClass = About;
	}

	initData() {
		super.initData();
	}
}

export default AboutContainer;
