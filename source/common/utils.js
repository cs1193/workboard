const isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Function]";
}

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

const isString = (obj) => {
  return Object.prototype.toString.call(obj) === "[object String]";
}

function guid(text) {
  return `${text}-${Math.random().toString(36).substr(2, 16)}`;
}

function isObjectEqual(oldObj, newObj) {
  if (isObject(oldObj) && isObject(newObj)) {
    for (let key of Object.keys(oldObj)) {
      if (!isObjectEqual(oldObj[key], newObj[key])) return false;
    }
    return Object.keys(oldObj).length === Object.keys(newObj).length;
  }
  return oldObj + '' === newObj + '';
}

function flattenArray(array) {
  if (!array)
    return [];

  const items = [];

  for (let item of array) {
    if (isArray(item))
      items.push(...flattenArray(item));
    else
      items.push(item);
  }
  return items;
}

function cloneObject(obj) {
  let newObj = (isArray(obj)) ? [] : {};
  for (let key in obj) {
    let tempObj = obj[key];
    newObj[key] = (isObject(tempObj)) ? cloneObject(tempObj) : tempObj;
  }
  return newObj;
}

function isObjectEmpty(value) {
  return !Object.keys(value).length;
}

function isMapEqual(oldMap, newMap) {
  let test;

  if (oldMap.size !== newMap.size) {
    return false;
  }

  for (let [key, value] of oldMap) {
    test = newMap.get(key);

    if (test !== value || (test === undefined && !newMap.has(key))) {
      return false;
    }
  }

  return true;
}

export {
  isArray,
  isFunction,
  isObject,
  isString,
  guid,
  isObjectEqual,
  flattenArray,
  cloneObject,
  isObjectEmpty,
  isMapEqual
}
