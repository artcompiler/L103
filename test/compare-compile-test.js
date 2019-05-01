const {expect, assert} = require('chai');
const jsonDiff = require('json-diff');
const path = require('path');
const request = require('request');
const url = require('url');
const LOCAL_GATEWAY = 'http://localhost:3000/';
const REMOTE_GATEWAY = 'https://www.graffiticode.com/';
const LANG_ID = 107;
getTests(function (err, testData) {
  describe('Compare compile', function() {
    this.timeout(50000);
    function checkGateway(host, resume) {
      request.head(host, function (err, res) {
        if (err) {
          if (err.code === 'ECONNREFUSED') {
            err = new Error(`unable to connect to gateway: ${err.message}`);
          }
          return resume(err);
        }
        if (!res || res.statusCode !== 200) {
          return resume(new Error(`gateway did not return 200: ${res.statusCode}`));
        }
        resume();
      });
    }
    before('Check local', function(done) {
      checkGateway(LOCAL_GATEWAY, done);
    });
    before('Check remote gateway', function (done) {
      checkGateway(REMOTE_GATEWAY, done);
    });
    function getCompile(host, id, resume) {
      const hostUrl = new url.URL(host);
      hostUrl.searchParams.set('id', id);
      hostUrl.searchParams.set('refresh', 'true');
      hostUrl.searchParams.set('dontSave', 'true');
      hostUrl.pathname = '/data';
      request(hostUrl.toString(), function(err, res, body) {
        if (err) {
          return resume(err);
        }
        if (res.statusCode !== 200) {
          resume(new Error(`compile ${host} returned ${res.statusCode}`));
        }
        resume(null, body);
      });
    }
    function getLocalAndRemoteCompile(id, resume) {
      getCompile(LOCAL_GATEWAY, id, function(err, local) {
        if (err) {
          return resume(err);
        }
        getCompile(REMOTE_GATEWAY, id, function(err, remote) {
          if (err) {
            return resume(err);
          }
          resume(null, local, remote);
        });
      });
    }
    describe('running ' + (testData && testData.length || 0) + ' tests', function () {
      testData && testData.forEach(function (data) {
        it(data, function (done) {
          getLocalAndRemoteCompile(data, function (err, local, remote) {
            if (err) {
              done(err);
            } else {
              if (jsonDiff.diffString(remote, local)) {
                console.log(jsonDiff.diffString(remote, local));
              }
//              expect(jsonDiff.diffString(remote, local)).to.be.equal('');
              expect(remote === local).to.be.equal(true);
              done();
            }
          });
        });
      });
    });
  });
  run();
});
function getTests(resume) {
  console.log("Getting tests...");
  const hostUrl = new url.URL(LOCAL_GATEWAY);
  hostUrl.searchParams.set('table', 'items');
  hostUrl.searchParams.set('where', 'langid=' + LANG_ID + ' and mark is not null');
  hostUrl.searchParams.set('fields', ['itemid']);
  hostUrl.pathname = '/items';
  request(hostUrl.toString(), function(err, res, body) {
    if (err) {
      return resume(err);
    }
    if (res.statusCode !== 200) {
      resume(new Error(`compile returned ${res.statusCode}`));
    }
    let data = [];
    let smoke = process.argv.indexOf('--smoke') > 0;
    let tests = JSON.parse(body);
    if (smoke) {
      tests = shuffle(tests).slice(0, 100);
    }
    tests.forEach(d => {
      data.push(d.itemid);
    });
    data = ["l12SOVmZIX"];
    resume(null, data);
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
