/**
 * @fileOverview Range class that will be used as a wrapper for native browser
 * ranges and provides the same interface as the w3c Range class.
 */

var AbstractRange = require('xrange/abstractrange');
var inherits = require('inherits');

/**
 * Custom range class. This provides a similar interface to the w3c Range, but
 * it provides that functionality to older versions of IE.
 * @constructor
 * @extends {AbstractRange}
 * @param {TextRange=} opt_range Optionally pass a range when
 *   constructing the new Range. It defaults to creating a new range.
 */
function IERange(opt_range) {
  /**
   * The native browser range object. This will be used heavily behind the
   * scenes for all sorts of range shenanigans.
   * @type {TextRange}
   * @private
   */
  this._nativeRange = opt_range || this._createNativeRange();

  /**
   * The original string.
   * @type {?string}
   * @private
   */
  this._originalString = null;

  this._endNode = null;

  this._endOffset = 0;

  this._startNode = null;

  this._startOffset = 0;
}
inherits(IERange, AbstractRange);

/**
 * Create a native range instance. If there is a selection, create it based on
 * the selection.
 * @return {TextRange} The native range instance.
 */
IERange.prototype._createNativeRange = function () {
  return document.selection.createRange();
};

/** @override */
IERange.prototype.addToWindow = function () {

};

/**
 * Backup the range string in case it needs to be rebuilt.
 */
IERange.prototype.backup = function () {
  this._originalString = this.toHtmlString();
};

/**
 * Clear the native selection.
 */
IERange.prototype.clearNativeSelection = function () {

};

/**
 * Delete the contents of the range.
 */
IERange.prototype.deleteContents = function () {

};

/**
 * Returns a text rectangle object that encloses a group of text rectangles.
 * @return {Object}
 */
IERange.prototype.getBoundingClientRect = function () {
  // TODO: Does a TextRange support this?
};

/**
 * Get the end node for this range.
 * @return {Node} The end node of this range.
 */
IERange.prototype.getEndNode = function () {
  return this._endNode;
};

/**
 * Get the end offset for this range. That is, the offset within end node.
 * @return {number} The offset position within the end node.
 */
IERange.prototype.getEndOffset = function () {
  return this._endOffset;
};

/**
 * Get the original html string of the range.
 * @type {string}
 */
IERange.prototype.getOriginalString = function () {
  return this._originalString;
};

/**
 * Get the parent element of the range.
 * @return {Element} The parent element.
 */
IERange.prototype.getParentNode = function () {
  return this._nativeRange.parentElement();
};

/**
 * Get the start node for this range.
 * @return {Node} The start node of this range.
 */
IERange.prototype.getStartNode = function () {
  return this._startNode;
};

/**
 * Get the start offset for this range. That is, the offset within start node.
 * @return {number} The offset position within the start node.
 */
IERange.prototype.getStartOffset = function () {
  return this._startOffset;
};

/**
 * Insert the provided element into the range.
 * @param {Element} element The element to insert into the range.
 */
IERange.prototype.insertNode = function(element) {

};

/**
 * Select the contents of the provided node.
 * @param {Node} node The node to select contents of.
 */
IERange.prototype.selectNodeContents = function (node) {

};

/**
 * Set the end position of this range.
 * @param {Node} node The node to end the range in.
 * @param {number} index The character index in the node to end the range.
 */
IERange.prototype.setEnd = function (node, index) {
  this._endNode = node;
  this._endOffset = index;
};

/**
 * Set the start of the range.
 * @param {Node} node The node in which to start the range.
 * @param {number} index The position in the node to start the range.
 */
IERange.prototype.setStart = function (node, index) {
  this._startNode = node;
  this._startOffset = index;
};

/**
 * Get the html string contents of the range.
 * @return {string} The html string contents of the range.
 */
IERange.prototype.toHtmlString = function () {

};

/**
 * Get the string contents of the range.
 * @return {string} The string contents of the range.
 */
IERange.prototype.toString = function () {

};

module.exports = IERange;
