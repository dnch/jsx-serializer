/*
  Module dependencies
*/
var ElementType = require('domelementtype');
var entities = require('entities');
var _ = require('lodash');

/*
  Format attributes
*/
function formatAttrs(attributes, opts) {
  if (!attributes) return;

  var output = '',
      value;

  // Loop through the attributes
  for (var key in attributes) {
    value = attributes[key];
    if (output) {
      output += ' ';
    }

    output += _.camelCase(key);
    output += '="' + entities.encodeXML(value) + '"';

  }

  return output;
}

var render = module.exports = function(dom, opts) {
  if (!Array.isArray(dom) && !dom.cheerio) dom = [dom];
  opts = opts || {};

  var output = '';

  for(var i = 0; i < dom.length; i++){
    var elem = dom[i];

    if (elem.type === 'root')
      output += render(elem.children, opts);
    else if (ElementType.isTag(elem))
      output += renderTag(elem, opts);
    else if (elem.type === ElementType.Directive)
      output += "";
    else if (elem.type === ElementType.Comment)
      output += "";
    else if (elem.type === ElementType.CDATA)
      output += "";
    else
      output += renderText(elem, opts);
  }

  return output;
};

function renderTag(elem, opts) {
  var tag = '<' + elem.name,
      attribs = formatAttrs(elem.attribs, opts);

  if (attribs) {
    tag += ' ' + attribs;
  }

  if (!elem.children || elem.children.length === 0) {
    tag += ' />';
  } else {
    tag += '>';
    tag += render(elem.children, opts);
    tag += '</' + elem.name + '>';
  }

  return tag;
}

function renderText(elem, opts) {
  var data = elem.data || '';

  // if entities weren't decoded, no need to encode them back
  if (!elem.parent) {
    data = entities.encodeXML(data);
  }

  return data;
}
