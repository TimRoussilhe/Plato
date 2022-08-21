/**
 * Gets the value at `path` of `object`.
 * @param {Object} object
 * @param {string|Array} path
 * @returns {*} value if exists else undefined
 */
const get = (object, path) => {
  if (typeof path === 'string') path = path.split('.').filter((key) => key.length);
  return path.reduce((dive, key) => dive && dive[key], object);
};

export const storeWatcher = (getState, path) => {
  let previousState;

  return (method) => {
    return () => {
      const state = get(getState(), path);
      if (state !== null && state !== undefined && state !== previousState) {
        method(state, previousState);
      }
      previousState = state;
    };
  };
};
