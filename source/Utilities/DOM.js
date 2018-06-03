import * as common from './Common';

const NODES = new Map();

const PATCH_TYPES = {
  APPEND_CHILD: 'APPEND_CHILD',
  REMOVE_CHILD: 'REMOVE_CHILD',
  REMOVE_ATTRIBUTE: 'REMOVE_ATTRIBUTE',
  REPLACE_CHILD: 'REPLACE_CHILD',
  SET_ATTRIBUTE: 'SET_ATTRIBUTE',
  TEXT_CONTENT: 'TEXT_CONTENT'
};

const PATCH_METHODS = {
  APPEND_CHILD: appendChild,
  REMOVE_CHILD: removeChild,
  REMOVE_ATTRIBUTE: removeAttribute,
  REPLACE_CHILD: replaceChild,
  SET_ATTRIBUTE: setAttribute,
  TEXT_CONTENT: textContent
};

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
    domId: common.guid('dom'),
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

  NODES.set(nodeObject.domId, node);

  console.log(NODES);

  return node;
}

export function diff(source, target) {
  let patches = new Array();

  const sourceChildNodes = source.children;
  const targetChildNodes = target.children;

  const sourceChildNodesLength = (sourceChildNodes) ? sourceChildNodes.length : 0;
  const targetChildNodesLength = (targetChildNodes) ? targetChildNodes.length : 0;

  for (let i = 0; i < targetChildNodesLength; i++) {
    const currentSource = sourceChildNodes[i];
    const currentTarget = targetChildNodes[i];

    if (!currentSource) {
      patches.push({
        target: targetChildNodes[i],
        source,
        type: PATCH_TYPES.APPEND_CHILD
      });
      continue;
    }

    patches = patches.concat(diffNode(currentSource, currentTarget));
  }

  if (targetChildNodesLength < sourceChildNodesLength) {
    for (let i = targetChildNodesLength; i < sourceChildNodesLength; i++) {
      patches.push({
        target: sourceChildNodes[i],
        source,
        type: PATCH_TYPES.REMOVE_CHILD
      });
    }
  }

  return patches;
}

function diffNode(source, target) {
  let patches = compareNode(source, target);

  if (patches) {
    return patches.concat(diff(source, target));
  }

  return [{
    target,
    source,
    type: PATCH_TYPES.REPLACE_CHILD
  }]
}

function compareNode(source, target) {
  return compareElement(source, target)
    .concat(compareText(source, target));
}

function compareElement(source, target) {
  var patches = [];

  if (source.localName === target.localName) {
    const { properties: sourceProperties } = source;
    const { properties: targetProperties } = target;

    for (let name in sourceProperties) {
      if (isEmpty(targetProperties[name])) {
        patches.push({
          data: { name },
          target,
          source,
          type: PATCH_TYPES.REMOVE_ATTRIBUTE
        });
      }
    }

    for (let name in targetProperties) {
      const sourceValue = sourceProperties[name];
      const targetValue = targetProperties[name];

      if (sourceValue != targetValue && !isEmpty(targetValue[name])) {
        patches.push({
          data: { name },
          target,
          source,
          type: PATCH_TYPES.SET_ATTRIBUTE
        })
      }
    }
  }

  return patches;
}

function compareText(source, target) {
  if (source.textContent === target.textContent) {
    return [];
  }

  return [{
    target,
    source,
    type: PATCH_TYPES.TEXT_CONTENT
  }];
}

const isEmpty = (value) => value == null;

export function patch(patches) {
  patches.forEach(patchNode);
}

export function patchNode(patchData) {
  PATCH_METHODS[patchData.type](
    patchData.source,
    patchData.target
  );
}

function appendChild(source, target) {
  NODES.get(source.domId).appendChild(createElement(target));
}

function removeChild(source, target) {
  const targetNode = NODES[target.domId];
  const sourceNode = NODES[target.domId];

  if (sourceNode) {
    sourceNode.removeChild(targetNode);
  } else {
    const { childNodes } = sourceNode;
    const index = childNodes.indexOf(targetNode);
    if (index > -1) {
      childNodes.splice(index, 1);
    }
  }
}

function removeAttribute(source, target, data) {
  const { name } = data;
  NODES[source.domId].removeAttribute(name);
}

function replaceChild(source, target) {
  const sourceNode = NODES[source.domId];
  if (sourceNode) {
    sourceNode.parentNode && sourceNode.parentNode.replaceChild(createElement(target), sourceNode);
  } else {
    sourceNode.domId = targetNode.domId;
    sourceNode.localName = targetNode.localName;
    sourceNode.properties = targetNode.properties;
    sourceNode.children = targetNode.children;
  }
}

function setAttribute(source, target, data) {
  const { name } = data;
  NODES[source.domId].setAttribute(name, target.properties[name]);
}

function textContent(source, target) {
  NODES[source.domId].textContent = target.textContent;
}
