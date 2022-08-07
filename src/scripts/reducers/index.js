import { combineReducers } from 'store/store';

import app from 'app/reducers';
import layout from 'layout/reducers';

const rootReducer = combineReducers({
	app,
	layout,
});

export default rootReducer;
