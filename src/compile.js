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
        val.unshift(val1);
        resume([].concat(err1).concat(err2), val);
      });
    });
  } else if (lst && lst.length > 0) {
    fn(lst[0], (err1, val1) => {
      let val = [val1];
      resume([].concat(err1), val);
    });
  } else {
    resume([], []);
  }
}

let transform = (function() {
  let nodePool;
  function transform(pool, resume) {
    nodePool = pool;
    return visit(pool.root, {}, resume);
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
        console.log("Exception caught: " + e.stack);
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
            options: options,
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
      let lst = [].concat(val);
      if (err && err.length) {
        errs = errs.concat(err);
      }
      mapList(lst, (v, resume) => {
        MathCore.evaluateVerbose({
          method: "variables",
          options: options,
        }, v, function (err, val) {
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
            texToSympy(v, (err, v) => {
              if (err && err.length) {
                errs = errs.concat(error(err, node.elts[0]));
                resume(errs, []);
              } else {
                let obj = {
                  func: "eval",
                  expr: "(lambda" + params + ":" + name +
                    "(" + v + "))(" + symbols + ")",
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
          }
        });
      }, resume);
    });
  }
  function evalSympy2(name, node, options, resume) {
    var errs = [];
    let syms = ["x", "y", "z"];
    visit(node.elts[0], options, function (err, val0) {
      visit(node.elts[1], options, function (err, val1) {
        let symbols = "";
        let params = "";
        syms.forEach(s => {
          if (symbols) {
            symbols += " ";
            params += ",";
          }
          symbols += s;
          params += s;
        });
        let lst = [].concat(val0);
        if (err && err.length) {
          errs = errs.concat(err);
        }
        mapList(lst, (v, resume) => {
          texToSympy(v, (err, v) => {
            let obj = {
              func: "eval",
              expr: "(lambda(" + params + "):" + name +
                "(" + v + ", symbols('" + val1 + "')))(symbols('"+ symbols + "'))",
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
        reference.forEach(v => {
          MathCore.evaluateVerbose({
            method: "equivLiteral",
            options: options,
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
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), {key: val1, val: val2});
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
    "STYLE" : style,
    "CALCULATE": calculate,
    "SIMPLIFY": simplify,
    "EXPAND": expand,
    "FACTOR": factor,
    "EVAL": evaluate,
    "CANCEL": cancel,
    "COLLECT": collect,
    "APART": apart,
    "MATCH": match,
    "CONCAT" : concat,
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
    // Do some rendering here.
    if (typeof val === "string") {
      val = [val];
    }
    var errs = [];
    var vals = [];
    let lst = [].concat(val);
    mapList(lst, (v, resume) => {
      tex2SVG(v, (err, svg) => {
        if (err && err.length) {
          errs = errs.concat(err);
        }
        resume(errs, {
          val: v,
          svg: escapeXML(svg),
        });
      });
    }, resume);
  }
  return render;
})();
export let compiler = (function () {
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
  }
})();
