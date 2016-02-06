# Redux Worker Middleware [![build status](https://img.shields.io/travis/keyanzhang/redux-worker-middleware/master.svg?style=flat-square)](https://travis-ci.org/keyanzhang/redux-worker-middleware)

Redux + Web Workers = :boom: :construction_worker:

```
npm install --save redux-worker-middleware
```

## Intro

The goal of the middleware is to provide an unopinionated workflow that delegates expensive operations to Web Workers. Thus, please notice that this middleware **doesn't** wrap, transform, or shim Web Workers. 

In case you need, Webpack's [worker-loader](https://github.com/webpack/worker-loader) is an out of box solution for that. 

## ~~API~~ How it works
`redux-worker-middleware` exports a single (default) function `createWorkerMiddleware`. Here are the steps to set it up:

1. Pass it a Web Worker instance and put the returned (curried) function in the middleware chain. 
    - Notice that your worker should have the signature of `Action -> Action`; that is, it always takes a complete action and returns a complete action, which can be dispatched right away. It makes the API much simpler. 
    - Need to partially update the payload? Sure, just let your worker handle the logic!

2. To let the workers work, make sure that your action is [FSA compliant](https://github.com/acdlite/flux-standard-action) and `action.meta.WebWorker` is truthy. Otherwise, the middleware will just pass the action along.

3. If an action specifies that it needs to be processed by a worker, The middleware will obey the order. Then when the data comes back, it will be passed along to the rest of the middleware chain.

## Demo
I wrote this middleware while developing https://github.com/keyanzhang/repo.cat, where I need to parse a lot of markdown stuff to HTML at runtime. So a real demo can be found there: the Web Worker related part lives in @TODO, @TODO, and @TODO.

A minimal example can be found as below:

`Add1Worker.js`:
```javascript
self.onmessage = ({ data: action }) => { // data should be a FSA compliant action object.
  self.postMessage({
    ...action,
    payload: {
      num: action.payload.num + 1,
    },
  });
};
```

@TODO

## Notes

For now, we don't really care if you actually pass it a real Worker instance; as long as it look likes a Worker and works like a Worker (i.e., has a `postMessage` method), it _is_ a Worker. 

The reason behind is that we want to support WebWorker shims in an easy manner, although it doesn't make a lot of sense. (One may argue that using IE <= 9 makes negative sense. I agree with that :wink:)

## License
MIT
