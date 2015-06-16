var coreObject = require('core-object');
var readCompatAPI = require('broccoli-read-compat');

var MergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var CommentStripper = require('./lib/comment-stripper');
var Markdown = require('./lib/markdown');
var HtmlBuilder = require('./lib/construct-html');

var FashionConsultant = coreObject.extend({
  init: function(options) {
    this.inputTree = options.inputPaths;

    if(options.docAssetsPath === undefined) {
      options.docAssetsPath = 'doc-assets';
    }

    if(options.srcCss === undefined) {
      options.srcCss = Funnel('app/assets/styles', {
        include: ['**/*.css']
      });
    }

    if(options.outputPath === undefined) {
      options.outputPath = 'styleguide';
    }

    this.options = options;
  },

  rebuild: function() {
    var cssStripper = CommentStripper(this.inputTree);

    var docFragments = Funnel(cssStripper, {
      include: [CommentStripper._docFragmentsFile]
    });

    var strippedCss = Funnel(cssStripper, {
      exclude: [CommentStripper._docFragmentsFile]
    })

    var markdown = Markdown(docFragments, {
      docFragmentsPath: CommentStripper._docFragmentsFile,
    });

    var markdownOutputFile = Funnel(markdown, {
      include: [Markdown._outputPath]
    });

    var docAssets = Funnel(this.options.docAssetsPath);

    var docCss = Funnel(docAssets, {
      include: ['**/*.css'],
    });

    var html = HtmlBuilder(MergeTrees([markdownOutputFile, docAssets]), {
      markdownPath: Markdown._outputPath,
      singleFile: true,
    });

    var styleguide = Funnel(MergeTrees([strippedCss, html, docCss]), {
      destDir: this.options.outputPath
    });

    var output = MergeTrees([styleguide, strippedCss]);

    return output;
  }
});

readCompatAPI.wrapFactory(FashionConsultant);

module.exports = FashionConsultant;
