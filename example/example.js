import WorkBoard from '../source/index';

import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  new WorkBoard('#workboard', getBoardData());
});

function getBoardData() {
  const mockData = {
    'name': 'Hello Board',
    'totalColumns': 5,
    'columns': [{
      'name': 'Backlog',
      'order': 1,
      'totalCard': 3,
      'cards': [{
        'text': 'Hello',
        'order': 1
      }]
    }, {
      'name': 'ToDo',
      'order': 2,
      'totalCard': 0,
      'cards': []
    }, {
      'name': 'In Progress',
      'order': 3,
      'totalCard': 5,
      'cards': []
    }, {
      'name': 'Review',
      'order': 4,
      'totalCard': 1,
      'cards': []
    }, {
      'name': 'Done',
      'order': 5,
      'totalCard': 2,
      'cards': []
    }]
  };

  return mockData;
}
