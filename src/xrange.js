/**
 * @fileOverview Range class that will be used as a wrapper for native browser
 * ranges and provides the same interface as the w3c Range class.
 */

/**
 * Custom range class. This class provides the same interface as the w3c Range
 * class, but it provides that functionality to older versions of IE.
 * @constructor
 * @param {Range|TextRange=} opt_range Optionally pass a range when
 *   constructing the new Range. It defaults to creating a new range.
 */
function XRange(opt_range) {
  /**
   * The native browser range object. This will be used heavily behind the
   * scenes for all sorts of range shenanigans.
   * @type {Range|TextRange}
   * @private
   */
  this._nativeRange = opt_range || this._createNativeRange();
}

/**
 * Create a native range instance. If there is a selection, create it based on
 * the selection.
 * @return {Range|TextRange} The native range instance.
 */
XRange.prototype._createNativeRange = function () {
  var sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) {
    return document.createRange();
  }
  return sel.getRangeAt(0);
};

/**
 * Delete the contents of the range.
 */
XRange.prototype.deleteContents = function () {
  this._nativeRange.deleteContents();
};

/**
 * Returns a text rectangle object that encloses a group of text rectangles.
 * @return {Object}
 */
XRange.prototype.getBoundingClientRect = function () {
  return this._nativeRange.getBoundingClientRect();
};

/**
 * Get the parent element of the range.
 * @return {Element} The parent element.
 */
XRange.prototype.getParentElement = function () {
  var parentEl = this._nativeRange.commonAncestorContainer;
  if (parentEl.nodeType !== 1) {
    parentEl = parentEl.parentNode;
  }
  return parentEl;
};

/**
 * Insert the provided element into the range.
 * @param {Element} element The element to insert into the range.
 */
XRange.prototype.insertNode = function(element) {
  this._nativeRange.insertNode(element);
};

/**
 * Select the contents of the provided node.
 * @param {Node} node The node to select contents of.
 */
XRange.prototype.selectNodeContents = function (node) {
  this._nativeRange.selectNodeContents(node);
};

/**
 * Set the end position of this range.
 * @param {Node} node The node to end the range in.
 * @param {number} index The character index in the node to end the range.
 */
XRange.prototype.setEnd = function (node, index) {
  this._nativeRange.setEnd(node, index);
};

/**
 * Set the start of the range.
 * @param {Node} node The node in which to start the range.
 * @param {number} index The position in the node to start the range.
 */
XRange.prototype.setStart = function (node, index) {
  this._nativeRange.setStart(node, index);
};

/**
 * Get the html string contents of the range.
 * @return {string} The html string contents of the range.
 */
XRange.prototype.toHtmlString = function () {
  var div = document.createElement('div');
  div.appendChild(this._nativeRange.cloneContents());
  return div.innerHTML;
};

/**
 * Get the string contents of the range.
 * @return {string} The string contents of the range.
 */
XRange.prototype.toString = function () {
  return this._nativeRange.toString();
};

module.exports = XRange;
