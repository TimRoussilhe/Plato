import {
	SET_ROUTES,
	NAVIGATION,
	SET_ANIMATING,
	SET_META,
	SET_PAGE,
	SET_OLDPAGE,
	SET_DEVICE_TYPE,
} from './constants';

export function navigate(location, params = {}) {
	return {
		type: NAVIGATION,
		location: location,
		params: params,
	};
}

export function setMeta(meta = null, isDefault = false) {
	return {
		type: SET_META,
		meta: meta,
		isDefault: isDefault,
	};
}

export function setRoutes(routes) {
	return {
		type: SET_ROUTES,
		routes: routes,
	};
}

export function setAnimating(animatingState) {
	return {
		type: SET_ANIMATING,
		isAnimating: animatingState,
	};
}

export function setPage(page) {
	return {
		type: SET_PAGE,
		page: page,
	};
}

export function setOldPage(page) {
	return {
		type: SET_OLDPAGE,
		page: page,
	};
}

export function setDeviceType(deviceType) {
	return {
		type: SET_DEVICE_TYPE,
		deviceType: deviceType,
	};
}
