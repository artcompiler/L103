/* Copyright (c) 2016, Art Compiler LLC */
/* @flow */
const MATHJAX = false;
import {assert, message, messages, reserveCodeRange} from "./assert.js"
/* MATHJAX
import * as mjAPI from "mathjax-node/lib/main.js";
*/
import MathCore from "./mathcore.js";
import * as https from "https";
import * as http from "http";
import {Core} from "./latexsympy.js";
reserveCodeRange(1000, 1999, "compile");
messages[1001] = "Node ID %1 not found in pool.";
messages[1002] = "Invalid tag in node with Node ID %1.";
messages[1003] = "No async callback provided.";
messages[1004] = "No visitor method defined for '%1'.";
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
    path: path,
  };
  var req = http.get(options, function(res) {
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
    },
  };
  let protocol = http; //https;
  var req = protocol.request(options, function(res) {
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
  req.on('error', function(e) {
    console.log("ERROR: " + e);
    resume([].concat(e), []);
  });
}
function mapList(lst, fn, resume) {
  if (lst && lst.length > 1) {
    fn(lst[0], (err1, val1) => {
      mapList(lst.slice(1), fn, (err2, val2) => {
        let val = [].concat(val2);
        if (val1 !== null) {
          val.unshift(val1);
        }
        resume([].concat(err1).concat(err2), val);
      });
    });
  } else if (lst && lst.length > 0) {
    fn(lst[0], (err1, val1) => {
      let val = [];
      if (val1 !== null) {
        val.push(val1);
      }
      resume([].concat(err1), val);
    });
  } else {
    resume([], []);
  }
}
let transform = (function() {
  let nodePool;
  let version;
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
      nid: nid,

    };
  }
  function texToSympy(val, resume) {
    var errs = [];
    var source = val;
    if (source) {
      try {
        Core.translate({}, source, function (err, val) {
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
      let latex = val;
      let opts;
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
    assert(typeof resume === "function", message(1003));
    // Get the node from the pool of nodes.
    let node;
    if (!nid) {
      resume([], null);
      return;
    } else if (typeof nid === "object") {
      node = nid;
    } else {
      node = nodePool[nid];
    }
    assert(node, message(1001, [nid]));
    assert(node.tag, message(1001, [nid]));
    assert(typeof table[node.tag] === "function", message(1004, [JSON.stringify(node.tag)]));
    return table[node.tag](node, options, resume);
  }
  // BEGIN VISITOR METHODS
  function str(node, options, resume) {
    let val = node.elts[0];
    resume([], val);
  }
  function num(node, options, resume) {
    let val = node.elts[0];
    resume([], +val);
  }
  function ident(node, options, resume) {
    let word = findWord(options, node.elts[0]);
    resume([], word && word.val || node.elts[0]);
  }
  function bool(node, options, resume) {
    let val = node.elts[0];
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
        resume([].concat(err1).concat(err2), Math.pow(val1,val2));
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
      let key = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        let obj = val2;
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
      let obj = val1;
      if (false) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      resume([].concat(err1), obj.length);
    });
  }
  function variable(node, options, resume) {
    visit(node.elts[0], options, (err, val) => {
      option(options, "variable", val);
      visit(node.elts[1], options, (err, val) => {
        resume(err, val);
      });
    });
  }
  function domain(node, options, resume) {
    visit(node.elts[0], options, (err, val) => {
      option(options, "domain", val);
      visit(node.elts[1], options, (err, val) => {
        resume(err, val);
      });
    });
  }
  function calculate(node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, function (err, val) {
      errs = errs.concat(err);
      let lst = [].concat(val);
      mapList(lst, (v, resume) => {
        var response = v;
        if (response) {
          options.strict = true;
          MathCore.evaluateVerbose({
            method: "calculate",
            options: {},
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
    MathCore.evaluateVerbose({
      method: "variables",
      options: {},
    }, expr, function (err, val) {
      if (err && err.length) {
        console.log("ERROR: " + JSON.stringify(err));
        errs = errs.concat(error(err, node.elts[0]));
        resume(errs, []);
      } else {
        let syms = val.result;
        let index;
        if ((index = syms.indexOf("\\pi")) >= 0) {
          syms = (function(syms) {
            var rest = syms.slice(index + 1);
            syms.length = index;
            return syms.concat(rest);
          })(syms);
        }
        let symbols = "";
        let params = "";
        if (syms && syms.length) {
          // Construct a list a symbols and parameters.
          syms.forEach(s => {
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
        let opts = "";
        Object.keys(options).forEach(k => {
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
        texToSympy(expr, (err, v) => {
          if (err && err.length) {
            errs = errs.concat(err);
            resume(errs, []);
          } else {
            let args = v + opts;
            let obj = {
              func: "eval",
              expr: "(lambda" + params + ":" + fn +
                "(" + args + "))(" + symbols + ")",
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
  function seed(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val === "string") {
        val = {
          value: val,
          seed: val,
        }
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
          seed: val,
        }
      } else {
        val.stimulus = val.value;
        val.seed = val.value;
      }
      let env = topEnv(options);
      Object.keys(env.lexicon).forEach(key => {
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
          result: val,
        }
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
      assert(val instanceof Array);
      resume([], {
        choices: val,
      });
    });
  }
  function precision(node, options, resume) {
    visit(node.elts[0], options, (err, val1) => {
      option(options, "precision", val1);
      visit(node.elts[1], options, (err, val2) => {
        resume(err, val2);
      });
    });
  }
  function format(node, options, resume) {
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      visit(node.elts[1], options, (err, val2) => {
        var pattern = val1;
        errs = errs.concat(err);
        let response = val2.value || val2;
        if (response) {
          response = "" + response;
          MathCore.evaluateVerbose({
            method: "format",
            options: {},  // blank options
            value: pattern,
          }, response, (err, val) => {
            if (err && err.length) {
              errs = errs.concat(error(err, node.elts[1]));
            }
            if (typeof val2 === "object") {
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
  function isTrue(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    let input = options.input;
    let validations = options.validations;
    mapList(input, (d, resume) => {
      MathCore.evaluateVerbose({
        method: "isTrue",
        options: options.settings,
      }, d, function (err, val) {
        resume(err, {
          method: "isTrue",
          input: d,
          result: val.result,
        });
      });
    }, (err, val) => {
      input.forEach((v, i) => {
        validations[i] = validations[i] || [];
        validations[i].push({
          type: "method",
          method: "istrue",
          result: val[i].result,
        });
      });
      resume(err, validations);
    });
  }
  function isValid(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    let input = options.input;
    let validations = options.validations;
    mapList(input, (d, resume) => {
      MathCore.evaluateVerbose({
        method: "validSyntax",
        options: options.settings,
      }, d, function (err, val) {
        resume(err, {
          method: "validSyntax",
          input: d,
          result: val.result,
        });
      });
    }, (err, val) => {
      input.forEach((v, i) => {
        validations[i] = validations[i] || [];
        validations[i].push({
          type: "method",
          method: "isvalid",
          result: val[i].result,
        });
      });
      resume(err, validations);
    });
  }
  function simplified(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    let input = options.input;
    let validations = options.validations;
    mapList(input, (d, resume) => {
      MathCore.evaluateVerbose({
        method: "isSimplified",
        options: options.settings,
      }, d, function (err, val) {
        resume(err, {
          method: "isSimplified",
          input: d,
          result: val.result,
        });
      });
    }, (err, val) => {
      input.forEach((v, i) => {
        validations[i] = validations[i] || [];
        validations[i].push({
          type: "method",
          method: "simplified",
          result: val[i].result,
        });
      });
      resume(err, validations);
    });
  }
  function expanded(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    let input = options.input;
    let validations = options.validations;
    mapList(input, (d, resume) => {
      MathCore.evaluateVerbose({
        method: "isExpanded",
        options: options.settings,
      }, d, function (err, val) {
        resume(err, {
          method: "isExpanded",
          input: d,
          result: val.result,
        });
      });
    }, (err, val) => {
      input.forEach((v, i) => {
        validations[i] = validations[i] || [];
        validations[i].push({
          type: "method",
          method: "expanded",
          result: val[i].result,
        });
      });
      resume(err, validations);
    });
  }
  function factored(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    let input = options.input;
    let validations = options.validations;
    mapList(input, (d, resume) => {
      MathCore.evaluateVerbose({
        method: "isFactorised",
        options: options.settings,
      }, d, function (err, val) {
        resume(err, {
          method: "isFactorised",
          input: d,
          result: val.result,
        });
      });
    }, (err, val) => {
      input.forEach((v, i) => {
        validations[i] = validations[i] || [];
        validations[i].push({
          type: "method",
          method: "factored",
          result: val[i].result,
        });
      });
      resume(err, validations);
    });
  }
  function field(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        options.settings.field = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function decimalPlaces(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        options.settings.decimalPlaces = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function setThousandsSeparator(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        options.settings.setDecimalSepartor = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function setDecimalSeparator(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        options.settings.setDecimalSeparator = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }

  function ignoreOrder(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.ignoreOrder = true;
      resume(errs, val1);
    });
  }
  function allowDecimal(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.allowDecimal = true;
      resume(errs, val1);
    });
  }
  function allowInterval(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.allowInterval = true;
      resume(errs, val1);
    });
  }
  function allowThousandsSeparator(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.allowThousandsSeparator = true;
      resume(errs, val1);
    });
  }
  function compareSides(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.compareSides = true;
      resume(errs, val1);
    });
  }
  function compareGrouping(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.compareGrouping = true;
      resume(errs, val1);
    });
  }
  function ignoreText(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.ignoreText = true;
      resume(errs, val1);
    });
  }
  function ignoreTrailingZeros(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.ignoreTrailingZeros = true;
      resume(errs, val1);
    });
  }
  function ignoreCoefficientOne(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.ignoreCoefficientOne = true;
      resume(errs, val1);
    });
  }
  function allowEulersNumber(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      options.settings.allowEulersNumber = true;
      resume(errs, val1);
    });
  }
  function inverseResult(node, options, resume) {
    if (!options.settings) {
      options.settings = {};
    }
    options.settings.inverseResult = true;
    var errs = [];
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      resume(errs, val1);
    });
  }
  function literal(node, options, resume) {
    var errs = [];
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      let input = options.input;
      let rating = options.rating;
      let value = val1;
      let validations = options.validations;
      console.log("literal() options=" + JSON.stringify(options));
      mapList(input, (d, resume) => {
        MathCore.evaluateVerbose({
          method: "equivLiteral",
          options: options.settings,
          value: value,
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("literal() errs=" + errs);
          }
          resume(err, {
            method: "literal",
            value: value,
            result: val.result,
          });
        });
      }, (err, val) => {
        input.forEach((v, i) => {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "literal",
            value: value,
            result: val[i].result,
          });
        });
        resume(err, validations);
      });
    });
  }
  function symbolic(node, options, resume) {
    var errs = [];
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      let input = options.input;
      let rating = options.rating;
      let value = val1;
      let validations = options.validations;
      options.settings.strict = true;
      mapList(input, (d, resume) => {
        MathCore.evaluateVerbose({
          method: "equivSymbolic",
          options: options.settings,
          value: value,
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("symbolic() errs=" + JSON.stringify(errs));
          }
          resume(err, {
            method: "equivSymbolic",
            value: value,
            result: val.result,
          });
        });
      }, (err, val) => {
        input.forEach((v, i) => {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "symbolic",
            value: value,
            result: val[i].result,
          });
        });
        resume(err, validations);
      });
    });
  }
  function syntax(node, options, resume) {
    var errs = [];
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      let input = options.input;
      let rating = options.rating;
      let value = val1;
      let validations = options.validations;
      mapList(input, (d, resume) => {
        MathCore.evaluateVerbose({
          method: "equivSyntax",
          options: options.settings,
          value: value,
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("syntax() errs=" + JSON.stringify(errs));
          }
          resume(err, {
            method: "equivSyntax",
            value: value,
            result: val.result,
          });
        });
      }, (err, val) => {
        input.forEach((v, i) => {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "syntax",
            value: value,
            result: val[i].result,
          });
        });
        resume(err, validations);
      });
    });
  }
  function isUnit(node, options, resume) {
    var errs = [];
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      let input = options.input;
      let rating = options.rating;
      let value = val1;
      let validations = options.validations;
      mapList(input, (d, resume) => {
        MathCore.evaluateVerbose({
          method: "isUnit",
          options: options.settings,
          value: value,
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("syntax() errs=" + JSON.stringify(errs));
          }
          resume(err, {
            method: "isUnit",
            value: value,
            result: val.result,
          });
        });
      }, (err, val) => {
        input.forEach((v, i) => {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "isunit",
            value: value,
            result: val[i].result,
          });
        });
        resume(err, validations);
      });
    });
  }
  function numeric(node, options, resume) {
    var errs = [];
    if (!options.settings) {
      options.settings = {};
    }
    visit(node.elts[0], options, (err, val1) => {
      errs = errs.concat(err);
      let input = options.input;
      let rating = options.rating;
      let value = val1;
      let validations = options.validations;
      mapList(input, (d, resume) => {
        MathCore.evaluateVerbose({
          method: "equivValue",
          options: options.settings,
          value: value,
        }, d, function (err, val) {
          if (err && err.length) {
            errs = errs.concat(error(err, node.elts[0]));
            console.log("numeric() errs=" + JSON.stringify(errs));
          }
          resume(err, {
            method: "equivValue",
            value: value,
            result: val.result,
          });
        });
      }, (err, val) => {
        input.forEach((v, i) => {
          validations[i] = validations[i] || [];
          validations[i].push({
            type: "method",
            method: "numeric",
            value: value,
            result: val[i].result,
          });
        });
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
    let t = {};
    if (typeof val === "string") {
      t[val] = 1;
      val = t;
    } else {
    //  t[str] = val;
    }
    let obj;
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
    let keys = Object.keys(val);
    let obj = {};
    keys.forEach(k => {
      let v = val[k];
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
        options.context = options.context || val2.context;  // save first one.
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
        options.template = val2.template = options.data.template !== undefined
          ? options.data.template : val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function desmos(node, options, resume) {
    visit(node.elts[0], options, function (err, val1) {
      visit(node.elts[1], options, function (err, val2) {
        let values = [];
        val2.forEach(v => {
          if (val1 === "desmos_slope_intercept_question") {
            values.push({
              slope: v.m || v.slope,
              intercept: v.b || v.intercept,
            });
          } else if (val1 === "desmos_sqrt_question") {
            values.push({
              vertex_x: v.h || v.vertex_x,
              vertex_y: v.k || v.vertex_y,
              leading_coefficient: v.a || v.leading_coefficient,
              direction: v.d || v.direction,
            });
          } else if (val1 === "desmos_parabola_question") {
            values.push({
              "y-intercept": v.c || v["y-intercept"],
              "vertex_y": v.k || v.vertex_y,
              "vertex_x": v.h || v.vertex_x,
              "leading_coefficient": v.a || v.leading_coefficient,
              "number_of_solutions": v.n || v.number_of_solutions,
            });
          } else if (val1 === "desmos_circle_question") {
            values.push({
              "center_x": v.x || v.center_x,
              "center_y": v.y || v.center_y,
              "radius": v.r || v.radius,
            });
          } else if (val1 === "desmos_rectangle_question") {
            values.push({
              "area": v.A || v.area,
              "perimeter": v.P || v.perimeter,
            });
          } else if (val1 === "desmos_volume_question") {
            values.push({
              "surface_area": v.A || v.surface_area,
              "volume": v.V || v.volume,
            });
          } else {
            assert(false, val1);
          }
        });
        resume([].concat(err), {
          type: "desmos",
          subtype: val1,
          gen: val2,
          values: values,
        });
      });
    });
  }
  function formulaEssay(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        type: "formulaessay",
        gen: val,
      });
    });
  }
  function formula(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        type: "formula",
        gen: val,
      });
    });
  }
  function mcq(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        type: "mcq",
        gen: val,
      });
    });
  }
  function sympyToLaTeX(val, resume) {
    var errs = [];
    let obj = {
      func: "latex",
      expr: val,
    };
    getSympy("/api/v1/eval", obj, (err, data) => {
      if (err && err.length) {
        console.log("ERROR sympyToLaTeX() val=" + val);
        errs = errs.concat(error(err));
      }
      data = data.replace(/log/g, "ln");
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
        reference.forEach(v => {
          MathCore.evaluateVerbose({
            method: "equivLiteral",
            options: {
              "ignoreOrder": true,
            },
            value: v,
          }, response, (err, val) => {
            if (err && err.length) {
              errs = errs.concat(error(err, node.elts[0]));
            } else {
              vals.push("\\text{" + +(val.result) + " | } " + v);
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
          style: val2,
        });
      });
    });
  }
  function rubric(node, options, resume) {
    options.validations = [];
    visit(node.elts[1], options, function (err2, val2) {
      options.input = val2.input;
      options.rating = val2.rating;
      let n0 = node.elts[0];
      if (nodePool[n0].tag === "LIST") {
        if (nodePool[n0].elts.length > 1) {
          n0 = {
            tag: "AND",
            elts: [n0],
          };
        } else {
          n0 = nodePool[n0].elts[0];
        }
      }
      visit(n0, options, function (err1, val1) {
        //val1 = val1[0];
        let vals = [];
        val1.forEach((vv, i) => {
          vv = vv instanceof Array && vv[0] || vv;
          options.rating[i].scorer = vals[i] = vals[i] || {
            input: val2.input[i],
            result: vv.result,
            validation: vv instanceof Array && [0] || vv,  // FIXME alway pass an object here.
          };
        });
        resume([].concat(err1).concat(err2), {
          input: val2.input,
          score: vals,
        });
      });
    });
  }
  function concat(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let str = "";
      if (val1 instanceof Array) {
        val1.forEach(v => {
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
      let vals = [];
      val1 = val1[0];
      val1.forEach((vv, i) => {
        options.rating[i].scorer = vals[i] = vals[i] || {
          type: "and",
          result: true,
          validations: vv,
        };
        vv.forEach((v, j) => {
          vals[i].result = vals[i].result && v.result;
        });
      });
      resume(err1, vals);
    });
  }
  function or(node, options, resume) {
    options.validations = [];
    visit(node.elts[0], options, function (err1, val1) {
      let vals = [];
      val1 = val1[0];
      val1.forEach((vv, i) => {
        options.rating[i].scorer = vals[i] = vals[i] || {
          type: "or",
          result: false,
          validations: vv,
        };
        vv.forEach((v, j) => {
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
          elts: node.elts.slice(1),
        };
        list(node, options, function (err2, val2) {
          let val = [].concat(val2);
          val.unshift(val1);
          resume([].concat(err1).concat(err2), val);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        let val = [val1];
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
      let data = options.data ? options.data : [];
      let rating = [];
      // data.forEach(d => {
      //   rating.push({
      //     value: d,
      //   });
      // });
      resume([], {
        input: data,
        rating: rating,
      });
    } else {
      visit(node.elts[0], options, function (err1, val1) {
        let rating = [];
        let input = options.data && Object.keys(options.data).length !== 0 && isArray(options.data) ? options.data : val1;
        input.forEach(i => {
          rating.push({
            score: 0,
            input: i,
            scorer: [],
          });
        });
        let val = {
          input: input,
          rating: rating,
        }
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
      let values = [];
      let params = options.data && options.data.params
                   ? options.data.params  // Use form data.
                   : val1;                // Use defaults.
      if (params) {
        let keys, vals;
        if (isArray(params)) {
          keys = params[0];
          vals = params.slice(1);
        } else {
          keys = Object.keys(params);
          vals = [Object.values(params)];
          params = [keys].concat(vals);  // Make new form for params.
        }
        // Create first row using param names.
        values.push(keys);
        vals.forEach(v => {
          values = values.concat(generateDataFromArgs(keys, v));
        });
      }
      options.params = params;
      resume([], values);
    });
    function expandArgs(args) {
      let table = [];
      args = args ? args : []; // NOTE this only supports one row of args.
      args.forEach(s => {
        let exprs = s.split(",");
        let vals = [];
        exprs.forEach(expr => {
          let [r, incr=1] = expr.split(":");
          let [start, stop] = r.split("..");
          if (start >= stop) {
            // Guard against nonsense.
            stop = undefined;
          }
          if (stop === undefined) {
            vals.push(start);
          } else {
            let e, n, t;
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
            for (let i = 0; i <= (e - n); i += incr) {
              // Expand range
              switch (t) {
              case "I":
              case "F":
                vals.push(String(n + i));
                break;
              case "V":
                vals.push(String.fromCharCode(n+i) + start.substring(1));
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
      let env = {}; //Object.assign({}, params);
      keys.forEach((k, i) => {
        if (vals[i] !== undefined) {
          env[k] = {
            type: "const",
            value: vals[i],
          };
        }
      });
      return env;
    }
    function evalExpr(env, expr, resume) {
      if (expr.indexOf("=") === 0) {
        expr = expr.substring(1);
        MathCore.evaluateVerbose({
          method: "calculate",
          options: {
            env: env
          },
        }, expr, function (err, val) {
          return resume([], val.result);
        });
      } else {
        return resume([], expr);
      }
    }
    function generateDataFromArgs(keys, args) {
      let table = expandArgs(args);
      let data = [];
      for (let i = 0; i < table.length; i++) {
        // For each parameter.
        let row;
        let len = data.length;
        let newData = [];
        for (let j = 0; j < table[i].length; j++) {
          // For each arg for each parameters.
          let col = table[i][j];
          if (len > 0) {
            for (let k = 0; k < len; k++) {
              // Add a new row extended by the current column value.
              let env = buildEnv(keys, data[k]);
              evalExpr(env, col, (err, val) => {
                row = [].concat(data[k]).concat(val);
                newData.push(row);
              });
            }
          } else {
            newData.push([col]);
          }
        }
        data = newData;
      }
      return data;
    }
  }
  function arg(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let key = val1;
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
      pattern: [],
    });
  }
  function exitEnv(ctx) {
    ctx.env.pop();
  }
  function findWord(ctx, name) {
    let env = ctx.env;
    if (!env) {
      return null;
    }
    for (var i = env.length-1; i >= 0; i--) {
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
    return ctx.env[ctx.env.length-1]
  }
  function lambda(node, options, resume) {
    // Return a function value.
    visit(node.elts[0], options, function (err0, params) {
      let args = [].concat(options.args);
      enterEnv(options, "lambda", params.length);
      params.forEach(function (param, i) {
        let inits = node.elts[3] && nodePool[node.elts[3]].elts || [];
        if (args[i]) {
          // Got an arg so use it.
          addWord(options, param, {
            name: param,
            val: args[i],
          });
        } else {
          // Don't have an arg so evaluate the init and use its value.
          visit(inits[i], options, (err, val) => {
            addWord(options, param, {
              name: param,
              val: val,
            });
          });
        }
      });
      visit(node.elts[1], options, function (err, val) {
        exitEnv(options);
        resume([].concat(err0).concat(err).concat(err), val)
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
      mapList(argsList, (val, resume) => {
        options.args = val;
        visit(node.elts[0], options, function (err, val) {
          resume(err, val);
        });
      }, (err, val) => {
        resume(err, val);
      });
    });
  }
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), {key: val1, val: val2});
      });
    });
  }
  function record(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node = {
          tag: "RECORD",
          elts: node.elts.slice(1),
        };
        record(node, options, function (err2, val2) {
          val2[val1.key] = val1.val;
          resume([].concat(err1).concat(err2), val2);
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        let val = {};
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
          elts: node.elts.slice(1),
        };
        exprs(node, options, function (err2, val2) {
          let val = [].concat(val2);
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
  let table = {
    "PROG" : program,
    "EXPRS" : exprs,
    "STR": str,
    "NUM": num,
    "IDENT": ident,
    "BOOL": bool,
    "LIST": list,
    "RECORD": record,
    "BINDING": binding,
    "ADD" : add,
    "SUB" : sub,
    "MUL" : mul,
    "DIV" : div,
    "POW" : pow,
    "IGNORE-ORDER" : ignoreOrder,
    "INVERSE-RESULT" : inverseResult,
    "RUBRIC" : rubric,
    "STYLE" : style,
    "SYMPY": sympy,
    "CALCULATE": calculate,
    "SIMPLIFIED": simplified,
    "EXPANDED": expanded,
    "IS-TRUE": isTrue,
    "IS-VALID": isValid,
    "IS-UNIT": isUnit,
    "FACTORED": factored,
    "SYMBOLIC": symbolic,
    "SYNTAX": syntax,
    "SIMPLIFY": simplify,
    "SOLVE": solve,
    "EXPAND": expand,
    "FACTOR": factor,
    "DECIMAL-PLACES": decimalPlaces,
    "ALLOW-DECIMAL": allowDecimal,
    "IGNORE-ORDER": ignoreOrder,
    "IGNORE-COEFFICIENT-ONE": ignoreCoefficientOne,
    "COMPARE-SIDES": compareSides,
    "COMPARE-GROUPING": compareGrouping,
    "SET-DECIMAL-SEPARATOR": setDecimalSeparator,
    "SET-THOUSANDS-SEPARATOR": setThousandsSeparator,
    "FIELD": field,
    "ALLOW-THOUSANDS-SEPARATOR": allowThousandsSeparator,
    "ALLOW-INTERVAL": allowInterval,
    "IGNORE-TEXT": ignoreText,
    "IGNORE-TRAILING-ZEROS": ignoreTrailingZeros,
    "EVAL": evaluate,
    "CANCEL": cancel,
    "INTEGRATE": integrate,
    "DIFF": diff,
    "COLLECT": collect,
    "APART": apart,
    "MATCH": match,
    "CONCAT" : concat,
    "AND" : and,
    "OR" : or,
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
    "VAL" : val,
    "KEY" : key,
    "LEN" : len,
    "ARG" : arg,
    "DATA" : inData,
    "IN" : inData,
    "LAMBDA" : lambda,
    "PAREN" : paren,
    "APPLY" : apply,
    "MAP" : map,
    "DECIMAL": decimal,
    "GEN" : formula,
    "DESMOS" : desmos,
    "FORMULA" : formula,
    "FORMULA-ESSAY" : formulaEssay,
    "MCQ" : mcq,
    "LATEX" : latex,
    "TITLE" : title,
    "INDEX" : index,
    "NUMERIC" : numeric,
    "VALUE" : numeric,
    "NOTES" : notes,
    "CONTEXT" : context,
    "TEMPLATE" : template,
    "PARAMS" : params,
  }
  return transform;
})();
let render = (function() {
  if (MATHJAX) {
    mjAPI.config({
      MathJax: {
        SVG: {
          font: "Tex",
          linebreaks: {
            automatic: true,
            width: "50em",
          },
        },
        displayAlign: "left",
      }
    });
    mjAPI.start();
    function tex2SVG(str, resume) {
      try {
        mjAPI.typeset({
          math: str,
          format: "TeX",
          svg: true,
          ex: 6,
          width: 60,
          linebreaks: true,
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
    }
    function escapeXML(str) {
      return String(str)
        .replace(/&(?!\w+;)/g, "&amp;")
        .replace(/\n/g, " ")
        .replace(/\\/g, "\\\\")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
  }
  function nontrivial(str) {
    for (let i = 0; str && i < str.length; i++) {
      let c = str[i];
      if (c !== " " &&
          c !== "}" &&
          c !== "]") {
        return true;
      }
    }
    return false;
  }
  function escapeSpaces(str) {
    return str.replace(new RegExp(" ","g"), "\\ ");
  }
  function render(val, options, resume) {
    resume([], val);
  }
  return render;
})();
export let compiler = (function () {
  exports.compile = function compile(pool, data, resume) {
//    console.log("compile() pool=" + JSON.stringify(pool));
    // Compiler takes an AST in the form of a node pool and transforms it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      let options = {
        data: data
      };
      transform(pool, options, function (err, val) {
        if (err && err.length) {
          console.log("compile() err=" + JSON.stringify(err));
          resume([].concat(err), val);
        } else {
          render(val, options, function (err, val) {
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
  }
})();
