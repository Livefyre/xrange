/**
 * @fileOverview Commonly used utility functions.
 */

/** @type {Object} */
var util = {};

/**
 * Find the first or last node within an element based on the optional second
 * argument.
 * @param {Element} parent The parent element to search.
 * @param {boolean=} opt_last Optionally select the last node within the element.
 * @return {Node} The first or last node in the element.
 */
util.findNodeInElement = function (parent, opt_last) {
  var _node;
  var fn = !opt_last ? util.forEachNode : util.forEachNodeReverse;
  fn(parent, function (node) {
    _node = node;
    return true;
  });
  return _node;
};

/**
 * Process an individual node. If there are child nodes of the current node,
 * call the fn argument. Otherwise, call the callback with the node as a param.
 * @param {Element|Node} node The node to process.
 * @param {function()} callback The function to call when a node is reached.
 * @param {function()} fn The function to call for recursion.
 * @return {boolean=} Whether we should continue to process.
 */
function processNode(node, callback, fn) {
  // If there are child nodes, go into them.
  if (node.hasChildNodes()) {
    return fn(node, callback);
  }
  // We only want to call the callback for text nodes.
  if (node.nodeType !== 3) {
    return;
  }
  return callback(node);
}

/**
 * Recursively iterates over the nodes that exist within the provided parent
 * element and calls the provided callback for each one. If the callback returns
 * true, the iteration will stop.
 * @param {Element} parent The parent element to search.
 * @param {function()} callback The function to call for each node.
 * @return {boolean=} True if the iteration was stopped prematurely.
 */
util.forEachNode = function (parent, callback) {
  var childNodes = parent.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (processNode(childNodes[i], callback, util.forEachNode)) {
      return true;
    }
  }
};

/**
 * Recursively iterates over the nodes that exist within the provided parent
 * element and calls the provided callback for each one. If the callback returns
 * true, the iteration will stop. This goes in reverse order, starting at the
 * end of the parent's child nodes.
 * @param {Element} parent The parent element to search.
 * @param {function()} callback The function to call for each node.
 * @return {boolean=} True if the iteration was stopped prematurely.
 */
util.forEachNodeReverse = function (parent, callback) {
  var childNodes = parent.childNodes;
  for (var i = childNodes.length - 1; i >= 0; i--) {
    if (processNode(childNodes[i], callback, util.forEachNodeReverse)) {
      return true;
    }
  }
};

/**
 * Iterates over a node's siblings until it doesn't have any left and calls the
 * callback function for each node it encounters. If one of the siblings is an
 * Element, it will process all of the element's children, calling the callback
 * for each node.
 * @param {Element|Node} node The node to iterate it's siblings.
 * @param {function()} callback The function to call for each node.
 * @return {boolean} True if the iteration was stopped prematurely.
 */
util.forEachSibling = function (node, callback) {
  var next = node.nextSibling;
  while (next) {
    if (processNode(next, callback, util.forEachNode)) {
      return true;
    }
    next = next.nextSibling;
  }
  return false;
};

/**
 * Returns a text rectangle object that encloses a group of text rectangles.
 * @return {Object}
 */
util.getBoundingClientRect = function (elem) {
  var rect = elem.getBoundingClientRect();
  // Sometimes IE has a problem getting this value for the first time. When
  // this happens, all of the data attributes are 0. It always seems to work
  // the second time, even if it's immediately after.
  if (!rect.height && !rect.top) {
    rect = elem.getBoundingClientRect();
  }
  // On some of the older IE browsers, the rect object doesn't contain
  // attributes for height or width, so we get to generate it!
  if (typeof rect.height === undefined) {
    rect = {top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left};
    rect.height = rect.bottom - rect.top;
    rect.width = rect.right - rect.left;
  }
  return rect;
};

/**
 * Puts the specified node and all of its subtree into a "normalized" form. In
 * a normalized subtree, no text nodes in the subtree are empty and there are
 * no adjacent text nodes.
 * @param {Element} parentNode The parent element to normalize.
 */
util.normalize = function (parentNode) {
  var childNodes = parentNode.childNodes;
  var i;
  var len;
  var node;
  var nodesToRemove = [];
  var textNode;

  // Clean up the nodes and add some of the remove bin.
  for (i=0, len=childNodes.length; i<len; i++) {
    node = childNodes[i];
    // Recursively update child elements.
    if (node.hasChildNodes()) {
      util.normalize(node);
      textNode = null;
      continue;
    }
    if (textNode) {
      if (node.nodeType === 3) {
        nodesToRemove.push(node);
        textNode.nodeValue += node.nodeValue;
        continue;
      }
      textNode = null;
      continue;
    }
    if (node.nodeType === 3) {
      textNode = node;
    }
  }

  for (i=0, len=nodesToRemove.length; i<len; i++) {
    parentNode.removeChild(nodesToRemove[i]);
  }
};

module.exports = util;
