/** @type {Object} */
var fixtures = {};

/**
 * Get a complex DOM structure.
 * @return {Element} The root element in the DOM structure.
 */
fixtures.getComplexDOM = function () {
  var complexDiv = document.createElement('div');
  var span = document.createElement('span');
  span.innerHTML = 'def';
  var span2 = document.createElement('span');
  span2.innerHTML = 'ghi';
  var span3 = document.createElement('span');
  span3.innerHTML = 'jkl';
  span2.appendChild(span3);
  complexDiv.appendChild(document.createTextNode('abc'));
  complexDiv.appendChild(span);
  complexDiv.appendChild(span2);
  return complexDiv;
};

/**
 * Get a medium DOM structure.
 * @return {Element} The root element in the DOM structure.
 */
fixtures.getMediumDOM = function () {
  var htmlDiv = document.createElement('div');
  var anchor = document.createElement('a');
  anchor.href = 'http://google.com';
  anchor.innerHTML = 'def';
  htmlDiv.appendChild(document.createTextNode('abc '));
  htmlDiv.appendChild(anchor);
  htmlDiv.appendChild(document.createTextNode(' ghi'));
  return htmlDiv;
};

/**
 * Get a simple DOM structure.
 * @return {Element} The root element in the DOM structure.
 */
fixtures.getSimpleDOM = function () {
  var simpleDiv = document.createElement('div');
  simpleDiv.innerHTML = 'abc def ghi';
  return simpleDiv;
};

module.exports = fixtures;
