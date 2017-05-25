/*
   L122 compiler service.

   @flow weak
*/
var fs = require('fs');
var http = require('http');
var express = require('express')
var app = express();
app.set('port', (process.env.PORT || 5122));
app.set('views', __dirname);
app.use(express.static(__dirname + '/pub'));
app.get('/', function(req, res) {
  res.send("Hello, L122!");
});

var compiler = require("./lib/compile.js");
// Graffiti Code will load the version of itself that matches the graffiti
// version. The compiler should use a version of itself that is compatible
// with the language version. This version object is returned along with
// the result of each /compile.
var version = {
  compiler: "v0.0.0",
  language: "v0.0.0",
  graffiti: "v0.0.0",
};

app.get('/version', function(req, res) {
  res.send(version);
});
app.get('/compile', function(req, res) {
  var body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    body = JSON.parse(body);
    let code = body.src;
    let data = body.data;
    var obj = compiler.compile(code, data, function (err, val) {
      if (err && err.length) {
        res.status(400).send({
          error: err,
        });
      } else {
        res.send(val);
      }
    });
  });
  req.on('error', function(e) {
    console.log(e);
    res.status(400).send(e);
  });
});
app.listen(app.get('port'), function() {
  global.port = app.get('port');
  console.log("Node app is running at localhost:" + app.get('port'))
});
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err.stack);
});
