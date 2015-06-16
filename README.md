# fashion-consultant

Fashion Consultant helps you build styleguides using the broccoli build pipeline.

# Installation

npm install --save fashion-consultant

# Usage

Create a Brocfile like so:

```
var FashionConsultant = require('./fashion-consultant');
var Funnel = require('broccoli-funnel');

module.exports = new FashionConsultant({
  inputPaths: Funnel('path/to/your/stylesheets'),
}).rebuild();
```

and then run `broccoli build <outDir>`
