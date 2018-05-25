import * as helpers from '../common/helpers';

import Column from '../Column/Column';

import './Board.scss';

export default class Board extends helpers.EventEmitter {
  constructor(options) {
    super();
    this.id = this.id = helpers.guid('board');
    this.options = options;
    this.data = {};
    this.columns = [];
    this.totalColumns = [];
    this.element = this.render();
    this.isLoading = true;
    this.draggedCard = {};

    this.addListener('setData', () => {
      this.updateBoardName();
      this.updateBoardColumns();
      this.isLoading = false;
    });

    this.addListener('cardDropped', () => {
      this.updateDragLeave();
    });

    return this;
  }

  render() {
    return helpers.createElement('div', {
      'class': ['board']
    }, this.renderBoardName(), this.renderColumns());
  }

  renderBoardName() {
    return helpers.createElement('div', {
      'class': ['board__name']
    }, this.data.name ? this.data.name : '');
  }

  renderColumns() {
    var boardColumnElement = helpers.createElement('div', {
      'class': ['board__columns']
    });
    this.updateBoardColumns(boardColumnElement);
    return boardColumnElement;
  }

  setData(data) {
    this.data = data;
    this.emit('setData');
  }

  updateBoardName() {
    let boardNameHolder = helpers.findChildNodes(this.element, 'board__name');
    boardNameHolder.appendChild(document.createTextNode(this.data.name));
  }

  updateBoardColumns(element) {
    let boardColumnElement = element || helpers.findChildNodes(this.element, 'board__columns');
    let columns = this.data.columns || [];

    if (columns.length > 0) {
      for (var i = 0; i < columns.length; i++) {
        let column = new Column(this, columns[i].name, columns[i].order, columns[i].totalColumns, columns[i].cards);
        boardColumnElement.appendChild(column.element);
        this.columns.push(column);
      }
    }
  }

  setDraggedCard(card) {
    this.draggedCard = card;
  }

  getDraggedCard() {
    return this.draggedCard;
  }

  updateDragLeave() {
    let columns = this.columns || [];

    if (columns.length > 0) {
      for (var i = 0; i < columns.length; i++) {
        columns[i].removeDragHighlight();
      }
    }
  }
}
