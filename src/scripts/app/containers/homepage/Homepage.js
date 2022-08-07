import AbstractPageContainer from 'abstract/pageContainer';
import Homepage from 'components/homepage/Homepage';

class HomepageContainer extends AbstractPageContainer {
	constructor(props) {
		super(props);
		this.storeEvents = {
			'layout.window': (window) => this.onResize(window),
		};
		this.ComponentClass = Homepage;
	}

	initData() {
		super.initData();
	}

	onResize(window) {
		console.log('window', window);
	}
}

export default HomepageContainer;
