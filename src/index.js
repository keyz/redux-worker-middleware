const createWorkerMiddleware = (worker) => {
  /*
    for now, we don't really care if you actually pass it a Worker instance; as long as
    it look likes a Worker and works like a Worker (has a `postMessage` method), it _is_ a Worker.

    The reason behind is that we want to support WebWorker shims in an easy manner,
    although shimming it doesn't make a lot of sense.
  */

  if (!worker) {
    console.error( // eslint-disable-line no-console
      'Fatal: `worker` is falsy.'
    );
  } else if (!worker.postMessage) {
    console.error( // eslint-disable-line no-console
      'Fatal: `worker` doesn\'t have a `postMessage` method.'
    );
  }

  /*
    the first argument is ({ dispatch, getState }) by default,
    but we don't actually need them for now.
  */
  return () => (next) => {
    if (!next) {
      console.error( // eslint-disable-line no-console
        'Fatal: worker middleware received no `next` action. Check your chain of middlewares.'
      );
    }

    worker.onmessage = ({ data: action }) => { // eslint-disable-line no-param-reassign
      next(action);
    };

    return (action) => {
      if (action.meta && action.meta.WebWorker) {
        worker.postMessage(action);
      } else {
        return next(action);
      }
    };
  };
};

export default createWorkerMiddleware;
