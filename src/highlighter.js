/**
 * @fileOverview Highlighter class. This will highlight or unhighlight an XRange
 * instance with html.
 */

var domUtil = require('./util/dom');
var XRange = require('./xrange');

/**
 * Highlighter class.
 * @constructor
 * @param {Object} opts Config options.
 */
function Highlighter(opts) {
  /**
   * The class name that should be on the highlighted element.
   * @type {string}
   * @private
   */
  this._className = opts.className;
}

/**
 * Highlight the contents of a node. If the start or end indexes are provided,
 * use them when highlighting. Otherwise, highlight the whole node.
 * @param {Node} node The node to highlight.
 * @param {number=} opt_startIdx Optional start index for the highlight.
 * @param {number=} opt_endIdx Optional end index for the highlight.
 * @private
 */
Highlighter.prototype._highlightNode = function (node, opt_startIdx, opt_endIdx) {
  var content = node.nodeValue;
  var startIdx = opt_startIdx || 0;
  var endIdx = opt_endIdx || content.length;
  var frag = document.createDocumentFragment();
  // If the start node is greater than 0, add a new text node for the beginning
  // of the content.
  if (startIdx > 0) {
    frag.appendChild(document.createTextNode(content.substring(0, startIdx)));
  }
  // Wrap the content in a span with a class name.
  var wrap = document.createElement('span');
  wrap.className = this._className;
  wrap.innerHTML = content.substring(startIdx, endIdx);
  frag.appendChild(wrap);
  // If the end index is less than the length of the contents, add a new text
  // node for the remainder of the content.
  if (endIdx < content.length) {
    frag.appendChild(document.createTextNode(content.substring(endIdx)));
  }
  node.parentNode.replaceChild(frag, node);
  return wrap;
};

/**
 * Highlight the contents of a range. This will loop over all children of the
 * range and wrap them in elements.
 * @param {XRange} xRange The XRange object to wrap.
 */
Highlighter.prototype.highlight = function (xRange) {
  xRange.backup();
  var endNode = xRange.getEndNode();
  var endOffset = xRange.getEndOffset();
  var startNode = xRange.getStartNode();
  var startOffset = xRange.getStartOffset();

  // If start and end are same nodes, do it quickly...
  if (startNode === endNode) {
    this._highlightNode(startNode, startOffset, endOffset);
    return;
  }

  var commonAncestor = xRange.getParentNode();
  var hasReachedEnd = false;
  var self = this;

  /**
   * Highlight all of the text nodes within siblings of the currentNode arg
   * until the end node is reached. If the end node has not been reached by the
   * time all siblings have been visited, go up a level and look at the siblings
   * there.
   * @param {Element|Node} currentNode The node to look through it's siblings.
   */
  function highlightSiblings(currentNode) {
    // Loop through all of the siblings and highlight all nodes up to and
    // including the end node.
    domUtil.forEachSibling(currentNode, function (node) {
      if (node === endNode) {
        node = self._highlightNode(node, 0, endOffset);
        hasReachedEnd = true;
        return true;
      }
      node = self._highlightNode(node);
    });

    // If the end node has not been reached yet but all siblings have been
    // visited, go up a level and check the siblings there.
    if (!hasReachedEnd && currentNode.parentNode !== commonAncestor) {
      highlightSiblings(currentNode.parentNode);
    }
  }

  // Highlight the start node
  var currentNode = this._highlightNode(startNode, startOffset);
  // Start the potentially recursive process of highlighting siblings
  highlightSiblings(currentNode);
  // Need to clear the range after everything is highlighted so that it doesn't
  // look weird.
  xRange.clearNativeSelection();
};

/**
 * Unhighlight the contents of a range. This removes the elements that were
 * added in the highlight function.
 * @param {XRange} xRange The XRange object to unwrap.
 */
Highlighter.prototype.unhighlight = function (xRange) {
  var parent;
  var rootEl = xRange.getParentNode();
  var self = this;
  // Loop over all of the highlighted elements and replace them with their
  // text node children.
  domUtil.forEachNode(rootEl, function (node) {
    parent = node.parentNode;
    if (parent.className.indexOf(self._className) > -1) {
      parent.parentNode.replaceChild(node, parent);
    }
  });
  // Once the highlight elements have been removed, the text nodes will be all
  // broken, so they need to be cleaned up.
  domUtil.normalize(rootEl);
  // Since there has been so much DOM destruction with the (un)highlighting,
  // the range will need to be created again. By passing it in as the 3rd
  // argument, it will be modified instead of creating a new one.
  XRange.getRangeByString(xRange.getOriginalString(), rootEl, xRange);
};

module.exports = Highlighter;
