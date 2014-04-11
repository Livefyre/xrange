var $ = require('jquery');
var domUtil = require('xrange/util/dom');
var fixtures = require('xrange-tests/fixtures/dom');
var Highlighter = require('xrange/highlighter');
var XRange = require('xrange/xrange');


describe('highlighter', function () {
  var complexDiv, highlighter, htmlDiv, simpleDiv;
  var complexRange, htmlRange, simpleRange;
  var className = 'highlighted';

  beforeEach(function () {
    complexDiv = fixtures.getComplexDOM();
    document.body.appendChild(complexDiv);

    htmlDiv = fixtures.getMediumDOM();
    document.body.appendChild(htmlDiv);

    simpleDiv = fixtures.getSimpleDOM();
    document.body.appendChild(simpleDiv);

    highlighter = new Highlighter({
      className: className
    });
  });

  afterEach(function () {
    document.body.removeChild(complexDiv);
    document.body.removeChild(htmlDiv);
    document.body.removeChild(simpleDiv);
  });

  describe('_highlightNode', function () {
    it('highlights the contents of a node when no index arguments are passed', function () {
      var div = document.createElement('div');
      div.innerHTML = 'abc def ghi';
      highlighter._highlightNode(div.childNodes[0]);
      var result = $('.' + highlighter._className, div).html();
      chai.expect(div.childNodes.length).to.equal(1);
      chai.expect(result).to.equal('abc def ghi');
    });

    it('highlights part of the node if just the start index is passed', function () {
      var div = document.createElement('div');
      div.innerHTML = 'abc def ghi';
      highlighter._highlightNode(div.childNodes[0], 4);
      var result = $('.' + highlighter._className, div).html();
      chai.expect(div.childNodes.length).to.equal(2);
      chai.expect(result).to.equal('def ghi');
    });

    it('highlights a substring when both indexes are passed', function () {
      var div = document.createElement('div');
      div.innerHTML = 'abc def ghi';
      highlighter._highlightNode(div.childNodes[0], 4, 9);
      var result = $('.' + highlighter._className, div).html();
      chai.expect(div.childNodes.length).to.equal(3);
      chai.expect(result).to.equal('def g');
    });
  });

  describe('highlight', function () {
    it('wraps a simple text range', function () {
      simpleRange = new XRange();
      var node = simpleDiv.childNodes[0];
      simpleRange.setStart(node, 2);
      simpleRange.setEnd(node, 9);
      highlighter.highlight(simpleRange);

      var highlights = simpleDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(1);
      chai.expect(highlights[0].innerHTML).to.equal('c def g');
    });

    it('wraps an entire html element', function () {
      htmlRange = new XRange();
      htmlRange.setStart(htmlDiv.childNodes[0], 2);
      htmlRange.setEnd(htmlDiv.childNodes[2], 2);
      highlighter.highlight(htmlRange);

      var highlights = htmlDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(3);
      chai.expect(highlights[0].innerHTML).to.equal('c ');
      chai.expect(highlights[1].innerHTML).to.equal('def');
      chai.expect(highlights[2].innerHTML).to.equal(' g');
    });

    it('wraps from an element to its parents sibling', function () {
      htmlRange = new XRange();
      htmlRange.setStart(htmlDiv.childNodes[1].childNodes[0], 2);
      htmlRange.setEnd(htmlDiv.childNodes[2], 2);
      highlighter.highlight(htmlRange);

      var highlights = htmlDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(2);
      chai.expect(highlights[0].innerHTML).to.equal('f');
      chai.expect(highlights[1].innerHTML).to.equal(' g');
    });

    it('wraps elements even if they are not closed', function () {
      complexRange = new XRange();
      complexRange.setStart(complexDiv.childNodes[0], 2);
      var endNode = domUtil.findNodeInElement(complexDiv, true);
      complexRange.setEnd(endNode, 2);
      highlighter.highlight(complexRange);

      var highlights = complexDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(4);
      chai.expect(highlights[0].innerHTML).to.equal('c');
      chai.expect(highlights[1].innerHTML).to.equal('def');
      chai.expect(highlights[2].innerHTML).to.equal('ghi');
      chai.expect(highlights[3].innerHTML).to.equal('jk');
    });
  });

  describe('unhighlight', function () {
    it('unwraps a simple text range', function () {
      simpleRange = new XRange();
      var node = simpleDiv.childNodes[0];
      simpleRange.setStart(node, 2);
      simpleRange.setEnd(node, 9);
      highlighter.highlight(simpleRange);

      var highlights = simpleDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(1);

      highlighter.unhighlight(simpleRange);
      highlights = simpleDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(0);
    });

    it('unwraps an entire html element', function () {
      htmlRange = new XRange();
      htmlRange.setStart(htmlDiv.childNodes[0], 2);
      htmlRange.setEnd(htmlDiv.childNodes[2], 2);
      highlighter.highlight(htmlRange);

      var highlights = htmlDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(3);

      highlighter.unhighlight(htmlRange);
      highlights = htmlDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(0);
    });

    it('unwraps elements even if they are not closed', function () {
      complexRange = new XRange();
      complexRange.setStart(complexDiv.childNodes[0], 2);
      var endNode = domUtil.findNodeInElement(complexDiv, true);
      complexRange.setEnd(endNode, 2);
      highlighter.highlight(complexRange);

      var highlights = complexDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(4);

      highlighter.unhighlight(complexRange);
      highlights = complexDiv.getElementsByClassName(className);
      chai.expect(highlights.length).to.equal(0);
    });
  });

  it('can highlight, unhighlight, and highight the same range', function () {
    complexRange = new XRange();
    complexRange.setStart(complexDiv.childNodes[0], 2);
    var endNode = domUtil.findNodeInElement(complexDiv, true);
    complexRange.setEnd(endNode, 2);
    highlighter.highlight(complexRange);

    var highlights = complexDiv.getElementsByClassName(className);
    chai.expect(highlights.length).to.equal(4);

    highlighter.unhighlight(complexRange);
    highlights = complexDiv.getElementsByClassName(className);
    chai.expect(highlights.length).to.equal(0);

    highlighter.highlight(complexRange);
    highlights = complexDiv.getElementsByClassName(className);
    chai.expect(highlights.length).to.equal(4);
  });
});
