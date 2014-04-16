var domUtil = require('xrange/util/dom');
var fixtures = require('xrange-tests/fixtures/dom');
var sinon = require('sinon');


describe('dom', function () {
  var complexDiv, emptyElementDiv, htmlDiv, simpleDiv;

  before(function () {
    complexDiv = fixtures.getComplexDOM();
    document.body.appendChild(complexDiv);

    emptyElementDiv = document.createElement('div');
    emptyElementDiv.appendChild(document.createTextNode('abc def'));
    emptyElementDiv.appendChild(document.createElement('br'));
    emptyElementDiv.appendChild(document.createTextNode('ghi jkl'));
    document.body.appendChild(emptyElementDiv);

    htmlDiv = fixtures.getMediumDOM();
    document.body.appendChild(htmlDiv);

    simpleDiv = fixtures.getSimpleDOM();
    document.body.appendChild(simpleDiv);
  });

  after(function () {
    document.body.removeChild(complexDiv);
    document.body.removeChild(emptyElementDiv);
    document.body.removeChild(htmlDiv);
    document.body.removeChild(simpleDiv);
  });

  describe('findNodeInElement', function () {
    it('finds the only node in a simple div', function () {
      var node = domUtil.findNodeInElement(simpleDiv);
      chai.expect(node).to.be.an.instanceof(Node);
      chai.expect(node.nodeValue).to.equal('abc def ghi');
    });

    it('finds the first node in a complex div', function () {
      var node = domUtil.findNodeInElement(complexDiv);
      chai.expect(node).to.be.an.instanceof(Node);
      chai.expect(node.nodeValue).to.equal('abc');
    });

    it('finds the last node in a complex div', function () {
      var node = domUtil.findNodeInElement(complexDiv, true);
      chai.expect(node).to.be.an.instanceof(Node);
      chai.expect(node.nodeValue).to.equal('jkl');
    });
  });

  describe('forEachNode', function () {
    it('does not fire callback for empty nodes', function () {
      var callback = sinon.stub();
      domUtil.forEachNode(document.createElement('div'), callback);
      chai.assert(!callback.called);
    });

    it('fires the callback once for simple elements', function () {
      var callback = sinon.stub();
      domUtil.forEachNode(simpleDiv, callback);
      chai.assert(callback.calledOnce);
    });

    it('fires the callback multiple times for complex elements', function () {
      var callback = sinon.stub();
      domUtil.forEachNode(complexDiv, callback);
      chai.expect(callback.callCount).to.equal(4);
    });

    it('fires the callback once if callback returns true', function () {
      var callback = sinon.stub();
      callback.returns(true);
      domUtil.forEachNode(complexDiv, callback);
      chai.assert(callback.calledOnce);
    });

    it('does not fire the callback for empty elements', function () {
      var callback = sinon.stub();
      domUtil.forEachNode(emptyElementDiv, callback);
      chai.expect(callback.callCount).to.equal(2);
    });
  });

  describe('forEachNodeReverse', function () {
    it('does not fire callback for empty nodes', function () {
      var callback = sinon.stub();
      domUtil.forEachNodeReverse(document.createElement('div'), callback);
      chai.assert(!callback.called);
    });

    it('fires the callback once for simple elements', function () {
      var callback = sinon.stub();
      domUtil.forEachNodeReverse(simpleDiv, callback);
      chai.assert(callback.calledOnce);
    });

    it('fires the callback multiple times for complex elements', function () {
      var callback = sinon.stub();
      domUtil.forEachNodeReverse(complexDiv, callback);
      chai.expect(callback.callCount).to.equal(4);
      var lastNode = complexDiv.children[1].children[0].childNodes[0];
      chai.assert(callback.getCall(0).calledWith(lastNode));
    });

    it('fires the callback once if callback returns true', function () {
      var callback = sinon.stub();
      callback.returns(true);
      domUtil.forEachNodeReverse(complexDiv, callback);
      chai.assert(callback.calledOnce);
    });

    it('does not fire the callback for empty elements', function () {
      var callback = sinon.stub();
      domUtil.forEachNodeReverse(emptyElementDiv, callback);
      chai.expect(callback.callCount).to.equal(2);
    });
  });

  describe('forEachSibling', function () {
    it('does not fire callback when no siblings', function () {
      var callback = sinon.stub();
      domUtil.forEachSibling(simpleDiv, callback);
      chai.assert(!callback.called);
    });

    it('fires the callback for all siblings', function () {
      var callback = sinon.stub();
      var div = document.createElement('div');
      div.appendChild(document.createTextNode('abc'));
      div.appendChild(document.createTextNode('def'));
      domUtil.forEachSibling(div.childNodes[0], callback);
      chai.assert(callback.calledOnce);
    });

    it('goes into elements and fires callback for each node', function () {
      var callback = sinon.stub();
      domUtil.forEachSibling(htmlDiv.childNodes[0], callback);
      chai.expect(callback.callCount).to.equal(2);
    });

    it('does not fire the callback for empty elements', function () {
      var callback = sinon.stub();
      domUtil.forEachSibling(emptyElementDiv.childNodes[0], callback);
      chai.expect(callback.callCount).to.equal(1);
    });
  });

  describe('normalize', function () {
    var text1 = 'this is block 1.';
    var text2 = 'this is block 2.';
    var text3 = 'this is block 3.';
    var text4 = 'this is block 4.';
    var text5 = 'this is block 5.';
    var text6 = 'this is block 6.';

    it('normalizes subsequent text nodes into individual nodes', function () {
      var elem = document.createElement('div');
      elem.appendChild(document.createTextNode(text1));
      elem.appendChild(document.createTextNode(text2));
      elem.appendChild(document.createTextNode(text3));
      elem.appendChild(document.createElement('span'));
      elem.appendChild(document.createTextNode(text4));
      elem.appendChild(document.createTextNode(text5));
      elem.appendChild(document.createElement('span'));
      elem.appendChild(document.createTextNode(text6));

      var spy = sinon.spy(elem, 'normalize');
      chai.expect(elem.childNodes.length).to.equal(8);
      domUtil.normalize(elem);
      chai.assert(!spy.called, 'normalize is not supposed to be called');
      chai.expect(elem.childNodes.length).to.equal(5);
      var children = elem.childNodes;
      chai.expect(children[0].textContent).to.equal(text1 + text2 + text3);
      chai.expect(children[1].tagName).to.equal('SPAN');
      chai.expect(children[2].textContent).to.equal(text4 + text5);
      chai.expect(children[3].tagName).to.equal('SPAN');
      chai.expect(children[4].textContent).to.equal(text6);
      spy.restore();
    });

    it('recursively normalizes text nodes', function () {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(text1));
      var anchor = document.createElement('a');
      anchor.appendChild(document.createTextNode(text2));
      anchor.appendChild(document.createTextNode(text3));
      anchor.appendChild(document.createTextNode(text4));
      div.appendChild(anchor);
      div.appendChild(document.createTextNode(text5));
      div.appendChild(document.createTextNode(text6));

      domUtil.normalize(div);
      chai.expect(div.childNodes.length).to.equal(3);
      chai.expect(anchor.childNodes.length).to.equal(1);
      chai.expect(anchor.childNodes[0].textContent).to.equal(text2 + text3 + text4);
      chai.expect(div.childNodes[2].textContent).to.equal(text5 + text6);
    });
  });
});
