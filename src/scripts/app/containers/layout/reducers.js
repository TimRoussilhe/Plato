import {
	SET_ORIENTATION,
} from './constants';

const InitialState = {
	orientation: null,
};

// Updates an entity cache in response to any action with response.entities.
export const layout = (state = InitialState, action) => {
	switch (action.type) {

	case SET_ORIENTATION: {
		const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
		return {
			...state,
			orientation: orientation,
		};
	}
	default: {
		return state;
	}
	}
};

export default layout;
