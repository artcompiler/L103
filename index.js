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
const querystring = require("querystring");
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
  console.log('ERROR L107 Uncaught exception: ' + err.stack);
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
      lang: "L" + langID,
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
        data = JSON.parse(data);
      } catch (e) {
        console.log("ERROR " + data);
        console.log(e.stack);
        resume([e], null);
      }
      resume([], data);
    }).on("error", function () {
      console.log("error() status=" + res.statusCode + " data=" + data);
    });
  });
};
const testItems = (items, passed, failed, resume) => {
  if (items.length === 0) {
    resume([], "done");
    return;
  }
  let itemID = items.shift();
  let t0 = new Date;
  try {
    process.stdout.write(itemID + ": ");
    recompileItem(itemID, "localhost", (err, localOBJ) => {
      //console.log("testItems() localOBJ=" + JSON.stringify(localOBJ));
      let t1 = new Date;
      recompileItem(itemID, "www.graffiticode.com", (err, remoteOBJ) => {
        process.stdout.write((items.length + 1) + " " + itemID);
        //console.log("testItems() remoteOBJ=" + JSON.stringify(remoteOBJ));
        let t2 = new Date;
        let diff = jsonDiff.diffString(remoteOBJ, localOBJ);
        if (!diff) {
          console.log(" PASS");
          passed.push(itemID);
        } else {
          console.log(" FAIL");
          console.log(diff);
          failed.push(itemID);
        }
        testItems(items, passed, failed, resume);
      });
    });
  } catch (e) {
    process.stdout.write((items.length + 1) + " " + itemID);
    console.log(" ERROR");
    failed.push(itemID);
    testItems(items, passed, failed, resume);
  }
};
const msToMinSec = (ms) => {
  let m = Math.floor(ms / 60000);
  let s = ((ms % 60000) / 1000).toFixed(0);
  return (m > 0 && m + "m " || "") + (s < 10 && "0" || "") + s + "s";
}
function getGCHost() {
  const LOCAL = global.port === 5107;
  if (LOCAL) {
    return "localhost";
  } else {
    return "www.graffiticode.com";
  }
}
function getGCPort() {
  const LOCAL = global.port === 5107;
  if (LOCAL) {
    return "3000";
  } else {
    return "443";
  }
}
function getTests(limit, resume) {
  let query = {
    table: "items",
    where: "langid=" + langID + " and mark is not null",
    fields: ["itemid"],
  };
  let options = {
    method: "GET",
    host: getGCHost(),
    port: getGCPort(),
    path: "/items?" + querystring.stringify(query).trim().replace(/ /g, "+")
  };
  const LOCAL = global.port === 5107;
  const protocol = LOCAL ? http : https;
  let req = protocol.get(options, function(res) {
    let data = "";
    res.on('data', function (chunk) {
      data += chunk;
    }).on('end', function () {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log("parse error: " + data);
        resume("parse error: " + data, []);
      }
      itemIDs = [];
      limit = limit || data.length;
      shuffle(data).slice(0, limit).forEach(d => {
        itemIDs.push(d.itemid);
      });
      resume(null, itemIDs);
    }).on("error", function () {
      console.log("error() status=" + res.statusCode + " data=" + data);
    });
  });
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
const test = () => {
  let limit = +process.argv[3];
  getTests(limit, (err, data) => {
    if (err) {
      console.log(err);
      data = "[]";
    }
    let t0 = new Date;
    let passed = [], failed = [];
    //data = ["nKQUjlbVIV"];
    testItems(data, passed, failed, (err, val) => {
      console.log(passed.length + " PASSED, " + failed.length + " FAILED (" + msToMinSec(new Date - t0) + ")");
      process.exit(0);
    });
  });
};
// SHARED STOP
