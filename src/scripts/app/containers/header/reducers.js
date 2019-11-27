import { SHOW_HEADER, HIDE_HEADER } from './constants';

const InitialState = {
	isShown: true,
};

const initialState = new InitialState();

// Updates an entity cache in response to any action with response.entities.
export const header = (state = initialState, action) => {
	switch (action.type) {
		case SHOW_HEADER: {
			return {
				...state,
				isShown: true,
			};
		}
		case HIDE_HEADER: {
			return {
				...state,
				isShown: false,
			};
		}
		default: {
			return state;
		}
	}
};

export default header;
