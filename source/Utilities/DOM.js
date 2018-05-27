import * as common from './Common';

const tags = {
  DIVISION: 'div'
}

const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3
}

export function createNode(element, attributes, ...childNodes) {
  let tag = ((element || element !== null) ? element : tags.DIVISION).toLowerCase();
  let children = new Array();
  let properties = new Map();

  for (let key in attributes) {
    properties.set(key, attributes[key]);
  }

  if (common.isArray(childNodes)) {
    if (childNodes.length > 0) {
      for (let i = 0; i < childNodes.length; i++) {
        children.push(childNodes[i]);
      }
    }
  }

  return {
    tag,
    properties,
    children
  };
}

export function createElement(nodeObject) {
  if (common.isString(nodeObject))
    return document.createTextNode(nodeObject);

  let node = document.createElement(nodeObject.tag);

  const properties = nodeObject.properties;

  if (properties.size > 0) {
    for (let [key, value] of properties) {
      if (key === 'class') {
        node.classList.add.apply(node.classList, value);
      } else if (isEventAttribute(key)) {
        node.addEventListener(
          key.slice(2).toLowerCase(),
          value
        );
      } else {
        node.setAttribute(key, value);
      }
    }
  }

  const children = nodeObject.children;

  if (children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      let childNode = createElement(children[i]);
      if (childNode)
        node.appendChild(childNode);
    }
  }

  return node;
}

export function diff(source, target) {
  let updatedNodes = new Array();

  const sourceChildNodes = source.childNodes;
  const targetChildNodes = target.childNodes;

  const sourceChildNodesLength = (sourceChildNodes) ? sourceChildNodes.length : 0;
  const targetChildNodesLength = (targetChildNodes) ? targetChildNodes.length : 0;

  for (let i = 0; i < targetChildNodesLength; i++) {
    const currentSource = sourceChildNodes[i];
    const currentTarget = targetChildNodes[i];

    console.log(currentSource, currentTarget);

    if (!currentSource) {
      console.log(currentTarget[i], source);
    }

    diffNode(currentSource, currentTarget);
  }

  if (targetChildNodesLength < sourceChildNodesLength) {
    for (let i = targetChildNodes; i < sourceChildNodesLength; i++) {
      console.log(sourceChildNodes[i], source);
    }
  }
}

function diffNode(source, target) {
  const sourceType = source.nodeType;
  const targetType = target.nodeType;

  console.log(sourceType, targetType);

  if (targetType !== sourceType) {
    return [];
  } else if (targetType === NODE_TYPES.ELEMENT) {
    if (source.localName === target.localName) {

    }
  } else if (targetType === NODE_TYPES.TEXT) {
    if (source.textContent === target.textContent) {
      return [];
    }

    return 'change_text';
  }

  return [];
}

const isEventAttribute = (attribute) => {
  return /^on/.test(attribute);
}
