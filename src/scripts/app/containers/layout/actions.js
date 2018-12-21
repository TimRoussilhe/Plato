import {
	SET_ORIENTATION,

} from './constants';

export function setOrientation(window) {
	return {
		type: SET_ORIENTATION,
		window: window,
	};
}
