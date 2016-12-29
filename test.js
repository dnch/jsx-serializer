var expect = require('expect.js'),
    defaultOpts = require('cheerio').prototype.options,
    _ = require('lodash'),
    parse = require('cheerio/lib/parse'),
    render = require('./index.js');

var jsx = function(preset, str, options) {
  options = _.defaults(options || {}, _.defaults(preset, defaultOpts));
  var dom = parse(str, options);
  return render(dom);
};

describe('render', function() {
  // run jsx with default options
  describe('(jsx, {})', _.partial( testBody, _.partial(jsx, {}) ));
});


function testBody(jsx) {
  it('should handle double quotes within single quoted attributes properly', function() {
    var str = '<hr class=\'an "edge" case\' />';
    expect(jsx(str)).to.equal('<hr class="an &quot;edge&quot; case" />');
  });

  it('should append ="" to all attributes with no value', function() {
    var str = '<div dropdown-toggle>';
    expect(jsx(str)).to.equal('<div dropdownToggle="" />');
  });

  it('should render <br /> tags correctly', function() {
    var str = '<br />';
    expect(jsx(str)).to.equal('<br />');
  });

  it('should retain encoded jsx content within attributes', function() {
    var str = '<hr class="cheerio &amp; node = happy parsing" />';
    expect(jsx(str)).to.equal('<hr class="cheerio &amp; node = happy parsing" />');
  });

  it('should not shorten the "name" attribute when it contains the value "name"', function() {
    var str = '<input name="name"/>';
    expect(jsx(str)).to.equal('<input name="name" />');
  });

  it('should append ="" to attributes with no value', function() {
    var str = '<div dropdown-toggle></div>';
    expect(jsx(str)).to.equal('<div dropdownToggle="" />');
  });

  it('nukes comments', function() {
    var str = '<!-- comment -->';
    expect(jsx(str)).to.equal('');
  });

  it('should render whitespace by default', function() {
    var str = '<a href="./haha.jsx">hi</a> <a href="./blah.jsx">blah</a>';
    expect(jsx(str)).to.equal(str);
  });

  it('should re-case all hyphens', function() {
    var str = '<div data-foo-bar-baz="value"></div>';
    expect(jsx(str)).to.equal('<div dataFooBarBaz="value" />');
  });

  it('should render SVG nodes with a closing slash in jsx mode', function() {
    var str = '<svg><circle x="12" y="12" /><path d="123M" /><polygon points="60,20 100,40 100,80 60,100 20,80 20,40" /></svg>';
    expect(jsx(str)).to.equal(str);
  });
}
