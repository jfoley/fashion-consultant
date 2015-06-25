let StripIndent = require('strip-indent');
let DocFragmentParser = require('../lib/doc-fragment-parser');
let Colors = require('colors');
let Diff = require('diff');

function CSS(strings, ...values) {
  // throw away the first \n to emulate ruby heredocs
  return StripIndent(strings.raw[0].slice(1));
}

describe('DocFragmentParser', () => {
  it('parses doc fragments', () => {
    const cssString = CSS`
      /*doc
      some text here
      */
      .alert { color: 'red' };
      `;

    let parser = new DocFragmentParser(cssString);
    parser.parse();

    expect(parser.strippedCss()).toEqual(`.alert { color: 'red' };`);
    expect(parser.docFragments()).toEqual(['some text here']);
  });

  it('parses multiple doc fragments', () => {
    const cssString = CSS`
    /*doc
    some text here
    */
    .alert { color: 'red' };

    .warn { color: 'yellow' };

    /*doc
    more text
    */
    .info { color: 'green' };`;

    let parser = new DocFragmentParser(cssString);
    parser.parse();

    const expectedCSS = CSS`
    .alert { color: 'red' };

    .warn { color: 'yellow' };


    .info { color: 'green' };`;

    expect(parser.strippedCss()).diffChars(expectedCSS);
    expect(parser.docFragments()).toEqual(['some text here', 'more text']);
  });
});
