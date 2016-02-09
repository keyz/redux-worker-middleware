import createLogger from 'redux-logger';

const logger = createLogger({
  predicate: () => __DEV__,
});

export default logger;
