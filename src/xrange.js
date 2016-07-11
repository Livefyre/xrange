/**
 * @fileOverview Returns whichever range object should be used. This is
 * determined by what the browser supports.
 */

var domUtil = require('./util/dom');

/**
 * Range object.
 * @type {StandardRange|IERange}
 */
var XRange = !!window.getSelection ?
  require('./standardrange') :
  require('./ierange');

/**
 * Get the range from a string representation of the range within the provided
 * element. Returns null if no range could not be found or the range itself.
 * @param {string} str The string to find the range of.
 * @param {Element} rootEl The DOM element to find the range in.
 * @param {XRange=} opt_range Optional range to update.
 * @return {?XRange} Null or the range.
 */
XRange.getRangeByString = function (str, rootEl, opt_range) {
  var rangeDom = document.createElement('div');
  rangeDom.innerHTML = str;
  var firstRangeNode = domUtil.findNodeInElement(rangeDom);
  var lastRangeNode = domUtil.findNodeInElement(rangeDom, true);
  // Ensure that we were able to find the first and last nodes within the root
  // element.
  if (!firstRangeNode || !lastRangeNode) {
    return;
  }
  firstRangeNode = firstRangeNode.nodeValue;
  lastRangeNode = lastRangeNode.nodeValue;

  var range = opt_range || new XRange();
  var startNodes = [];

  /**
   * Checks a node and index with the startNodes array to see if the range
   * matches the string that was provided in the parent function. Iterates over
   * each start range node/idx array and tries to find a matching range.
   * @param {Node} node The node to check as the end node in the range.
   * @param {number} idx The index within the node where the range ends.
   * @return {boolean} Whether the range matches the string or not.
   */
  function checkRange(node, idx) {
    var start;
    range.setEnd(node, idx);
    for (var i=0; i < startNodes.length; i++) {
      start = startNodes[i];
      range.setStart(start[0], start[1]);
      // Check that the html string of the range is equal to the string that
      // we're trying to get the range for.
      if (range.toHtmlString() === str) {
        return true;
      }
    }
    return false;
  }

  // Loop through all child nodes in the root element to find nodes that match
  // the start and end nodes of the string.
  var success = domUtil.forEachNode(rootEl, function (node) {
    var startIdx = node.nodeValue.indexOf(firstRangeNode);
    if (startIdx > -1) {
      startNodes.push([node, startIdx]);
    }
    var endIdx = node.nodeValue.indexOf(lastRangeNode);
    if (endIdx > -1 && checkRange(node, endIdx + lastRangeNode.length)) {
      return true;
    }
  });
  return success ? range : null;
};

module.exports = XRange;
