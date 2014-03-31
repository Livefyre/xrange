({
  mainConfigFile: 'requirejs.conf.js',
  paths: {
    almond: 'lib/almond/almond'
  },
  baseUrl: '.',
  name: 'xrange',
  include: ['almond'],
  out: 'dist/xrange.min.js',
  preserveLicenseComments: false,
  optimize: 'uglify2',
  cjsTranslate: true,
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  generateSourceMaps: true
});
