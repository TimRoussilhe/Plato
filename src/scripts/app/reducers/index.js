import { combineReducers } from 'store/store';

import app from 'containers/app/reducers';
import layout from 'containers/layout/reducers';

const rootReducer = combineReducers({
	app,
	layout,
});

export default rootReducer;
