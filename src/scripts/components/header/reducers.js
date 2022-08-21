import { SHOW_HEADER, HIDE_HEADER } from './constants.js';

const InitialState = {
  isShown: true,
};

// Updates an entity cache in response to any action with response.entities.
export const header = (state = InitialState, action) => {
  switch (action.type) {
    case SHOW_HEADER: {
      return {
        ...state,
        isShown: true,
      };
    }
    case HIDE_HEADER: {
      return {
        ...state,
        isShown: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default header;
