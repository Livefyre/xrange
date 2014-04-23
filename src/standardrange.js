/**
 * @fileOverview Range class that will be used as a wrapper for native browser
 * ranges and provides the same interface as the w3c Range class.
 */

var AbstractRange = require('xrange/abstractrange');
var inherits = require('inherits');

/**
 * Custom range class. This provides a similar interface to the w3c Range.
 * @constructor
 * @extends {AbstractRange}
 * @param {Range=} opt_range Optionally pass a range when
 *   constructing the new Range. It defaults to creating a new range.
 */
function StandardRange(opt_range) {
  /**
   * The native browser range object. This will be used heavily behind the
   * scenes for all sorts of range shenanigans.
   * @type {Range}
   * @private
   */
  this._nativeRange = opt_range || this._createNativeRange();

  /**
   * The original string.
   * @type {?string}
   * @private
   */
  this._originalString = null;
}
inherits(StandardRange, AbstractRange);

/**
 * Create a native range instance. If there is a selection, create it based on
 * the selection.
 * @return {Range} The native range instance.
 */
StandardRange.prototype._createNativeRange = function () {
  var sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) {
    return document.createRange();
  }
  return sel.getRangeAt(0);
};

/** @override */
StandardRange.prototype.addToSelection = function () {
    var sel = window.getSelection();
    sel.addRange(this._nativeRange);
};

/**
 * Backup the range string in case it needs to be rebuilt.
 */
StandardRange.prototype.backup = function () {
  this._originalString = this.toHtmlString();
};

/**
 * Clear the native selection.
 */
StandardRange.prototype.clearNativeSelection = function () {
  var sel = window.getSelection();
  sel.empty && sel.empty();
  sel.removeAllRanges && sel.removeAllRanges();
};

/**
 * Delete the contents of the range.
 */
StandardRange.prototype.deleteContents = function () {
  this._nativeRange.deleteContents();
};

/**
 * Returns a text rectangle object that encloses a group of text rectangles.
 * @return {Object}
 */
StandardRange.prototype.getBoundingClientRect = function () {
  return this._nativeRange.getBoundingClientRect();
};

/**
 * Get the end node for this range.
 * @return {Node} The end node of this range.
 */
StandardRange.prototype.getEndNode = function () {
  return this._nativeRange.endContainer;
};

/**
 * Get the end offset for this range. That is, the offset within end node.
 * @return {number} The offset position within the end node.
 */
StandardRange.prototype.getEndOffset = function () {
  return this._nativeRange.endOffset;
};

/**
 * Get the original html string of the range.
 * @type {string}
 */
StandardRange.prototype.getOriginalString = function () {
  return this._originalString;
};

/**
 * Get the parent element of the range.
 * @return {Element} The parent element.
 */
StandardRange.prototype.getParentNode = function () {
  var parentEl = this._nativeRange.commonAncestorContainer;
  if (parentEl.nodeType !== 1) {
    parentEl = parentEl.parentNode;
  }
  return parentEl;
};

/**
 * Get the start node for this range.
 * @return {Node} The start node of this range.
 */
StandardRange.prototype.getStartNode = function () {
  return this._nativeRange.startContainer;
};

/**
 * Get the start offset for this range. That is, the offset within start node.
 * @return {number} The offset position within the start node.
 */
StandardRange.prototype.getStartOffset = function () {
  return this._nativeRange.startOffset;
};

/**
 * Insert the provided element into the range.
 * @param {Element} element The element to insert into the range.
 */
StandardRange.prototype.insertNode = function(element) {
  this._nativeRange.insertNode(element);
};

/**
 * Select the contents of the provided node.
 * @param {Node} node The node to select contents of.
 */
StandardRange.prototype.selectNodeContents = function (node) {
  this._nativeRange.selectNodeContents(node);
};

/**
 * Set the end position of this range.
 * @param {Node} node The node to end the range in.
 * @param {number} index The character index in the node to end the range.
 */
StandardRange.prototype.setEnd = function (node, index) {
  this._nativeRange.setEnd(node, index);
};

/**
 * Set the start of the range.
 * @param {Node} node The node in which to start the range.
 * @param {number} index The position in the node to start the range.
 */
StandardRange.prototype.setStart = function (node, index) {
  this._nativeRange.setStart(node, index);
};

/**
 * Get the html string contents of the range.
 * @return {string} The html string contents of the range.
 */
StandardRange.prototype.toHtmlString = function () {
  var div = document.createElement('div');
  div.appendChild(this._nativeRange.cloneContents());
  return div.innerHTML;
};

/**
 * Get the string contents of the range.
 * @return {string} The string contents of the range.
 */
StandardRange.prototype.toString = function () {
  return this._nativeRange.toString();
};

module.exports = StandardRange;
