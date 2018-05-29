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
    }
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

function removeChild() {

}

function removeAttribute() {

}

function replaceChild() {

}

function setAttribute() {

}

function textContent() {

}
