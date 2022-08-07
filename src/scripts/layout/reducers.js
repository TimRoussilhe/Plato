import { SET_ORIENTATION, CALCULATE_RESPONSIVE_STATE, BREAKPOINTS } from './constants';

const InitialState = {
	orientation: null,
	window: {},
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
		case CALCULATE_RESPONSIVE_STATE: {
			const width = window.innerWidth;
			const height = window.innerHeight;
			let activeBreakpoint;
			for (const breakpoint in BREAKPOINTS) {
				if (Object.hasOwnProperty.call(BREAKPOINTS, breakpoint)) {
					const minWidth = BREAKPOINTS[breakpoint];
					if (width >= minWidth) activeBreakpoint = breakpoint;
				}
			}
			return {
				...state,
				window: {
					width,
					height,
					breakpoint: activeBreakpoint,
				},
			};
		}
		default: {
			return state;
		}
	}
};

export default layout;
