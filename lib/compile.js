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
        resume(["ERROR Sympy: " + encodedData], {});
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
  var version = void 0;
  function getVersion(pool) {
    return pool.version ? +pool.version : 0;
  }
  function transform(code, data, resume) {
    nodePool = code;
    version = getVersion(code);
    return visit(code.root, data, resume);
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
  function mul(node, options, resume) {
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
        resume([].concat(err1).concat(err2), val1 * val2);
      });
    });
  }
  function pow(node, options, resume) {
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
        resume([].concat(err1).concat(err2), Math.pow(val1, val2));
      });
    });
  }
  function option(options, id, val) {
    // Get or set an option on a node.
    var old = options[id];
    if (val !== undefined) {
      options[id] = val;
    }
    return old;
  }
  function key(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      var key = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        var obj = val2;
        if (false) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), Object.keys(obj)[key]);
      });
    });
  }
  function val(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      var key = val1;
      visit(node.elts[1], options, function (err2, val2) {
        var obj = val2;
        resume([].concat(err1).concat(err2), obj[key]);
      });
    });
  }
  function len(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      var obj = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      resume([].concat(err1), obj.length);
    });
  }
  function variable(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      option(options, "variable", val);
      visit(node.elts[1], options, function (err, val) {
        resume(err, val);
      });
    });
  }
  function precision(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      option(options, "precision", val);
      visit(node.elts[1], options, function (err, val) {
        resume(err, val);
      });
    });
  }
  function domain(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      option(options, "domain", val);
      visit(node.elts[1], options, function (err, val) {
        resume(err, val);
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
            options: {}
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
    var result;
    visit(node.elts[0], options, function (err, val0) {
      if (typeof val0 !== "string") {
        result = val0;
        val0 = val0.value;
      } else {
        result = {
          value: val0,
          steps: []
        };
      }
      if (err && err.length) {
        errs = errs.concat(err);
      }
      _mathcore2.default.evaluateVerbose({
        method: "variables",
        options: {}
      }, val0, function (err, val) {
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
            var opts = "";
            Object.keys(options).forEach(function (k) {
              switch (k) {
                case "variable":
                case "precision":
                  opts += "," + options[k];
                  break;
                case "domain":
                  opts += "," + k + "=" + options[k];
                  break;
                default:
                  break;
              }
            });
            texToSympy(val0, function (err, v) {
              if (err && err.length) {
                errs = errs.concat(error(err, node.elts[0]));
                resume(errs, []);
              } else {
                var _args = v + opts;
                var obj = {
                  func: "eval",
                  expr: "(lambda" + params + ":" + name + "(" + _args + "))(" + symbols + ")"
                };
                getSympy("/api/v1/eval", obj, function (err, data) {
                  if (err && err.length) {
                    errs = errs.concat(error(err, node.elts[0]));
                  }
                  result.value = data;
                  result.steps.push({
                    name: name,
                    val: data
                  });
                  resume(errs, result);
                });
              }
            });
          })();
        }
      });
    });
  }
  function literal(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      var obj = {
        value: val,
        seed: val,
        steps: [{
          name: "seed",
          val: val
        }]
      };
      resume([], obj);
    });
  }
  function stimulus(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      val.stimulus = val.value;
      resume([], val);
    });
  }
  function solution(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      val.solution = val.value;
      resume([], val);
    });
  }
  function solve(node, options, resume) {
    evalSympy("solveset", node, options, resume);
  }
  function cancel(node, options, resume) {
    evalSympy("cancel", node, options, resume);
  }
  function apart(node, options, resume) {
    evalSympy("apart", node, options, resume);
  }
  function collect(node, options, resume) {
    evalSympy("collect", node, options, resume);
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
  function integrate(node, options, resume) {
    evalSympy("integrate", node, options, resume);
  }
  function diff(node, options, resume) {
    evalSympy("diff", node, options, resume);
  }
  function decimal(node, options, resume) {
    evalSympy("N", node, options, resume);
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
            options: {},
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
          if (v.value) {
            str += v.value;
          } else {
            str += v;
          }
        });
      } else if (val1.value) {
        str = val1.value.toString();
      } else {
        str = val1.toString();
      }
      resume(err1, str);
    });
  }
  function paren(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(err1, val1);
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
  function inData(node, options, resume) {
    resume([], options.data);
  }
  function arg(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      var key = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      resume([].concat(err1), options.args[key]);
    });
  }
  function args(node, options, resume) {
    resume([], options.args);
  }
  function lambda(node, options, resume) {
    // Return a function value.
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function apply(node, options, resume) {
    // Apply a function to arguments.
    visit(node.elts[1], options, function (err1, val1) {
      // args
      options.args = [val1];
      visit(node.elts[0], options, function (err0, val0) {
        // fn
        resume([].concat(err1).concat(err0), val0);
      });
    });
  }
  function map(node, options, resume) {
    // Apply a function to arguments.
    var errs = [];
    var vals = [];
    visit(node.elts[1], options, function (err1, val1) {
      // args
      mapList(val1, function (val, resume) {
        options.args = [val];
        visit(node.elts[0], options, function (err0, val0) {
          resume([].concat(err0), val0);
        });
      }, function (err, val) {
        resume(err, val);
      });
    });
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
    "MUL": mul,
    "POW": pow,
    "STYLE": style,
    "CALCULATE": calculate,
    "SIMPLIFY": simplify,
    "SOLVE": solve,
    "EXPAND": expand,
    "FACTOR": factor,
    "EVAL": evaluate,
    "CANCEL": cancel,
    "INTEGRATE": integrate,
    "DIFF": diff,
    "COLLECT": collect,
    "APART": apart,
    "MATCH": match,
    "CONCAT": concat,
    "LITERAL": literal,
    "STIMULUS": stimulus,
    "SOLUTION": solution,
    "VARIABLE": variable,
    "PRECISION": precision,
    "DOMAIN": domain,
    "VAL": val,
    "KEY": key,
    "LEN": len,
    "ARG": arg,
    "DATA": inData,
    "IN": inData,
    "LAMBDA": lambda,
    "PAREN": paren,
    "APPLY": apply,
    "MAP": map,
    "DECIMAL": decimal
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
    var errs = [];
    var vals = [];
    var lst = [].concat(val);
    //    mapList(lst, (v, resume) => {
    console.log("render() lst=" + JSON.stringify(lst));
    mapList(lst, function (v, resume) {
      var lst = [];
      if (v.seed) {
        lst.push({
          name: "seed",
          val: v.seed
        });
      }
      if (v.stimulus) {
        lst.push({
          name: "stimulus",
          val: v.stimulus
        });
      }
      if (v.solution) {
        lst.push({
          name: "solution",
          val: v.solution
        });
      }
      console.log("render() lst=" + JSON.stringify(lst));
      //      mapList(lst.steps, (v, resume) => {
      mapList(lst, function (v, resume) {
        console.log("render() v=" + JSON.stringify(v));
        tex2SVG(v.val, function (err, svg) {
          console.log("render() svg=" + svg);
          if (err && err.length) {
            errs = errs.concat(err);
          }
          resume(errs, {
            name: v.name,
            val: v.val,
            svg: escapeXML(svg)
          });
        });
      }, function (err, val) {
        var name = lst.name;
        resume(err, {
          name: val.name,
          val: val
        });
      });
    }, resume);
  }
  return render;
}();
var compiler = exports.compiler = function () {
  exports.compile = function compile(pool, data, resume) {
    // Compiler takes an AST in the form of a node pool and transforms it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      var options = {
        data: data
      };
      transform(pool, options, function (err, val) {
        if (err && err.length) {
          resume([].concat(err), val);
        } else {
          render(val, function (err, val) {
            console.log("compile() val=" + JSON.stringify(val));
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