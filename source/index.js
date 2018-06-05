import * as common from './common';

import Board from './Board/Board';

import './index.scss';

const WorkBoard = (selector, data) => {
  var board = new Board(selector);

  if (data) {
    // setTimeout(() => {
      board.setData(data);
    // }, 5000);

    document
      .querySelector(selector)
      .appendChild(board.element);
  }

};

export default WorkBoard;

var sourceTree = common.dom.createNode('div', {
  'class': ['source']
}, 'Source');

var sourceRender = common.dom.createElement(sourceTree);

var targetTree = common.dom.createNode('div', {
  'class': ['target']
}, common.dom.createNode('div', {
  'class': ['target_2']
}, 'Hello'));

var targetRender = common.dom.createElement(targetTree);

var changes = common.dom.diff(sourceTree, targetTree);

console.log(sourceTree, sourceRender, targetTree, targetRender, changes);

var vdom = document.querySelector('#vdom');
var fragment = document.createDocumentFragment();
fragment.appendChild(sourceRender);
vdom.appendChild(fragment);
