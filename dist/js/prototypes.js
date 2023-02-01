window.Element.prototype.setMoreAttr = function (attrs) {
  Object.keys(attrs).forEach((attr) => {
    this.setAttribute(attr, attrs[attr]);
  });
};
Document.prototype.createElementWithAttrs = function (element, attrs) {
  let ele = this.createElement(element);
  ele.setMoreAttr(attrs);
  return ele;
};

Document.prototype.createMoreElement = function (type, numOfele) {
  let elements = [];
  for (let i = 0; i < numOfele; i++) {
    elements.push(this.createElement(type));
  }
  return elements;
};

Object.prototype.loop = function (func) {
  Object.keys(this).forEach((key) => {
    func(key, this[key]);
  });
};

// find elements in object by its value
Object.prototype.getByValue = function (value, path, retKey = null) {
  let keyRes = Object.keys(this).find(
    (ky) => getValue(this, `${ky}.${path}`) === value
  );
  return retKey === null ? this[keyRes] : this[keyRes][retKey];
};

/**
 *  get value from object by nested keys
 * @author moustafa saad <moustafasaad954@gmail.com>
 * @param {object} obj - object you need to get value from it
 * @param {string} path - keys spilted by ('.')
 * @returns {any} value of this path
 */
Object.prototype.getValue = function (obj, path) {
  if (!path) return obj;
  const properties = path.split(".");
  return getValue(obj[properties.shift()], properties.join("."));
};
