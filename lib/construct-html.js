var Filter = require('broccoli-filter');
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var Writer = require('broccoli-caching-writer');
var glob = require('glob');

function HtmlBuilder (inputTree, options) {
  if (!(this instanceof HtmlBuilder)) return new HtmlBuilder(inputTree, options);

  if(options.htmlTemplatePath === undefined) {
    options.htmlTemplatePath = 'index.hbs';
  }

  if(options.categoryTemplatePath === undefined) {
    options.categoryTemplatePath = 'category.hbs';
  }

  if(options.renderSingleFile === undefined) {
    options.renderSingleFile = true;
  }

  options.enforceSingleInputTree = true;

  Writer.call(this, inputTree, options);

  this.options = options;
}

HtmlBuilder.prototype = Object.create(Writer.prototype);
HtmlBuilder.prototype.constructor = HtmlBuilder;

HtmlBuilder.outputPath = 'index.html';

HtmlBuilder.prototype.updateCache = function(includePath, destDir) {
  this.loadTemplates(includePath);

  var cssFiles = glob.sync(path.join(includePath, '**/*.css'));

  cssFiles = cssFiles.map(function(p) {
    return p.slice(includePath.length + 1);
  });

  var markdownPath = path.join(includePath, this.options.markdownPath);
  var markdown = JSON.parse(fs.readFileSync(markdownPath, 'utf8'));
  // console.log(markdown);

  var _this = this;
  var renderedCategories = Object.keys(markdown).map(function(cat) {
    var category = markdown[cat];

    return _this.categoryTemplate({fragments: category});
  });

  if(this.options.renderSingleFile) {
    var categoryMeta = Object.keys(markdown).map(function(cat, i) {
      var rendered = renderedCategories[i];

      return {rendered: rendered, name: cat};
    });

    var rendered = this.template({
      categories: categoryMeta,
      cssFiles: cssFiles,
    });

    fs.writeFileSync(path.join(destDir, HtmlBuilder.outputPath), rendered);
  } else {
    throw('multi category rendering not yet implemented');
  }
}

HtmlBuilder.prototype.loadTemplates = function(includePath) {
  if(this.template === undefined) {
    var htmlTemplatePath = path.join(includePath, this.options.htmlTemplatePath);
    var htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    this.template = Handlebars.compile(htmlTemplate);
  }

  if(this.categoryTemplate === undefined) {
    var categoryTemplatePath = path.join(includePath, this.options.categoryTemplatePath);
    var categoryTemplate = fs.readFileSync(categoryTemplatePath, 'utf8');
    this.categoryTemplate = Handlebars.compile(categoryTemplate);
  }
}

module.exports = HtmlBuilder;
