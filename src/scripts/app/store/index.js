import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from 'reducers';
import { createLogger } from 'redux-logger';
import { responsiveStoreEnhancer } from 'redux-responsive';

const IS_LOCALHOST = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const USE_DEV_TOOLS = IS_LOCALHOST && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const logger = createLogger({
	collapsed: true,
	duration: false,
	colors: {
		title: () => '#84d26b',
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

const composeEnhancers = USE_DEV_TOOLS ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(rootReducer, {}, composeEnhancers(responsiveStoreEnhancer, applyMiddleware(...middlewares)));

export default store;
