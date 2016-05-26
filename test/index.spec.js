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

  afterEach(() => {
    restoreSpies();
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
      middleware()(next)(actionWithWorker);
    }).toThrow('worker.postMessage is not a function');
  });

  it('the worker must be invoked if the action needs it', (done) => {
    const spyWorkerBehavior = createSpy();

    const next = () => {
      expect(spyWorkerBehavior).toHaveBeenCalled();
      done();
    };

    const middleware = createWorkerMiddleware(new window.Worker(spyWorkerBehavior));
    middleware()(next)(actionWithWorker);
  });

  it('the worker shouldn\'t be invoked if the action doesn\'t need it', (done) => {
    const spyWorkerBehavior = createSpy();

    const next = () => {
      expect(spyWorkerBehavior).toNotHaveBeenCalled();
      done();
    };

    const middleware = createWorkerMiddleware(new window.Worker(spyWorkerBehavior));
    middleware()(next)(actionWithoutWorker);
  });

  it('when the action needs a worker, it should eventually pass an action to ' +
     '`dispatch` or the next middleware after the worker finishes processing', (done) => {
    const makeNext = (oldAction) => (newAction) => {
      expect(newAction).toBe(oldAction);
      done();
    };

    const next = makeNext(actionWithWorker);

    const middleware = createWorkerMiddleware(new window.Worker());
    middleware()(next)(actionWithWorker);
  });

  it('when the action doesn\'t need a worker, it should directly pass an action to ' +
     '`dispatch` or the next middleware without modifying it', (done) => {
    const makeNext = (oldAction) => (newAction) => {
      expect(newAction).toBe(oldAction);
      done();
    };

    const next = makeNext(actionWithoutWorker);

    const middleware = createWorkerMiddleware(new window.Worker());
    middleware()(next)(actionWithoutWorker);
  });

  it('should return a correct result if the action needs a worker', (done) => {
    const workerBehavior = (action) => ({
      ...action,
      payload: {
        ...action.payload,
        data: 256,
        category: 'colors',
      },
    });

    const makeNext = (oldAction) => (newAction) => {
      expect(newAction).toEqual(workerBehavior(oldAction));
      done();
    };

    const next = makeNext(actionWithWorker);

    const middleware = createWorkerMiddleware(new window.Worker(workerBehavior));
    middleware()(next)(actionWithWorker);
  });
});
