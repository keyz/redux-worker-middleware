import {
  WORKER_LOOP,
  NORMAL_LOOP,
  ASYNC_LOOP,
} from '../constants';

const initialState = 0;

const numReducer = (state = initialState, action) => {
  switch (action.type) {
    case WORKER_LOOP: { // we want block scope here
      return action.payload.num;
    }
    case NORMAL_LOOP: {
      return action.payload.num;
    }
    case ASYNC_LOOP: {
      return action.payload.num;
    }
    default: {
      return state;
    }
  }
};

export { numReducer as num };
