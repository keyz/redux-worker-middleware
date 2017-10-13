import { Middleware } from "redux";

declare function createWorkerMiddleware(
  worker: Worker,
  workerName?: string
): Middleware;
export default createWorkerMiddleware;
