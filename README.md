# Redux Worker Middleware
[![build status](https://img.shields.io/travis/keyanzhang/redux-worker-middleware/master.svg?style=flat-square)](https://travis-ci.org/keyanzhang/redux-worker-middleware)
[![test coverage](https://img.shields.io/coveralls/keyanzhang/redux-worker-middleware/master.svg?style=flat-square)](https://coveralls.io/github/keyanzhang/redux-worker-middleware?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-worker-middleware.svg?style=flat-square)](https://www.npmjs.com/package/redux-worker-middleware)

Redux + Web Workers = :boom: :construction_worker:

```
npm install --save redux-worker-middleware
```

## Intro

The goal of the middleware is to provide an unopinionated workflow that delegates expensive operations to Web Workers. Thus, please notice that this middleware **doesn't** wrap, transform, or shim Web Workers.

In case you need, webpack's [worker-loader](https://github.com/webpack/worker-loader) is an out of box solution for that.

## ~~API~~ How it works
`redux-worker-middleware` exports a single (default) function `createWorkerMiddleware`. Here are the steps to set it up:

1. Pass it a Web Worker instance and put the returned (curried) function in the middleware chain.
    - Notice that your worker should have the signature of `Action -> Action`; that is, it always takes a complete action and returns a complete action, which can be dispatched right away. It makes the API much simpler.
    - Need to partially update the payload? Sure, just let your worker handle the logic! It has to work anyway.

2. To let the workers work, make sure that your action is [FSA compliant](https://github.com/acdlite/flux-standard-action) and the `action.meta.WebWorker` field is truthy. Otherwise, the middleware will just pass the action along.

3. If an action specifies that it needs to be processed by a worker, The middleware will obey the order. Then when the data comes back, it will be re-dispatched as a new action and be passed through all the middlewares (see [#5](https://github.com/keyanzhang/redux-worker-middleware/pull/5)).

## Demo
I wrote this middleware as part of https://github.com/keyanzhang/repo.cat, where I need to parse a lot of markdown stuff to HTML at runtime. So the real demo can be found there: the Web Worker related parts live in [`actions/DataFetching.js`](https://github.com/keyanzhang/repo.cat/blob/master/src/actions/DataFetching.js), [`middlewares/worker.js`](https://github.com/keyanzhang/repo.cat/blob/master/src/middlewares/worker.js), and [`workers/GFMParserWorker.js`](https://github.com/keyanzhang/repo.cat/blob/master/src/workers/GFMParserWorker.js).

A minimal example can be found as below:

Web Worker: `Add1Worker.js`:
```javascript
self.onmessage = ({ data: action }) => { // `data` should be a FSA compliant action object.
  self.postMessage({
    type: action.type,
    // Notice that we remove the `meta.WebWorker` field from the payload.
    // Since the returned data will be dispatched as a new action and be passed through all the middlewares,
    // keeping the `meta.WebWorker` field may cause an infinite loop.
    payload: {
      num: action.payload.num + 1,
    },
  });
};
```

ActionCreator:
```javascript
export const add1Action = (n) => ({
  type: 'ADD_1',
  meta: {
    WebWorker: true, // This line specifies that the worker should show up and do the job
  },
  payload: {
    num: n,
  },
});
```

Then in your store configuration,
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createWorkerMiddleware from 'redux-worker-middleware';

import * as reducers from '../reducers';
import {
  logger,
  thunk,
} from '../middlewares';

const Add1Worker = require('worker!../workers/Add1Worker'); // webpack's worker-loader
const add1Worker = new Add1Worker;

const workerMiddleware = createWorkerMiddleware(add1Worker);

const rootReducer = combineReducers(reducers);

const createStoreWithMiddleware = applyMiddleware(
  workerMiddleware,
  thunk,
  logger,
)(createStore);

// ... ...
```

That's it! Now when you fire an `add1Action`, the worker will show up and do the computation. The result (action) will be re-dispatched as a new action and be passed through all the middlewares.

## Notes

For now, we don't really care if you actually pass it a real Worker instance; as long as it look likes a Worker and works like a Worker (i.e., has a `postMessage` method), it _is_ a Worker. The reason behind is that we want to support Web Worker shims in an easy manner.

## License
MIT
