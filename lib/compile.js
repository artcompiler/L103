"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compiler = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _assert = require("./assert.js");

var _mathcore = require("./mathcore.js");

var _mathcore2 = _interopRequireDefault(_mathcore);

var _https = require("https");

var https = _interopRequireWildcard(_https);

var _http = require("http");

var http = _interopRequireWildcard(_http);

var _latexsympy = require("./latexsympy.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2016, Art Compiler LLC */
var MATHJAX = false;
/* MATHJAX
import * as mjAPI from "mathjax-node/lib/main.js";
*/

(0, _assert.reserveCodeRange)(1000, 1999, "compile");
_assert.messages[1001] = "Node ID %1 not found in pool.";
_assert.messages[1002] = "Invalid tag in node with Node ID %1.";
_assert.messages[1003] = "No async callback provided.";
_assert.messages[1004] = "No visitor method defined for '%1'.";
function getGCHost() {
  if (global.port === 5107) {
    return "localhost";
  } else {
    return "www.graffiticode.com";
  }
}
function getGCPort() {
  if (global.port === 5107) {
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
        if (val1 !== null) {
          val.unshift(val1);
        }
        resume([].concat(err1).concat(err2), val);
      });
    });
  } else if (lst && lst.length > 0) {
    fn(lst[0], function (err1, val1) {
      var val = [];
      if (val1 !== null) {
        val.push(val1);
      }
      resume([].concat(err1), val);
    });
  } else {
    resume([], []);
  }
}
var transform = function () {
  var nodePool = void 0;
  var version = void 0;
  function node(nid) {
    return nodePool[nid];
  }
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
        _latexsympy.Core.translate({}, source, function (err, val) {
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
  function trans(dialect, node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, function (err, val) {
      errs = errs.concat(err);
      var latex = val;
      var opts = void 0;
      var methods = dialect + " " + (val.methods || "");
      if (latex) {
        texToSympy(latex, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
          }
          val = "\\text{" + val + "}";
          resume(errs, val);
        });
      }
    });
  }
  function visit(nid, options, resume) {
    (0, _assert.assert)(typeof resume === "function", (0, _assert.message)(1003));
    // Get the node from the pool of nodes.
    var node = void 0;
    if (!nid) {
      resume([], null);
      return;
    } else if ((typeof nid === "undefined" ? "undefined" : _typeof(nid)) === "object") {
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
    var word = findWord(options, node.elts[0]);
    resume([], word && word.val || node.elts[0]);
  }
  function bool(node, options, resume) {
    var val = node.elts[0];
    resume([], !!val);
  }
  function add(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument 1 must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument 2 must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 + val2);
      });
    });
  }
  function sub(node, options, resume) {
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
        resume([].concat(err1).concat(err2), val1 - val2);
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
  function div(node, options, resume) {
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
        resume([].concat(err1).concat(err2), val1 / val2);
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
        var val = obj && obj[key] ? obj[key] : [];
        resume([].concat(err1).concat(err2), val);
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
  function evalSympy(fn, expr, options, resume) {
    var errs = [];
    var result;
    _mathcore2.default.evaluateVerbose({
      method: "variables",
      options: {}
    }, expr, function (err, val) {
      if (err && err.length) {
        console.log("ERROR: " + JSON.stringify(err));
        errs = errs.concat(error(err, node.elts[0]));
        resume(errs, []);
      } else {
        var syms = val.result;
        var _index = void 0;
        if ((_index = syms.indexOf("\\pi")) >= 0) {
          syms = function (syms) {
            var rest = syms.slice(_index + 1);
            syms.length = _index;
            return syms.concat(rest);
          }(syms);
        }
        var symbols = "";
        var _params = "";
        if (syms && syms.length) {
          // Construct a list a symbols and parameters.
          syms.forEach(function (s) {
            if (symbols) {
              symbols += " ";
              _params += ",";
            }
            symbols += s;
            _params += s;
          });
          symbols = "symbols('" + symbols + "')";
          _params = "(" + _params + ")";
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
        texToSympy(expr, function (err, v) {
          if (err && err.length) {
            errs = errs.concat(err);
            resume(errs, []);
          } else {
            var _args = v + opts;
            var obj = {
              func: "eval",
              expr: "(lambda" + _params + ":" + fn + "(" + _args + "))(" + symbols + ")"
            };
            getSympy("/api/v1/eval", obj, function (err, data) {
              if (err && err.length) {
                errs = errs.concat(err);
              }
              resume(errs, data);
            });
          }
        });
      }
    });
  }
  function value(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        val2.value = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function seed(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val === "string") {
        val = {
          value: val,
          seed: val
        };
      } else {
        val.seed = val.value;
      }
      resume([], val);
    });
  }
  function stimulus(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val === "string") {
        val = {
          value: val,
          stimulus: val,
          seed: val
        };
      } else {
        val.stimulus = val.value;
        val.seed = val.value;
      }
      var env = topEnv(options);
      Object.keys(env.lexicon).forEach(function (key) {
        // Add bindings to target for use in resolving {x} refs.
        val[key] = String(env.lexicon[key].val);
      });
      resume([], val);
    });
  }
  function result(node, options, resume) {
    resume([], options.result);
  }
  function solution(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val === "string") {
        val = {
          value: val,
          solution: val,
          result: val
        };
      } else {
        val.result = val.value;
        val.solution = val.value;
      }
      options.result = val.value;
      resume([], val);
    });
  }
  function choices(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      (0, _assert.assert)(val instanceof Array);
      resume([], {
        choices: val
      });
    });
  }
  function precision(node, options, resume) {
    visit(node.elts[0], options, function (err, val1) {
      option(options, "precision", val1);
      visit(node.elts[1], options, function (err, val2) {
        resume(err, val2);
      });
    });
  }
  function format(node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, function (err, val1) {
      errs = errs.concat(err);
      visit(node.elts[1], options, function (err, val2) {
        var pattern = val1;
        errs = errs.concat(err);
        var response = val2.value || val2;
        if (response) {
          response = "" + response;
          _mathcore2.default.evaluateVerbose({
            method: "format",
            options: {}, // blank options
            value: pattern
          }, response, function (err, val) {
            if (err && err.length) {
              errs = errs.concat(error(err, node.elts[1]));
            }
            if ((typeof val2 === "undefined" ? "undefined" : _typeof(val2)) === "object") {
              val2.value = val.result;
            } else {
              val2 = val.result;
            }
            resume(errs, val2);
          });
        } else {
          resume(errs, val2);
        }
      });
    });
  }
  function sympy(node, options, resume) {
    return trans("SymPy", node, options, resume);
  }
  function simplified(node, options, resume) {
    var input = options.input;
    var rating = options.rating;
    mapList(input, function (d, resume) {
      _mathcore2.default.evaluateVerbose({
        method: "isSimplified",
        options: {}
      }, d, function (err, val) {
        resume(err, {
          method: "isSimplified",
          input: d,
          result: val.result
        });
      });
    }, function (err, val) {
      rating.forEach(function (v, i) {
        rating[i].simplified = val[i].result;
        rating[i].score += val[i].result ? 1 : 0;
      });
      resume(err, val);
    });
  }
  function expanded(node, options, resume) {
    var input = options.input;
    var rating = options.rating;
    mapList(input, function (d, resume) {
      _mathcore2.default.evaluateVerbose({
        method: "isExpanded",
        options: {}
      }, d, function (err, val) {
        resume(err, {
          result: val.result
        });
      });
    }, function (err, val) {
      rating.forEach(function (v, i) {
        rating[i].expanded = val[i].result;
        rating[i].score += val[i].result ? 1 : 0;
      });
      resume(err, val);
    });
  }
  function factored(node, options, resume) {
    var input = options.input;
    var rating = options.rating;
    mapList(input, function (d, resume) {
      _mathcore2.default.evaluateVerbose({
        method: "isFactorised",
        options: {}
      }, d, function (err, val) {
        resume(err, {
          result: val.result
        });
      });
    }, function (err, val) {
      rating.forEach(function (v, i) {
        rating[i].factored = val[i].result;
        rating[i].score += val[i].result ? 1 : 0;
      });
      resume(err, val);
    });
  }
  function ignoreOrder(node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, function (err, val1) {
      errs = errs.concat(err);
      options.settings.ignoreOrder = true;
      resume(errs, val1);
    });
  }
  function literal(node, options, resume) {
    var errs = [];
    options.settings = {};
    visit(node.elts[0], options, function (err, val1) {
      errs = errs.concat(err);
      var input = options.input;
      var rating = options.rating;
      var value = val1;
      var validations = options.validations;
      mapList(input, function (d, resume) {
        _mathcore2.default.evaluateVerbose({
          method: "equivLiteral",
          options: options.settings,
          value: value
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("literal() errs=" + errs);
          }
          resume(err, {
            method: "literal",
            value: value,
            result: val.result
          });
        });
      }, function (err, val) {
        input.forEach(function (v, i) {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "literal",
            value: value,
            result: val[i].result
          });
        });
        console.log("literal() validations=" + JSON.stringify(validations, null, 2));
        resume(err, validations);
      });
    });
  }
  function symbolic(node, options, resume) {
    var errs = [];
    options.settings = {};
    visit(node.elts[0], options, function (err, val1) {
      errs = errs.concat(err);
      var input = options.input;
      var rating = options.rating;
      var value = val1;
      var validations = options.validations;
      mapList(input, function (d, resume) {
        console.log("symbolic() value=" + value);
        console.log("symbolic() input=" + input);
        _mathcore2.default.evaluateVerbose({
          method: "equivSymbolic",
          options: options.settings,
          value: value
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("symbolic() errs=" + errs);
          }
          resume(err, {
            method: "equivSymbolic",
            value: value,
            result: val.result
          });
        });
      }, function (err, val) {
        input.forEach(function (v, i) {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "symbolic",
            value: value,
            result: val[i].result
          });
        });
        console.log("symbolic() validations=" + JSON.stringify(validations, null, 2));
        resume(err, validations);
      });
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
  function title(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        val2.title = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function parseIndex(str, val) {
    var t = {};
    if (typeof val === "string") {
      t[val] = 1;
      val = t;
    } else {
      //  t[str] = val;
    }
    var obj = void 0;
    while (str) {
      obj = {};
      obj["\\text{" + str + "}"] = val;
      str = str.substring(0, str.lastIndexOf("."));
      val = obj;
    }
    return obj;
  }
  function expandIndex(val) {
    // Expand path strings to indexes.
    // If "key": "val" --> parse key and assign val.
    // If "key": val --> expand val
    var keys = Object.keys(val);
    var obj = {};
    keys.forEach(function (k) {
      var v = val[k];
      obj = Object.assign(obj, parseIndex(k, v));
    });
    return obj;
  }
  function index(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        val2.index = expandIndex(val1);
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function notes(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        if (val1 instanceof Array) {
          val1 = val1.join("");
        }
        val2.notes = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function context(node, options, resume) {
    visit(node.elts[1], options, function (err2, val2) {
      visit(node.elts[0], options, function (err1, val1) {
        if (typeof val1 !== "string") {
          val1 = val1.value;
        }
        val2.context = options.data.context || val1;
        options.context = options.context || val2.context; // save first one.
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function template(node, options, resume) {
    // Evaluate from right to left.
    visit(node.elts[1], options, function (err2, val2) {
      visit(node.elts[0], options, function (err1, val1) {
        if (typeof val1 !== "string") {
          val1 = val1.value;
        }
        options.template = val2.template = options.data.template !== undefined ? options.data.template : val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function desmos(node, options, resume) {
    visit(node.elts[0], options, function (err, val1) {
      visit(node.elts[1], options, function (err, val2) {
        var values = [];
        val2.forEach(function (v) {
          if (val1 === "desmos_slope_intercept_question") {
            values.push({
              slope: v.m || v.slope,
              intercept: v.b || v.intercept
            });
          } else if (val1 === "desmos_sqrt_question") {
            values.push({
              vertex_x: v.h || v.vertex_x,
              vertex_y: v.k || v.vertex_y,
              leading_coefficient: v.a || v.leading_coefficient,
              direction: v.d || v.direction
            });
          } else if (val1 === "desmos_parabola_question") {
            values.push({
              "y-intercept": v.c || v["y-intercept"],
              "vertex_y": v.k || v.vertex_y,
              "vertex_x": v.h || v.vertex_x,
              "leading_coefficient": v.a || v.leading_coefficient,
              "number_of_solutions": v.n || v.number_of_solutions
            });
          } else if (val1 === "desmos_circle_question") {
            values.push({
              "center_x": v.x || v.center_x,
              "center_y": v.y || v.center_y,
              "radius": v.r || v.radius
            });
          } else if (val1 === "desmos_rectangle_question") {
            values.push({
              "area": v.A || v.area,
              "perimeter": v.P || v.perimeter
            });
          } else if (val1 === "desmos_volume_question") {
            values.push({
              "surface_area": v.A || v.surface_area,
              "volume": v.V || v.volume
            });
          } else {
            (0, _assert.assert)(false, val1);
          }
        });
        resume([].concat(err), {
          type: "desmos",
          subtype: val1,
          gen: val2,
          values: values
        });
      });
    });
  }
  function formulaEssay(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        type: "formulaessay",
        gen: val
      });
    });
  }
  function formula(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        type: "formula",
        gen: val
      });
    });
  }
  function mcq(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        type: "mcq",
        gen: val
      });
    });
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
  function latex(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (val.indexOf("\\text") >= 0) {
        val = val.substring(val.indexOf("\\text") + 5);
        val = val.substring(val.indexOf("{") + 1);
        val = val.substring(0, val.lastIndexOf("}"));
        val = val.trim();
      }
      if (val) {
        sympyToLaTeX(val, resume);
      } else {
        resume([].concat(err), val);
      }
    });
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
            options: {
              "ignoreOrder": true
            },
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
  function rubric(node, options, resume) {
    options.validations = [];
    visit(node.elts[1], options, function (err2, val2) {
      options.input = val2.input;
      options.rating = val2.rating;
      visit(node.elts[0], options, function (err1, val1) {
        console.log("rubric() val1=" + JSON.stringify(val1, null, 2));
        //val1 = val1[0];
        var vals = [];
        val1.forEach(function (vv, i) {
          console.log("rubric() vv=" + JSON.stringify(vv, null, 2));
          options.rating[i].scorer = vals[i] = vals[i] || {
            input: val2.input[i],
            result: vv.result,
            validation: vv instanceof Array && [0] || vv // FIXME alway pass an object here.
          };
        });
        resume([].concat(err1).concat(err2), {
          input: val2.input,
          score: vals
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
  function and(node, options, resume) {
    options.validations = [];
    visit(node.elts[0], options, function (err1, val1) {
      var vals = [];
      val1 = val1[0];
      val1.forEach(function (vv, i) {
        options.rating[i].scorer = vals[i] = vals[i] || {
          type: "and",
          result: true,
          validations: vv
        };
        console.log("and() vv=" + JSON.stringify(vv, null, 2));
        vv.forEach(function (v, j) {
          vals[i].result = vals[i].result && v.result;
        });
      });
      resume(err1, vals);
    });
  }
  function or(node, options, resume) {
    options.validations = [];
    visit(node.elts[0], options, function (err1, val1) {
      var vals = [];
      val1 = val1[0];
      val1.forEach(function (vv, i) {
        options.rating[i].scorer = vals[i] = vals[i] || {
          type: "or",
          result: false,
          validations: vv
        };
        console.log("or() vv=" + JSON.stringify(vv, null, 2));
        vv.forEach(function (v, j) {
          vals[i].result = vals[i].result || v.result;
        });
      });
      resume(err1, vals);
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
    // If there is input data, then use it, otherwise use default data.
    if (node.elts.length === 0) {
      // No args, so use the given data or empty.
      var data = options.data ? options.data : [];
      var rating = [];
      // data.forEach(d => {
      //   rating.push({
      //     value: d,
      //   });
      // });
      resume([], {
        input: data,
        rating: rating
      });
    } else {
      visit(node.elts[0], options, function (err1, val1) {
        var rating = [];
        var input = options.data && Object.keys(options.data).length !== 0 ? options.data : val1;
        input.forEach(function (i) {
          rating.push({
            score: 0,
            input: i,
            scorer: []
          });
        });
        var val = {
          input: input,
          rating: rating
        };
        resume([].concat(err1), val);
      });
    }
  }
  function isArray(val) {
    return val instanceof Array;
  }
  function params(node, options, resume) {
    // params {
    //   "+": "+",
    //   "a": " ",
    //   "b": "1",
    //   "c": "2",
    //   "d": " ",
    //   "e": "3",
    //   "f": "5",
    // }
    // values [
    //   ["+", "a", "b", "c", "d", "e", "f"],
    //   ["+", " ", "1", "2", " ", "3", "4"],
    // ]
    visit(node.elts[0], options, function (err1, val1) {
      var values = [];
      var params = options.data && options.data.params ? options.data.params // Use form data.
      : val1; // Use defaults.
      if (params) {
        var keys = void 0,
            vals = void 0;
        if (isArray(params)) {
          keys = params[0];
          vals = params.slice(1);
        } else {
          keys = Object.keys(params);
          vals = [Object.values(params)];
          params = [keys].concat(vals); // Make new form for params.
        }
        // Create first row using param names.
        values.push(keys);
        vals.forEach(function (v) {
          values = values.concat(generateDataFromArgs(keys, v));
        });
      }
      options.params = params;
      resume([], values);
    });
    function expandArgs(args) {
      var table = [];
      args = args ? args : []; // NOTE this only supports one row of args.
      args.forEach(function (s) {
        var exprs = s.split(",");
        var vals = [];
        exprs.forEach(function (expr) {
          var _expr$split = expr.split(":"),
              _expr$split2 = _slicedToArray(_expr$split, 2),
              r = _expr$split2[0],
              _expr$split2$ = _expr$split2[1],
              incr = _expr$split2$ === undefined ? 1 : _expr$split2$;

          var _r$split = r.split(".."),
              _r$split2 = _slicedToArray(_r$split, 2),
              start = _r$split2[0],
              stop = _r$split2[1];

          if (start >= stop) {
            // Guard against nonsense.
            stop = undefined;
          }
          if (stop === undefined) {
            vals.push(start);
          } else {
            var e = void 0,
                n = void 0,
                t = void 0;
            if (n = parseInt(start)) {
              t = "I";
              e = parseInt(stop);
            } else if (n = parseFloat(start)) {
              t = "F";
              e = parseFloat(stop);
            } else {
              t = "V";
              n = start.charCodeAt(0);
              e = stop.charCodeAt(0);
            }
            incr = isNaN(+incr) ? 1 : +incr;
            for (var i = 0; i <= e - n; i += incr) {
              // Expand range
              switch (t) {
                case "I":
                case "F":
                  vals.push(String(n + i));
                  break;
                case "V":
                  vals.push(String.fromCharCode(n + i) + start.substring(1));
                  break;
              }
            }
          }
        });
        table.push(vals);
      });
      return table;
    }
    function buildEnv(keys, vals) {
      var env = {}; //Object.assign({}, params);
      keys.forEach(function (k, i) {
        if (vals[i] !== undefined) {
          env[k] = {
            type: "const",
            value: vals[i]
          };
        }
      });
      return env;
    }
    function evalExpr(env, expr, resume) {
      if (expr.indexOf("=") === 0) {
        expr = expr.substring(1);
        _mathcore2.default.evaluateVerbose({
          method: "calculate",
          options: {
            env: env
          }
        }, expr, function (err, val) {
          return resume([], val.result);
        });
      } else {
        return resume([], expr);
      }
    }
    function generateDataFromArgs(keys, args) {
      var table = expandArgs(args);
      var data = [];

      var _loop = function _loop(i) {
        // For each parameter.
        var row = void 0;
        var len = data.length;
        var newData = [];
        for (var j = 0; j < table[i].length; j++) {
          // For each arg for each parameters.
          var col = table[i][j];
          if (len > 0) {
            var _loop2 = function _loop2(k) {
              // Add a new row extended by the current column value.
              var env = buildEnv(keys, data[k]);
              evalExpr(env, col, function (err, val) {
                row = [].concat(data[k]).concat(val);
                newData.push(row);
              });
            };

            for (var k = 0; k < len; k++) {
              _loop2(k);
            }
          } else {
            newData.push([col]);
          }
        }
        data = newData;
      };

      for (var i = 0; i < table.length; i++) {
        _loop(i);
      }
      return data;
    }
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
  function enterEnv(ctx, name, paramc) {
    if (!ctx.env) {
      ctx.env = [];
    }
    // recursion guard
    if (ctx.env.length > 380) {
      //return;  // just stop recursing
      throw new Error("runaway recursion");
    }
    ctx.env.push({
      name: name,
      paramc: paramc,
      lexicon: {},
      pattern: []
    });
  }
  function exitEnv(ctx) {
    ctx.env.pop();
  }
  function findWord(ctx, name) {
    var env = ctx.env;
    if (!env) {
      return null;
    }
    for (var i = env.length - 1; i >= 0; i--) {
      var word = env[i].lexicon[name];
      if (word) {
        return word;
      }
    }
    return null;
  }
  function addWord(ctx, lexeme, entry) {
    topEnv(ctx).lexicon[lexeme] = entry;
    return null;
  }
  function topEnv(ctx) {
    return ctx.env[ctx.env.length - 1];
  }
  function lambda(node, options, resume) {
    // Return a function value.
    visit(node.elts[0], options, function (err0, params) {
      var args = [].concat(options.args);
      enterEnv(options, "lambda", params.length);
      params.forEach(function (param, i) {
        var inits = node.elts[3] && nodePool[node.elts[3]].elts || [];
        if (args[i]) {
          // Got an arg so use it.
          addWord(options, param, {
            name: param,
            val: args[i]
          });
        } else {
          // Don't have an arg so evaluate the init and use its value.
          visit(inits[i], options, function (err, val) {
            addWord(options, param, {
              name: param,
              val: val
            });
          });
        }
      });
      visit(node.elts[1], options, function (err, val) {
        exitEnv(options);
        resume([].concat(err0).concat(err).concat(err), val);
      });
    });
  }
  function apply(node, options, resume) {
    // Apply a function to arguments.
    visit(node.elts[1], options, function (err1, args) {
      options.args = args;
      visit(node.elts[0], options, function (err0, val) {
        exitEnv(options);
        resume([].concat(err0), val);
      });
    });
  }
  function map(node, options, resume) {
    // Apply a function to arguments.
    visit(node.elts[1], options, function (err1, argsList) {
      mapList(argsList, function (val, resume) {
        options.args = val;
        visit(node.elts[0], options, function (err, val) {
          resume(err, val);
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
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "RECORD",
          elts: node.elts.slice(1)
        };
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
    "SUB": sub,
    "MUL": mul,
    "DIV": div,
    "POW": pow,
    "IGNORE-ORDER": ignoreOrder,
    "RUBRIC": rubric,
    "STYLE": style,
    "SYMPY": sympy,
    "CALCULATE": calculate,
    "SIMPLIFIED": simplified,
    "EXPANDED": expanded,
    "FACTORED": factored,
    "SYMBOLIC": symbolic,
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
    "AND": and,
    "OR": or,
    "LITERAL": literal,
    "SEED": seed,
    "STIMULUS": stimulus,
    "SOLUTION": solution,
    "FORMAT": format,
    "CHOICES": choices,
    "RESULT": result,
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
    "DECIMAL": decimal,
    "GEN": formula,
    "DESMOS": desmos,
    "FORMULA": formula,
    "FORMULA-ESSAY": formulaEssay,
    "MCQ": mcq,
    "LATEX": latex,
    "TITLE": title,
    "INDEX": index,
    "VALUE": value,
    "NOTES": notes,
    "CONTEXT": context,
    "TEMPLATE": template,
    "PARAMS": params
  };
  return transform;
}();
var render = function () {
  if (MATHJAX) {
    var tex2SVG = function tex2SVG(str, resume) {
      try {
        mjAPI.typeset({
          math: str,
          format: "TeX",
          svg: true,
          ex: 6,
          width: 60,
          linebreaks: true
        }, function (data) {
          if (!data.errors) {
            resume([], data.svg);
          } else {
            resume([], "");
          }
        });
      } catch (e) {
        resume(["MathJAX parsing error"], "");
      }
    };

    var escapeXML = function escapeXML(str) {
      return String(str).replace(/&(?!\w+;)/g, "&amp;").replace(/\n/g, " ").replace(/\\/g, "\\\\").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    mjAPI.config({
      MathJax: {
        SVG: {
          font: "Tex",
          linebreaks: {
            automatic: true,
            width: "50em"
          }
        },
        displayAlign: "left"
      }
    });
    mjAPI.start();
  }
  function nontrivial(str) {
    for (var i = 0; str && i < str.length; i++) {
      var c = str[i];
      if (c !== " " && c !== "}" && c !== "]") {
        return true;
      }
    }
    return false;
  }
  function escapeSpaces(str) {
    return str.replace(new RegExp(" ", "g"), "\\ ");
  }
  function render(val, options, resume) {
    resume([], val);
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
        console.log("[1] compile() err=" + err);
        if (err && err.length) {
          resume([].concat(err), val);
        } else {
          render(val, options, function (err, val) {
            console.log("[2] compile() err=" + err);
            resume([].concat(err), val);
          });
        }
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume(["Compiler error"], {
        rating: 0
      });
    }
  };
}();