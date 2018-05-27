export const isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Function]";
}

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

export const isString = (obj) => {
  return Object.prototype.toString.call(obj) === "[object String]";
}

export function guid(text) {
  return `${text}-${Math.random().toString(36).substr(2, 16)}`;
}

export function addClass(element, selector) {
  let classNames = element.getAttribute('class');
  if (!hasClass(element, selector)) {
    element.setAttribute('class', classNames + ' ' + selector);
  }
}

export function removeClass(element, selector) {
  let classNames = element.getAttribute('class');
  if (hasClass(element, selector)) {
    let expression = new RegExp(selector, 'gi');
    element.setAttribute('class', classNames.replace(expression, ''));
  }
}

export function sortObjectByValue(obj, prop) {
  if (obj.length > 0) {
    var newObj = Array.prototype.slice.call(obj);
    newObj.sort((a, b) => {
      return a[prop] - b[prop];
    });
    return newObj;
  }
  return false;
}
