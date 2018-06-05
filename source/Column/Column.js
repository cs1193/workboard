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
      dragEnterClass: 'drag__entered',
      dragColumnStartClass: 'drag__column__start'
    };
    this.element = this.render(cards || []);
    this.draggedCard = {};
    this.data = [];

    var self = this;
    this.addListener('dragStart', (card) => {
      this.parent.setDraggedCard({
        'card': card,
        'startColumnId': self.id
      });
    });

    this.addListener('onDropCardOrder', (order) => {
      this.replaceOrder = order;
    });

    this.addListener('onDeleteCard', (card) => {
      this.deleteCard(card.id);
    });

    return this;
  }

  render(cards) {
    var self = this;
    return helpers.createElement('div', {
      'class': ['column'],
      'draggable': 'true',
      'onDragStart': helpers.debounce(function (event) {
        self.onColumnDragStart(event);
      }, 500),
      'onDragEnd': helpers.debounce(function (event) {
        self.onColumnDragEnd(event);
      }, 500),
      'onDrop': helpers.debounce(function (event) {
        self.onColumnDrop(event)
      }, 500)
    }, this.renderName(), this.renderCards(cards), this.renderAddNewCard());

    /*
    Recheck propagation

    'draggable': 'true',
    'onDragStart': helpers.debounce(function (event) {
      self.onColumnDragStart(event);
    }, 500),
    'onDragEnd': helpers.debounce(function (event) {
      self.onColumnDragEnd(event);
    }, 500),
    'onDrop': helpers.debounce(function (event) {
      self.onColumnDrop(event)
    }, 500)
     */
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
    cards = cards || this.cards;
    cards = helpers.sortObjectByValue(cards, 'order');

    if (cards.length > 0) {
      for (var i = 0; i < cards.length; i++) {
        var card = (cards[i].element) ? cards[i] : new Card(this, cards[i].text, cards[i].order);
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
    // console.log('Drag Over', this.name);
    return false;
  }

  onDragEnter(event) {
    event.preventDefault();
    var self = this;
    var classNames = this.element.getAttribute('class');
    this.parent.emit('setDraggedCardEndColumn', self.id);
    helpers.addClass(this.element, this.options.dragEnterClass);
  }

  onDragLeave(event) {
    // console.log('Drag Leave', this.name);
    let boundingBox = this.element.getBoundingClientRect();
    let classNames = this.element.getAttribute('class');
    if ((event.x > boundingBox.left + boundingBox.width) || (event.x < boundingBox.left) || (event.y > boundingBox.top + boundingBox.height) || (event.y < boundingBox.top)) {
      helpers.removeClass(this.element, this.options.dragEnterClass);
    }
  }

  onDrop(event, current) {
    event.stopPropagation();
    // console.log('Drop');
    let card = this.parent.getDraggedCard();
    // let cardHolder = helpers.findChildNodes(this.element, 'column__card__holder');
    // cardHolder.appendChild(card.element);
    this.cards.push(card);
    this.reorder();
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
    helpers.removeClass(this.element, this.options.dragEnterClass);
  }

  reorder() {
    var self = this;
    var cards = Array.prototype.slice.call(self.cards);

    var lastInsertedCard = cards.pop();
    lastInsertedCard.order = this.replaceOrder;

    cards.splice(this.replaceOrder - 1, 0, lastInsertedCard);

    var splicedArray = cards.splice(this.replaceOrder, cards.length - 1);

    for (let i = 0; i < splicedArray.length; i++) {
      splicedArray[i].order += 1;
      cards.push(splicedArray[i]);
    }

    let cardHolder = helpers.findChildNodes(this.element, 'column__card__holder');
    cardHolder.innerHTML = '';

    this.cards = cards;

    this.updateCards(cardHolder, cards);
  }

  deleteCard(id) {
    var self = this;
    var cards = Array.prototype.slice.call(self.cards);
    var index = cards.map((card) => {
      return card.id;
    }).indexOf(id);

    cards.splice(index, 1);


    var splicedArray = cards.splice(index, cards.length - 1);

    for (let i = 0; i < splicedArray.length; i++) {
      splicedArray[i].order = splicedArray[i].order - 1;
      cards.push(splicedArray[i]);
    }

    let cardHolder = helpers.findChildNodes(this.element, 'column__card__holder');
    cardHolder.innerHTML = '';

    this.cards = cards;

    this.updateCards(cardHolder, cards);
  }

  onColumnDragStart(event) {
    helpers.addClass(this.element, this.options.dragColumnStartClass);
    this.parent.emit('columnDragStart', this);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.element.innerHTML);
  }


  onColumnDragEnd(event) {
    helpers.removeClass(this.element, this.options.dragColumnStartClass);
    helpers.removeClass(this.element, this.options.dragEnterClass);
  }

  onColumnDrop(event) {
    var self = this;
    this.parent.emit('onDropColumnOrder', self.order);
  }
}
