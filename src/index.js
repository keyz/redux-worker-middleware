const noopWithWarning = () => {
  console.error( // eslint-disable-line no-console
    'Fatal: worker middleware received no `next` action. Check your chain of middlewares.'
  );
};

const createWorkerMiddleware = (worker) => {
  /*
    for now, we don't really care if you actually pass it a Worker instance; as long as
    it look likes a Worker and works like a Worker (has a `postMessage` method), it _is_ a Worker.

    The reason behind is that we want to support WebWorker shims in an easy manner,
    although it doesn't make a lot of sense.

    (One may argue that using IE <= 9 makes negative sense. I agree with that.)
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
    we need to grab the `next` function at runtime.
    this is a hacky solution but it totally works. is there a better way?
  */
  const nextPool = { next: noopWithWarning };

  worker.onmessage = ({ data: action }) => { // eslint-disable-line no-param-reassign
    nextPool.next(action);
  };

  /*
    the first argument is ({ dispatch, getState }) by default,
    but we don't actually need them for now.
  */
  return () => (next) => (action) => {
    if (next && nextPool.next === noopWithWarning) {
      nextPool.next = next;
    }

    if (action.WebWorker) {
      worker.postMessage(action);
    } else {
      return next(action);
    }
  };
};

export default createWorkerMiddleware;
