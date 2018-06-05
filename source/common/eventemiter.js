export default class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, fn) {
    this.listeners.has(name) || this.listeners.set(name, new Array());
    this.listeners.get(name).push(fn);
  }

  remove(name, fn) {
    let listeners = this.listeners.get(name);
    let index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return (utils.isFunction(listener) && listener === fn) ? i = index : i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(name, listeners);
        return true;
      }
    }
    return false;
  }

  emit(name, ...args) {
    let listeners = this.listeners.get(name);

    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
        listener(...args);
      });
      return true;
    }
    return false;
  }
}
