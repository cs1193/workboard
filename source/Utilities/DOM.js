import * as common from './Common';

const tags = {
  DIVISION: 'div'
}

const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3
}

let NodeMap = {};

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
    __id: common.guid(),
    tag,
    properties,
    children,
    nodeType: 1
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

  NodeMap[nodeObject.__id] = node;

  return node;
}

export function diffAndPatch(source, target) {
  let diffNodes = {};

  const sourceChildNodes = source.children;
  const targetChildNodes = target.children;

  const sourceChildNodesLength = (sourceChildNodes) ? sourceChildNodes.length : 0;
  const targetChildNodesLength = (targetChildNodes) ? targetChildNodes.length : 0;

  for (let i = 0; i < targetChildNodesLength; i++) {
    const currentSource = sourceChildNodes[i];
    const currentTarget = targetChildNodes[i];

    if (!currentSource) {
      NodeMap[source.__id].appendChild(createElement(currentTarget));
    }

    console.log(diffAndPatchNode(currentSource, currentTarget));
  }

  if (targetChildNodesLength < sourceChildNodesLength) {
    for (let i = targetChildNodes; i < sourceChildNodesLength; i++) {
      // console.log(sourceChildNodes[i], source);
    }
  }

  return diffNodes;
}

function diffAndPatchNode(source, target) {
  const sourceType = (source) ? source.nodeType : null;
  const targetType = (target) ? target.nodeType : null;

  console.log(sourceType, targetType);

  if (targetType !== sourceType) {
    return [];
  } else if (targetType === NODE_TYPES.ELEMENT) {
    // Compare Element
    if (source.localName === target.localName) {
      const { properties: sourceProperties } = source;
      const { properties: targetProperties } = target;

      for (let [key, value] of sourceProperties) {
        if (!targetProperties.has(key)) {
          NodeMap[source.__id].removeAttribute(key);
        }
      }

      for (let [key, value] of targetProperties) {
        const sourceValue = sourceProperties.get(key);

        console.log(isEmptyAttributes(sourceProperties.get(key)), source.__id, NodeMap[source.__id]);

        if (sourceValue !== value) {
          NodeMap[source.__id].setAttribute(key, target.properties[key]);
        }
      }
    }
  } else if (targetType === NODE_TYPES.TEXT) {
    // Compare Text
    if (source.textContent === target.textContent) {
      return [];
    }

    return 'change_text';
  }

  return [];
}

const isEmptyAttributes = (attribute) => {
  return (common.isArray(attribute)) ? attribute.length < 0 : attribute;
}

const isEventAttribute = (attribute) => {
  return /^on/.test(attribute);
}
