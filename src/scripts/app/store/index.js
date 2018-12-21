import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from 'reducers';
import {createLogger} from 'redux-logger';
import {responsiveStoreEnhancer} from 'redux-responsive';

const USE_DEV_TOOLS =
	process.env.DEV &&
	process.env.IS_BROWSER &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const logger = createLogger({
	collapsed: true,
	colors: {
		title: () => '#FF0000',
		prevState: () => '#9E9E9E',
		action: () => '#03A9F4',
		nextState: () => '#4CAF50',
		error: () => '#F20404',
	},
});

const middlewares = [];

if (USE_DEV_TOOLS) {
	middlewares.push(logger);
}

const composeEnhancers = USE_DEV_TOOLS ?
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
	compose;

const store = createStore(rootReducer, {}, composeEnhancers(
	responsiveStoreEnhancer,
	applyMiddleware(...middlewares)
));

export default store;
