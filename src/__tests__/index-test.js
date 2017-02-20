/* eslint-disable no-console */
import createWorkerMiddleware from '..';

class Worker {
  constructor(fn = x => x) {
    this.fn = fn;

    this.postMessage = this.postMessage.bind(this);
    this.onmessage = undefined;
  }

  postMessage(msg) {
    if (this.onmessage) {
      setTimeout(() => {
        const data = this.fn(msg);
        this.onmessage({ data });
      }, 0);
    }
  }
}

describe('createWorkerMiddleware', () => {
  const actionWithWorker = {
    type: 'I_USE_WORKER',
    meta: {
      WebWorker: true,
    },
    payload: {
      data: 42,
      category: 'life',
    },
  };

  const actionWithoutWorker = {
    type: 'I_DONT_USE_WORKER',
    payload: {
      data: 23,
      category: 'number',
    },
  };

  const dispatch = jest.fn(x => x);

  beforeEach(() => {
    dispatch.mockClear();
  });

  it('should yell if `worker` is falsy', () => {
    spyOn(console, 'error');

    createWorkerMiddleware();

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Fatal: `worker` is falsy.',
    );
  });

  it('should yell if `worker.postMessage` is falsy', () => {
    spyOn(console, 'error');

    createWorkerMiddleware({});

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Fatal: `worker` doesn\'t have a `postMessage` method.',
    );
  });

  it('the worker must be invoked if the action needs it', (done) => {
    const mockWorkerBehavior = jest.fn();
    const middleware = createWorkerMiddleware(new Worker(mockWorkerBehavior));

    const next = (action) => {
      expect(action).toBe(actionWithWorker);
      setTimeout(() => {
        expect(mockWorkerBehavior).toHaveBeenCalledTimes(1);
        expect(mockWorkerBehavior).toHaveBeenCalledWith(actionWithWorker);
        done();
      }, 10);
    };

    middleware({ dispatch })(next)(actionWithWorker);
  });

  it('the worker shouldn\'t be invoked if the action doesn\'t need it', (done) => {
    const mockWorkerBehavior = jest.fn();
    const middleware = createWorkerMiddleware(new Worker(mockWorkerBehavior));

    const next = (action) => {
      expect(action).toBe(actionWithoutWorker);
      setTimeout(() => {
        expect(mockWorkerBehavior).toHaveBeenCalledTimes(0);
        done();
      }, 10);
    };

    middleware({ dispatch })(next)(actionWithoutWorker);
  });

  it('when the action needs a worker, it should pass along the action with ' +
     '`next` so that the next middleware in the chain sees it', (done) => {
    const middleware = createWorkerMiddleware(new Worker());

    const next = (action) => {
      expect(action).toBe(actionWithWorker);
      setTimeout(() => {
        expect(dispatch).toHaveBeenCalledWith(actionWithWorker);
        done();
      }, 10);
    };

    middleware({ dispatch })(next)(actionWithWorker);
  });

  it('when the action doesn\'t need a worker, it should also pass along the action with ' +
     '`next` so that the next middleware in the chain sees it', (done) => {
    const middleware = createWorkerMiddleware(new Worker());

    const next = (action) => {
      expect(action).toBe(actionWithoutWorker);
      setTimeout(() => {
        expect(dispatch).toHaveBeenCalledTimes(0);
        done();
      }, 10);
    };

    middleware({ dispatch })(next)(actionWithoutWorker);
  });

  it('when the action needs a worker, it should still pass along the action with ' +
     '`next`, and it should dispatch the action returned from the worker', (done) => {
    const actionFromWorker = {
      type: 'WORKER_RETURN',
      payload: {
        data: 100,
      },
    };

    const mockWorkerBehavior = jest.fn(() => actionFromWorker);
    const middleware = createWorkerMiddleware(new Worker(mockWorkerBehavior));

    const next = (action) => {
      expect(action).toBe(actionWithWorker);
      setTimeout(() => {
        expect(mockWorkerBehavior).toHaveBeenCalledTimes(1);
        expect(mockWorkerBehavior).toHaveBeenCalledWith(actionWithWorker);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(actionFromWorker);
        done();
      }, 10);
    };

    middleware({ dispatch })(next)(actionWithWorker);
  });
});
