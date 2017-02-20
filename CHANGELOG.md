## 1.0.0 (February 19, 2017)

* Bugfix: pass along all actions to next middleware in chain. ([@jebeck](https://github.com/jebeck) in [#5](https://github.com/keyanzhang/redux-worker-middleware/pull/5))
  * It's now important to let the worker return messages that have the `meta.WebWorker` field removed. Since the returned data will be re-dispatched as a new action and be passed through all the middlewares, keeping the `meta.WebWorker` field may cause an infinite loop.
* Changed from `console.error` to (throw) real errors for incorrect configs ([#6](https://github.com/keyanzhang/redux-worker-middleware/pull/6))
* Let the middleware grab `dispatch` earlier ([#6](https://github.com/keyanzhang/redux-worker-middleware/pull/6))
