import * as helpers from '../common/helpers';

import Card from '../Card/Card';

import './Column.scss';

export default class Column extends helpers.EventEmitter {
  constructor(parent, name, order, totalCard, cards, options) {
    super();
    this.id = helpers.guid('column');
    this.parent = parent;
    this.name = name;
    this.order = order;
    this.totalCard = totalCard || 0;
    this.cards = [];
    this.options = options || {
      dragEnterClass: 'drag__entered'
    };
    this.element = this.render(cards || []);
    this.draggedCard = {};

    this.addListener('dragStart', (card) => {
      this.parent.setDraggedCard(card);
    });

    return this;
  }

  render(cards) {
    return helpers.createElement('div', {
      'class': ['column']
    }, this.renderName(), this.renderCards(cards), this.renderAddNewCard());
  }

  renderName() {
    return helpers.createElement('div', {
      'class': ['column__card__name']
    }, this.name);
  }

  renderCards(cards) {
    var self = this;
    var cardHolderTemplate = helpers.createElement('div', {
      'class': ['column__card__holder'],
      'onDragOver': function (event) {
        self.onDragOver(event);
      },
      'onDragEnter': helpers.debounce(function (event) {
        self.onDragEnter(event);
      }, 500),
      'onDragLeave': helpers.debounce(function (event) {
        self.onDragLeave(event);
      }, 500),
      'onDrop': helpers.debounce(function (event) {
        self.onDrop(event, this);
      }, 500)
    });
    this.updateCards(cardHolderTemplate, cards);
    return cardHolderTemplate;
  }

  updateCards(element, cards) {
    let cardHolder = element || helpers.findChildNodes(this.element, 'column__card__holder');
    cards = cards || [];
    if (cards.length > 0) {
      for (var i = 0; i < cards.length; i++) {
        var card = new Card(this, cards[i].text, cards[i].order);
        cardHolder.appendChild(card.element);
        this.cards.push(card);
      }
    }
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
      }, 500),
      'onBlur': helpers.debounce(function (event) {
        this.value = '';
      }, 500)
    }));
  }

  onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    console.log('Drag Over', this.name);
    return false;
  }

  onDragEnter(event) {
    event.preventDefault();
    var classNames = this.element.getAttribute('class');
    if (!helpers.hasClass(this.element, this.options.dragEnterClass)) {
      this.element.setAttribute('class', classNames + ' ' + this.options.dragEnterClass);
    }
  }

  onDragLeave(event) {
    console.log('Drag Leave', this.name);
    let boundingBox = this.element.getBoundingClientRect();
    let classNames = this.element.getAttribute('class');
    if ((event.x > boundingBox.left + boundingBox.width) || (event.x < boundingBox.left) || (event.y > boundingBox.top + boundingBox.height) || (event.y < boundingBox.top)) {
      if (helpers.hasClass(this.element, this.options.dragEnterClass)) {
        let expression = new RegExp(this.options.dragEnterClass, 'gi');
        this.element.setAttribute('class', classNames.replace(expression, ''));
      }
    }
  }

  onDrop(event, current) {
    event.stopPropagation();
    let card = this.parent.getDraggedCard();
    let cardHolder = helpers.findChildNodes(this.element, 'column__card__holder');
    cardHolder.appendChild(card.element);
    this.cards.push(card);
    this.parent.emit('cardDropped');
  }

  onAddCardInput = (event, value) => {
    event.preventDefault();

    if (event.keyCode === helpers.keyCode.ENTER_KEY) {
      this.addCard(value);
    }
  }

  addCard(text) {
    let card = new Card(this, text, (this.totalCard + 1));
    let cardHolder = helpers.findChildNodes(this.element, 'column__card__holder');
    cardHolder.appendChild(card.element);
    this.cards.push(card);
  }

  removeDragHighlight() {
    let classNames = this.element.getAttribute('class');
    if (helpers.hasClass(this.element, this.options.dragEnterClass)) {
      let expression = new RegExp(this.options.dragEnterClass, 'gi');
      this.element.setAttribute('class', classNames.replace(expression, ''));
    }
  }
}
