import createWorkerMiddleware from 'redux-worker-middleware';

const LoopWorker = require('worker!../worker/LoopWorker');
const loopWorker = new LoopWorker;

const workerMiddleware = createWorkerMiddleware(loopWorker);

export default workerMiddleware;
