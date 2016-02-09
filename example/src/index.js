import React from 'react';
import { render } from 'react-dom';
import Main from './components/Main';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();

if (__DEV__) {
  window.store = store;
}

render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('root'),
);
