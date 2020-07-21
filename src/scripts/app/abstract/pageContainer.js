import AbstractContainer from './container';
import store from 'store';

// Actions
import { setMeta } from 'containers/app/actions';

// Config
import { JSON_ENDPOINTS } from 'constants/config';

import { getRoute } from './../containers/app/selectors';
import Cache from './../containers/app/Cache';

/**
 * PageContainer: Defines a page container
 * @extends AbstractContainer
 * @constructor
 */
class PageContainer extends AbstractContainer {
	constructor(props) {
		super(props);
		this.type = props.type || 'default';
	}

	// to override if needed
	fetchData() {
		const endPoint = this.props.endPoint;

		if (!endPoint) {
			this.promises.data.resolve();
			return;
		}

		const { oldPage, location } = store.getState().app;
		const currentRoute = getRoute(location);

		if (oldPage) {
			const url = JSON_ENDPOINTS + this.props.endPoint;

			const data = Cache.has(currentRoute.id) ? Cache.getData(currentRoute.id) : null;
			if (data) {
				if (Promise.resolve(data) == data) {
					data.then(data => {
						this.setData(Cache.getData(currentRoute.id));
					});
				} else {
					this.setData(data);
				}
			} else {
				fetch(url)
					.then(response => {
						return response.json();
					})
					.then(json => {
						this.setData(json);
						Cache.set(currentRoute.id, json);
					})
					.catch(ex => {
						this.promises.data.reject();
					});
			}
		} else {
			const { globalData } = store.getState().app;
			if (globalData && globalData.serverData) {
				this.setData(globalData.serverData);
				// Save server data in the Cache
				Cache.set(currentRoute.id, globalData.serverData);
			} else {
				// weird thing here since globalData.serverData will always be defined from the node side
				this.promises.data.reject();
			}
		}
	}

	setData(data) {
		this.data = data;
		this.promises.data.resolve();
	}

	loadAssets() {
		this.promises.data.resolve();
	}

	initData() {
		if (this.data.meta) {
			store.dispatch(setMeta(this.data.meta));
		}
		this.props.data = this.data;
	}

	onInit() {
		super.onInit();
	}
}

export default PageContainer;
