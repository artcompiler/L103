/*
   L107 compiler service.
   @flow weak
*/
const langID = "107";
// SHARED START
const https = require('https');
const express = require('express');
const compiler = require("./lib/compile.js");
const app = module.exports = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const url = require('url');
const routes = require('./src/routes');

const agent = new https.Agent({keepAlive: true});

app.set('port', (process.env.PORT || "5" + langID));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false, limit: 100000000 }));
app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb' }));
app.use(express.static(__dirname + '/pub'));
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.sendStatus(500);
});
app.get('/', function(req, res) {
  res.send("Hello, L" + langID + "!");
});
app.get('/version', routes.version(compiler));
app.get('/compile', handleValidateCompile, routes.compile(compiler));

function handleValidateCompile(req, res, next) {
  const body = JSON.parse(req.body);
  let auth = body.auth;
  validate(auth, function (err, data) {
    if (err) {
      res.status(401).send(err);
      return;
    }
    if (data.access.indexOf('compile') === -1) {
      res.sendStatus(401).send('not authorized to compile');
      return;
    }
    next();
  });
}
function postAuth(path, data, resume) {
  const uri = new url.URL('https://auth.artcompiler.com');
  uri.pathname = path;
  request.post({
    uri: uri,
    body: data,
    json: true,
    agent: agent,
  }, function (err, res, body) {
    if (err) {
      console.log("ERROR " + err);
      return resume(err);
    }
    if (res.statusCode !== 200) {
      return resume(new Error(`auth returned non 200 status code ${res.statusCode}`));
    }
    resume(null, body);
  });
}
function count(token, count) {
  postAuth("/count", {
    jwt: token,
    lang: "L" + langID,
    count: count,
  }, () => {});
}
const validated = {};
function validate(token, resume) {
  if (token === undefined) {
    resume(null, {
      address: "guest",
      access: "compile",
    });
  } else if (validated[token]) {
    resume(null, validated[token]);
    count(token, 1);
  } else {
    postAuth("/validate", {
      jwt: token,
      lang: "L" + langID,
    }, (err, data) => {
      validated[token] = data;
      resume(err, data);
      count(token, 1);
    });
  }
}
if (!module.parent) {
  process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
  });
  app.listen(app.get('port'), function () {
    global.port = app.get('port');
    console.log("Node app is running at localhost:" + app.get('port'))
    if (process.argv.includes("test")) {
      test();
    }
  });
}
// SHARED STOP
