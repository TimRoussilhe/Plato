import { combineReducers } from 'redux';
import { createResponsiveStateReducer } from 'redux-responsive';

import app from 'containers/app/reducers';
import layout from 'containers/layout/reducers';

const rootReducer = combineReducers({
	app,
	layout,
	browser: createResponsiveStateReducer(
		{
			mobile: 640,
			tablet: 768,
			tabletH: 1024,
			desktop: 1280,
			desktopM: 1440,
			desktopL: 1680,
			desktopXL: 1920,
		},
		{
			extraFields: () => ({
				width: window.innerWidth,
				height: window.innerHeight,
			}),
		}
	),
});

export default rootReducer;
