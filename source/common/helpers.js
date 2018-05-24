
export const keyCode = {
  'ENTER_KEY': 13
};

export function debounce(fn, timer) {
  let timeout;
  return function () {
    let context = this;
    let args = Array.prototype.slice.call(arguments);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, timer);
  }
}

export function createElement(element, attributes, ...children) {
  let node = document.createElement(element);
  for (var key in attributes) {
    if (key === "class") {
      node.classList.add.apply(node.classList, attributes[key]);
    } else if (/^on/.test(key)) {
      node.addEventListener(
        key.slice(2).toLowerCase(),
        attributes[key]
      );
    } else {
      node.setAttribute(key, attributes[key]);
    }
  }

  children.forEach((child) => {
    if (typeof child === 'string') {
      node.appendChild(document.createTextNode(child));
    } else {
      node.appendChild(child);
    }
  });

  return node;
}

export function hasClass(element, classNameValue) {
  return (element.getAttribute && element.getAttribute('class').replace(/[\n\t]/g, ' ').indexOf(classNameValue) > -1);
}

export function findChildNodes(element, selector) {
  let children = element.firstChild;
  let sibilings = getSibilings(children);

  for (var i = 0; i < sibilings.length; i++) {
    if (hasClass(sibilings[i], selector))
      return sibilings[i];
    return findChildNodes(sibilings[i], selector);
  }
}

export function getSibilings(element) {
  let sibilings = [];
  let sibiling = element.parentNode.firstChild;
  for ( ; sibiling; sibiling = sibiling.nextSibling)
    if (sibiling.nodeType == 1 && sibiling !== element)
      sibilings.push(sibiling);
  return sibilings;
}
