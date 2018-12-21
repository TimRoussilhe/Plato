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

	constructor(options) {
		super(options);

	}

	// to override if needed
	fetchData() {

		const endPoint = this.options.endPoint;

		if (!endPoint) {
			this.promises.data.resolve();
			return;
		}

		const url = JSON_ENDPOINTS + this.options.endPoint;
		// axios.get(url)
		// 	.then((response) => {
		// 		console.log('response', response);
		// 		this.data = response.data;
		// 		this.promises.data.resolve();
		// 	})
		// 	.catch((error) => {
		// 		this.promises.data.reject();
		// 	});

		fetch(url)
			.then((response) => {
				console.log('response', response);
				this.data = response.data;
				this.promises.data.resolve();
			})
			.catch((error) => {
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
