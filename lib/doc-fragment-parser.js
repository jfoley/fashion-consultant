var CoreObject = require('core-object');
var StripScan = require('./strip-scan');

var DocFragmentParser = CoreObject.extend({
  init: function(cssString) {
    this._super();
    this._cssString = cssString;
    this._docFragments = [];
  },

  parse: function() {
    var strippedCss = StripScan(this._cssString, /\/\*doc([\s\S]*?)\*\//);
    this._strippedCss = strippedCss.stripped.trim();

    if(strippedCss.length !== 0) {
      this._docFragments = this._docFragments.concat(strippedCss);
    }
  },

  docFragments: function() {
    return this._docFragments;
  },

  strippedCss: function() {
    return this._strippedCss;
  }
});

module.exports = DocFragmentParser;
