var AbstractRange = require('xrange/abstractrange');
var fixtures = require('xrange-tests/fixtures/dom');
var XRange = require('xrange/xrange');


describe('range', function () {
  var complexDiv, htmlDiv, simpleDiv;

  before(function () {
    complexDiv = fixtures.getComplexDOM();
    document.body.appendChild(complexDiv);

    htmlDiv = fixtures.getMediumDOM();
    document.body.appendChild(htmlDiv);

    simpleDiv = fixtures.getSimpleDOM();
    document.body.appendChild(simpleDiv);
  });

  after(function () {
    document.body.removeChild(complexDiv);
    document.body.removeChild(htmlDiv);
    document.body.removeChild(simpleDiv);
  });

  describe('constructor', function () {
    it('creates a native range by default', function () {
      var range = new XRange();
      chai.expect(range._nativeRange).to.be.an.instanceof(Range);
    });

    it('creates a range based on the current selection if there is one', function () {
      var sel = window.getSelection();
      var oRange = document.createRange();
      oRange.setStart(htmlDiv.childNodes[0], 2);
      oRange.setEnd(htmlDiv.childNodes[2], 2);
      sel.addRange(oRange);

      var range = new XRange();
      chai.expect(range._nativeRange).to.be.an.instanceof(Range);
      chai.expect(range.toString()).to.equal('c def g');
      chai.expect(range.toHtmlString()).to.equal('c <a href="http://google.com">def</a> g');
    });

    it('allows a user to specify their own Range', function () {
      var textNode = htmlDiv.children[0].childNodes[0];
      var nRange = document.createRange();
      nRange.setStart(textNode, 1);
      nRange.setEnd(textNode, 2);
      var range = new XRange(nRange);
      chai.expect(range._nativeRange).to.equal(nRange);
      chai.expect(range.toString()).to.equal('e');
    });
  });

  describe('getRangeByString', function () {
    it('returns null if no range was found', function () {
      var rangeStr = 'cg';
      var range = XRange.getRangeByString(rangeStr, htmlDiv);
      chai.expect(range).to.be.null;
    });

    it('builds simple ranges', function () {
      var rangeStr = 'c def g';
      var range = XRange.getRangeByString(rangeStr, simpleDiv);
      chai.expect(range).to.be.an.instanceof(AbstractRange);
      chai.expect(range.toString()).to.equal(rangeStr);
      chai.expect(range.toHtmlString()).to.equal(rangeStr);
    });

    it('builds html ranges', function () {
      var rangeStr = 'c <a href="http://google.com">def</a> g';
      var range = XRange.getRangeByString(rangeStr, htmlDiv);
      chai.expect(range).to.be.an.instanceof(AbstractRange);
      chai.expect(range.toString()).to.equal('c def g');
      chai.expect(range.toHtmlString()).to.equal(rangeStr);
    });

    it('builds complex ranges', function () {
      var rangeStr = 'c<span>def</span><span>ghi<span>j</span></span>';
      var range = XRange.getRangeByString(rangeStr, complexDiv);
      chai.expect(range).to.be.an.instanceof(AbstractRange);
      chai.expect(range.toString()).to.equal('cdefghij');
      chai.expect(range.toHtmlString()).to.equal(rangeStr);
    });

    it('works for root elements that only contain text nodes and BR elements', function () {
      var rangeStr = 'You can have it all but life keeps moving';
      var div = document.createElement('div');
      div.appendChild(document.createTextNode('I’ve had the highest mountains'));
      div.appendChild(document.createElement('br'));
      div.appendChild(document.createTextNode('I’ve had the deepest rivers'));
      div.appendChild(document.createElement('br'));
      div.appendChild(document.createTextNode('You can have it all but life keeps moving'));
      div.appendChild(document.createElement('br'));
      div.appendChild(document.createTextNode('Take it in but don’t look down'));

      var range = XRange.getRangeByString(rangeStr, div);
      chai.expect(range).to.be.an.instanceof(AbstractRange);
      chai.expect(range.toString()).to.equal('You can have it all but life keeps moving');
      chai.expect(range.toHtmlString()).to.equal('You can have it all but life keeps moving');
    });
  });

  describe('addToSelection', function () {
    it('adds the range to the native window selection', function () {
        var rangeStr = 'c def g';
        var range = XRange.getRangeByString(rangeStr, simpleDiv);
        range.addToSelection();
        var windowRange = new XRange();
        chai.expect(range.toString()).to.equal(windowRange.toString());
    });
  });
});
