"use strict";

var pruno = module.parent.require('pruno');
var path = require('path');
var streamqueue = require('streamqueue');
var plugins = require('gulp-load-plugins')();

function SassTask(params) {
  this.params = (params || {});
}

SassTask.displayName = 'SassTask';

SassTask.getDefaults = function() {
  return {
    'entry': '::src/sass/index.sass',
    'dist': '::dist/stylesheets/app.css',
    'search': ['::src/**/*.sass', '::src/**/*.scss'],
    'minify': false,
    'source-maps':true,
    'font-awesome': false,
    'normalize': false
  };
};

SassTask.prototype.enqueue = function(gulp, params) {
  params = (params || {});
  var opts = distillOptions(SassTask, params);

  return compileCSS({
    gulp: gulp,
    compiler: 'sass',
    opts: opts,
    params: params
  });
};

SassTask.prototype.generateWatcher = function() {
  return true;
};

function compileCSS(args) {
  var gulp = args.gulp;
  var compiler = args.compiler;
  var opts = args.opts;
  var params = args.params;
  var parts = params.dist.match(/^(.+\/)(.+\.css)$/);
  var dist = parts[0];
  var distDir = parts[1];
  var fileName = parts[2];
  var stream = streamqueue({objectMode: true});

  stream.pipe(
    plugins.if(
      params['source-maps'],
      plugins.sourcemaps.init({loadMaps: true})
    )
  );

  if (params.normalize) {
    stream.queue(
      gulp.src(pkg('normalize.css', 'normalize.css'))
    );
  }

  if (params['font-awesome']) {
    stream.queue(
      gulp.src(pkg('font-awesome', 'css/font-awesome.css'))
    );
  }

  stream.queue(
    gulp.src(params.entry)
      .pipe(plugins.plumber())
      .pipe(plugins[compiler](opts))
  );

  return stream.done()
    .pipe(plugins.concat(fileName))
    .pipe(plugins.if(params.minify, plugins.minifyCss()))
    .pipe(plugins.if(params['source-maps'], plugins.sourcemaps.write()))
    .pipe(gulp.dest(distDir));
}

function pkg(pkgName, path) {
  return './node_modules/pruno-sass/node_modules/' + pkgName + '/' + path;
};

function getType(obj) {
  return Object.prototype.toString.call(obj)
    .match(/^\[object (.+)\]$/i)[1]
    .toLowerCase();
}

function distillOptions(Task, params) {
  var defaults = Object.keys(Task.getDefaults())
    .concat(['taskName']);

  return Object.keys(params)
    .filter(function (param) {
      return defaults.indexOf(param) === -1;
    })
    .reduce(function (memo, param) {
      memo[param] = params[param];
      delete params[param];
      return memo;
    }, {});
}

module.exports = pruno.extend(SassTask);
