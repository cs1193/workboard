import * as helpers from '../common/helpers';

import Column from '../Column/Column';

import './Board.scss';

export default class Board extends helpers.EventEmitter {
  constructor(options) {
    super();
    this.id = this.id = helpers.guid('board');
    this.options = options || {
      dragColumnEnterClass: 'drag__column__enter'
    };
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

    this.addListener('setDraggedCardEndColumn', (args) => {
      this.setDraggedCardEndColumn(args);
    });

    this.addListener('columnDragStart', (column) => {
      this.draggedColumn = column;
    });

    this.addListener('onDropColumnOrder', (order) => {
      this.replaceColumnOrder = order;
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
    var self = this;
    var boardColumnElement = helpers.createElement('div', {
      'class': ['board__columns']
    });

    /*
        Removed! recheck propagation

        'onDragOver': function (event) {
          self.onColumnDragOver(event);
        },
        'onDragEnter': helpers.debounce(function (event) {
          self.onColumnDragEnter(event);
        }, 500),
        'onDragLeave': helpers.debounce(function (event) {
          self.onColumnDragLeave(event);
        }, 500),
        'onDrop': helpers.debounce(function (event) {
          self.onColumnDrop(event, this);
        }, 500)
     */
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

  updateBoardColumns(element, columnsData) {
    let boardColumnElement = element || helpers.findChildNodes(this.element, 'board__columns');
    let columns = columnsData || this.data.columns || [];

    columns = helpers.sortObjectByValue(columns, 'order');

    if (columns.length > 0) {
      for (var i = 0; i < columns.length; i++) {
        let column = (columns[i].element) ? columns[i] : new Column(this, columns[i].name, columns[i].order, columns[i].totalColumns, columns[i].cards);
        boardColumnElement.appendChild(column.element);
        this.columns.push(column);
      }
    }
  }

  setDraggedCard(obj) {
    this.draggedCard = obj.card;
    this.draggedStartColumnId = obj.startColumnId;
  }

  setDraggedCardEndColumn(id) {
    this.draggedEndColumnId = id;
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

  onColumnDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  }

  onColumnDragEnter(event) {
    event.preventDefault();
    helpers.addClass(this.element, this.options.dragColumnEnterClass);
  }

  onColumnDragLeave(event) {
    let boundingBox = this.element.getBoundingClientRect();
    let classNames = this.element.getAttribute('class');
    if ((event.x > boundingBox.left + boundingBox.width) || (event.x < boundingBox.left) || (event.y > boundingBox.top + boundingBox.height) || (event.y < boundingBox.top)) {
      helpers.removeClass(this.element, this.options.dragColumnEnterClass);
    }
  }

  onColumnDrop(event) {
    event.stopPropagation();
    let column = this.draggedColumn;
    this.columns.push(column);
    this.reorder();
  }

  reorder() {
    var self = this;
    var columns = Array.prototype.slice.call(self.columns);

    var lastInsertedColumn = columns.pop();
    lastInsertedColumn.order = this.replaceColumnOrder;

    columns.splice(this.replaceColumnOrder - 1, 0, lastInsertedColumn);

    var splicedArray = columns.splice(this.replaceColumnOrder, columns.length - 1);

    for (let i = 0; i < splicedArray.length; i++) {
      splicedArray[i].order += 1;
      columns.push(splicedArray[i]);
    }

    console.log(columns, splicedArray);

    let columnsHolder = helpers.findChildNodes(this.element, 'board__columns');
    columnsHolder.innerHTML = '';

    this.columns = columns;

    this.updateBoardColumns(columnsHolder, columns);
  }
}
