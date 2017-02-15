/*
  Worker is polyfilled by the implementation at `./__setup__/workerPolyfill`.
*/

import expect, { createSpy, spyOn, restoreSpies } from 'expect';

import createWorkerMiddleware from '../src';

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

  const dispatch = createSpy();

  afterEach(() => {
    restoreSpies();
    dispatch.reset();
  });

  it('should yell if `worker` is falsy', () => {
    const consoleErrSpy = spyOn(console, 'error');

    createWorkerMiddleware();

    expect(consoleErrSpy).toHaveBeenCalledWith(
      'Fatal: `worker` is falsy.'
    );
  });

  it('should yell if `worker.postMessage` is falsy', () => {
    const consoleErrSpy = spyOn(console, 'error');

    const next = () => {
      expect(consoleErrSpy).toHaveBeenCalledWith(
        'Fatal: `worker` doesn\'t have a `postMessage` method.'
      );
    };

    const middleware = createWorkerMiddleware({});
    expect(() => {
      middleware({ dispatch })(next)(actionWithWorker);
    }).toThrow('worker.postMessage is not a function');
  });

  it('the worker must be invoked if the action needs it', (done) => {
    const spyWorkerBehavior = createSpy();
    const spyWorker = new window.Worker(spyWorkerBehavior);
    // const postMessageSpy = spyOn(spyWorker, 'postMessage');

    const makeNext = (action) => (newAction) => {
      // expect(postMessageSpy).toHaveBeenCalledWith(actionWithWorker);
      expect(newAction).toEqual(action);
      setTimeout(() => {
        expect(spyWorkerBehavior).toHaveBeenCalled();
        done();
      }, 10);
    };

    const next = makeNext(actionWithWorker);

    const middleware = createWorkerMiddleware(spyWorker);
    middleware({ dispatch })(next)(actionWithWorker);
  });

  it('the worker shouldn\'t be invoked if the action doesn\'t need it', (done) => {
    const spyWorkerBehavior = createSpy();

    const next = () => {
      expect(spyWorkerBehavior).toNotHaveBeenCalled();
      done();
    };

    const middleware = createWorkerMiddleware(new window.Worker(spyWorkerBehavior));
    middleware({ dispatch })(next)(actionWithoutWorker);
  });

  it('when the action needs a worker, it should pass along the action with ' +
    '`next` so that the next middleware in the chain sees it', (done) => {
    const makeNext = (action) => (newAction) => {
      expect(newAction).toBe(action);
      setTimeout(() => {
        expect(dispatch).toHaveBeenCalledWith(3);
        done();
      }, 10);
    };

    const next = makeNext(actionWithWorker);

    const middleware = createWorkerMiddleware(new window.Worker());
    middleware({ dispatch })(next)(actionWithWorker);
  });

  it('when the action doesn\'t need a worker, it should also pass along the action with ' +
    '`next` so that the next middleware in the chain sees it', (done) => {
    const makeNext = (action) => (newAction) => {
      expect(newAction).toBe(action);
      done();
    };

    const next = makeNext(actionWithoutWorker);

    const middleware = createWorkerMiddleware(new window.Worker());
    middleware({ dispatch })(next)(actionWithoutWorker);
    expect(dispatch).toNotHaveBeenCalled();
  });

  it('when the action needs a worker, it should still pass along the action with ' +
    '`next`, and it should dipsatch the action returned from the worker', (done) => {
    const workerBehavior = (action) => ({
      ...action,
      payload: {
        ...action.payload,
        data: 256,
        category: 'colors',
      },
    });

    const spyDispatch = (action) => (dispatchedAction) => {
      expect(dispatchedAction).toEqual(workerBehavior(action));
    };

    const makeNext = (action) => (newAction) => {
      expect(newAction).toEqual(action);
      setTimeout(() => { done(); }, 10);
    };

    const next = makeNext(actionWithWorker);

    const middleware = createWorkerMiddleware(new window.Worker(workerBehavior));
    middleware({ dispatch: spyDispatch })(next)(actionWithWorker);
  });
});
