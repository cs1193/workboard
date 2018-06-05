import * as utils from './utils';

const PATCH_TYPES = {
  INSERT_NODE: 'INSERT_NODE',
  REPLACE_NODE: 'REPLACE_NODE',
  REMOVE_NODE: 'REMOVE_NODE',
  TEXT_NODE: 'TEXT_NODE',
  PROPS_NODE: 'PROPS_NODE'
};

export function createNode(nTag, nAttributes, ...nChildren) {
  let domId = utils.guid('dom');
  let tag = ((nTag || nTag !== null) ? nTag : 'div');
  let properties = {};
  let children = [];

  for (let key in nAttributes) {
    properties[key] = nAttributes[key];
  }

  if (utils.isArray(nChildren)) {
    if (nChildren.length > 0) {
      for (let i = 0; i < nChildren.length; i++) {
        children.push(nChildren[i]);
      }
    }
  }

  return {
    domId,
    tag,
    properties,
    children
  };
}

export function createElement(node) {
  if (utils.isString(node))
    return document.createTextNode(node);

  let element = document.createElement(node.tag);

  const properties = node.properties;

  if (properties.size > 0) {
    for (let [key, value] of properties) {
      if (key === 'class') {
        element.classList.add.apply(element.classList, value);
      } else if (isEventAttribute(key)) {
        element.addEventListener(
          key.slice(2).toLowerCase(),
          value
        );
      } else {
        node.setAttribute(key, value);
      }
    }
  }

  const children = node.children;

  if (children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      let childNode = createElement(children[i]);
      if (childNode)
        element.appendChild(childNode);
    }
  }

  return element;
}

function isEventAttribute(key) {
  return /^on/.test(key);
}

// diff
export function diff(oldTree, newTree, index = 0) {
  let patches = {};
  let childrenPatches = {};

  if (!newTree && oldTree) {
    patches = {
      type: PATCH_TYPES.REMOVE_NODE,
      payload: oldTree
    };
  } else if (newTree && !oldTree) {
    patches = {
      type: PATCH_TYPES.INSERT_NODE,
      payload: newTree
    };
  } else if ((utils.isString(oldTree) && utils.isObject(newTree)) || utils.isObject(oldTree) && utils.isString(newTree) || oldTree.type !== newTree.type) {
    patches = {
      type: PATCH_TYPES.REPLACE_NODE,
      payload: newTree
    };
  } else if (newTree !== oldTree && utils.isString(newTree) && utils.isString(oldTree)) {
    patches = {
      type: PATCH_TYPES.TEXT_NODE,
      payload: newTree
    };
  } else if (utils.isObject(newTree) && utils.isObject(oldTree)) {
    if (diffProps(oldTree.properties, newTree.properties)) {
      const props = utils.cloneObject(newTree.properties);
      const oldProps = utils.cloneObject(oldTree.properties);

      patches = {
        type: PATCH_TYPES.PROPS_NODE,
        payload: {
          props,
          oldProps
        }
      };
    }

    const oldTreeChildren = utils.flattenArray(oldTree.children);
    const newTreeChildren = utils.flattenArray(newTree.children);

    let childrenLength = Math.max(oldTreeChildren.length, newTreeChildren.length);

    for (let i = 0; i < childrenLength; i++) {
      childrenPatches = {
        ...childrenPatches,
        ...diff(oldTreeChildren[i], newTreeChildren[i], i)
      };
    }
  }

  let changes = {};

  if (!utils.isObjectEmpty(patches)) changes['self'] = patches;
  if (!utils.isObjectEmpty(childrenPatches)) changes['children'] = childrenPatches;
  return !utils.isObjectEmpty(changes) && { [index] : patches };
}

const diffProps = (oldProps, newProps) => {
  oldProps = { ...oldProps };
  newProps = { ...newProps };
  return !utils.isObjectEqual(oldProps, newProps) && newProps;
}

// patch
