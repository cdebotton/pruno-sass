# pruno-sass

A SASS mix for pruno that includes font-awesome, normalize.css.

## Usage

```js
"use strict";

var pruno = require('pruno');

pruno.plugins(function(mix) {
  mix
    .configure({ dir: __dirname + '/config' })
    .sass({
      'entry': '::src/sass/index.sass',
      'dist': '::dist/stylesheets/app.css',
      'search': ['::src/**/*.sass', '::src/**/*.scss'],
      'minify': false,
      'source-maps':true,
      'font-awesome': false,
      'normalize': false
    });
});
```
