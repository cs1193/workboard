import * as helpers from '../common/helpers';

import Column from '../Column/Column';

import './Board.scss';

export default class Board {
  constructor(selector, name, options) {
    this.selector = selector;
    this.name = name;
    this.options = options;
    this.render();
  }

  render() {
    var templateElement = helpers.createElement('div', {
      'class': ['board']
    }, this.renderBoardName(), this.renderColumns());

    document.querySelector(this.selector).appendChild(templateElement);
  }

  renderBoardName() {
    return helpers.createElement('div', {
      'class': ['board__name']
    }, this.name);
  }

  renderColumns() {
    var boardColumnElement = helpers.createElement('div', {
      'class': ['board__columns']
    });

    const columns = ['Column 1', 'Column 2', 'Column 3', 'Column 1', 'Column 2', 'Column 3'];

    for (var i = 0; i < columns.length; i++) {
      boardColumnElement.appendChild(new Column(columns[i], i).element);
    }

    return boardColumnElement;
  }
}
