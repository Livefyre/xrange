/**
 * @fileoverview Simple http server for server fake json requests, static file
 * serving, and other mockery.
 */

var PORT = 8090;
var express = require('express');
var app = express();
var fs = require('fs');
var fixturePath = __dirname + '/test/fixtures';

function getFixtureObj(name, callback) {
  fs.readFile(fixturePath + '/' + name + '.json', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    callback(JSON.parse(data));
  });
}

app.use(express.directory(__dirname));
app.use(express.static(__dirname));

console.log('starting server at port', PORT);
app.listen(PORT);
