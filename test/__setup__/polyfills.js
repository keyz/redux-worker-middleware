require('babel-polyfill');
require('./domEnv').patchDOMEnv();
require('./workerPolyfill').patchWorker();
