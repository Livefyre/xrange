var XRange = require('xrange/xrange');


describe('range', function () {
  describe('constructor', function () {
    var div, span;

    before(function () {
      div = document.createElement('div');
      span = document.createElement('span');
      span.innerHTML = 'def';
      div.appendChild(document.createTextNode('abc'));
      div.appendChild(span);
      div.appendChild(document.createTextNode('ghi'));
      document.body.appendChild(div);
    });

    after(function () {
      document.body.removeChild(div);
    });

    it('creates a native range by default', function () {
      var range = new XRange();
      chai.expect(range._nativeRange).to.be.an.instanceof(Range);
    });

    it('creates a range based on the current selection if there is one', function () {
      var sel = window.getSelection();
      var oRange = document.createRange();
      oRange.setStart(div.childNodes[0], 2);
      oRange.setEnd(div.childNodes[2], 1);
      sel.addRange(oRange);

      var range = new XRange();
      chai.expect(range._nativeRange).to.be.an.instanceof(Range);
      chai.expect(range.toString()).to.equal('cdefg');
      chai.expect(range.toHtmlString()).to.equal('c<span>def</span>g');
    });

    it('allows a user to specify their own Range', function () {
      var textNode = span.childNodes[0];
      var nRange = document.createRange();
      nRange.setStart(textNode, 1);
      nRange.setEnd(textNode, 2);
      var range = new XRange(nRange);
      chai.expect(range._nativeRange).to.equal(nRange);
      chai.expect(range.toString()).to.equal('e');
    });
  });
});
