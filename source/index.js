import Board from './Board/Board';
// import EventEmitter from './common/EventEmitter';

import Utilities from './Utilities';

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

var sourceTree = Utilities.DOM.createNode('div', {
  'class': ['source'],
});

var targetTree = Utilities.DOM.createNode('div', {
  'class': ['target'],
}, Utilities.DOM.createNode('div', {
  'class': ['target_1'],
}));

var sourceRender = Utilities.DOM.createElement(sourceTree);
var targetRender = Utilities.DOM.createElement(targetTree);

console.log(sourceTree, sourceRender, targetTree, targetRender);

var diff = Utilities.DOM.diffAndPatch(sourceTree, targetTree);

sourceTree = Utilities.DOM.createNode('div', {
  'class': 'source',
},  Utilities.DOM.createNode('div', {
  'class': 'target_0',
}));

targetTree = Utilities.DOM.createNode('div', {
  'class': 'source',
}, Utilities.DOM.createNode('div', {
  'class': 'target_1',
}));

var diff = Utilities.DOM.diffAndPatch(sourceTree, targetTree);


export default WorkBoard;
