var FashionConsultant = require('./index');
var Funnel = require('broccoli-funnel');

module.exports = new FashionConsultant({
  inputPaths: Funnel('example'),
}).rebuild();
