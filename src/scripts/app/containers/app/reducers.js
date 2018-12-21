import {
	SET_ROUTES,
	SET_PAGE,
	SET_OLDPAGE,
	NAVIGATION,
	SET_ANIMATING,
	SET_META,
	SET_DEVICE_TYPE,
} from './constants';

import {
	DEFAULT_META_TITLE,
	DEFAULT_META_DESCRIPTION,
} from '../../constants/metas';

const InitialState = {
	routes: [],
	params: null,
	location: null,
	isAnimating: false,
	page: null,
	oldPage: null,
	meta: {},
	deviceType: null,
};

// Updates an entity cache in response to any action with response.entities.
export const app = (state = InitialState, action) => {
	switch (action.type) {
	case SET_META: {

		let meta = action.meta !== null ? action.meta: {};
		// if no meta from data we used default one
		if ( action.meta === null){
			meta.title = DEFAULT_META_TITLE;
			meta.description = DEFAULT_META_DESCRIPTION;
		}

		return {
			...state,
			meta: meta,
		};
	}

	case SET_ROUTES: {
		return {
			...state,
			routes: action.routes,
		};
	}
	case NAVIGATION: {
		return {
			...state,
			params: action.params,
			location: action.location,
		};
	}
	case SET_ANIMATING: {
		return {
			...state,
			isAnimating: action.isAnimating,
		};
	}
	case SET_PAGE: {
		return {
			...state,
			page: action.page,
		};
	}
	case SET_OLDPAGE: {
		return {
			...state,
			oldPage: action.oldPage,
		};
	}
	case SET_DEVICE_TYPE: {
		return {
			...state,
			deviceType: action.deviceType,
		};
	}
	default: {
		return state;
	}
	}
};

export default app;
