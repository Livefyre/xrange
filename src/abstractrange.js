/**
 * @fileOverview Abstract range class.
 */

var abstractMethod = require('xrange/util').abstractMethod;

/**
 * Abstract range class.
 */
function AbstractRange() {}

/**
 * Create a native range instance. If there is a selection, create it based on
 * the selection.
 * @return {TextRange} The native range instance.
 */
AbstractRange.prototype._createNativeRange = abstractMethod;

/**
 * Backup the range string in case it needs to be rebuilt.
 */
AbstractRange.prototype.backup = abstractMethod;

/**
 * Clear the native selection.
 */
AbstractRange.prototype.clearNativeSelection = abstractMethod;

/**
 * Delete the contents of the range.
 */
AbstractRange.prototype.deleteContents = abstractMethod;

/**
 * Returns a text rectangle object that encloses a group of text rectangles.
 * @return {Object}
 */
AbstractRange.prototype.getBoundingClientRect = abstractMethod;

/**
 * Get the end node for this range.
 * @return {Node} The end node of this range.
 */
AbstractRange.prototype.getEndNode = abstractMethod;

/**
 * Get the end offset for this range. That is, the offset within end node.
 * @return {number} The offset position within the end node.
 */
AbstractRange.prototype.getEndOffset = abstractMethod;

/**
 * Get the original html string of the range.
 * @type {string}
 */
AbstractRange.prototype.getOriginalString = abstractMethod;

/**
 * Get the parent element of the range.
 * @return {Element} The parent element.
 */
AbstractRange.prototype.getparentNode = abstractMethod;

/**
 * Get the start node for this range.
 * @return {Node} The start node of this range.
 */
AbstractRange.prototype.getStartNode = abstractMethod;

/**
 * Get the start offset for this range. That is, the offset within start node.
 * @return {number} The offset position within the start node.
 */
AbstractRange.prototype.getStartOffset = abstractMethod;

/**
 * Insert the provided element into the range.
 * @param {Element} element The element to insert into the range.
 */
AbstractRange.prototype.insertNode = abstractMethod;

/**
 * Select the contents of the provided node.
 * @param {Node} node The node to select contents of.
 */
AbstractRange.prototype.selectNodeContents = abstractMethod;

/**
 * Set the end position of this range.
 * @param {Node} node The node to end the range in.
 * @param {number} index The character index in the node to end the range.
 */
AbstractRange.prototype.setEnd = abstractMethod;

/**
 * Set the start of the range.
 * @param {Node} node The node in which to start the range.
 * @param {number} index The position in the node to start the range.
 */
AbstractRange.prototype.setStart = abstractMethod;

/**
 * Get the html string contents of the range.
 * @return {string} The html string contents of the range.
 */
AbstractRange.prototype.toHtmlString = abstractMethod;

/**
 * Get the string contents of the range.
 * @return {string} The string contents of the range.
 */
AbstractRange.prototype.toString = abstractMethod;

module.exports = AbstractRange;
