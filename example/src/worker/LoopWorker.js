import { calcValue } from '../actions';
import { WORKER_LOOP } from '../constants';

const returnMsg = self.postMessage;

self.onmessage = ({ data: action }) => {
  const { loopCount } = action.payload;
  returnMsg(calcValue(loopCount, WORKER_LOOP));
};
