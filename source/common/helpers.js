
export const keyCode = {
  'ENTER_KEY': 13
};

export function debounce(fn, timer) {
  let timeout;
  return function () {
    const context = this;
    const args = Array.prototype.slice.call(arguments);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, timer);
  }
}

export function throttle(callback, wait, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }

  return function() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
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

  if (hasClass(children, selector)) return children;

  let sibilings = getSibilings(children);

  if (sibilings && sibilings.length > 0) {
    for (var i = 0; i < sibilings.length; i++) {
      if (hasClass(sibilings[i], selector))
        return sibilings[i];
      return findChildNodes(sibilings[i], selector);
    }
  }
}

export function getSibilings(element) {
  let sibilings = [];

  if (element) {
    let sibiling = element.parentNode.firstChild;
    for ( ; sibiling; sibiling = sibiling.nextSibling)
      if (sibiling.nodeType == 1 && sibiling !== element)
        sibilings.push(sibiling);
  }

  return sibilings;
}

export class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(name, fn) {
    this.listeners.has(name) || this.listeners.set(name, []);
    this.listeners.get(name).push(fn);
  }

  emit(name, ...args) {
    let listeners = this.listeners.get(name);

    if (listeners && listeners.length > 0) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](...args);
      }
      return true;
    }
    return false;
  }
}

export function guid(text) {
  return `${text}-${Math.random().toString(36).substr(2, 16)}`;
}
