import { idFn } from '../utils';

export class Worker {
  constructor(fn = idFn) {
    this.fn = fn;
  }

  postMessage = (msg) => {
    if (this.onmessage) {
      setTimeout(() => {
        const data = this.fn(msg);
        this.onmessage({ data });
      }, 0);
    }
  };

  onmessage = undefined;
}

export const patchWorker = () => {
  global.window.Worker = global.window.Worker || Worker;
};

export const removeWorker = () => {
  global.window.Worker = undefined;
};
