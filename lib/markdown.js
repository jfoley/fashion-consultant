var Filter = require('broccoli-filter');
var marked = require('marked');
var glob = require('glob');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var Writer = require('broccoli-caching-writer');
var yaml = require('js-yaml');
var highlight = require('highlight.js');
var StripScan = require('./strip-scan');


function Markdown (inputTree, options) {
  if (!(this instanceof Markdown)) return new Markdown(inputTree, options);

  options.enforceSingleInputTree = true;
  this.options = options;

  Writer.call(this, inputTree, options);
}

Markdown.prototype = Object.create(Writer.prototype);
Markdown.prototype.constructor = Markdown;

Markdown._outputPath = 'markdown.json';

Markdown.prototype.updateCache = function(srcDir, destDir) {
  var docFragmentsPath = path.join(srcDir, this.options.docFragmentsPath);
  var docFragments = fs.readFileSync(docFragmentsPath, 'utf8');

  docFragments = JSON.parse(docFragments);

  docFragments = docFragments.map(function(fragment) {
    return processFrontMatter(fragment);
  });

  docFragments = docFragments.map(function(fragment) {
    return renderMarkdown(fragment);
  });

  docFragments = categorizeFragements(docFragments);

  var markdownOutputFile = path.join(destDir, Markdown._outputPath);
  fs.writeFileSync(markdownOutputFile, JSON.stringify(docFragments));
}

function processFrontMatter(string) {
  var frontMatter = StripScan(string, /[\s\S]*(-{3}[\s\S]*?)-{3}[\s]*/);
  var metadata = yaml.safeLoad(frontMatter);

  return {metadata: metadata, raw: frontMatter.stripped};
}

function categorizeFragements(fragments) {
  var markdowns = {};

  fragments.forEach(function(md) {
    var category = markdowns[md.metadata.category];
    if(category === undefined) {
      markdowns[md.metadata.category] = category = [];
    }

    category.push(md);
  });

  return markdowns;
}

function renderMarkdown(markdownObject) {
  var renderer = new marked.Renderer();

  var oldCodeRenderer = renderer.code;

  renderer.code = function(code, lang, escaped) {

    markdownObject.example = code;

    var rendered = oldCodeRenderer.call(this, code, lang, true);

    return rendered;
  }

  markdownObject.rendered = marked(markdownObject.raw, {
    renderer: renderer,
    langPrefix: 'hljs ',

    highlight: function (code) {
      return highlight.highlight('html', code).value;
    }
  });

  return markdownObject;
}

module.exports = Markdown;
