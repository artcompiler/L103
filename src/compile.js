/* Copyright (c) 2020, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./assert.ts";
import fs from "fs";
import * as https from "https";
import * as http from "http";
reserveCodeRange(1000, 1999, "compile");
messages[1001] = "Node ID %1 not found in pool.";
messages[1002] = "Invalid tag in node with Node ID %1.";
messages[1003] = "No async callback provided.";
messages[1004] = "No visitor method defined for '%1'.";
function getGCHost() {
  if (global.port === 5103) {
    return "localhost";
  } else {
    return "gc.acx.ac";
  }
}
function getGCPort() {
  if (global.port === 5103) {
    return "3000";
  } else {
    return "80";
  }
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
let transformer = (function() {
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
    console.log("visit() nid=" + nid + " node=" + JSON.stringify(node, null, 2));
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
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), `${val1} + ${val2}`);
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
    let clearSettings = options.clearSettings;
    if (node.elts && node.elts.length > 1) {
      if (clearSettings) {
        options.settings = {};  // Reset for each scorer.
      }
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
        val1 = [].concat(val1);
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
        };
        resume([].concat(err1), val);
      });
    }
  }
  function isArray(val) {
    return val instanceof Array;
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
    return ctx.env[ctx.env.length-1];
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

  function size(node, options, resume) {
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
        resume(
          [].concat(err1).concat(err2),
          `p.createCanvas(${val1},${val2})`
        );
      });
    });
  }

  function color(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `p.color(${val1})`
      );
    });
  }

  function triangle(node, options, resume) {
    visit(node.elts[0], options, function (err1, val0) {
      visit(node.elts[1], options, function (err1, val1) {
        visit(node.elts[2], options, function (err1, val2) {
          visit(node.elts[3], options, function (err1, val3) {
            visit(node.elts[4], options, function (err1, val4) {
              visit(node.elts[5], options, function (err1, val5) {
                resume(
                  [].concat(err1).concat(err1),
                  `p.triangle(${val0},${val1},${val2},${val3},${val4},${val5})`
                );
              });
            });
          });
        });
      });
    });
  }

  function strokeWeight(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `p.strokeWeight(${val1})`
      );
    });
  }

  function stroke(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `p.stroke(${val1})`
      );
    });
  }

  function rect(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      console.log("rect() val1=" + val1);
      resume(
        [].concat(err1).concat(err1),
        `p.rect(${val1})`
      );
    });
  }

  function fill(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `p.fill(${val1})`
      );
    });
  }

  function noFill(node, options, resume) {
    resume(
      [],
      `p.noFill()`
    );
  }

  function ellipse(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `p.ellipse(${val1})`
      );
    });
  }

  function background(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `p.background(${val1})`
      );
    });
  }

  function arc(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      console.log("arc() val1=" + val1);
      resume(
        [].concat(err1).concat(err1),
        `p.arc(${val1})`
      );
    });
  }

  function onSetup(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `${val1}`,
      );
    });
  }

  function onDraw(node, options, resume) {
    console.log("onDraw() node=" + JSON.stringify(node, null, 2));
    visit(node.elts[0], options, function (err1, val1) {
      resume(
        [].concat(err1).concat(err1),
        `onDraw(p, "${val1}")`,
      );
    });
  }

  function frameCount(node, options, resume) {
    resume(
      [],
      `p.frameCount`,
    );
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
    "CONCAT" : concat,
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
    "SIZE" : size,
    "BACKGROUND": background,
    "COLOR": color,
    "TRIANGLE": triangle,
    "RECT": rect,
    "ELLIPSE": ellipse,
    "NO_FILL": noFill,
    "FILL": fill,
    "STROKE": stroke,
    "STROKE-WEIGHT": strokeWeight,
    "ARC": arc,
    "ON_SETUP": onSetup,
    "ON_DRAW": onDraw,
    "FRAME_COUNT": frameCount,
  };
  return transform;
});
let render = (function() {
  function render(val, options, resume) {
    resume([], val);
  }
  return render;
})();

function statusCodeFromErrors(errs) {
  let statusCode;
  return errs.some(
    err => statusCode =
      err.statusCode
  ) && statusCode || 500;
}

function messageFromErrors(errs) {
  let message;
  return errs.some(
    err => message =
      err.data && err.data.error ||
      err.data
  ) && message || "Internal error";
}

export const compiler = (function () {
  return {
    langID: 103,
    version: "v0.0.0",
    compile: function compile(code, data, config, resume) {
      console.log("compile() code=" + JSON.stringify(code, null, 2));
      // Compiler takes an AST in the form of a node pool (code) and transforms it
      // into an object to be rendered on the client by the viewer for this
      // language.
      const transform = transformer();
      try {
        let options = {
          data: data,
          config: config,
          result: '',
        };
        transform(code, options, function (err, val) {
          if (err && err.length) {
            console.log("compile() err=" + JSON.stringify(err));
            resume([{
              statusCode: statusCodeFromErrors(err),
              error: messageFromErrors(err),
            }], val);
          } else {
            render(val, options, function (err, val) {
              val = !(val instanceof Array) && [val] || val;
              resume(err, val);
            });
          }
        });
      } catch (x) {
        console.log("ERROR with code");
        console.log(x.stack);
        resume([{
        statusCode: 500,
          error: "Compiler error"
        }]);
      }
    },
  };
})();
