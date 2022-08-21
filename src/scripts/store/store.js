const combineReducers = (reducers) => {
  const nextState = {};
  const reducerFunctions = {};
  const reducersKeys = Object.keys(reducers);
  reducersKeys.forEach((reducerKey) => {
    if (typeof reducers[reducerKey] === 'function') {
      reducerFunctions[reducerKey] = reducers[reducerKey];
    }
  });
  const reducerFunctionsKeys = Object.keys(reducerFunctions);

  return (state = {}, action) => {
    reducerFunctionsKeys.forEach((reducerKey) => {
      const reducer = reducerFunctions[reducerKey];
      nextState[reducerKey] = reducer(state[reducerKey], action);
    });

    return nextState;
  };
};

const validateAction = (action) => {
  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new Error('Action must be an object!');
  }
  if (typeof action.type === 'undefined') {
    throw new Error('Action must have a type!');
  }
};

const Logger = (previousState, state, action) => {
  console.groupCollapsed(`%c 🍳 action %c${action.type}`, 'color: #00b8d0', 'color: #ffa693');
  console.groupCollapsed('%c 👴 previousState', 'color: #00d061', previousState);
  console.groupEnd();
  console.groupCollapsed('%c 🎬 action', 'color: #00d061', action);
  console.groupEnd();
  console.groupCollapsed('%c 🔮 state', 'color: #00d061', state);
  console.groupEnd();
  console.groupEnd();
};

const createStore = (reducer, initialState, USE_DEV_TOOLS) => {
  const store = {};

  store.state = initialState;
  store.listeners = [];

  store.subscribe = (listener) => {
    store.listeners.push(listener);
    return () => {
      store.listeners = store.listeners.filter((l) => l !== listener);
    };
  };

  store.dispatch = (action) => {
    validateAction(action);
    const previousState = USE_DEV_TOOLS && window.structuredClone ? structuredClone(store.state) : {};

    store.state = reducer(store.state, action);
    USE_DEV_TOOLS && Logger(previousState, store.state, action);

    store.listeners.forEach((listener) => {
      listener(action);
    });
  };

  store.getState = () => store.state;
  store.dispatch({ type: 'INIT' });

  return store;
};

export { createStore, combineReducers };
