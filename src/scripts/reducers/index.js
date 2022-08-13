import { combineReducers } from 'store/store.js';

import app from 'app/reducers.js';
import layout from 'layout/reducers.js';

const rootReducer = combineReducers({
	app,
	layout,
});

export default rootReducer;
