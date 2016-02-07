import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as reducers from '../reducers';
import {
  logger,
  thunk,
  worker,
} from '../middlewares';

const rootReducer = combineReducers(reducers);

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  worker,
  logger,
)(createStore);

const configureStore = (initialState) => {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
