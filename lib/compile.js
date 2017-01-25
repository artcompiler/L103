"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compiler = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* Copyright (c) 2016, Art Compiler LLC */


var _assert = require("./assert.js");

var _mjSingle = require("mathjax-node/lib/mj-single.js");

var mjAPI = _interopRequireWildcard(_mjSingle);

var _mathcore = require("./mathcore.js");

var _mathcore2 = _interopRequireDefault(_mathcore);

var _https = require("https");

var https = _interopRequireWildcard(_https);

var _http = require("http");

var http = _interopRequireWildcard(_http);

var _latexSympy = require("./latex-sympy.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _assert.reserveCodeRange)(1000, 1999, "compile");
_assert.messages[1001] = "Node ID %1 not found in pool.";
_assert.messages[1002] = "Invalid tag in node with Node ID %1.";
_assert.messages[1003] = "No async callback provided.";
_assert.messages[1004] = "No visitor method defined for '%1'.";

function getGCHost() {
  if (global.port === 5121) {
    return "localhost";
  } else {
    return "www.graffiticode.com";
  }
}
function getGCPort() {
  if (global.port === 5121) {
    return "3000";
  } else {
    return "80";
  }
}
function get(path, resume) {
  var data = [];
  var options = {
    host: getGCHost(),
    port: getGCPort(),
    path: path
  };
  var req = http.get(options, function (res) {
    res.on("data", function (chunk) {
      data.push(chunk);
    }).on("end", function () {
      resume([], JSON.parse(data.join("")));
    }).on("error", function () {
      resume(["ERROR"], "");
    });
  });
}

function getSympy(path, data, resume) {
  path = path.trim().replace(/ /g, "+");
  var encodedData = JSON.stringify(data);
  var options = {
    method: "GET",
    host: "sympy-artcompiler.herokuapp.com",
    port: "80",
    path: path,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': encodedData.length
    }
  };
  var protocol = http; //https;
  var req = protocol.request(options, function (res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    }).on('end', function () {
      try {
        resume([], JSON.parse(data));
      } catch (e) {
        console.log("parse error: " + e.stack);
        resume([], {});
      }
    }).on("error", function () {
      console.log("error() status=" + res.statusCode + " data=" + data);
      resume([], {});
    });
  });
  req.write(encodedData);
  req.end();
  req.on('error', function (e) {
    console.log("ERROR: " + e);
    resume([].concat(e), []);
  });
}
function mapList(lst, fn, resume) {
  if (lst && lst.length > 1) {
    fn(lst[0], function (err1, val1) {
      mapList(lst.slice(1), fn, function (err2, val2) {
        var val = [].concat(val2);
        val.unshift(val1);
        resume([].concat(err1).concat(err2), val);
      });
    });
  } else if (lst && lst.length > 0) {
    fn(lst[0], function (err1, val1) {
      var val = [val1];
      resume([].concat(err1), val);
    });
  } else {
    resume([], []);
  }
}

var transform = function () {
  var nodePool = void 0;
  function transform(pool, resume) {
    nodePool = pool;
    return visit(pool.root, {}, resume);
  }
  function error(str, nid) {
    return {
      str: str,
      nid: nid
    };
  }
  function texToSympy(val, resume) {
    var errs = [];
    var source = val;
    if (source) {
      try {
        _latexSympy.Core.translate({}, source, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(err);
            val = "";
          }
          resume(errs, val);
        });
      } catch (e) {
        console.log("Exception caught: " + e.stack);
        errs = errs.concat(e.message);
        resume(errs, "");
      }
    }
  }
  function visit(nid, options, resume) {
    (0, _assert.assert)(typeof resume === "function", (0, _assert.message)(1003));
    // Get the node from the pool of nodes.
    var node = void 0;
    if ((typeof nid === "undefined" ? "undefined" : _typeof(nid)) === "object") {
      node = nid;
    } else {
      node = nodePool[nid];
    }
    (0, _assert.assert)(node, (0, _assert.message)(1001, [nid]));
    (0, _assert.assert)(node.tag, (0, _assert.message)(1001, [nid]));
    (0, _assert.assert)(typeof table[node.tag] === "function", (0, _assert.message)(1004, [JSON.stringify(node.tag)]));
    return table[node.tag](node, options, resume);
  }
  // BEGIN VISITOR METHODS
  function str(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  }
  function num(node, options, resume) {
    var val = node.elts[0];
    resume([], +val);
  }
  function ident(node, options, resume) {
    var val = node.elts[0];
    resume([], val);
  }
  function bool(node, options, resume) {
    var val = node.elts[0];
    resume([], !!val);
  }
  function add(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 + val2);
      });
    });
  }
  function calculate(node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, function (err, val) {
      errs = errs.concat(err);
      var lst = [].concat(val);
      mapList(lst, function (v, resume) {
        var response = v;
        if (response) {
          options.strict = true;
          _mathcore2.default.evaluateVerbose({
            method: "calculate",
            options: options
          }, response, function (err, val) {
            delete options.strict;
            if (err && err.length) {
              errs = errs.concat(error(err, node.elts[0]));
            }
            resume(errs, val.result);
          });
        }
      }, resume);
    });
  }
  function evalSympy(name, node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, function (err, val) {
      console.log("evalSympy() val=" + JSON.stringify(val, null, 2));
      var lst = [].concat(val);
      if (err && err.length) {
        errs = errs.concat(err);
      }
      mapList(lst, function (v, resume) {
        _mathcore2.default.evaluateVerbose({
          method: "variables",
          options: options
        }, v, function (err, val) {
          if (err && err.length) {
            console.log("ERROR: " + JSON.stringify(err));
            errs = errs.concat(error(err, node.elts[0]));
            resume(errs, []);
          } else {
            (function () {
              var syms = val.result;
              var index = void 0;
              if ((index = syms.indexOf("\\pi")) >= 0) {
                syms = function (syms) {
                  var rest = syms.slice(index + 1);
                  syms.length = index;
                  return syms.concat(rest);
                }(syms);
              }
              var symbols = "";
              var params = "";
              if (syms && syms.length) {
                // Construct a list a symbols and parameters.
                syms.forEach(function (s) {
                  if (symbols) {
                    symbols += " ";
                    params += ",";
                  }
                  symbols += s;
                  params += s;
                });
                symbols = "symbols('" + symbols + "')";
                params = "(" + params + ")";
              }
              texToSympy(v, function (err, v) {
                if (err && err.length) {
                  errs = errs.concat(error(err, node.elts[0]));
                  resume(errs, []);
                } else {
                  var obj = {
                    func: "eval",
                    expr: "(lambda" + params + ":" + name + "(" + v + "))(" + symbols + ")"
                  };
                  console.log("evalSympy() obj=" + JSON.stringify(obj));
                  getSympy("/api/v1/eval", obj, function (err, data) {
                    if (err && err.length) {
                      errs = errs.concat(error(err, node.elts[0]));
                    }
                    resume(errs, data);
                  });
                }
              });
            })();
          }
        });
      }, resume);
    });
  }
  function evalSympy2(name, node, options, resume) {
    var errs = [];
    var syms = ["x", "y", "z"];
    visit(node.elts[0], options, function (err, val0) {
      visit(node.elts[1], options, function (err, val1) {
        var symbols = "";
        var params = "";
        syms.forEach(function (s) {
          if (symbols) {
            symbols += " ";
            params += ",";
          }
          symbols += s;
          params += s;
        });
        var lst = [].concat(val0);
        if (err && err.length) {
          errs = errs.concat(err);
        }
        mapList(lst, function (v, resume) {
          texToSympy(v, function (err, v) {
            var obj = {
              func: "eval",
              expr: "(lambda(" + params + "):" + name + "(" + v + ", symbols('" + val1 + "')))(symbols('" + symbols + "'))"
            };
            getSympy("/api/v1/eval", obj, function (err, data) {
              if (err && err.length) {
                errs = errs.concat(error(err, node.elts[0]));
              }
              resume(errs, data);
            });
          });
        }, resume);
      });
    });
  }
  function cancel(node, options, resume) {
    evalSympy("cancel", node, options, resume);
  }
  function apart(node, options, resume) {
    evalSympy("apart", node, options, resume);
  }
  function collect(node, options, resume) {
    evalSympy2("collect", node, options, resume);
  }
  function evaluate(node, options, resume) {
    evalSympy("", node, options, resume);
  }
  function factor(node, options, resume) {
    evalSympy("factor", node, options, resume);
  }
  function expand(node, options, resume) {
    evalSympy("expand", node, options, resume);
  }
  function simplify(node, options, resume) {
    evalSympy("simplify", node, options, resume);
  }
  function match(node, options, resume) {
    var errs = [];
    visit(node.elts[1], options, function (err, val) {
      errs = errs.concat(err);
      var reference = val.result ? val.result : val;
      visit(node.elts[0], options, function (err, val) {
        errs = errs.concat(err);
        var response = val.result ? val.result : val;
        var vals = [];
        if (!(reference instanceof Array)) {
          reference = [reference];
        }
        reference.forEach(function (v) {
          _mathcore2.default.evaluateVerbose({
            method: "equivLiteral",
            options: options,
            value: v
          }, response, function (err, val) {
            if (err && err.length) {
              errs = errs.concat(error(err, node.elts[0]));
            } else {
              vals.push("\\text{" + +val.result + " | } " + v);
            }
          });
        });
        resume(errs, vals);
      });
    });
  }
  function style(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), {
          value: val1,
          style: val2
        });
      });
    });
  }
  function concat(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      var str = "";
      if (val1 instanceof Array) {
        val1.forEach(function (v) {
          str += v;
        });
      } else {
        str = val1.toString();
      }
      resume(err1, str);
    });
  }
  function list(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "LIST",
          elts: node.elts.slice(1)
        };
        list(node, options, function (err2, val2) {
          var val = [].concat(val2);
          val.unshift(val1);
          //          val.push(val1);
          resume([].concat(err1).concat(err2), val);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        var val = [val1];
        resume([].concat(err1), val);
      });
    } else {
      resume([], []);
    }
  }
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), { key: val1, val: val2 });
      });
    });
  }
  function record(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts.pop(), options, function (err1, val1) {
        record(node, options, function (err2, val2) {
          val2[val1.key] = val1.val;
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        var val = {};
        val[val1.key] = val1.val;
        resume([].concat(err1), val);
      });
    } else {
      resume([], {});
    }
  }
  function exprs(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "EXPRS",
          elts: node.elts.slice(1)
        };
        exprs(node, options, function (err2, val2) {
          var val = [].concat(val2);
          val.unshift(val1);
          resume([].concat(err1).concat(err2), val);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        resume([].concat(err1), val1);
      });
    } else {
      resume([], []);
    }
  }
  function program(node, options, resume) {
    if (!options) {
      options = {};
    }
    visit(node.elts[0], options, function (err, val) {
      resume(err, val);
    });
  }
  var table = {
    "PROG": program,
    "EXPRS": exprs,
    "STR": str,
    "NUM": num,
    "IDENT": ident,
    "BOOL": bool,
    "LIST": list,
    "RECORD": record,
    "BINDING": binding,
    "ADD": add,
    "STYLE": style,
    "CALCULATE": calculate,
    "SIMPLIFY": simplify,
    "EXPAND": expand,
    "FACTOR": factor,
    "EVAL": evaluate,
    "CANCEL": cancel,
    "COLLECT": collect,
    "APART": apart,
    "MATCH": match,
    "CONCAT": concat
  };
  return transform;
}();
mjAPI.config({
  MathJax: {
    SVG: {
      font: "Tex"
    }
  }
});
mjAPI.start();
var render = function () {
  function tex2SVG(str, resume) {
    mjAPI.typeset({
      math: str,
      format: "inline-TeX",
      svg: true,
      ex: 6,
      width: 100
    }, function (data) {
      if (!data.errors) {
        resume([], data.svg);
      } else {
        resume([], "");
      }
    });
  }
  function escapeXML(str) {
    return String(str).replace(/&(?!\w+;)/g, "&amp;").replace(/\n/g, " ").replace(/\\/g, "\\\\").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function sympyToLaTeX(val, resume) {
    var errs = [];
    var obj = {
      func: "latex",
      expr: val
    };
    getSympy("/api/v1/eval", obj, function (err, data) {
      if (err && err.length) {
        errs = errs.concat(error(err, node.elts[0]));
      }
      resume(errs, data);
    });
  }
  function render(val, resume) {
    // Do some rendering here.
    if (typeof val === "string") {
      val = [val];
    }
    var errs = [];
    var vals = [];
    var lst = [].concat(val);
    mapList(lst, function (v, resume) {
      tex2SVG(v, function (err, svg) {
        if (err && err.length) {
          errs = errs.concat(err);
        }
        resume(errs, {
          val: v,
          svg: escapeXML(svg)
        });
      });
    }, resume);
  }
  return render;
}();
var compiler = exports.compiler = function () {
  exports.compile = function compile(pool, resume) {
    // Compiler takes an AST in the form of a node pool and transforms it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      transform(pool, function (err, val) {
        if (err && err.length) {
          resume([].concat(err), val);
        } else {
          render(val, function (err, val) {
            resume([].concat(err), val);
          });
        }
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume(["Compiler error"], {
        score: 0
      });
    }
  };
}();