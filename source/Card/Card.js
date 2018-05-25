import * as helpers from '../common/helpers';

import './Card.scss';

export default class Card {
  constructor(parent, text, order, options) {
    this.id = helpers.guid('card');
    this.parent = parent;
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
    let self = this;
    return helpers.createElement('div', {
      'class': ['card'],
      'draggable': 'true',
      'onDragStart': helpers.debounce(function (event) {
        self.onDragStart(event);
      }, 500),
      'onDragEnd': helpers.debounce(function (event) {
        self.onDragEnd(event);
      }, 500)
    }, this.text);
  }

  onDragStart(event) {
    var classNames = this.element.getAttribute('class');
    if (!helpers.hasClass(this.element, this.options.dragStartClass)) {
      this.element.setAttribute('class', classNames + ' ' + this.options.dragStartClass);
    }
    this.parent.emit('dragStart', this);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.element.innerHTML);
  }

  onDragEnd(event) {
    let classNames = this.element.getAttribute('class');
    if (helpers.hasClass(this.element, this.options.dragStartClass)) {
      let expression = new RegExp(this.options.dragStartClass, 'gi');
      this.element.setAttribute('class', classNames.replace(expression, ''));
    }
  }
}
