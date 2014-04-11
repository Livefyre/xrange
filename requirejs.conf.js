require.config({
  baseUrl: '/',
  paths: {
    inherits: 'lib/inherits/inherits',
    jquery: 'lib/jquery/dist/jquery.min',
    sinon: 'lib/sinonjs/sinon'
  },
  packages: [{
    name: 'xrange',
    location: 'src'
  },
  {
    name: 'xrange-tests',
    location: 'test'
  },
  {
    name: 'xrange/util',
    location: 'src/util',
    main: 'base'
  }],
  shim: {
    jquery: {
        exports: '$'
    },
    'sinon': {
      exports: 'sinon'
    }
  }
});
