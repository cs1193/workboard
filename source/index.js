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

// var sourceTree = Utilities.DOM.createNode('div', {
//   'class': ['source'],
// }, 'Hello Source');
//
// var targetTree = Utilities.DOM.createNode('div', {
//   'class': ['target'],
// }, 'Hello Target');
//
// var sourceRender = Utilities.DOM.createElement(sourceTree);
// var targetRender = Utilities.DOM.createElement(targetTree);
//
// console.log(sourceTree, sourceRender, targetTree, targetRender);
//
// var VDOM = document.querySelector('#vdom');
// VDOM.innerHTML = '';
// VDOM.appendChild(sourceRender);
//
// setTimeout(function () {
//
//   var diff = Utilities.DOM.diff(sourceTree, targetTree);
//
//   Utilities.DOM.patch(diff);
//
//   Utilities.Logger.Logger(JSON.stringify(diff));
//
// }, 5000);

export default WorkBoard;
