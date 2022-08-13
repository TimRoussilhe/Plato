import { createStore } from './store.js';
import rootReducer from 'reducers';

const IS_LOCALHOST = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const USE_DEV_TOOLS = IS_LOCALHOST;
const store = createStore(rootReducer, {}, USE_DEV_TOOLS);

export default store;
