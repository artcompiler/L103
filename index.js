/*
   L107 compiler service.
   @flow weak
*/
const langID = "107";
// SHARED START
const fs = require('fs');
const http = require("http");
const https = require("https");
const express = require('express')
const compiler = require("./lib/compile.js");
const app = express();
const jsonDiff = require("json-diff");
app.set('port', (process.env.PORT || "5" + langID));
app.use(express.static(__dirname + '/pub'));
app.get('/', function(req, res) {
  res.send("Hello, L" + langID + "!");
});
app.listen(app.get('port'), function() {
  global.port = +app.get('port');
  console.log("Node app is running at localhost:" + app.get('port'))
  if (process.argv.includes("test")) {
    test();
  }
});
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
app.get("/version", function(req, res) {
  res.send(compiler.version || "v0.0.0");
});
app.get("/compile", function(req, res) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    body = JSON.parse(body);
    let auth = body.auth;
    validate(auth, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        if (data.access.indexOf("compile") === -1) {
          // Don't have compile access.
          res.sendStatus(401).send(err);
        } else {
          let code = body.src;
          let data = body.data;
          data.REFRESH = body.refresh; // Stowaway flag.
          let t0 = new Date;
          compiler.compile(code, data, function (err, val) {
            if (err.length) {
              res.send({
                error: err,
              });
            } else {
              console.log("GET /compile " + (new Date - t0) + "ms");
              res.json(val);
            }
          });
        }
      }
    });
  });
  req.on('error', function(e) {
    console.log(e);
    res.send(e);
  });
});
function postAuth(path, data, resume) {
  let encodedData = JSON.stringify(data);
  var options = {
    host: "auth.artcompiler.com",
    port: "443",
    path: path,
    method: "POST",
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(encodedData),
    },
  };
  var req = https.request(options);
  req.on("response", (res) => {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    }).on('end', function () {
      try {
        resume(null, JSON.parse(data));
      } catch (e) {
        console.log("ERROR " + data);
        console.log(e.stack);
      }
    }).on("error", function () {
      console.log("error() status=" + res.statusCode + " data=" + data);
    });
  });
  req.end(encodedData);
  req.on('error', function(err) {
    console.log("ERROR " + err);
    resume(err);
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
    }, (err, data) => {
      validated[token] = data;
      resume(err, data);
      count(token, 1);
    });
  }
}
const recompileItem = (id, host, resume) => {
  let protocol, url;
  if (host === "localhost") {
    protocol = http;
    url = "http://localhost:3000/data/?id=" + id + "&refresh=true&dontSave=true";
  } else {
    protocol = https;
    url = "https://" + host + "/data/?id=" + id + "&refresh=true&dontSave=true";
  }
  var req = protocol.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    }).on('end', function () {
      try {
        resume([], JSON.parse(data));
      } catch (e) {
        console.log("ERROR " + data);
        console.log(e.stack);
        resume([e], null);
      }
    }).on("error", function () {
      console.log("error() status=" + res.statusCode + " data=" + data);
    });
  });
};
const testItems = (items, passed, failed) => {
  passed = passed || [];
  failed = failed || [];
  if (items.length === 0) {
    console.log(passed.length + " PASSED, " + failed.length + " FAILED");
    return;
  }
  let itemID = items.shift();
  let t0 = new Date;
  recompileItem(itemID, "localhost", (err, localOBJ) => {
    //console.log("testItems() localOBJ=" + JSON.stringify(localOBJ));
    let t1 = new Date;
    recompileItem(itemID, "www.graffiticode.com", (err, remoteOBJ) => {
      //console.log("testItems() remoteOBJ=" + JSON.stringify(remoteOBJ));
      let t2 = new Date;
      let diff = jsonDiff.diffString(localOBJ, remoteOBJ);
      if (!diff) {
        console.log((items.length + 1) + " PASS " + itemID);
        passed.push(itemID);
      } else {
        console.log((items.length + 1) + " FAIL " + itemID);
        console.log(diff);
        failed.push(itemID);
      }
      testItems(items, passed, failed);
    });
  });
};
const test = () => {
  fs.readFile("tools/test.json", function (err, data) {
    if (err) {
      console.log(err);
      data = "[]";
    }
    testItems(JSON.parse(data));
  });
};

// SHARED STOP
