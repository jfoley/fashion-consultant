var Fs = require('fs');
var Path = require('path');
var Broccoli = require('broccoli');
var Funnel = require('broccoli-funnel');
var FashionConsultant = require('../index');

describe('FashionConsultant', () => {
  it('generates a styleguide', (done) => {
    var stylesDir = Path.join(__dirname, '..', 'example');

    var consultant = new FashionConsultant({
      inputPaths: Funnel(stylesDir)
    });

    var builder = new Broccoli.Builder(consultant.rebuild());
    builder.build()
    .then((hash) => {
      var outputDir = hash.directory;
      var files = Fs.readdirSync(outputDir);

      expect(files).toEqual(['app.css', 'styleguide']);

      var styleguidePath = Path.join(outputDir, 'styleguide', 'index.html');
      var styleguideContent = Fs.readFileSync(styleguidePath, 'utf8');

      expect(styleguideContent).toContain("<h1 id='A style'>A style</h1>");
    })
    .catch((err) => {
      console.error(err);
      fail(err);
    })
    .finally(() => {
      builder.cleanup();
      done()
    });
  });
});
