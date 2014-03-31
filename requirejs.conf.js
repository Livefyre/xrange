require.config({
  baseUrl: '/',
  paths: {
    inherits: 'lib/inherits/inherits',
    sinon: 'lib/sinonjs/sinon'
  },
  packages: [{
    name: 'xrange',
    location: 'src'
  },
  {
    name: 'xrange-tests',
    location: 'test'
  }],
  shim: {
    'sinon': {
      exports: 'sinon'
    }
  }
});
