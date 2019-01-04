import AbstractContainer from './container';
import store from 'store';
// import axios from 'axios';

// Constants
// import {END_POINT} from 'constants/api';
// import {BAR_LOADER} from 'containers/loader/constants';

// Utils
// import {loadJSON} from 'utils/load';

// Actions
import {setMeta} from 'containers/app/actions';

// Config
import {JSON_ENDPOINTS} from 'constants/config';

/**
 * PageContainer: Defines a page container
 * @extends AbstractContainer
 * @constructor
 */
class PageContainer extends AbstractContainer {

	constructor(props) {
		super(props);

	}

	// to override if needed
	fetchData() {

		const endPoint = this.props.endPoint;

		if (!endPoint) {
			this.promises.data.resolve();
			return;
		}

		const url = JSON_ENDPOINTS + this.props.endPoint;

		fetch(url).then((response) => {
			return response.json();
		}).then((json) => {
			this.data = json;
			this.promises.data.resolve();
		}).catch((ex) => {
			this.promises.data.reject();
		});

	}

	loadAssets() {
		this.promises.data.resolve();
	}

	initData() {
		// store.dispatch(setMeta(this.data.meta));
	}

	onInit() {
		super.onInit();
	}

}

export default PageContainer;
