var Filter = require('broccoli-filter');
var fs = require('fs');
var path = require('path');
var DocFragmentParser = require('./doc-fragment-parser');

function Plugin (inputTree, options) {
  if (!(this instanceof Plugin)) return new Plugin(inputTree, options);

  Filter.call(this, inputTree, options);
}
Plugin.prototype = Object.create(Filter.prototype);
Plugin.prototype.constructor = Plugin;

Plugin._docFragmentsFile = 'doc-fragments.json';
Plugin.prototype.extensions = ['css', 'scss'];

Plugin.prototype.write = function(readTree, destDir) {
  var _this = this;
  return Filter.prototype.write.apply(this, arguments).then(function() {
    var docFragmentsPath = path.join(destDir, Plugin._docFragmentsFile);
    fs.writeFileSync(docFragmentsPath, JSON.stringify(_this.docFragments));
  });
}

Plugin.prototype.processString = function(string, file) {
  var parser = new DocFragmentParser(string);
  parser.parse();
  this.docFragments = parser.docFragments();

  return parser.strippedCss();
}

module.exports = Plugin;
