/* Copyright (c) 2016, Art Compiler LLC */
/* @flow */
import {assert, message, messages, reserveCodeRange} from "./assert.js"
import * as mjAPI from "mathjax-node/lib/mj-single.js";
import MathCore from "./mathcore.js";
import * as https from "https";
import * as http from "http";
import {Core} from "./latex-sympy.js";
reserveCodeRange(1000, 1999, "compile");
messages[1001] = "Node ID %1 not found in pool.";
messages[1002] = "Invalid tag in node with Node ID %1.";
messages[1003] = "No async callback provided.";
messages[1004] = "No visitor method defined for '%1'.";
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
  function visit(nid, options, resume) {
    assert(typeof resume === "function", message(1003));
    // Get the node from the pool of nodes.
    let node;
    if (typeof nid === "object") {
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
    let val = node.elts[0];
    resume([], val);
  }
  function bool(node, options, resume) {
    let val = node.elts[0];
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
  function precision(node, options, resume) {
    visit(node.elts[0], options, (err, val) => {
      option(options, "precision", val);
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
          steps: [],
        }
      }
      if (err && err.length) {
        errs = errs.concat(err);
      }
      MathCore.evaluateVerbose({
        method: "variables",
        options: {},
      }, val0, function (err, val) {
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
          texToSympy(val0, (err, v) => {
            if (err && err.length) {
              errs = errs.concat(error(err, node.elts[0]));
              resume(errs, []);
            } else {
              let args = v + opts;
              let obj = {
                func: "eval",
                expr: "(lambda" + params + ":" + name +
                  "(" + args + "))(" + symbols + ")",
              };
              getSympy("/api/v1/eval", obj, function (err, data) {
                if (err && err.length) {
                  errs = errs.concat(error(err, node.elts[0]));
                }
                result.value = data;
                result.steps.push({
                  name: name,
                  val: data,
                });
                resume(errs, result);
              });
            }
          });
        }
      });
    });
  }
  function literal(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      let obj = {
        value: val,
        seed: val,
        steps: [{
          name: "seed",
          val: val,
        }],
      };
      resume([], obj);
    });
  }
  function stimulus(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val === "string") {
        val = {
          value: val,
          stimulus: val,
          steps: [{
            name: "stimulus",
            val: val,
          }],
        }
      } else {
        val.stimulus = val.value;
      }
      resume([], val);
    });
  }
  function solution(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      if (typeof val === "string") {
        val = {
          value: val,
          solution: val,
          steps: [{
            name: "solution",
            val: val,
          }],
        }
      } else {
        val.solution = val.value;
      }
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
  function title(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        val2.title = val1;
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
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        if (val1 instanceof Array) {
          val1 = val1.join("");
        }
        val2.context = val1;
        resume([].concat(err1).concat(err2), val2);
      });
    });
  }
  function gen(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      resume([].concat(err), {
        gen: val.values,
        params: val.params,
      });
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
            options: {},
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
    let data = options.data && options.data.params ? options.data.params : [[]];
    resume([], data);
  }
  function params(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      let params = val1;
      let values = [];
      let data = options.data && options.data.params ? options.data.params : [[]];
      if (params) {
        let keys = Object.keys(params);
        // Create first row using param names.
        data[0].forEach((d, i) => {
          // Replace default values with actual values.
          let k = keys[i];
          params[k] = d;
        });
        values.push(keys);
      }
      values = values.concat(generateDataFromArgs(params, data));
      resume([], {
        params: params,
        values: values,
      });
    });
    function expandArgs(params, args) {
      let table = [];
      args = args ? args[0] : []; // NOTE this only supports one row of args.
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
      })
      return table;
    }
    function buildEnv(params, vals) {
      let keys = Object.keys(params);
      let env = Object.assign({}, params);
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
    function generateDataFromArgs(params, args) {
      let table = expandArgs(params, args);
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
              let env = buildEnv(params, data[k]);
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
    let errs = [];
    let vals = [];
    visit(node.elts[1], options, function (err1, val1) {
      // args
      mapList(val1.values, (val, resume) => {
        options.args = [val];
        visit(node.elts[0], options, (err0, val0) => {
          resume([].concat(err0), val0);
        });
      }, (err, val) => {
        val1.values = val;
        resume(err, val1);
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
      // Copy checks into object code.
      val.checks = options.data ? options.data.checks : undefined;
      val.context = options.data && options.data.context ? options.data.context 
                  : val.context ? val.context
                  : "{{stimulus}}";
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
    "MUL" : mul,
    "POW" : pow,
    "STYLE" : style,
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
    "CONCAT" : concat,
    "LITERAL": literal,
    "STIMULUS": stimulus,
    "SOLUTION": solution,
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
    "GEN" : gen,
    "TITLE" : title,
    "NOTES" : notes,
    "CONTEXT" : context,
    "PARAMS" : params,
  }
  return transform;
})();
mjAPI.config({
  MathJax: {
    SVG: {
      font: "Tex"
    }
  }
});
mjAPI.start();
let render = (function() {
  function tex2SVG(str, resume) {
    try {
      mjAPI.typeset({
        math: str,
        format: "inline-TeX",
        svg: true,
        ex: 6,
        width: 100,
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
  function sympyToLaTeX(val, resume) {
    var errs = [];
    let obj = {
      func: "latex",
      expr: val,
    };
    getSympy("/api/v1/eval", obj, (err, data) => {
      if (err && err.length) {
        errs = errs.concat(error(err, node.elts[0]));
      }
      resume(errs, data);
    });
  }
  function render(val, resume) {
    let checks = val.checks;
    let params = val.params;
    let title = val.title;
    let notes = val.notes;
    let context = val.context;
    // Do some rendering here.
    var errs = [];
    var vals = [];
    let lst = [].concat(val.gen);
    mapList(lst, (v, resume) => {
      let lst = [];
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
      mapList(lst, (v, resume) => {
        if (typeof v.val === "string") {
          tex2SVG(v.val, (err, svg) => {
            if (err && err.length) {
              errs = errs.concat(err);
            }
            resume(errs, {
              name: v.name,
              val: v.val,
              svg: escapeXML(svg),
            });
          });
        } else {
          resume(errs, null);
        }
      }, (err, val) => {
        let name = lst.name;
        resume(err, {
          name: val.name,
          val: val,
        });
      });
    }, (err, val) => {
      resume([], {
        data: val,
        params: params,
        title: title,
        notes: notes,
        context: context,
        checks: checks,
      });
    });
  }
  return render;
})();
export let compiler = (function () {
  exports.compile = function compile(pool, data, resume) {
    // Compiler takes an AST in the form of a node pool and transforms it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      let options = {
        data: data
      };
      transform(pool, options, function (err, val) {
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
  }
})();
