import * as helpers from '../common/helpers';

import Card from '../Card/Card';

import './Column.scss';

export default class Column {
  constructor(name, order, options) {
    this.name = name;
    this.order = order;
    this.options = options || {
      dragEnterClass: 'drag__entered'
    };
    this.element = this.render();
    this.cards = [];
    this.totalCard = 0;
    return this;
  }

  render() {
    return helpers.createElement('div', {
      'class': ['column'],
      'onDragOver': helpers.debounce(this.onDragOver, 500),
      'onDragEnter': helpers.debounce(this.onDragEnter, 500),
      'onDragLeave': helpers.debounce(this.onDragLeave, 500),
      'onDrop': helpers.debounce(this.onDrop, 500)
    }, this.renderName(), this.renderCards(), this.renderAddNewCard());
  }

  renderName() {
    return helpers.createElement('div', {
      'class': ['column__card__name']
    }, this.name);
  }

  renderCards() {
    var cardHolderTemplate = helpers.createElement('div', {
      'class': ['column__card__holder']
    });

    for (var i = 0; i < 10; i++) {
      cardHolderTemplate.appendChild(new Card(i, i).element);
      this.totalCard++;
    }

    return cardHolderTemplate;
  }

  renderAddNewCard() {
    var self = this;
    return helpers.createElement('div', {
      'class': ['column__add__new__card']
    }, helpers.createElement('input', {
      'class': ['column__add__new__card__input'],
      'placeholder': 'Add New Card',
      'onKeyPress': helpers.debounce(function (event) {
        self.onAddCardInput(event, this.value);
      }, 500)
    }));
  }

  onDragOver = (event) => {
    event.preventDefault();
    console.log('Drag Over', this.name);
  }

  onDragEnter = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var classNames = this.element.getAttribute('class');
    if (!helpers.hasClass(this.element, this.options.dragEnterClass)) {
      this.element.setAttribute('class', classNames + ' ' + this.options.dragEnterClass);
    }
  }

  onDragLeave = (event) => {
    console.log('Drag Leave', this.name);
    event.stopPropagation();
    event.preventDefault();
    let boundingBox = this.element.getBoundingClientRect();
    let classNames = this.element.getAttribute('class');
    if (event.x > boundingBox.left + boundingBox.width || event.x < boundingBox.left || event.y > boundingBox.top + boundingBox.height || event.y < boundingBox.top) {
      if (helpers.hasClass(this.element, this.options.dragEnterClass)) {
        let expression = new RegExp(this.options.dragEnterClass, 'gi');
        this.element.setAttribute('class', classNames.replace(expression, ''));
      }
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    console.log('Drop', this.name);
  }

  onAddCardInput = (event, value) => {
    event.preventDefault();
    let self = this;

    if (event.keyCode === helpers.keyCode.ENTER_KEY) {
      this.addCard(value);
    }
  }

  addCard(text) {
    let card = new Card(text, (this.totalCard + 1));
    let cardHolder = helpers.findChildNodes(this.element, 'column__card__holder');
    cardHolder.appendChild(card.element);
    this.totalCard++;
  }
}