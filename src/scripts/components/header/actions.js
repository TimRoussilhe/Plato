import { SHOW_HEADER, HIDE_HEADER } from './constants.js';

export function showHeader() {
	return {
		type: SHOW_HEADER,
	};
}

export function hideHeader() {
	return {
		type: HIDE_HEADER,
	};
}
