import AbstractPageContainer from 'abstract/Pagecontainer';
import Homepage from 'components/homepage/Homepage';

// actions
// import {setIntroListHomepage} from './actions';

class HomepageContainer extends AbstractPageContainer {
	constructor(props) {
		super(props);

		this.ComponentClass = Homepage;
	}

	initData() {
		// const list = {
		// 	default_landing: false,
		// };

		// this.data.cities.forEach((key, value) => {
		// 	list[key.id] = false;
		// });

		// this.dispatch(setIntroListHomepage(list));

		super.initData();
	}
}

export default HomepageContainer;
