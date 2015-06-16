var Filter = require('broccoli-filter');
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var StripScan = require('./strip-scan');

function CommentStripper (inputTree, options) {
  if (!(this instanceof CommentStripper)) return new CommentStripper(inputTree, options);

  this.docSections = [];
  Filter.call(this, inputTree, options);
}
CommentStripper.prototype = Object.create(Filter.prototype);
CommentStripper.prototype.constructor = CommentStripper;

CommentStripper._docFragmentsFile = 'doc-fragments.json';
CommentStripper.prototype.extensions = ['css', 'scss'];

CommentStripper.prototype.write = function(readTree, destDir) {
  var _this = this;
  return Filter.prototype.write.apply(this, arguments).then(function() {
    var docFragmentsPath = path.join(destDir, CommentStripper._docFragmentsFile);
    fs.writeFileSync(docFragmentsPath, JSON.stringify(_this.docSections));
  });
}

CommentStripper.prototype.processString = function(string, file) {
  var strippedCss = StripScan(string, /\/\*doc([\s\S]*?)\*\//);

  if(strippedCss.length !== 0) {
    this.docSections = this.docSections.concat(strippedCss);
  }

  return strippedCss.stripped;
}

module.exports = CommentStripper;
