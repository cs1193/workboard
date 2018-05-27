export default class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(name, fn) {
    if (!this.listeners[name])
      this.listeners[name] = [];
    this.listeners[name].push(fn);
  }

  emit(name) {
    let args = Array.prototype.slice.call(arguments);
    let listeners = this.listeners[name];

    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].apply(this, args);
      }
      return true;
    }
    return false;
  }
}
