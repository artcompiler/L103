/*
   L121 compiler service.

   @flow weak
*/
var fs = require('fs');
var http = require('http');
var express = require('express')
var app = express();
app.set('port', (process.env.PORT || 5121));
app.set('views', __dirname);
app.use(express.static(__dirname + '/pub'));
app.get('/', function(req, res) {
  res.send("Hello, L121!");
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
        res.send({
          data: val,
        });
      }
    });
  });
  req.on('error', function(e) {
    console.log(e);
    res.status(400).send(e);
  });
});
app.get('/view/:id', function(req, res) {
  var id = req.params.id;
  item(id, function (err, data) {
    var obj = JSON.parse(data)[0].obj;
    res.render('view.html', {
      obj: JSON.stringify(obj),
    }, function (error, html) {
      if (error) {
        console.log("error=" + error.stack);
        res.status(400).send(error);
      } else {
        res.send(html);
      }
    });
  });
  function item(id, resume) {
    var options = {
      method: "GET",
      host: "www.graffiticode.com",
      path: "/code/" + id,
    };
    var req = http.get(options, function(res) {
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;
      }).on('end', function () {
        try {
          resume([], data);
        } catch (e) {
          console.log("ERROR: " + e.stack);
        }
      }).on("error", function () {
        resume([].concat("ERROR status=" + res.statusCode + " data=" + data), null);
      });
    });
  }
});
app.listen(app.get('port'), function() {
  global.port = app.get('port');
  console.log("Node app is running at localhost:" + app.get('port'))
});
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
