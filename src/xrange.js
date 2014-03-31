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
 * Set the start of the range.
 * @param {Node} node The node in which to start the range.
 * @param {number} index The position in the node to start the range.
 */
XRange.prototype.setStart = function (node, index) {

};

XRange.prototype.toHtmlString = function () {
  var div = document.createElement('div');
  div.appendChild(this._nativeRange.cloneContents());
  return div.innerHTML;
};

XRange.prototype.toString = function () {
  return this._nativeRange.toString();
};

module.exports = XRange;
