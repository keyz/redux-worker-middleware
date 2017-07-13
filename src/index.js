const plainSender = (worker, action, next) => {
  if (action.meta && action.meta.WebWorker) {
    worker.postMessage(action);
  }
  return next(action);
};

const stringSender = (worker, action, next) => {
  if (action.meta && action.meta.WebWorker) {
    worker.postMessage(JSON.stringify(action));
  }
  return next(action);
};

const plainReceiver = dispatch => ({ data: resultAction }) => {
  dispatch(resultAction);
};

const stringReceiver = dispatch => ({ data: string }) => {
  dispatch(JSON.parse(string));
};

const createWorkerMiddleware = (worker, {
  sendString = false,
  receiveString = false,
} = {}) => {
  /*
    for now, we don't really care if you actually pass it a Worker instance; as long as
    it look likes a Worker and works like a Worker (has a `postMessage` method), it _is_ a Worker.

    The reason behind is that we want to support WebWorker shims in an easy manner,
    although shimming it doesn't make a lot of sense.
  */

  if (!worker) {
    throw new Error(
      `\`createWorkerMiddleware\` expects a worker instance as the argument. Instead received: ${worker}`,
    );
  } else if (!worker.postMessage) {
    throw new Error(
      'The worker instance is expected to have a `postMessage` method.',
    );
  }

  const sender = sendString ? stringSender : plainSender;

  return ({ dispatch }) => {
    /*
      when the worker posts a message back, dispatch the action with its payload
      so that it will go through the entire middleware chain
    */
    // eslint-disable-next-line no-param-reassign
    worker.onmessage = receiveString ? stringReceiver(dispatch) : plainReceiver(dispatch);

    return (next) => {
      if (!next) {
        throw new Error(
          'Worker middleware received no `next` action. Check your chain of middlewares.',
        );
      }

      return action => sender(worker, action, next);
    };
  };
};

export default createWorkerMiddleware;
