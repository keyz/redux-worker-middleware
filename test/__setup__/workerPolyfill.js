export class Worker {
  constructor(fn = () => (3)) {
    this.fn = fn;
  }

  postMessage = (msg) => {
    setTimeout(() => {
      const data = this.fn(msg);
      this.onmessage({ data });
    }, 5);
  };

  onmessage = undefined;
}

export const patchWorker = () => {
  global.window.Worker = global.window.Worker || Worker;
};

export const removeWorker = () => {
  global.window.Worker = undefined;
};
