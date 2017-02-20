import {
  WORKER_LOOP,
  NORMAL_LOOP,
  ASYNC_LOOP,
} from '../constants';

export const calcValue = (loopCount, type) => {
  let num = 0;
  for (let i = 0; i < loopCount; i++) {
    num++;
  }

  return {
    type,
    payload: {
      num,
    },
  };
};

export const normalCalcValue = (loopCount) => (dispatch) =>
  dispatch(calcValue(loopCount, NORMAL_LOOP));

export const asyncCalcValue = (loopCount) => (dispatch) => {
  setTimeout(() => {
    dispatch(calcValue(loopCount, ASYNC_LOOP));
  }, 0);
};

export const workerCalcValue = (loopCount) => (dispatch) => dispatch({
  type: WORKER_LOOP,
  meta: {
    WebWorker: true,
  },
  payload: {
    loopCount,
  },
});
