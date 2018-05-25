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
      }, 500),
      'onDrop': helpers.debounce(function (event) {
        self.onDrop(event)
      }, 500)
    }, this.text, helpers.createElement('div', {
      'class': ['close'],
      'onClick': helpers.debounce(function (event) {
        self.onDelete(event);
      }, 500)
    }, 'X'));
  }

  onDragStart(event) {
    helpers.addClass(this.element, this.options.dragStartClass);
    this.parent.emit('dragStart', this);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.element.innerHTML);
  }

  onDragEnd(event) {
    helpers.removeClass(this.element, this.options.dragStartClass);
  }

  onDrop(event) {
    var self = this;
    this.parent.emit('onDropCardOrder', self.order);
  }

  onDelete(event) {
    event.preventDefault();
    var self = this;
    this.parent.emit('onDeleteCard', self);
  }
}
