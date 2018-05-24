import * as helpers from '../common/helpers';

import './Card.scss';

export default class Card {
  constructor(text, order, options) {
    this.text = text;
    this.order = order;
    this.options = options || {
      dragStartClass: 'drag__start',
      dragEndClass: 'drag__end'
    };
    this.element = this.render();
    return this;
  }

  render() {
    return helpers.createElement('div', {
      'class': ['card'],
      'draggable': 'true',
      'onDragStart': helpers.debounce(this.onDragStart, 500),
      'onDragEnd': helpers.debounce(this.onDragEnd, 500)
    }, `Card ${this.text}`);
  }

  onDragStart = (event) => {
    var classNames = this.element.getAttribute('class');
    if (!helpers.hasClass(this.element, this.options.dragStartClass)) {
      this.element.setAttribute('class', classNames + ' ' + this.options.dragStartClass);
      setTimeout(() => (this.element.setAttribute('class',  classNames + ' ' + 'invisible')), 0);
    }
  }

  onDragEnd = (event) => {

  }
}
