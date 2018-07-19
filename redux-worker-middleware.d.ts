import { Middleware } from "redux";

export interface IMiddlewareOptions {
  serialize: (action: any) => string;
  deserialize: (raw: string) => any;
}

declare function createWorkerMiddleware(
  worker: Worker,
  workerName?: string,
  options?: IMiddlewareOptions
): Middleware;
export default createWorkerMiddleware;
