import EventEmitter from './eventemitter';

export default class Observer extends EventEmitter {
  constructor() {
    super();
    this.on('change', (data) => this.onChange(data));
  }

  onChange(data) {
    console.log('Change');
  }
}
