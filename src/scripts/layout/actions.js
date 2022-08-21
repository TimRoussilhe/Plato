import { SET_ORIENTATION, CALCULATE_RESPONSIVE_STATE } from './constants.js';

export function setOrientation(window) {
  return {
    type: SET_ORIENTATION,
    window,
  };
}

export function calculateResponsiveState(window) {
  return {
    type: CALCULATE_RESPONSIVE_STATE,
    window,
  };
}
