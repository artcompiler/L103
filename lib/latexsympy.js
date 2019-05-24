"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.spokenmath = f();
  }
})(function () {
  var define, module, exports;return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
          }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];return o(n || r);
          }, p, p.exports, r, e, n, t);
        }return n[i].exports;
      }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
        o(t[i]);
      }return o;
    }return r;
  }()({ 1: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Assert = exports.checkCounter = exports.setCounter = exports.clearLocation = exports.setLocation = exports.reserveCodeRange = exports.message = exports.assert = undefined;

      var _backward = require("./backward.js");

      var ASSERT = true; /*
                          * Copyright 2013 Art Compiler LLC
                          *
                          * Licensed under the Apache License, Version 2.0 (the "License");
                          * you may not use this file except in compliance with the License.
                          * You may obtain a copy of the License at
                          *
                          *     http://www.apache.org/licenses/LICENSE-2.0
                          *
                          * Unless required by applicable law or agreed to in writing, software
                          * distributed under the License is distributed on an "AS IS" BASIS,
                          * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                          * See the License for the specific language governing permissions and
                          * limitations under the License.
                          */
      /*
        ASSERTS AND MESSAGES
      
        We use the 'assert()' function to trap invalid states of all kinds. External
        messages are distinguished from internal messages by a numeric prefix that
        indicates the error code associated with the message. For example, the
        following two asserts implement an internal and external assert, respectively.
      
           assert(false, "This code is broken.");
           assert(false, "1001: Invalid user input.");
      
        To aid in the writing of external messages, we keep them in a single global
        table named 'Assert.messages'. Each module adds to this table its own messages
        with an expression such as
      
           messages[1001] = "Invalid user input.";
      
        These messages are accessed with the 'message' function as such
      
           message(1001);
      
        Calling 'assert' with 'message' looks like
      
           assert(x != y, message(1001));
      
        ALLOCATING ERROR CODES
      
        In order to avoid error code conflicts, each module claims a range of values
        that is not already taken by the modules in the same system. A module claims
        a range of codes by calling the function reserveCodeRange() like this:
      
           reserveCodeRange(1000, 1999, "mymodule");
      
        If the requested code range has any values that are already reserved, then
        an assertion is raised.
      
        USAGE
      
        In general, only allocate message codes for external asserts. For internal
        asserts, it is sufficient to simply inline the message text in the assert
        expression.
      
        It is good to write an assert for every undefined state, regardless of whether
        it is the result of external input or not. Asserts can then be externalized if
        and when they it is clear that they are the result of external input.
      
        A client module can override the messages provided by the libraries it uses by
        simply redefining those messages after the defining library is loaded. That is,
        the client can copy and past the statements of the form
      
           messages[1001] = "Invalid user input.";
      
        and provide new text for the message.
      
           messages[1001] = "Syntax error.";
      
        In the same way different sets of messages can be overridden for the purpose
        of localization.
      
      */

      var assert = exports.assert = function () {
        return !ASSERT ? function () {} : function (val, str, location) {
          if (str === void 0) {
            str = "failed!";
          }
          if (!val) {
            var err = new Error(str);
            err.location = location ? location : Assert.location;
            throw err;
          }
        };
      }();

      var message = exports.message = function message(errorCode, args) {
        var str = Assert.messages[errorCode];
        var location = Assert.location;
        if (args) {
          (0, _backward.forEach)(args, function (arg, i) {
            str = str.replace("%" + (i + 1), arg);
          });
        }
        return errorCode + ": " + str;
      };

      var reserveCodeRange = exports.reserveCodeRange = function reserveCodeRange(first, last, moduleName) {
        assert(first <= last, "Invalid code range");
        var noConflict = (0, _backward.every)(Assert.reservedCodes, function (range) {
          return last < range.first || first > range.last;
        });
        assert(noConflict, "Conflicting request for error code range");
        Assert.reservedCodes.push({ first: first, last: last, name: moduleName });
      };

      var setLocation = exports.setLocation = function setLocation(location) {
        //assert(location, "Empty location");
        Assert.location = location;
      };

      var clearLocation = exports.clearLocation = function clearLocation() {
        Assert.location = null;
      };

      var setCounter = exports.setCounter = function setCounter(count, message) {
        Assert.count = count;
        Assert.countMessage = message ? message : "ERROR count exceeded";
      };

      var checkCounter = exports.checkCounter = function checkCounter() {
        var count = Assert.count;
        if (typeof count !== "number" || isNaN(count)) {
          assert(false, "ERROR counter not set");
          return;
        }
        assert(Assert.count--, Assert.countMessage);
      };

      var Assert = exports.Assert = {
        assert: assert,
        message: message,
        messages: {},
        reserveCodeRange: reserveCodeRange,
        reservedCodes: [],
        setLocation: setLocation,
        clearLocation: clearLocation,
        setCounter: setCounter,
        checkCounter: checkCounter
      };
    }, { "./backward.js": 3 }], 2: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Ast = undefined;

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      }; /*
          * Copyright 2013 Art Compiler LLC
          *
          * Licensed under the Apache License, Version 2.0 (the "License");
          * you may not use this file except in compliance with the License.
          * You may obtain a copy of the License at
          *
          *     http://www.apache.org/licenses/LICENSE-2.0
          *
          * Unless required by applicable law or agreed to in writing, software
          * distributed under the License is distributed on an "AS IS" BASIS,
          * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
          * See the License for the specific language governing permissions and
          * limitations under the License.
          */
      /*
        This module implements the node factory for abstract syntax trees (AST).
      
        Each node inherits an Ast instance as it prototype.
      
        All Ast instances share the same node pool and therefore intern trees of
        identical structure to the same node id.
      
        Construct new nodes using the following forms:
          ast.create("+").arg(10).arg(20);
          ast.create("+", [10, 20]);
          ast.create({op: "+", args: [10, 20]});
      
        Node manipulation functions are chainable.
      
       */

      var _backward = require("./backward.js");

      var _assert = require("./assert.js");

      var Ast = exports.Ast = function () {
        // Pool of nodes. Shared between all Ast instances.

        function Ast() {
          this.nodePool = ["unused"];
          this.nodeMap = {};
        }

        // Create a node for operation 'op'
        Ast.prototype.create = function create(op, args) {
          // Create a node that inherits from Ast
          var node = create(this);
          if (typeof op === "string") {
            node.op = op;
            if (args instanceof Array) {
              node.args = args;
            } else {
              node.args = [];
            }
          } else if (op !== null && (typeof op === "undefined" ? "undefined" : _typeof(op)) === "object") {
            var obj = op;
            (0, _backward.forEach)(keys(obj), function (v, i) {
              node[v] = obj[v];
            });
          }
          return node;
        };

        // Append node to this node's args.
        Ast.prototype.arg = function arg(node) {
          if (!isNode(this)) {
            throw "Malformed node";
          }
          this.args.push(node);
          return this;
        };

        // Get or set the Nth arg of this node.
        Ast.prototype.argN = function argN(i, node) {
          if (!isNode(this)) {
            throw "Malformed node";
          }
          if (node === undefined) {
            return this.args[i];
          }
          this.args[i] = node;
          return this;
        };

        // Get or set the args of this node.
        Ast.prototype.args = function args(a) {
          if (!isNode(this)) {
            throw "Malformed node";
          }
          if (a === undefined) {
            return this.args;
          }
          this.args = a;
          return this;
        };

        // Check if obj is a value node object [private]
        Ast.prototype.isNode = isNode;

        function isNode(obj) {
          if (obj === undefined) {
            obj = this;
          }
          return obj.op && obj.args;
        }

        // Intern an AST into the node pool and return its node id.
        Ast.prototype.intern = function intern(node) {
          if (this instanceof Ast && node === undefined && isNode(this)) {
            // We have an Ast that look like a node
            node = this;
          }
          (0, _assert.assert)((typeof node === "undefined" ? "undefined" : _typeof(node)) === "object", "node not an object");
          var op = node.op;
          var count = node.args.length;
          var args = "";
          var args_nids = [];
          for (var i = 0; i < count; i++) {
            args += " ";
            if (typeof node.args[i] === "string") {
              args += args_nids[i] = node.args[i];
            } else {
              args += args_nids[i] = this.intern(node.args[i]);
            }
          }
          if (node.lbrk && node.lbrk !== "{".charCodeAt(0)) {
            // Make brackets part of the key.
            args += String.fromCharCode(node.lbrk);
            args += String.fromCharCode(node.rbrk);
          }
          var key = op + count + args;
          var nid = this.nodeMap[key];
          if (nid === void 0) {
            this.nodePool.push({
              op: op,
              args: args_nids
            });
            nid = this.nodePool.length - 1;
            this.nodeMap[key] = nid;
          }
          return nid;
        };

        // Get a node from the node pool.
        Ast.prototype.node = function node(nid) {
          var n = JSON.parse(JSON.stringify(this.nodePool[nid]));
          for (var i = 0; i < n.args.length; i++) {
            // If string, then not a nid.
            if (typeof n.args[i] !== "string") {
              n.args[i] = this.node(n.args[i]);
            }
          }
          return n;
        };

        // Dump the contents of the node pool.
        Ast.prototype.dumpAll = function dumpAll() {
          var s = "";
          var ast = this;
          (0, _backward.forEach)(this.nodePool, function (n, i) {
            s += "\n" + i + ": " + Ast.dump(n);
          });
          return s;
        };

        // Dump the contents of a node.
        Ast.dump = Ast.prototype.dump = function dump(n) {
          if (typeof n === "string") {
            var _s = "\"" + n + "\"";
          } else if (typeof n === "number") {
            var _s2 = n;
          } else {
            var _s3 = "{ op: \"" + n.op + "\", args: [ ";
            for (var i = 0; i < n.args.length; i++) {
              if (i > 0) {
                _s3 += " , ";
              }
              _s3 += dump(n.args[i]);
            }
            _s3 += " ] }";
          }
          return s;
        };

        // Self tests
        var RUN_SELF_TESTS = false;
        function test() {
          (function () {})();
        }
        if (RUN_SELF_TESTS) {
          test();
        }

        return Ast;
      }();
    }, { "./assert.js": 1, "./backward.js": 3 }], 3: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      };

      /*
       * Copyright 2013 Art Compiler LLC
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */
      /*
        Backward.js defines lexically scoped functions to support backward
        compatibility with IE8.
      
        Derived from https://github.com/kriskowal/es5-shim
      */

      // ES5 15.4.4.18
      // http://es5.github.com/#x15.4.4.18
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

      // Check failure of by-index access of string characters (IE < 9)
      // and failure of `0 in boxedString` (Rhino)
      var boxedString = Object("a"),
          splitString = boxedString[0] != "a" || !(0 in boxedString);

      var forEach = exports.forEach = function forEach(array, fun) {
        var thisp = arguments[2];
        if (Array.prototype.indexOf) {
          return array.forEach(fun);
        }
        var object = toObject(array),
            self = splitString && _toString(object) == "[object String]" ? object.split("") : object,
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
          throw new TypeError(); // TODO message
        }

        while (++i < length) {
          if (i in self) {
            // Invoke the callback function with call, passing arguments:
            // context, property value, property key, thisArg object
            // context
            fun.call(thisp, self[i], i, object);
          }
        }
      };

      // ES5 15.4.4.20
      // http://es5.github.com/#x15.4.4.20
      // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
      var filter = exports.filter = function filter(array, fun /*, thisp */) {
        var thisp = arguments[2];
        if (Array.prototype.filter) {
          return array.filter(fun);
        }
        var object = toObject(array),
            self = splitString && _toString(array) == "[object String]" ? array.split("") : object,
            length = self.length >>> 0,
            result = [],
            value;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
          throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
          if (i in self) {
            value = self[i];
            if (fun.call(thisp, value, i, object)) {
              result.push(value);
            }
          }
        }
        return result;
      };

      // ES5 15.4.4.16
      // http://es5.github.com/#x15.4.4.16
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
      var every = exports.every = function every(array, fun /*, thisp */) {
        var thisp = arguments[2];
        if (Array.prototype.every) {
          return array.every(fun, thisp);
        }
        var object = toObject(array),
            self = splitString && _toString(array) == "[object String]" ? array.split("") : object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
          throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
          if (i in self && !fun.call(thisp, self[i], i, object)) {
            return false;
          }
        }
        return true;
      };

      // ES5 15.4.4.17
      // http://es5.github.com/#x15.4.4.17
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
      var some = exports.some = function some(array, fun /*, thisp */) {
        var thisp = arguments[2];
        if (Array.prototype.some) {
          return array.some(fun, thisp);
        }
        var object = toObject(array),
            self = splitString && _toString(array) == "[object String]" ? array.split("") : object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
          throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
          if (i in self && fun.call(thisp, self[i], i, object)) {
            return true;
          }
        }
        return false;
      };

      // ES5 15.4.4.14
      // http://es5.github.com/#x15.4.4.14
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
      var indexOf = exports.indexOf = function indexOf(array, sought /*, fromIndex */) {
        var fromIndex = arguments[2];
        if (Array.prototype.indexOf || typeof array === "string") {
          return array.indexOf(sought, fromIndex);
        }
        var self = splitString && _toString(array) == "[object String]" ? array.split("") : toObject(array),
            length = self.length >>> 0;

        if (!length) {
          return -1;
        }

        var i = 0;
        if (arguments.length > 2) {
          i = toInteger(fromIndex);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
          if (i in self && self[i] === sought) {
            return i;
          }
        }
        return -1;
      };

      // ES5 15.2.3.14
      // http://es5.github.com/#x15.2.3.14
      var keys = exports.keys = function keys(object) {
        if (Object.keys) {
          return Object.keys(object);
        }
        // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
        var hasDontEnumBug = true,
            dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
            dontEnumsLength = dontEnums.length;

        for (var key in { "toString": null }) {
          hasDontEnumBug = false;
        }

        if ((typeof object === "undefined" ? "undefined" : _typeof(object)) != "object" && typeof object != "function" || object === null) {
          throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
          if (owns(object, name)) {
            keys.push(name);
          }
        }

        if (hasDontEnumBug) {
          for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
            var dontEnum = dontEnums[i];
            if (owns(object, dontEnum)) {
              keys.push(dontEnum);
            }
          }
        }
        return keys;
      };

      // ES5 9.9
      // http://es5.github.com/#x9.9
      var toObject = exports.toObject = function toObject(o) {
        if (o == null) {
          // this matches both null and undefined
          throw new TypeError("can't convert " + o + " to object");
        }
        return Object(o);
      };

      //var call = Function.prototype.call;
      //var prototypeOfArray = Array.prototype;
      var prototypeOfObject = Object.prototype;
      //var _Array_slice_ = prototypeOfArray.slice;
      // Having a toString local variable name breaks in Opera so use _toString.
      var _toString = function _toString(val) {
        return prototypeOfObject.toString.apply(val);
      }; //call.bind(prototypeOfObject.toString);
      var owns = function owns(object, name) {
        return prototypeOfObject.hasOwnProperty.call(object, name);
      }; //call.bind(prototypeOfObject.hasOwnProperty);

      var create = exports.create = function create(o) {
        if (Object.create) {
          return Object.create(o);
        }
        var F = function F() {};
        if (arguments.length != 1) {
          throw new Error('Object.create implementation only accepts one parameter.');
        }
        F.prototype = o;
        return new F();
      };

      // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
      if (typeof window !== "undefined" && !window.JSON) {
        window.JSON = {
          parse: function parse(sJSON) {
            return eval('(' + sJSON + ')');
          },
          stringify: function () {
            var toString = Object.prototype.toString;
            var isArray = Array.isArray || function (a) {
              return toString.call(a) === '[object Array]';
            };
            var escMap = { '"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t' };
            var escFunc = function escFunc(m) {
              return escMap[m] || "\\u" + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
            };
            var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
            return function stringify(value) {
              if (value == null) {
                return 'null';
              } else if (typeof value === 'number') {
                return isFinite(value) ? value.toString() : 'null';
              } else if (typeof value === 'boolean') {
                return value.toString();
              } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
                if (typeof value.toJSON === 'function') {
                  return stringify(value.toJSON());
                } else if (isArray(value)) {
                  var res = '[';
                  for (var i = 0; i < value.length; i++) {
                    res += (i ? ', ' : '') + stringify(value[i]);
                  }return res + ']';
                } else if (toString.call(value) === '[object Object]') {
                  var tmp = [];
                  for (var k in value) {
                    if (value.hasOwnProperty(k)) tmp.push(stringify(k) + ': ' + stringify(value[k]));
                  }
                  return '{' + tmp.join(', ') + '}';
                }
              }
              return '"' + value.toString().replace(escRE, escFunc) + '"';
            };
          }()
        };
      }
    }, {}], 4: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Core = undefined;

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      };

      var _slicedToArray = function () {
        function sliceIterator(arr, i) {
          var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;_e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }return _arr;
        }return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }(); /*
            * Copyright 2016 Art Compiler LLC. All Rights Reserved.
            *
            */

      var _version = require("./version.js");

      var _backward = require("./backward.js");

      var _assert = require("./assert.js");

      var _ast = require("./ast.js");

      var _model = require("./model.js");

      var _rules2 = require("./rules.js");

      (function (ast) {

        var messages = _assert.Assert.messages;

        function newNode(op, args) {
          return {
            op: op,
            args: args
          };
        }

        function binaryNode(op, args, flatten) {
          if (args.length < 2) {
            return args[0];
          }
          var aa = [];
          (0, _backward.forEach)(args, function (n) {
            if (flatten && n.op === op) {
              aa = aa.concat(n.args);
            } else {
              aa.push(n);
            }
          });
          return newNode(op, aa);
        }

        // The outer Visitor function provides a global scope for all visitors,
        // as well as dispatching to methods within a visitor.
        function Visitor(ast) {
          function visit(node, visit, resume) {
            (0, _assert.assert)(node.op && node.args, "Visitor.visit() op=" + node.op + " args = " + node.args);
            switch (node.op) {
              case _model.Model.NUM:
                node = visit.numeric(node, resume);
                break;
              case _model.Model.ADD:
              case _model.Model.SUB:
              case _model.Model.PM:
              case _model.Model.BACKSLASH: // set operator
              case _model.Model.DIV:
              case _model.Model.FRAC:
              case _model.Model.LOG:
              case _model.Model.COLON:
              case _model.Model.FUNC:
              case _model.Model.TYPE:
                if (node.args.length === 1) {
                  node = visit.unary(node, resume);
                } else {
                  node = visit.binary(node, resume);
                }
                break;
              case _model.Model.MUL:
              case _model.Model.TIMES:
              case _model.Model.COEFF:
                node = visit.multiplicative(node, resume);
                break;
              case _model.Model.POW:
                node = visit.exponential(node, resume);
                break;
              case _model.Model.VAR:
                node = visit.variable(node, resume);
                break;
              case _model.Model.SQRT:
              case _model.Model.SIN:
              case _model.Model.COS:
              case _model.Model.TAN:
              case _model.Model.SEC:
              case _model.Model.CSC:
              case _model.Model.COT:
              case _model.Model.ARCSIN:
              case _model.Model.ARCCOS:
              case _model.Model.ARCTAN:
              case _model.Model.ARCSEC:
              case _model.Model.ARCCSC:
              case _model.Model.ARCCOT:
              case _model.Model.SINH:
              case _model.Model.COSH:
              case _model.Model.TANH:
              case _model.Model.ARCSINH:
              case _model.Model.ARCCOSH:
              case _model.Model.ARCTANH:
              case _model.Model.ARCSECH:
              case _model.Model.ARCCSCH:
              case _model.Model.ARCCOTH:
              case _model.Model.SECH:
              case _model.Model.CSCH:
              case _model.Model.COTH:
              case _model.Model.PERCENT:
              case _model.Model.M:
              case _model.Model.ABS:
              case _model.Model.FACT:
              case _model.Model.FORALL:
              case _model.Model.EXISTS:
              case _model.Model.IN:
              case _model.Model.SUM:
              case _model.Model.LIM:
              case _model.Model.EXP:
              case _model.Model.TO:
              case _model.Model.DERIV:
              case _model.Model.INTEGRAL:
              case _model.Model.PROD:
              case _model.Model.CUP:
              case _model.Model.BIGCUP:
              case _model.Model.CAP:
              case _model.Model.BIGCAP:
              case _model.Model.PIPE:
              case _model.Model.ION:
              case _model.Model.POW:
              case _model.Model.SUBSCRIPT:
              case _model.Model.OVERLINE:
              case _model.Model.OVERSET:
              case _model.Model.UNDERSET:
              case _model.Model.MATHBF:
              case _model.Model.NONE:
              case _model.Model.DEGREE:
              case _model.Model.DOT:
              case _model.Model.MATHFIELD:
              case _model.Model.SET:
              case _model.Model.NOT:
                node = visit.unary(node, resume);
                break;
              case _model.Model.COMMA:
              case _model.Model.MATRIX:
              case _model.Model.VEC:
              case _model.Model.ROW:
              case _model.Model.COL:
              case _model.Model.LIST:
                node = visit.comma(node, resume);
                break;
              case _model.Model.EQL:
              case _model.Model.LT:
              case _model.Model.LE:
              case _model.Model.GT:
              case _model.Model.GE:
              case _model.Model.NE:
              case _model.Model.NGTR:
              case _model.Model.NLESS:
              case _model.Model.NI:
              case _model.Model.SUBSETEQ:
              case _model.Model.SUPSETEQ:
              case _model.Model.SUBSET:
              case _model.Model.SUPSET:
              case _model.Model.NNI:
              case _model.Model.NSUBSETEQ:
              case _model.Model.NSUPSETEQ:
              case _model.Model.NSUBSET:
              case _model.Model.NSUPSET:
              case _model.Model.APPROX:
              case _model.Model.IMPLIES:
              case _model.Model.PERP:
              case _model.Model.PROPTO:
              case _model.Model.PARALLEL:
              case _model.Model.NPARALLEL:
              case _model.Model.SIM:
              case _model.Model.CONG:
              case _model.Model.CAPRIGHTARROW:
              case _model.Model.RIGHTARROW:
              case _model.Model.LEFTARROW:
              case _model.Model.LONGRIGHTARROW:
              case _model.Model.LONGLEFTARROW:
              case _model.Model.OVERRIGHTARROW:
              case _model.Model.OVERLEFTARROW:
              case _model.Model.CAPLEFTRIGHTARROW:
              case _model.Model.LEFTRIGHTARROW:
              case _model.Model.LONGLEFTRIGHTARROW:
              case _model.Model.OVERLEFTRIGHTARROW:
                node = visit.equals(node, resume);
                break;
              case _model.Model.PAREN:
              case _model.Model.INTERVAL:
                node = visit.paren(node);
                break;
              default:
                if (visit.name !== "normalizeLiteral" && visit.name !== "sort") {
                  node = newNode(_model.Model.VAR, ["INTERNAL ERROR Should not get here. Unhandled node operator " + node.op]);
                }
                break;
            }
            return node;
          }
          function lookup(word) {
            if (!word) {
              return "";
            }
            var words = _model.Model.option("words");
            var val = void 0;
            if (words) {
              val = words[word];
            }
            if (!val) {
              val = word;
              if (val.charAt(0) === "\\") {
                val = val.substring(1);
              }
            }
            return val;
          }
          function normalizeFormatObject(fmt) {
            // Normalize the fmt object to an array of objects
            var list = [];
            switch (fmt.op) {
              case _model.Model.VAR:
                list.push({
                  code: fmt.args[0]
                });
                break;
              case _model.Model.MUL:
                var code = "";
                var length = undefined; // undefined and zero have different meanings.
                (0, _backward.forEach)(fmt.args, function (f) {
                  if (f.op === _model.Model.VAR) {
                    code += f.args[0];
                  } else if (f.op === _model.Model.NUM) {
                    length = +f.args[0];
                  }
                });
                list.push({
                  code: code,
                  length: length
                });
                break;
              case _model.Model.COMMA:
                (0, _backward.forEach)(fmt.args, function (f) {
                  list = list.concat(normalizeFormatObject(f));
                });
                break;
            }
            return list;
          }
          function parseFormatPattern(pattern) {
            // Normalize the fmt object to an array of objects
            var _pattern$split = pattern.split("["),
                _pattern$split2 = _slicedToArray(_pattern$split, 2),
                name = _pattern$split2[0],
                arg = _pattern$split2[1];

            return {
              name: name,
              arg: arg && arg.substring(0, arg.indexOf("]")) || undefined
            };
          }
          function checkNumberType(fmt, node) {
            var fmtList = normalizeFormatObject(fmt);
            return fmtList.some(function (f) {
              var code = f.code;
              var length = f.length;
              switch (code) {
                case "integer":
                  if (node.numberFormat === "integer") {
                    if (length === undefined || length === node.args[0].length) {
                      // If there is no size or if the size matches the value...
                      return true;
                    }
                  }
                  break;
                case "decimal":
                  if (node.numberFormat === "decimal" && node.isRepeating) {
                    if (length === undefined) {
                      return true;
                    } else {
                      // Repeating is infinite.
                      return false;
                    }
                  }
                  if (node.numberFormat === "decimal") {
                    if (length === undefined || length === 0 && (0, _backward.indexOf)(node.args[0], ".") === -1 || length === node.args[0].substring((0, _backward.indexOf)(node.args[0], ".") + 1).length) {
                      // If there is no size or if the size matches the value...
                      return true;
                    }
                  }
                  break;
                case "number":
                  if (node.numberFormat === "decimal" && node.isRepeating) {
                    if (length === undefined) {
                      return true;
                    } else {
                      // Repeating is infinite.
                      return false;
                    }
                  }
                  if (node.numberFormat === "integer" || node.numberFormat === "decimal") {
                    var brk = (0, _backward.indexOf)(node.args[0], ".");
                    if (length === undefined || length === 0 && brk === -1 || brk >= 0 && length === node.args[0].substring(brk + 1).length) {
                      // If there is no size or if the size matches the value...
                      return true;
                    }
                  }
                  break;
                case "scientific":
                  if (node.isScientific) {
                    var coeff = node.args[0].args[0];
                    if (length === undefined || length === 0 && (0, _backward.indexOf)(coeff, ".") === -1 || length === coeff.substring((0, _backward.indexOf)(coeff, ".") + 1).length) {
                      // If there is no size or if the size matches the value...
                      return true;
                    }
                  }
                  break;
                case "fraction":
                  if (node.isFraction || node.isMixedFraction) {
                    return true;
                  }
                  break;
                case "simpleFraction":
                case "nonMixedFraction":
                  // deprecated
                  if (node.isFraction) {
                    return true;
                  }
                  break;
                case "mixedFraction":
                  if (node.isMixedFraction) {
                    return true;
                  }
                  break;
                case "fractionOrDecimal":
                  if (node.isFraction || node.isMixedFraction || node.numberFormat === "decimal") {
                    return true;
                  }
                  break;
                default:
                  (0, _assert.assert)(false, (0, _assert.message)(2015, [code]));
                  break;
              }
            });
          }
          function checkMatrixType(fmt, node) {
            var fmtList = normalizeFormatObject(fmt);
            return fmtList.some(function (f) {
              var code = f.code;
              var length = f.length;
              switch (code) {
                case "simpleSmallRowMatrix":
                case "smallRowMatrix":
                  return node.op === _model.Model.MATRIX && node.m === 1 && node.n < 4;
                case "simpleSmallColumnMatrix":
                case "smallColumnMatrix":
                  return node.op === _model.Model.MATRIX && node.m < 4 && node.n === 1;
                case "simpleSmallMatrix":
                case "smallMatrix":
                  return node.op === _model.Model.MATRIX && node.m < 4 && node.n < 4;
                case "matrix":
                  return node.op === _model.Model.MATRIX;
                case "row":
                  return node.op === _model.Model.ROW;
                case "column":
                  return node.op === _model.Model.COL;
                default:
                  return false;
              }
            });
          }
          function checkPolynomialType(pattern, node) {
            var fmt = parseFormatPattern(pattern);
            var name = fmt.name;
            var arg = fmt.arg;
            switch (name) {
              case "polynomial":
                if (arg) {
                  if (arg.indexOf(">") === 0) {
                    var n = parseInt(arg.substring(1));
                    return node.isPolynomial > n;
                  } else {
                    var _n = parseInt(arg);
                    return node.isPolynomial > _n;
                  }
                }
                return node.isPolynomial;
              default:
                return false;
            }
          }
          function isSimpleExpression(node) {
            if (node.op === _model.Model.NUM || node.op === _model.Model.VAR || typeof node === "string") {
              return true;
            }
            return false;
          }
          function hasSimpleExpressions(node) {
            (0, _assert.assert)(node.op === _model.Model.MATRIX || node.op === _model.Model.ROW || node.op === _model.Model.COL);
            return (0, _backward.every)(node.args, function (n) {
              if (n.op === _model.Model.MATRIX || n.op === _model.Model.ROW || n.op === _model.Model.COL) {
                return hasSimpleExpressions(n);
              }
              return isSimpleExpression(n);
            });
          }
          function matchType(pattern, node) {
            if (pattern.op === _model.Model.TYPE && pattern.args[0].op === _model.Model.VAR) {
              var name = pattern.args[0].args[0];
              name = name.indexOf("[") > 0 && name.slice(0, name.indexOf("[")) || name;
              switch (name) {
                case "number":
                case "integer":
                case "decimal":
                case "scientific":
                case "fraction":
                case "simpleFraction":
                case "mixedFraction":
                case "fractionOrDecimal":
                  return checkNumberType(pattern.args[0], node);
                case "variable":
                  return node.op === _model.Model.VAR;
                case "simpleSmallRowMatrix":
                case "simpleSmallColumnMatrix":
                case "simpleSmallMatrix":
                  return checkMatrixType(pattern.args[0], node) && hasSimpleExpressions(node);
                case "smallRowMatrix":
                case "smallColumnMatrix":
                case "smallMatrix":
                case "matrix":
                case "row":
                case "column":
                  return checkMatrixType(pattern.args[0], node);
                case "polynomial":
                  return checkPolynomialType(pattern.args[0].args[0], node);
                default:
                  var types = _model.Model.option("types");
                  var type = types[name];
                  if (type) {
                    (0, _assert.assert)(type instanceof Array);
                    return type.some(function (pattern) {
                      // FIXME pre-compile types.
                      var matches = match([normalizeLiteral(_model.Model.create(pattern))], node);
                      return matches.length > 0;
                    });
                  }
              }
              return false;
            } else if (pattern.op === _model.Model.COLON && pattern.args[0].op === _model.Model.VAR && pattern.args[0].args[0] === "?") {
              // This is a legacy case that can be removed when all content is updated.
              (0, _assert.assert)(pattern.args[1].op === _model.Model.VAR);
              switch (pattern.args[1].args[0]) {
                case "N":
                  return node.op === _model.Model.NUM;
                case "V":
                  return node.op === _model.Model.VAR;
                default:
              }
              return false;
            }
            return pattern.op === _model.Model.VAR && pattern.args[0] === "?" || pattern.op === _model.Model.MATRIX && node.op === _model.Model.MATRIX;
          }

          // ["? + ?", "? - ?"], "1 + 2"
          function match(patterns, node) {
            if (patterns.size === 0 || node === undefined) {
              return false;
            }
            var matches = patterns.filter(function (pattern) {
              if (pattern.op === undefined || node.op === undefined) {
                return false;
              }
              if (ast.intern(pattern) === ast.intern(node) || matchType(pattern, node)) {
                return true;
              }
              if (pattern.op === node.op) {
                if (pattern.args.length === node.args.length) {
                  // Same number of args, so see if each matches.
                  return pattern.args.every(function (arg, i) {
                    if (pattern.op === _model.Model.VAR) {
                      if (arg === node.args[i]) {
                        return true;
                      }
                      return false;
                    }
                    var result = match([arg], node.args[i]);
                    return result.length === 1;
                  });
                } else if (pattern.args.length < node.args.length) {
                  // Different number of args, then see if there is a wildcard match.
                  var nargs = node.args.slice(1);
                  if (pattern.args.length === 2) {
                    // Binary node pattern
                    var result = match([pattern.args[0]], node.args[0]).length > 0 && match([pattern.args[1]], newNode(node.op, nargs)).length > 0
                    // Match rest of the node against the second pattern argument.
                    ;
                    return result;
                  }
                }
              }
              return false;
            });
            // if (matches.length > 0) {
            //   console.log("node: " + JSON.stringify(node, null, 2));
            //   console.log("matches: " + JSON.stringify(matches, null, 2));
            // }
            return matches;
          }
          function expandBinary(str, args) {
            var t = str;
            (0, _backward.forEach)(args, function (arg, i) {
              str = str.replace("%" + (i + 1), arg.args[0]);
            });
            if (args.length > 2) {
              return expandBinary(t, [newNode(_model.Model.VAR, [str])].concat(args.slice(2)));
            }
            return str;
          }
          function expand(template, args, env) {
            env = env || {};
            // Use first matched template for now.
            var str = template.str;
            if (str && args) {
              var count = str.split("%").length - 1;
              if (str.indexOf("%%") >= 0) {
                str = str.replace("%%", args[0].args[0]);
              }
              if (str.indexOf("%*") >= 0) {
                var s = "";
                (0, _backward.forEach)(args, function (arg) {
                  if (s !== "") {
                    s += " ";
                  }
                  // Replicate template for each argument.
                  s += str.replace("%*", arg.args[0]).replace("%M", arg.m).replace("%N", arg.n);
                });
                str = s; // Overwrite str.
              }
              if (str.indexOf("%IP") >= 0) {
                str = str.replace("%IP", env.ip);
              }
              if (str.indexOf("%FP0") >= 0) {
                str = str.replace("%FP0", env.fp);
              }
              if (str.indexOf("%FP") >= 0) {
                str = str.replace("%FP", env.fp.split("").join(" "));
              }
              if (str.indexOf("%M") >= 0) {
                (0, _assert.assert)(env.m);
                str = str.replace("%M", env.m);
              }
              if (str.indexOf("%N") >= 0) {
                (0, _assert.assert)(env.n);
                str = str.replace("%N", env.n);
              }
              if (count === 2 && args.length > 2) {
                str = expandBinary(str, args);
              } else {
                (0, _backward.forEach)(args, function (arg, i) {
                  str = str.replace("%" + (i + 1), arg.args[0]);
                });
              }
              return {
                op: _model.Model.VAR,
                args: [str]
              };
            }
            //      assert(args.length === 1 && isEmpty(args[0]));
            return args[0];
          }
          function isEmpty(node) {
            return node.op === _model.Model.VAR && node.args.length === 1 && node.args[0] === "";
          }

          function getPrec(op) {
            switch (op) {
              case _model.Model.OR:
                return 1;
              case _model.Model.AND:
                return 2;
              case _model.Model.EQ:
              case _model.Model.NE:
                return 3;
              case _model.Model.LT:
              case _model.Model.GT:
              case _model.Model.LE:
              case _model.Model.GE:
              case _model.Model.NGTR:
              case _model.Model.NLESS:
              case _model.Model.NI:
              case _model.Model.SUBSETEQ:
              case _model.Model.SUPSETEQ:
              case _model.Model.SUBSET:
              case _model.Model.SUPSET:
              case _model.Model.NNI:
              case _model.Model.NSUBSETEQ:
              case _model.Model.NSUPSETEQ:
              case _model.Model.NSUBSET:
              case _model.Model.NSUPSET:
                return 4;
              case _model.Model.ADD:
              case _model.Model.SUB:
              case _model.Model.PM:
                return 5;
              case _model.Model.MUL:
              case _model.Model.FRAC:
              case _model.Model.DIV:
              case _model.Model.MOD:
              case _model.Model.COLON:
                return 6;
              case _model.Model.POW:
              case _model.Model.LOG:
              default:
                return 7;
            }
            (0, _assert.assert)(false, "ERROR missing precedence for " + op);
          }

          function isLowerPrecedence(n0, n1) {
            // Is n1 lower precedence than n0?
            var p0 = getPrec(n0.op);
            var p1 = getPrec(n1.op);
            return p1 < p0;
          }

          function normalizeLiteral(root) {
            if (!root || !root.args) {
              (0, _assert.assert)(false, "Should not get here. Illformed node.");
              return 0;
            }
            var nid = ast.intern(root);
            // if (root.normalizeLiteralNid === nid) {
            //   return root;
            // }
            var node = visit(root, {
              name: "normalizeLiteral",
              numeric: function numeric(node) {
                return node;
              },
              binary: function binary(node) {
                var args = [];
                (0, _backward.forEach)(node.args, function (n) {
                  args.push(normalizeLiteral(n));
                });
                node.args = args;
                return node;
              },
              multiplicative: function multiplicative(node) {
                var args = [];
                var flatten = true;
                (0, _backward.forEach)(node.args, function (n) {
                  if ((n.isPolynomialTerm || n.isImplicit) && args.length > 0) {
                    args.push(binaryNode(_model.Model.MUL, [args.pop(), normalizeLiteral(n)], flatten));
                  } else {
                    args.push(normalizeLiteral(n));
                  }
                });
                // Only have explicit mul left, so convert to times.
                var op = node.op === _model.Model.MUL ? _model.Model.TIMES : node.op;
                var n = binaryNode(op, args, true);
                n.isScientific = node.isScientific;
                n.isMixedFraction = node.isMixedFraction;
                n.isBinomial = node.isBinomial;
                n.isPolynomial = node.isPolynomial;
                n.isPolynomialTerm = node.isPolynomialTerm;
                return n;
              },
              unary: function unary(node) {
                var args = [];
                (0, _backward.forEach)(node.args, function (n) {
                  args.push(normalizeLiteral(n));
                });
                var n = newNode(node.op, args);
                n.isPolynomial = node.isPolynomial;
                return n;
              },
              exponential: function exponential(node) {
                var args = [];
                (0, _backward.forEach)(node.args, function (n) {
                  args.push(normalizeLiteral(n));
                });
                node.args = args;
                return node;
              },
              variable: function variable(node) {
                return node;
              },
              comma: function comma(node) {
                var args = [];
                (0, _backward.forEach)(node.args, function (n) {
                  args.push(normalizeLiteral(n));
                });
                node.args = args;
                return node;
              },
              paren: function paren(node) {
                var args = [];
                (0, _backward.forEach)(node.args, function (n) {
                  args.push(normalizeLiteral(n));
                });
                node.args = args;
                return node;
              },
              equals: function equals(node) {
                var args = [];
                (0, _backward.forEach)(node.args, function (n) {
                  args.push(normalizeLiteral(n));
                });
                if (option("ignoreOrder") && (node.op === _model.Model.GT || node.op === _model.Model.GE)) {
                  // Swap adjacent elements and reverse the operator.
                  (0, _assert.assert)(args.length === 2, "Internal error: comparisons have only two operands");
                  var t = args[0];
                  args[0] = args[1];
                  args[1] = t;
                  node.op = node.op === _model.Model.GT ? _model.Model.LT : _model.Model.LE;
                  node.args = args;
                } else {
                  node.args = args;
                }
                return node;
              }
            });
            // // If the node has changed, normalizeLiteral again
            // while (nid !== ast.intern(node)) {
            //   nid = ast.intern(node);
            //   node = normalizeLiteral(node);
            // }
            // node.normalizeLiteralNid = nid;
            // node.normalizeLiteralNid = ast.intern(node);
            return node;
          }

          function matchedTemplate(rules, matches, arity) {
            var templates = [];
            matches.forEach(function (m) {
              templates = templates.concat(rules[JSON.stringify(m)]);
            });
            var matchedTemplates = [];
            templates.forEach(function (t) {
              if ((!t.context || _model.Model.option("NoParens") && t.context.indexOf("NoParens") > -1 || _model.Model.option("EndRoot") && t.context.indexOf("EndRoot") > -1) && arity >= paramCount(t)) {
                // Some args might be elided.
                matchedTemplates.push(t);
              }
            });
            //assert(matchedTemplates.length > 0);
            if (matchedTemplates.length === 0) {
              // Make one up.
              matchedTemplates.push({ str: "" });
            }
            // Use first match.
            return matchedTemplates[0];
            function paramCount(template) {
              // Parse out the number of params in the template.
              (0, _assert.assert)(typeof template.str === "string");
              var a = template.str.split("%");
              var nn = a.filter(function (n) {
                return !isNaN(+n[0]);
              });
              return nn.length === 0 ? 0 : +nn.sort()[nn.length - 1][0];
            }
          }
          function getNodeArgsForTemplate(node, template) {
            // Parse out the number of params in the template.
            (0, _assert.assert)(typeof template.str === "string");
            var str = template.str;
            if (str.indexOf("%%") >= 0) {
              return [node];
            }
            // let a = str.split("%");  // ["..", "1..", "2.."]
            // let nn = a.filter(n => {
            //   // Include '%1', %M, %N
            //   return !isNaN(+n[0]) || n[0] === "M" || n[0] === "N";
            // });
            return node.args;
          }
          function translate(root, rules) {
            // Translate math from LaTeX to English.
            // rules = {ptrn: tmpl, ...};
            var globalRules = void 0;
            if (rules instanceof Array) {
              if (rules.length === 1) {
                rules = rules[0];
              } else {
                rules = mergeMaps(rules[1], rules[0]);
              }
            }
            globalRules = rules;
            var keys = Object.keys(rules);
            // FIXME when IE supports Map, this can be removed.
            var patterns = [];
            keys.forEach(function (k) {
              patterns.push(JSON.parse(k));
            });
            if (!root || !root.args) {
              (0, _assert.assert)(false, "Should not get here. Illformed node.");
              return 0;
            }
            return visit(root, {
              name: "translate",
              numeric: function numeric(node) {
                var args = [{
                  op: _model.Model.VAR,
                  args: [lookup(node.args[0])]
                }];
                var env = {};
                if (node.numberFormat === "decimal") {
                  var parts = node.args[0].split(".");
                  (0, _assert.assert)(parts.length === 2);
                  env.ip = parts[0];
                  env.fp = parts[1];
                }
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, 1);
                return expand(template, args, env);
              },
              binary: function binary(node) {
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                var template = matchedTemplate(rules, matches, node.args.length);
                var argRules = getRulesForArgs(template);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                (0, _backward.forEach)(nodeArgs, function (n, i) {
                  args = args.concat(translate(n, [globalRules, argRules]));
                });
                return expand(template, args);
              },
              multiplicative: function multiplicative(node) {
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, node.args.length);
                var argRules = getRulesForArgs(template, rules);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                (0, _backward.forEach)(nodeArgs, function (n, i) {
                  args = args.concat(translate(n, [globalRules, argRules]));
                });
                return expand(template, args);
              },
              unary: function unary(node) {
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, node.args.length);
                var argRules = getRulesForArgs(template, rules);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                (0, _backward.forEach)(nodeArgs, function (n, i) {
                  args = args.concat(translate(n, [globalRules, argRules]));
                });
                return expand(template, args);
              },
              exponential: function exponential(node) {
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, node.args.length);
                var argRules = getRulesForArgs(template, rules);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                (0, _backward.forEach)(nodeArgs, function (n, i) {
                  args = args.concat(translate(n, [globalRules, argRules]));
                });
                return expand(template, args);
              },
              variable: function variable(node) {
                // let str = "";
                // forEach(node.args, function (n, i) {
                //   // This is a little bit of a hack to handle how subscripts are encoded
                //   // as compound variables.
                //   if (i > 0) {
                //     str += " sub ";
                //     let v = translate(n, rules);
                //     str += v.args[0];
                //     str += " baseline ";
                //   } else {
                //     str += lookup(n);
                //   }
                // });
                // let matches = match(patterns, node);
                // let args = [newNode(Model.VAR, [str])];
                // if (matches.length === 0) {
                //   return args[0];
                // }
                // // Use first match for now.
                // let template = matchedTemplate(rules, matches, 1);
                // return expand(template, args);
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, node.args.length);
                var argRules = getRulesForArgs(template, rules);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                args.push(newNode(_model.Model.VAR, [lookup(nodeArgs.shift())]));
                (0, _backward.forEach)(nodeArgs, function (n, i) {
                  // Now translate the subscripts.
                  args = args.concat(translate(n, [globalRules, argRules]));
                });
                return expand(template, args);
              },
              comma: function comma(node) {
                if (node.op === _model.Model.MATRIX || node.op === _model.Model.ROW || node.op === _model.Model.COL) {
                  var env = {};
                  if (node.op === _model.Model.MATRIX) {
                    (0, _assert.assert)(node.args[0].op === _model.Model.ROW);
                    (0, _assert.assert)(node.args[0].args[0].op === _model.Model.COL);
                    node.m = env.m = node.args[0].args.length;
                    node.n = env.n = node.args[0].args[0].args.length;
                    (0, _backward.forEach)(node.args, function (n, i) {
                      // matrix dimensions
                      n.m = i + 1;
                    });
                  } else if (node.op === _model.Model.ROW) {
                    (0, _backward.forEach)(node.args, function (n, i) {
                      n.m = i + 1;
                      n.n = undefined;
                    });
                  } else {
                    (0, _backward.forEach)(node.args, function (n, i) {
                      n.m = node.m;
                      n.n = i + 1;
                    });
                  }
                  var matches = match(patterns, node);
                  if (matches.length === 0) {
                    return node;
                  }
                  // Use first match for now.
                  var template = matchedTemplate(rules, matches, node.args.length);
                  var args = [];
                  var argRules = getRulesForArgs(template, rules);
                  var nodeArgs = getNodeArgsForTemplate(node, template);
                  (0, _backward.forEach)(nodeArgs, function (n, i) {
                    args = args.concat(translate(n, [globalRules, argRules]));
                    args[i].m = n.m;
                    args[i].n = n.n;
                  });
                  return expand(template, args, env);
                } else {
                  var _matches = match(patterns, node);
                  if (_matches.length === 0) {
                    return node;
                  }
                  // Use first match for now.
                  var _template = matchedTemplate(rules, _matches, node.args.length);
                  var _argRules = getRulesForArgs(_template, rules);
                  var _nodeArgs = getNodeArgsForTemplate(node, _template);
                  var _args = [];
                  (0, _backward.forEach)(_nodeArgs, function (n, i) {
                    _args = _args.concat(translate(n, [globalRules, _argRules]));
                  });
                  return expand(_template, _args);
                }
              },
              equals: function equals(node) {
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, node.args.length);
                var argRules = getRulesForArgs(template, rules);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                (0, _backward.forEach)(nodeArgs, function (n, i) {
                  args = args.concat(translate(n, [globalRules, argRules]));
                });
                return expand(template, args, node);
              },
              paren: function paren(node) {
                //assert (node.args.length === 1);
                var matches = match(patterns, node);
                if (matches.length === 0) {
                  return node;
                } else if (matches.length > 1) {
                  // Have more than one match, so compare brackets
                  var t = matches;
                  matches = matches.filter(function (n) {
                    return n.lbrk === node.lbrk && n.rbrk === node.rbrk;
                  });
                  if (matches.length === 0) {
                    // Restore original matches.
                    matches = t;
                  }
                }
                // Use first match for now.
                var template = matchedTemplate(rules, matches, 1);
                var argRules = getRulesForArgs(template, rules);
                var nodeArgs = getNodeArgsForTemplate(node, template);
                var args = [];
                (0, _backward.forEach)(nodeArgs, function (n) {
                  args.push(translate(n, [globalRules, argRules]));
                });
                return expand(template, args);
              }
            });
          }

          this.normalizeLiteral = normalizeLiteral;
          this.translate = translate;
        }

        function normalizeLiteral(node) {
          var visitor = new Visitor(ast);
          var prevLocation = _assert.Assert.location;
          if (node.location) {
            _assert.Assert.setLocation(node.location);
          }
          var result = visitor.normalizeLiteral(node);
          _assert.Assert.setLocation(prevLocation);
          return result;
        }

        function dumpRules(rules) {
          var str = "";
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _slicedToArray(_step.value, 2),
                  key = _step$value[0],
                  val = _step$value[1];

              str += JSON.stringify(key, null, 2) + " --> " + JSON.stringify(val, null, 2) + "\n";
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return str;
        }

        function getRulesForArgs(template, rules) {
          // Use first match for now.
          return template.rules;
        }

        function mergeMaps(m1, m2) {
          var map = {};
          if (m1) {
            var _keys = Object.keys(m1);
            _keys.forEach(function (k) {
              map[k] = m1[k];
            });
          }
          var keys = Object.keys(m2);
          keys.forEach(function (k) {
            if (!map[k]) {
              map[k] = m2[k];
            }
          });
          return map;
        }
        function compileTemplate(template) {
          var compiledTemplate = void 0;
          if (template instanceof Array) {
            compiledTemplate = [];
            template.forEach(function (t) {
              compiledTemplate = compiledTemplate.concat(compileTemplate(t));
            });
          } else {
            if (typeof template === "string") {
              // "%1"
              compiledTemplate = [{
                str: template
              }];
            } else {
              // {"%1": {"?": "%1"}}
              // [cntx1 "%1", cntx2 {"%1": {?: "%1"}}] --> [{context: "cntx1", str: "%1"},...]
              var context = "",
                  str = void 0,
                  _rules = void 0;
              if (template.options) {
                context += template.options.EndRoot ? " EndRoot" : "";
                context += template.options.NoParens ? " NoParens" : "";
                str = template.value;
              } else {
                str = Object.keys(template)[0];
                (0, _assert.assert)(str !== "options");
                _rules = compileRules(template[str]);
              }
              compiledTemplate = [{
                context: context,
                str: str,
                rules: _rules
              }];
            }
          }
          return compiledTemplate;
        }
        function compileRules(rules) {
          // { "ast as string": template, ... }
          var keys = Object.keys(rules);
          var compiledRules = {};
          keys.forEach(function (key) {
            var pattern = JSON.stringify(normalizeLiteral(_model.Model.create(key))); // Parse and normalize.
            var template = compileTemplate(rules[key]);
            if (!compiledRules[pattern]) {
              compiledRules[pattern] = template;
            }
          });
          return compiledRules;
        }
        function translate(node, rules) {
          var visitor = new Visitor(ast);
          var compiledRules = compileRules(rules);
          return visitor.translate(node, compiledRules);
        }
        function trim(str) {
          var i = 0;
          var out = "";
          for (; i < str.length; i++) {
            switch (str.charAt(i)) {
              case " ":
              case "\t":
              case "\n":
                if (out.length === 0 || out.charAt(out.length - 1) === " ") {
                  // Erase space at beginning and after other space.
                  continue;
                }
                out += " ";
                break;
              default:
                out += str.charAt(i);
                break;
            }
          }
          while (out.charAt(out.length - 1) === " ") {
            // Trim off trailing whitespace.
            out = out.substring(0, out.length - 1);
          }
          while (out.lastIndexOf("baseline") !== -1 && out.lastIndexOf(" baseline") === out.length - " baseline".length) {
            // Trim off trailing modifiers
            out = out.substring(0, out.length - " baseline".length);
          }
          return out;
        }
        _model.Model.fn.translate = function (n1) {
          var rules = _model.Model.option("rules");
          var n = translate(normalizeLiteral(n1), rules);
          if (!n || n.op !== _model.Model.VAR) {
            n = newNode(_model.Model.VAR, [""]);
          }
          return trim(n.args[0]);
        };

        var option = _model.Model.option = function option(p, v) {
          var options = _model.Model.options;
          var opt = options && options[p];
          if (v !== undefined) {
            // Set the option value.
            _model.Model.options = options = options ? options : {};
            options[p] = v;
          }
          if (opt === undefined) {
            switch (p) {
              case "field":
                opt = "integer";
                break;
              case "decimalPlaces":
                opt = 10;
                break;
              case "setThousandsSeparator":
              case "setDecimalSeparator":
              case "dontExpandPowers":
              case "dontFactorDenominators":
              case "dontFactorTerms":
              case "dontConvertDecimalToFraction":
              case "strict":
                opt = undefined;
                break;
              case "types":
                opt = {};
                break;
              default:
                opt = false;
                break;
            }
          }
          // Return the original or default option.
          return opt;
        };

        var RUN_SELF_TESTS = false;
        if (RUN_SELF_TESTS) {
          var env = {};

          trace("\nMath Model self testing");
          (function () {})();
        }
      })(new _ast.Ast());
      var Core = exports.Core = function () {
        _assert.Assert.reserveCodeRange(3000, 3999, "core");
        var messages = _assert.Assert.messages;
        var message = _assert.Assert.message;
        var assert = _assert.Assert.assert;
        messages[3001] = "No Math Core spec provided.";
        messages[3002] = "No Math Core solution provided.";
        messages[3003] = "No Math Core spec value provided.";
        messages[3004] = "Invalid Math Core spec method '%1'.";
        messages[3005] = "Operation taking too long.";
        messages[3006] = "Invalid option name '%1'.";
        messages[3007] = "Invalid option value '%2' for option '%1'.";
        messages[3008] = "Internal error: %1";

        var u = 1;
        var k = 1000;
        var c = Math.pow(10, -2);
        var m = Math.pow(10, -3);
        var mu = Math.pow(10, -6); // micro, \\mu
        var n = Math.pow(10, -9);
        var env = {
          "g": { type: "unit", value: u, base: "g" },
          "s": { type: "unit", value: u, base: "s" },
          "m": { type: "unit", value: u, base: "m" },
          "L": { type: "unit", value: u, base: "L" },
          "kg": { type: "unit", value: k, base: "g" },
          "km": { type: "unit", value: k, base: "m" },
          "ks": { type: "unit", value: k, base: "s" },
          "kL": { type: "unit", value: k, base: "L" },
          "cg": { type: "unit", value: c, base: "g" },
          "cm": { type: "unit", value: c, base: "m" },
          "cs": { type: "unit", value: c, base: "s" },
          "cL": { type: "unit", value: c, base: "L" },
          "mg": { type: "unit", value: m, base: "g" },
          "mm": { type: "unit", value: m, base: "m" },
          "ms": { type: "unit", value: m, base: "s" },
          "mL": { type: "unit", value: m, base: "L" },
          "\\mug": { type: "unit", value: mu, base: "g" },
          "\\mus": { type: "unit", value: mu, base: "s" },
          "\\mum": { type: "unit", value: mu, base: "m" },
          "\\muL": { type: "unit", value: mu, base: "L" },
          "ng": { type: "unit", value: n, base: "g" },
          "nm": { type: "unit", value: n, base: "m" },
          "ns": { type: "unit", value: n, base: "s" },
          "nL": { type: "unit", value: n, base: "L" },
          "in": { type: "unit", value: 1 / 12, base: "ft" },
          "ft": { type: "unit", value: u, base: "ft" },
          "yd": { type: "unit", value: 3, base: "ft" },
          "mi": { type: "unit", value: 5280, base: "ft" },
          "fl": { type: "unit", value: 1, base: "fl" }, // fluid ounce
          "cup": { type: "unit", value: 8, base: "fl" },
          "pt": { type: "unit", value: 16, base: "fl" },
          "qt": { type: "unit", value: 32, base: "fl" },
          "gal": { type: "unit", value: 128, base: "fl" },
          "oz": { type: "unit", value: 1 / 16, base: "lb" },
          "lb": { type: "unit", value: 1, base: "lb" },
          "st": { type: "unit", value: 1 / 1614, base: "lb" },
          "qtr": { type: "unit", value: 28, base: "lb" },
          "cwt": { type: "unit", value: 112, base: "lb" },
          "t": { type: "unit", value: 2240, base: "lb" },
          "$": { type: "unit", value: u, base: "$" },
          "i": { type: "unit", value: null, base: "i" },
          "min": { type: "unit", value: 60, base: "s" },
          "hr": { type: "unit", value: 3600, base: "s" },
          "day": { type: "unit", value: 24 * 3600, base: "s" },
          "\\radian": { type: "unit", value: u, base: "radian" },
          "'": { type: "unit", value: 1, base: "prime" },
          "''": { type: "unit", value: 1, base: "doubleprime" },
          "'''": { type: "unit", value: 1, base: "tripleprime" },
          "\\degree": { type: "unit", value: Math.PI / 180, base: "radian" },
          "\\degree K": { type: "unit", value: u, base: "\\degree K" },
          "\\degree C": { type: "unit", value: u, base: "\\degree C" },
          "\\degree F": { type: "unit", value: u, base: "\\degree F" },
          "R": { name: "reals" }, // special math symbol for real space
          "matrix": {},
          "pmatrix": {},
          "bmatrix": {},
          "Bmatrix": {},
          "vmatrix": {},
          "Vmatrix": {},
          "array": {},
          "\\alpha": { type: "var" },
          "\\beta": { type: "var" },
          "\\gamma": { type: "var" },
          "\\delta": { type: "var" },
          "\\epsilon": { type: "var" },
          "\\zeta": { type: "var" },
          "\\eta": { type: "var" },
          "\\theta": { type: "var" },
          "\\iota": { type: "var" },
          "\\kappa": { type: "var" },
          "\\lambda": { type: "var" },
          "\\mu": { type: "const", value: mu },
          "\\nu": { type: "var" },
          "\\xi": { type: "var" },
          "\\pi": { type: "const", value: Math.PI },
          "\\rho": { type: "var" },
          "\\sigma": { type: "var" },
          "\\tau": { type: "var" },
          "\\upsilon": { type: "var" },
          "\\phi": { type: "var" },
          "\\chi": { type: "var" },
          "\\psi": { type: "var" },
          "\\omega": { type: "var" },
          "\\sin": { type: "var" },
          "\\cos": { type: "var" },
          "\\tan": { type: "var" },
          "\\sec": { type: "var" },
          "\\csc": { type: "var" },
          "\\cot": { type: "var" },
          "\\arcsin": { type: "var" },
          "\\arccos": { type: "var" },
          "\\arctan": { type: "var" },
          "\\arcsec": { type: "var" },
          "\\arccsc": { type: "var" },
          "\\arccot": { type: "var" },
          "\\sinh": { type: "var" },
          "\\cosh": { type: "var" },
          "\\tanh": { type: "var" },
          "\\sech": { type: "var" },
          "\\csch": { type: "var" },
          "\\coth": { type: "var" },
          "\\log": { type: "var" },
          "\\ln": { type: "var" },
          "\\lg": { type: "var" }
        };

        function validateOption(p, v) {
          switch (p) {
            case "field":
              switch (v) {
                case void 0: // undefined means use default
                case "integer":
                case "real":
                case "complex":
                  break;
                default:
                  assert(false, message(3007, [p, v]));
                  break;
              }
              break;
            case "decimalPlaces":
              if (v === void 0 || +v >= 0 && +v <= 20) {
                break;
              }
              assert(false, message(3007, [p, v]));
              break;
            case "NoParens":
            case "EndRoot":
            case "allowDecimal":
            case "allowInterval":
            case "dontExpandPowers":
            case "dontFactorDenominators":
            case "dontFactorTerms":
            case "dontConvertDecimalToFraction":
            case "dontSimplifyImaginary":
            case "ignoreOrder":
            case "inverseResult":
            case "requireThousandsSeparator":
            case "ignoreText":
            case "ignoreTrailingZeros":
            case "allowThousandsSeparator":
            case "compareSides":
            case "ignoreCoefficientOne":
            case "strict":
              if (typeof v === "undefined" || typeof v === "boolean") {
                break;
              }
              assert(false, message(3007, [p, v]));
              break;
            case "setThousandsSeparator":
              if (typeof v === "undefined" || typeof v === "string" && v.length === 1 || v instanceof Array) {
                break;
              }
              assert(false, message(3007, [p, v]));
              break;
            case "setDecimalSeparator":
              if (typeof v === "undefined" || typeof v === "string" && v.length === 1 || v instanceof Array && v.length > 0 && v[0].length === 1) {
                break;
              }
              assert(false, message(3007, [p, JSON.stringify(v)]));
              break;
            case "words":
            case "rules":
            case "types":
            case "data":
              if (typeof v === "undefined" || (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                break;
              }
              assert(false, message(3007, [p, v]));
              break;
            default:
              assert(false, message(3006, [p]));
              break;
          }
          // If we get this far, all is well.
          return;
        }
        function validateOptions(options) {
          if (options) {
            (0, _backward.forEach)((0, _backward.keys)(options), function (option) {
              validateOption(option, options[option]);
            });
          }
        }
        function translate(options, solution, resume) {
          if (!options) {
            options = {};
          }
          if (!options.rules) {
            // Use the default rules in rules.js.
            options.words = _rules2.rules.words;
            options.rules = _rules2.rules.rules;
            options.types = _rules2.rules.types;
          }
          var spec = {
            method: "translate",
            options: options
          };
          var evaluator = makeEvaluator(spec, resume);
          evaluator.evaluate(solution, function (err, val) {
            resume(err, val);
          });
        }
        function makeEvaluator(spec, resume) {
          var valueNode = void 0;
          var method = spec.method;
          var value = spec.value;
          var options = _model.Model.options = spec.options;
          var pendingError = void 0;
          try {
            _assert.Assert.setLocation("spec");
            validateOptions(options);
            _model.Model.pushEnv(env);
            valueNode = value != undefined ? _model.Model.create(value, "spec") : undefined;
            _model.Model.popEnv();
          } catch (e) {
            console.log("ERROR makeEvaluator() " + e.stack);
            pendingError = e;
            resume([{
              result: null,
              errorCode: parseErrorCode(message),
              message: parseMessage(message),
              stack: e.stack,
              location: e.location,
              model: null, // Unused, for now.
              toString: function toString() {
                return this.errorCode + ": (" + this.location + ") " + this.message + "\n" + this.stack;
              }
            }], ""); // If error, empty string.
          }
          var evaluate = function evaluate(solution, resume) {
            try {
              if (pendingError) {
                throw pendingError;
              }
              _assert.Assert.setLocation("user");
              assert(solution != undefined, message(3002));
              _model.Model.pushEnv(env);
              var solutionNode = _model.Model.create(solution, "user");
              assert(solutionNode, message(3008, ["invalid input"]));
              _assert.Assert.setLocation("spec");
              var result = void 0;
              switch (method) {
                case "translate":
                  result = solutionNode.translate();
                  break;
                default:
                  assert(false, message(3004, [method]));
                  break;
              }
              _model.Model.popEnv();
              resume([], result);
            } catch (e) {
              console.log("ERROR evaluate() " + e.stack);
              var _message = e.message;
              resume([{
                result: null,
                errorCode: parseErrorCode(_message),
                message: parseMessage(_message),
                stack: e.stack,
                location: e.location,
                model: null, // Unused, for now.
                toString: function toString() {
                  return this.errorCode + ": (" + this.location + ") " + this.message + "\n" + this.stack;
                }
              }], ""); // If error, empty string.
              return;
            }
          };
          return {
            evaluate: evaluate,
            model: valueNode
          };
          function parseErrorCode(e) {
            var code = +e.slice(0, (0, _backward.indexOf)(e, ":"));
            if (!isNaN(code)) {
              return code;
            }
            return 0;
          }
          function parseMessage(e) {
            var code = parseErrorCode(e);
            if (code) {
              return e.slice((0, _backward.indexOf)(e, ":") + 2);
            }
            return e;
          }
        }

        // Exports
        return {
          translate: translate,
          Model: _model.Model,
          Ast: _ast.Ast
        };
      }();

      if (typeof window !== "undefined") {
        // Make a browser hook.
        window.Core = Core;
      }
    }, { "./assert.js": 1, "./ast.js": 2, "./backward.js": 3, "./model.js": 5, "./rules.js": 6, "./version.js": 7 }], 5: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Model = undefined;

      var _backward = require("./backward.js");

      var _assert = require("./assert.js");

      var _ast = require("./ast.js");

      var Model = exports.Model = function () {

        function error(str) {
          trace("error: " + str);
        }

        function Model() {}

        Model.fn = {};
        Model.env = env = {};
        var envStack = [];
        var env = {};

        Model.pushEnv = function pushEnv(e) {
          envStack.push(env);
          Model.env = env = e;
        };

        Model.popEnv = function popEnv() {
          (0, _assert.assert)(envStack.length > 0, "Empty envStack");
          Model.env = env = envStack.pop();
        };

        function isChemCore() {
          // Has chem symbols so in chem mode
          return !!Model.env["Au"];
        }

        var Mp = Model.prototype = new _ast.Ast();

        // Add messages here
        _assert.Assert.reserveCodeRange(1000, 1999, "model");
        _assert.Assert.messages[1000] = "Internal error. %1.";
        _assert.Assert.messages[1001] = "Invalid syntax. '%1' expected, '%2' found.";
        _assert.Assert.messages[1002] = "Only one decimal separator can be specified.";
        _assert.Assert.messages[1003] = "Extra characters in input at position: %1, lexeme: %2.";
        _assert.Assert.messages[1004] = "Invalid character '%1' (%2) in input.";
        _assert.Assert.messages[1005] = "Misplaced thousands separator.";
        _assert.Assert.messages[1006] = "Invalid syntax. Expression expected, %1 found.";
        _assert.Assert.messages[1007] = "Unexpected character: '%1' in '%2'.";
        _assert.Assert.messages[1008] = "The same character '%1' is being used as a thousands and decimal separators.";
        _assert.Assert.messages[1009] = "Missing argument for '%1' command.";
        _assert.Assert.messages[1010] = "Expecting an operator between numbers.";
        var message = _assert.Assert.message;

        // Create a model from a node object or expression string
        Model.create = Mp.create = function create(node, location) {
          (0, _assert.assert)(node != undefined, "Model.create() called with invalid argument " + node);
          // If we already have a model, then just return it.
          if (node instanceof Model) {
            if (location) {
              node.location = location;
            }
            return node;
          }
          var model = void 0;
          if (node instanceof Array) {
            model = [];
            (0, _backward.forEach)(node, function (n) {
              model.push(create(n, location));
            });
            return model;
          }
          if (!(this instanceof Model)) {
            return new Model().create(node, location);
          }
          // Create a node that inherits from Ast
          model = create(this);
          model.location = location;
          if (typeof node === "string") {
            // Got a string, so parse it into a node
            var parser = parse(node, Model.env);
            node = parser.expr();
          } else {
            // Make a deep copy of the node
            node = JSON.parse(JSON.stringify(node));
          }
          // Add missing plugin functions to the Model prototype
          (0, _backward.forEach)((0, _backward.keys)(Model.fn), function (v, i) {
            if (!Mp.hasOwnProperty(v)) {
              Mp[v] = function () {
                var fn = Model.fn[v];
                if (arguments.length > 1 && arguments[1] instanceof Model) {
                  return fn.apply(this, arguments);
                } else {
                  var args = [this];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    args.push(arguments[_i]);
                  }
                  return fn.apply(this, args);
                }
              };
            }
          });
          // Now copy the node's properties into the model object
          (0, _backward.forEach)((0, _backward.keys)(node), function (v, i) {
            model[v] = node[v];
          });
          return model;
        };

        // Render LaTex from the model node.
        Mp.toLaTex = function toLaTex(node) {
          return render(node);
        };

        var OpStr = {
          ADD: "+",
          SUB: "-",
          MUL: "mul",
          TIMES: "times",
          COEFF: "coeff",
          DIV: "div",
          FRAC: "frac",
          EQL: "=",
          ATAN2: "atan2",
          SQRT: "sqrt",
          VEC: "vec",
          PM: "pm",
          NOT: "not",
          SIN: "sin",
          COS: "cos",
          TAN: "tan",
          SEC: "sec",
          COT: "cot",
          CSC: "csc",
          ARCSIN: "arcsin",
          ARCCOS: "arccos",
          ARCTAN: "arctan",
          ARCSEC: "arcsec",
          ARCCOT: "arccot",
          ARCCSC: "arccsc",
          SINH: "sinh",
          COSH: "cosh",
          TANH: "tanh",
          SECH: "sech",
          COTH: "coth",
          CSCH: "csch",
          ARCSINH: "arcsinh",
          ARCCOSH: "arccosh",
          ARCTANH: "arctanh",
          ARCSECH: "arcsech",
          ARCCSCH: "arccsch",
          ARCCOTH: "arccoth",
          LOG: "log",
          LN: "ln",
          LG: "lg",
          VAR: "var",
          NUM: "num",
          CST: "cst",
          COMMA: ",",
          POW: "^",
          SUBSCRIPT: "_",
          ABS: "abs",
          PAREN: "()",
          HIGHLIGHT: "hi",
          LT: "lt",
          LE: "le",
          GT: "gt",
          GE: "ge",
          NE: "ne",
          NGTR: "ngtr",
          NLESS: "nless",
          NI: "ni",
          SUBSETEQ: "subseteq",
          SUPSETEQ: "supseteq",
          SUBSET: "subset",
          SUPSET: "supset",
          NNI: "nni",
          NSUBSETEQ: "nsubseteq",
          NSUPSETEQ: "nsupseteq",
          NSUBSET: "nsubset",
          NSUPSET: "nsupset",
          APPROX: "approx",
          IMPLIES: "implies",
          CAPRIGHTARROW: "caprightarrow",
          RIGHTARROW: "rightarrow",
          LEFTARROW: "leftarrrow",
          LONGRIGHTARROW: "longrightarrow",
          LONGLEFTARROW: "longleftarrow",
          OVERRIGHTARROW: "overrightarrow",
          OVERLEFTARROW: "overleftarrow",
          CAPLEFTRIGHTARROW: "capleftrightarrow",
          LEFTRIGHTARROW: "leftrightarrow",
          LONGLEFTRIGHTARROW: "longleftrightarrow",
          OVERLEFTRIGHTARROW: "overleftrightarrow",
          PERP: "perp",
          PROPTO: "propto",
          PARALLEL: "parallel",
          NPARALLEL: "nparallel",
          SIM: "sim",
          CONG: "cong",
          INTERVAL: "interval",
          LIST: "list",
          SET: "set",
          EXISTS: "exists",
          IN: "in",
          FORALL: "forall",
          LIM: "lim",
          EXP: "exp",
          TO: "to",
          SUM: "sum",
          DERIV: "deriv",
          PIPE: "pipe",
          INTEGRAL: "integral",
          PROD: "prod",
          CUP: "cup",
          BIGCUP: "bigcup",
          CAP: "cap",
          BIGCAP: "bigcap",
          PERCENT: "%",
          QMARK: "?",
          M: "M",
          FACT: "fact",
          BINOM: "binom",
          ROW: "row",
          COL: "col",
          COLON: "colon",
          MATRIX: "matrix",
          TYPE: "type",
          OVERSET: "overset",
          UNDERSET: "underset",
          OVERLINE: "overline",
          DEGREE: "degree",
          BACKSLASH: "backslash",
          MATHBF: "mathbf",
          DOT: "dot",
          MATHFIELD: "mathfield",
          DELTA: "delta",
          NONE: "none"
        };

        (0, _backward.forEach)((0, _backward.keys)(OpStr), function (v, i) {
          Model[v] = OpStr[v];
        });

        var OpToLaTeX = {};
        OpToLaTeX[OpStr.ADD] = "+";
        OpToLaTeX[OpStr.SUB] = "-";
        OpToLaTeX[OpStr.MUL] = "\\times";
        OpToLaTeX[OpStr.DIV] = "\\div";
        OpToLaTeX[OpStr.FRAC] = "\\frac";
        OpToLaTeX[OpStr.EQL] = "=";
        OpToLaTeX[OpStr.ATAN2] = "\\atan2";
        OpToLaTeX[OpStr.POW] = "^";
        OpToLaTeX[OpStr.SUBSCRIPT] = "_";
        OpToLaTeX[OpStr.PM] = "\\pm";
        OpToLaTeX[OpStr.NOT] = "\\not";
        OpToLaTeX[OpStr.SIN] = "\\sin";
        OpToLaTeX[OpStr.COS] = "\\cos";
        OpToLaTeX[OpStr.TAN] = "\\tan";
        OpToLaTeX[OpStr.SEC] = "\\sec";
        OpToLaTeX[OpStr.COT] = "\\cot";
        OpToLaTeX[OpStr.CSC] = "\\csc";
        OpToLaTeX[OpStr.ARCSIN] = "\\arcsin";
        OpToLaTeX[OpStr.ARCCOS] = "\\arccos";
        OpToLaTeX[OpStr.ARCTAN] = "\\arctan";
        OpToLaTeX[OpStr.ARCSEC] = "\\arcsec";
        OpToLaTeX[OpStr.ARCCOT] = "\\arccot";
        OpToLaTeX[OpStr.ARCCSC] = "\\arccsc";
        OpToLaTeX[OpStr.SINH] = "\\sinh";
        OpToLaTeX[OpStr.COSH] = "\\cosh";
        OpToLaTeX[OpStr.TANH] = "\\tanh";
        OpToLaTeX[OpStr.ARCSINH] = "\\arcsinh";
        OpToLaTeX[OpStr.ARCCOSH] = "\\arccosh";
        OpToLaTeX[OpStr.ARCTANH] = "\\arctanh";
        OpToLaTeX[OpStr.ARCSECH] = "\\arcsech";
        OpToLaTeX[OpStr.ARCCSCH] = "\\arccsch";
        OpToLaTeX[OpStr.ARCCOTH] = "\\arccoth";
        OpToLaTeX[OpStr.SECH] = "\\sech";
        OpToLaTeX[OpStr.COTH] = "\\coth";
        OpToLaTeX[OpStr.CSCH] = "\\csch";
        OpToLaTeX[OpStr.LN] = "\\ln";
        OpToLaTeX[OpStr.COMMA] = ",";
        OpToLaTeX[OpStr.M] = "\\M";
        OpToLaTeX[OpStr.BINOM] = "\\binom";
        OpToLaTeX[OpStr.COLON] = "\\colon";

        Model.fold = function fold(node, env) {
          var args = [],
              val = void 0;
          (0, _backward.forEach)(node.args, function (n) {
            args.push(fold(n, env));
          });
          node.args = args;
          switch (node.op) {
            case OpStr.VAR:
              if (val = env[node.args[0]]) {
                node = val; // Replace var node with its value.
              }
              break;
            default:
              // Nothing to fold.
              break;
          }
          return node;
        };

        function isInvisibleCharCode(c) {
          return isControlCharCode(c);
        }
        function isWhitespaceCharCode(c) {
          return c === 32 || c === 9 || c === 10 || c === 13;
        }
        function isAlphaCharCode(c) {
          return c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 39; // prime
        }
        function isNumberCharCode(c) {
          return c >= 48 && c <= 57;
        }
        function isControlCharCode(c) {
          return c >= 0x0001 && c <= 0x001F || c >= 0x007F && c <= 0x009F;
        }
        function stripInvisible(src) {
          var out = "";
          var c, lastCharCode;
          var curIndex = 0;
          while (curIndex < src.length) {
            while (curIndex < src.length && isInvisibleCharCode(c = src.charCodeAt(curIndex++))) {
              if (lastCharCode === 32) {
                // Replace N invisible char with one space char.
                continue;
              }
              c = 9;
              lastCharCode = c;
            }
            if (c === 92) {
              // Backslash. Keep next character.
              out += String.fromCharCode(c);
              c = src.charCodeAt(curIndex++);
            } else if (c === 9) {
              // Got an invisible character, check if separating numbers.
              if (isNumberCharCode(out.charCodeAt(out.length - 1)) && isNumberCharCode(src.charCodeAt(curIndex))) {
                // Erase the space.
                c = src.charCodeAt(curIndex++);
              }
            }
            out += String.fromCharCode(c);
          }
          return out;
        }

        // Character defines.
        var CC_SPACE = 0x20;
        var CC_BANG = 0x21;
        var CC_DOLLAR = 0x24;
        var CC_PERCENT = 0x25;
        var CC_LEFTPAREN = 0x28;
        var CC_MUL = 0x2A;
        var CC_ADD = 0x2B;
        var CC_COMMA = 0x2C;
        var CC_SUB = 0x2D;
        var CC_RIGHTPAREN = 0x29;
        var CC_SLASH = 0x2F;
        var CC_NUM = 0x30;
        var CC_COLON = 0x3A;
        var CC_SEMICOLON = 0x3B;
        var CC_EQL = 0x3D;
        var CC_QMARK = 0x3F;
        var CC_CONST = 0x41;
        var CC_LEFTBRACKET = 0x5B;
        var CC_RIGHTBRACKET = 0x5D;
        var CC_CARET = 0x5E;
        var CC_UNDERSCORE = 0x5F;
        var CC_VAR = 0x61;
        var CC_LEFTBRACE = 0x7B;
        var CC_VERTICALBAR = 0x7C;
        var CC_RIGHTBRACE = 0x7D;
        var CC_SINGLEQUOTE = 0x27;

        // Token defines.
        var TK_NONE = 0;
        var TK_ADD = CC_ADD;
        var TK_CARET = CC_CARET;
        var TK_UNDERSCORE = CC_UNDERSCORE;
        var TK_COS = 0x105;
        var TK_COT = 0x108;
        var TK_CSC = 0x109;
        var TK_FRAC = 0x100;
        var TK_SLASH = CC_SLASH;
        var TK_EQL = CC_EQL;
        var TK_LN = 0x107;
        var TK_LEFTBRACE = CC_LEFTBRACE;
        var TK_VERTICALBAR = CC_VERTICALBAR;
        var TK_LEFTBRACKET = CC_LEFTBRACKET;
        var TK_LEFTPAREN = CC_LEFTPAREN;
        var TK_MUL = CC_MUL;
        var TK_NUM = CC_NUM;
        var TK_PM = 0x102;
        var TK_RIGHTBRACE = CC_RIGHTBRACE;
        var TK_RIGHTBRACKET = CC_RIGHTBRACKET;
        var TK_RIGHTPAREN = CC_RIGHTPAREN;
        var TK_SEC = 0x106;
        var TK_SIN = 0x103;
        var TK_SQRT = 0x101;
        var TK_SUB = CC_SUB;
        var TK_TAN = 0x104;
        var TK_VAR = CC_VAR;
        var TK_CONST = CC_CONST;
        var TK_NEXT = 0x10A;
        var TK_COMMA = CC_COMMA;
        var TK_LG = 0x10B;
        var TK_LOG = 0x10C;
        var TK_TEXT = 0x10D;
        var TK_LT = 0x10E;
        var TK_LE = 0x10F;
        var TK_GT = 0x110;
        var TK_GE = 0x111;
        var TK_EXISTS = 0x112;
        var TK_IN = 0x113;
        var TK_FORALL = 0x114;
        var TK_LIM = 0x115;
        var TK_EXP = 0x116;
        var TK_TO = 0x117;
        var TK_SUM = 0x118;
        var TK_INT = 0x119;
        var TK_PROD = 0x11A;
        var TK_PERCENT = CC_PERCENT;
        var TK_QMARK = CC_QMARK;
        var TK_M = 0x11B;
        var TK_RIGHTARROW = 0x11C;
        var TK_BANG = CC_BANG;
        var TK_BINOM = 0x11D;
        var TK_NEWROW = 0x11E;
        var TK_NEWCOL = 0x11F;
        var TK_BEGIN = 0x120;
        var TK_END = 0x121;
        var TK_COLON = CC_COLON;
        var TK_VEC = 0x122;
        var TK_ARCSIN = 0x123;
        var TK_ARCCOS = 0x124;
        var TK_ARCTAN = 0x125;
        var TK_DIV = 0x126;
        var TK_TYPE = 0x127;
        var TK_OVERLINE = 0x128;
        var TK_OVERSET = 0x129;
        var TK_UNDERSET = 0x12A;
        var TK_BACKSLASH = 0x12B;
        var TK_MATHBF = 0x12C;
        var TK_NE = 0x12D;
        var TK_APPROX = 0x12E;
        var TK_ABS = 0x12F;
        var TK_DOT = 0x130;
        var TK_ARCSEC = 0x131;
        var TK_ARCCSC = 0x132;
        var TK_ARCCOT = 0x133;
        var TK_MATHFIELD = 0x134;
        var TK_CUP = 0x135;
        var TK_BIGCUP = 0x136;
        var TK_CAP = 0x137;
        var TK_BIGCAP = 0x138;
        var TK_PERP = 0x139;
        var TK_PROPTO = 0x13A;
        var TK_NGTR = 0x13B;
        var TK_NLESS = 0x13C;
        var TK_NI = 0x13D;
        var TK_SUBSETEQ = 0x13E;
        var TK_SUPSETEQ = 0x13F;
        var TK_SUBSET = 0x140;
        var TK_SUPSET = 0x141;
        var TK_NOT = 0x142;
        var TK_PARALLEL = 0x143;
        var TK_NPARALLEL = 0x144;
        var TK_SIM = 0x145;
        var TK_CONG = 0x146;
        var TK_LEFTARROW = 0x147;
        var TK_LONGRIGHTARROW = 0x148;
        var TK_LONGLEFTARROW = 0x149;
        var TK_OVERRIGHTARROW = 0x14A;
        var TK_OVERLEFTARROW = 0x14B;
        var TK_LONGLEFTRIGHTARROW = 0x14C;
        var TK_OVERLEFTRIGHTARROW = 0x14D;
        var TK_IMPLIES = 0x14E;
        var TK_LEFTRIGHTARROW = 0x14F;
        var TK_CAPLEFTRIGHTARROW = 0x150;
        var TK_CAPRIGHTARROW = 0x151;
        var TK_DELTA = 0x152;
        var TK_SINH = 0x153;
        var TK_COSH = 0x154;
        var TK_TANH = 0x155;
        var TK_SECH = 0x156;
        var TK_COTH = 0x157;
        var TK_CSCH = 0x158;
        var TK_ARCSINH = 0x159;
        var TK_ARCCOSH = 0x15A;
        var TK_ARCTANH = 0x15B;
        var TK_ARCSECH = 0x15C;
        var TK_ARCCSCH = 0x15D;
        var TK_ARCCOTH = 0x15E;
        var TK_OPERATORNAME = 0x162;
        var TK_LEFTCMD = 0x163;
        var TK_RIGHTCMD = 0x164;
        var T0 = TK_NONE,
            T1 = TK_NONE;

        // Define mapping from token to operator
        var tokenToOperator = {};
        tokenToOperator[TK_SLASH] = OpStr.FRAC;
        tokenToOperator[TK_FRAC] = OpStr.FRAC;
        tokenToOperator[TK_SQRT] = OpStr.SQRT;
        tokenToOperator[TK_VEC] = OpStr.VEC;
        tokenToOperator[TK_ADD] = OpStr.ADD;
        tokenToOperator[TK_SUB] = OpStr.SUB;
        tokenToOperator[TK_PM] = OpStr.PM;
        tokenToOperator[TK_NOT] = OpStr.NOT;
        tokenToOperator[TK_CARET] = OpStr.POW;
        tokenToOperator[TK_UNDERSCORE] = OpStr.SUBSCRIPT;
        tokenToOperator[TK_MUL] = OpStr.MUL;
        tokenToOperator[TK_DOT] = OpStr.DOT;
        tokenToOperator[TK_DIV] = OpStr.DIV;
        tokenToOperator[TK_SIN] = OpStr.SIN;
        tokenToOperator[TK_COS] = OpStr.COS;
        tokenToOperator[TK_TAN] = OpStr.TAN;
        tokenToOperator[TK_ARCSIN] = OpStr.ARCSIN;
        tokenToOperator[TK_ARCCOS] = OpStr.ARCCOS;
        tokenToOperator[TK_ARCTAN] = OpStr.ARCTAN;
        tokenToOperator[TK_ARCSEC] = OpStr.ARCSEC;
        tokenToOperator[TK_ARCCSC] = OpStr.ARCCSC;
        tokenToOperator[TK_ARCCOT] = OpStr.ARCCOT;
        tokenToOperator[TK_SEC] = OpStr.SEC;
        tokenToOperator[TK_COT] = OpStr.COT;
        tokenToOperator[TK_CSC] = OpStr.CSC;
        tokenToOperator[TK_SINH] = OpStr.SINH;
        tokenToOperator[TK_COSH] = OpStr.COSH;
        tokenToOperator[TK_TANH] = OpStr.TANH;
        tokenToOperator[TK_ARCSINH] = OpStr.ARCSINH;
        tokenToOperator[TK_ARCCOSH] = OpStr.ARCCOSH;
        tokenToOperator[TK_ARCTANH] = OpStr.ARCTANH;
        tokenToOperator[TK_ARCSECH] = OpStr.ARCSECH;
        tokenToOperator[TK_ARCCSCH] = OpStr.ARCCSCH;
        tokenToOperator[TK_ARCCOTH] = OpStr.ARCCOTH;
        tokenToOperator[TK_SECH] = OpStr.SECH;
        tokenToOperator[TK_COTH] = OpStr.COTH;
        tokenToOperator[TK_CSCH] = OpStr.CSCH;
        tokenToOperator[TK_EQL] = OpStr.EQL;
        tokenToOperator[TK_COMMA] = OpStr.COMMA;
        tokenToOperator[TK_TEXT] = OpStr.TEXT;
        tokenToOperator[TK_OPERATORNAME] = OpStr.OPERATORNAME;
        tokenToOperator[TK_LT] = OpStr.LT;
        tokenToOperator[TK_LE] = OpStr.LE;
        tokenToOperator[TK_GT] = OpStr.GT;
        tokenToOperator[TK_GE] = OpStr.GE;
        tokenToOperator[TK_NE] = OpStr.NE;
        tokenToOperator[TK_NGTR] = OpStr.NGTR;
        tokenToOperator[TK_NLESS] = OpStr.NLESS;
        tokenToOperator[TK_NI] = OpStr.NI;
        tokenToOperator[TK_SUBSETEQ] = OpStr.SUBSETEQ;
        tokenToOperator[TK_SUPSETEQ] = OpStr.SUPSETEQ;
        tokenToOperator[TK_SUBSET] = OpStr.SUBSET;
        tokenToOperator[TK_SUPSET] = OpStr.SUPSET;
        tokenToOperator[TK_APPROX] = OpStr.APPROX;
        tokenToOperator[TK_PERP] = OpStr.PERP;
        tokenToOperator[TK_PROPTO] = OpStr.PROPTO;
        tokenToOperator[TK_PARALLEL] = OpStr.PARALLEL;
        tokenToOperator[TK_NPARALLEL] = OpStr.NPARALLEL;
        tokenToOperator[TK_SIM] = OpStr.SIM;
        tokenToOperator[TK_CONG] = OpStr.CONG;
        tokenToOperator[TK_EXISTS] = OpStr.EXISTS;
        tokenToOperator[TK_IN] = OpStr.IN;
        tokenToOperator[TK_FORALL] = OpStr.FORALL;
        tokenToOperator[TK_LIM] = OpStr.LIM;
        tokenToOperator[TK_EXP] = OpStr.EXP;
        tokenToOperator[TK_TO] = OpStr.TO;
        tokenToOperator[TK_VERTICALBAR] = OpStr.PIPE;
        tokenToOperator[TK_SUM] = OpStr.SUM;
        tokenToOperator[TK_INT] = OpStr.INTEGRAL;
        tokenToOperator[TK_PROD] = OpStr.PROD;
        tokenToOperator[TK_CUP] = OpStr.CUP;
        tokenToOperator[TK_BIGCUP] = OpStr.BIGCUP;
        tokenToOperator[TK_CAP] = OpStr.CAP;
        tokenToOperator[TK_BIGCAP] = OpStr.BIGCAP;
        tokenToOperator[TK_M] = OpStr.M;
        tokenToOperator[TK_IMPLIES] = OpStr.IMPLIES;
        tokenToOperator[TK_CAPRIGHTARROW] = OpStr.CAPRIGHTARROW;
        tokenToOperator[TK_RIGHTARROW] = OpStr.RIGHTARROW;
        tokenToOperator[TK_LEFTARROW] = OpStr.LEFTARROW;
        tokenToOperator[TK_LONGRIGHTARROW] = OpStr.LONGRIGHTARROW;
        tokenToOperator[TK_LONGLEFTARROW] = OpStr.LONGLEFTARROW;
        tokenToOperator[TK_OVERRIGHTARROW] = OpStr.OVERRIGHTARROW;
        tokenToOperator[TK_OVERLEFTARROW] = OpStr.OVERLEFTARROW;
        tokenToOperator[TK_LEFTRIGHTARROW] = OpStr.LEFTRIGHTARROW;
        tokenToOperator[TK_CAPLEFTRIGHTARROW] = OpStr.CAPLEFTRIGHTARROW;
        tokenToOperator[TK_LONGLEFTRIGHTARROW] = OpStr.LONGLEFTRIGHTARROW;
        tokenToOperator[TK_OVERLEFTRIGHTARROW] = OpStr.OVERLEFTRIGHTARROW;

        tokenToOperator[TK_BANG] = OpStr.FACT;
        tokenToOperator[TK_BINOM] = OpStr.BINOM;
        tokenToOperator[TK_NEWROW] = OpStr.ROW;
        tokenToOperator[TK_NEWCOL] = OpStr.COL;
        tokenToOperator[TK_COLON] = OpStr.COLON;
        tokenToOperator[TK_TYPE] = OpStr.TYPE;
        tokenToOperator[TK_OVERLINE] = OpStr.OVERLINE;
        tokenToOperator[TK_OVERSET] = OpStr.OVERSET;
        tokenToOperator[TK_UNDERSET] = OpStr.UNDERSET;
        tokenToOperator[TK_BACKSLASH] = OpStr.BACKSLASH;
        tokenToOperator[TK_MATHBF] = OpStr.MATHBF;
        tokenToOperator[TK_DOT] = OpStr.DOT;
        tokenToOperator[TK_MATHFIELD] = OpStr.MATHFIELD;
        tokenToOperator[TK_DELTA] = OpStr.DELTA;

        var parse = function parse(src, env) {
          src = stripInvisible(src);
          function newNode(op, args) {
            (0, _assert.assert)(op);
            return {
              op: op,
              args: args
            };
          }

          function matchThousandsSeparator(ch, last) {
            // Check separator and return if there is a match.
            if (Model.option("allowThousandsSeparator") || Model.option("setThousandsSeparator")) {
              var separators = Model.option("setThousandsSeparator");
              if (!separators) {
                // Use defaults.
                return ch === ',' ? ch : '';
              } else {
                // If the character matches the last separator or, if not, last is undefiend
                // and character is in the provided list, return the character.
                if (ch === last || !last && (0, _backward.indexOf)(separators, ch) >= 0) {
                  return ch;
                } else {
                  return "";
                }
              }
            }
            // Not allowed. Will be treated as punctuation of some other kind.
            return '';
          }

          function matchDecimalSeparator(ch) {
            // We use the thousands separator to determine the conventional decimal
            // separator. If TS is ',' then DS is '.', otherwise DS is ','.
            var decimalSeparator = Model.option("setDecimalSeparator");
            var thousandsSeparators = Model.option("setThousandsSeparator");
            if (typeof decimalSeparator === "string") {
              // Single separator.
              (0, _assert.assert)(decimalSeparator.length === 1, message(1002));
              var separator = decimalSeparator;
              if (thousandsSeparators instanceof Array && (0, _backward.indexOf)(thousandsSeparators, separator) >= 0) {
                // There is a conflict between the decimal separator and the
                // thousands separator.
                (0, _assert.assert)(false, message(1008, [separator]));
              }
              return ch === separator;
            }
            if (decimalSeparator instanceof Array) {
              // Multiple separators.
              (0, _backward.forEach)(decimalSeparator, function (separator) {
                if (thousandsSeparators instanceof Array && (0, _backward.indexOf)(thousandsSeparators, separator) >= 0) {
                  // There is a conflict between the decimal separator and the
                  // thousands separator.
                  (0, _assert.assert)(false, message(1008, [separator]));
                }
              });
              return (0, _backward.indexOf)(decimalSeparator, ch) >= 0;
            }
            if (thousandsSeparators instanceof Array && (0, _backward.indexOf)(thousandsSeparators, '.') >= 0) {
              // Period is used as a thousands separator, so cannot be used as a
              // decimal separator.
              (0, _assert.assert)(false, message(1008));
              return false;
            }
            // Otherwise, period is used as the decimal separator.
            return ch === ".";
          }

          // Construct a number node.
          function numberNode(n0, doScale, roundOnly) {
            // doScale - scale n if true
            // roundOnly - only scale if rounding
            var ignoreTrailingZeros = Model.option("ignoreTrailingZeros");
            var n1 = n0.toString();
            var n2 = "";
            var i = void 0,
                ch = void 0;
            var lastSeparatorIndex = void 0,
                lastSignificantIndex = void 0;
            var separatorCount = 0;
            var numberFormat = "integer";
            var hasLeadingZero = void 0,
                hasTrailingZero = void 0;
            if (n0 === ".") {
              (0, _assert.assert)(false, message(1004, [n0, n0.charCodeAt(0)]));
            }
            for (i = 0; i < n1.length; i++) {
              if (matchThousandsSeparator(ch = n1.charAt(i))) {
                if (separatorCount && lastSeparatorIndex !== i - 4 || !separatorCount && i > 4) {
                  (0, _assert.assert)(false, message(1005));
                }
                lastSeparatorIndex = i;
                separatorCount++;
                // We erase separators so 1,000 and 1000 are equivLiteral.
              } else {
                if (matchDecimalSeparator(ch)) {
                  if (numberFormat === "decimal") {
                    (0, _assert.assert)(false, message(1007, [ch, n2 + ch]));
                  }
                  ch = '.';
                  numberFormat = "decimal";
                  if (separatorCount && lastSeparatorIndex !== i - 4) {
                    (0, _assert.assert)(false, message(1005));
                  }
                  if (n2 === "0") {
                    hasLeadingZero = true;
                  }
                  lastSignificantIndex = n2.length;
                  lastSeparatorIndex = i; // Used for thousandths separators
                  separatorCount++;
                } else if (numberFormat === "decimal") {
                  if (ch !== "0") {
                    lastSignificantIndex = n2.length;
                  }
                }
                n2 += ch;
              }
            }
            if (numberFormat !== "decimal" && lastSeparatorIndex && lastSeparatorIndex !== i - 4) {
              // If we haven't seen a decimal separator, then make sure the last thousands
              // separator is in the right place.
              (0, _assert.assert)(false, message(1005));
            }
            if (lastSignificantIndex !== undefined) {
              if (lastSignificantIndex + 1 < n2.length) {
                hasTrailingZero = true;
              }
              if (ignoreTrailingZeros) {
                n2 = n2.substring(0, lastSignificantIndex + 1);
                if (n2 === ".") {
                  // ".0" -> "." -> "0"
                  n2 = "0";
                }
              }
            }
            return {
              op: Model.NUM,
              args: [String(n2)],
              hasThousandsSeparator: separatorCount !== 0,
              numberFormat: numberFormat,
              hasLeadingZero: hasLeadingZero,
              hasTrailingZero: hasTrailingZero
            };
          }
          function multiplyNode(args, flatten) {
            if (args.length === 0) {
              // We have simplified away all factors.
              args = [nodeOne];
            }
            return binaryNode(Model.MUL, args, flatten);
          }
          // Construct a unary node.
          function unaryNode(op, args) {
            (0, _assert.assert)(args.length === 1, "Wrong number of arguments for unary node");
            return newNode(op, args);
          }
          function binaryNode(op, args, flatten) {
            (0, _assert.assert)(args.length > 0, "1000: Too few argument for binary node");
            if (args.length < 2) {
              return args[0];
            }
            var aa = [];
            (0, _backward.forEach)(args, function (n) {
              if (flatten && n.op === op) {
                aa = aa.concat(n.args);
              } else {
                aa.push(n);
              }
            });
            return newNode(op, aa);
          }
          var nodeOne = numberNode("1");
          var nodeMinusOne = unaryNode(Model.SUB, [numberNode("1")]);
          var nodeNone = newNode(Model.NONE, [numberNode("0")]);
          var nodeEmpty = newNode(Model.VAR, [""]);

          //
          // PARSER
          //
          // Manage the token stream.
          var scan = scanner(src);
          // Prime the token stream.
          function start(options) {
            T0 = scan.start(options);
          }
          // Get the current token.
          function hd() {
            return T0;
          }
          // Get the current lexeme.
          function lexeme() {
            return scan.lexeme();
          }
          // Advance the next token.
          function next(options) {
            T0 = T1;
            T1 = TK_NONE;
            if (T0 === TK_NONE) {
              T0 = scan.start(options);
            }
          }
          function lookahead(options) {
            if (T1 === TK_NONE) {
              T1 = scan.start(options);
            }
            return T1;
          }
          // Consume the current token if it matches, otherwise throw.
          function eat(tc, options) {
            var tk = hd();
            if (tk !== tc) {
              var expected = String.fromCharCode(tc);
              var found = tk ? String.fromCharCode(tk) : "EOS";
              (0, _assert.assert)(false, message(1001, [expected, found]));
            }
            next(options);
          }
          // Begin parsing functions.
          function isSimpleFraction(node) {
            if (node.op === Model.FRAC) {
              var n0 = node.args[0];
              var n1 = node.args[1];
              return n0.op === Model.NUM && n0.numberFormat === "integer" && n1.op === Model.NUM && n1.numberFormat === "integer";
            }
            return false;
          }
          function isMinusOne(node) {
            // Check for a "-1" literal.
            return node.op === Model.SUB && node.args.length === 1 && node.args[0].op === Model.NUM && node.args[0].args.length === 1 && node.args[0].args[0] === "1";
          }
          function primaryExpr() {
            var t = void 0,
                node = void 0,
                tk = void 0,
                op = void 0,
                base = void 0,
                args = void 0,
                expr1 = void 0,
                expr2 = void 0;
            switch (tk = hd()) {
              case CC_CONST:
              case CC_VAR:
                args = [lexeme()];
                next();
                // // Collect the subscript if there is one. Subscripts make multipart variable names.
                // if ((t=hd())===TK_UNDERSCORE) {
                //   next({oneCharToken: true});
                //   args.push(primaryExpr());   // {op:VAR, args:["Fe", "2"]}
                // }
                node = newNode(Model.VAR, args);
                if (isChemCore()) {
                  if (hd() === TK_LEFTBRACE && lookahead() === TK_RIGHTBRACE) {
                    // C_2{}^3 -> C_2^3
                    eat(TK_LEFTBRACE);
                    eat(TK_RIGHTBRACE);
                  }
                }
                break;
              case TK_NUM:
                node = numberNode(lexeme());
                next();
                break;
              case TK_TYPE:
                node = newNode(Model.TYPE, [newNode(Model.VAR, [lexeme()])]);
                next();
                break;
              case TK_LEFTBRACKET:
              case TK_LEFTPAREN:
                node = parenExpr(tk);
                break;
              case TK_LEFTBRACE:
                node = braceExpr();
                break;
              case TK_BEGIN:
                next();
                var figure = braceExpr();
                var tbl = matrixExpr();
                eat(TK_END);
                braceExpr();
                if ((0, _backward.indexOf)(figure.args[0], "matrix") >= 0) {
                  node = newNode(Model.MATRIX, [tbl]);
                } else {
                  (0, _assert.assert)(false, "Unrecognized LaTeX name");
                }
                break;
              case TK_VERTICALBAR:
                node = absExpr();
                break;
              case TK_ABS:
                next();
                node = unaryNode(Model.ABS, [braceExpr()]);
                break;
              case TK_FRAC:
                next();
                expr1 = braceExpr();
                expr2 = braceExpr();
                node = newNode(Model.FRAC, [expr1, expr2]);
                node.isFraction = isSimpleFraction(node);
                break;
              case TK_BINOM:
                next();
                var n = braceExpr();
                var k = braceExpr();
                // (n k) = \frac{n!}{k!(n-k)!}
                var num = unaryNode(Model.FACT, [n]);
                var den = binaryNode(Model.POW, [binaryNode(Model.MUL, [unaryNode(Model.FACT, [k]), unaryNode(Model.FACT, [binaryNode(Model.ADD, [n, negate(k)])])]), nodeMinusOne]);
                node = binaryNode(Model.MUL, [num, den]);
                node.isBinomial = true;
                break;
              case TK_SQRT:
                next();
                switch (hd()) {
                  case TK_LEFTBRACKET:
                    var root = bracketExpr();
                    base = braceExpr();
                    node = newNode(Model.SQRT, [base, root]);
                    break;
                  case TK_LEFTBRACE:
                    base = braceExpr();
                    node = newNode(Model.SQRT, [base, newNode(Model.NUM, ["2"])]);
                    break;
                  default:
                    (0, _assert.assert)(false, message(1001, ["{ or (", String.fromCharCode(hd())]));
                    break;
                }
                break;
              case TK_VEC:
                next();
                var name = braceExpr();
                node = newNode(Model.VEC, [name]);
                break;
              case TK_SIN:
              case TK_COS:
              case TK_TAN:
              case TK_SEC:
              case TK_COT:
              case TK_CSC:
              case TK_SINH:
              case TK_COSH:
              case TK_TANH:
              case TK_SECH:
              case TK_COTH:
              case TK_CSCH:
                next();
                var _t = void 0;
                args = [];
                // Collect exponents if there are any
                while ((_t = hd()) === TK_CARET) {
                  next({ oneCharToken: true });
                  args.push(unaryExpr());
                }
                if (args.length === 1 && isMinusOne(args[0])) {
                  // Special case for sin^{-1} and friends.
                  op = "arc" + tokenToOperator[tk];
                  args = [];
                } else {
                  op = tokenToOperator[tk];
                }
                args.unshift(newNode(op, [postfixExpr()]));
                if (args.length > 1) {
                  return newNode(Model.POW, args);
                } else {
                  return args[0];
                }
                break;
              case TK_ARCSIN:
              case TK_ARCCOS:
              case TK_ARCTAN:
              case TK_ARCSEC:
              case TK_ARCCOT:
              case TK_ARCCSC:
              case TK_ARCSINH:
              case TK_ARCCOSH:
              case TK_ARCTANH:
              case TK_ARCSECH:
              case TK_ARCCSCH:
              case TK_ARCCOTH:
                next();
                args = [];
                // Collect exponents if there are any
                while ((_t = hd()) === TK_CARET) {
                  next({ oneCharToken: true });
                  args.push(unaryExpr());
                }
                args.unshift(newNode(tokenToOperator[tk], [primaryExpr()]));
                if (args.length > 1) {
                  return newNode(Model.POW, args);
                } else {
                  return args[0];
                }
                break;
              case TK_LN:
                next();
                return newNode(Model.LOG, [newNode(Model.VAR, ["e"]), primaryExpr()]);
              case TK_LG:
                next();
                return newNode(Model.LOG, [newNode(Model.NUM, ["10"]), primaryExpr()]);
              case TK_LOG:
                next();
                args = [];
                // Collect the subscript if there is one
                if ((_t = hd()) === TK_UNDERSCORE) {
                  next({ oneCharToken: true });
                  args.push(primaryExpr());
                } else {
                  args.push(newNode(Model.VAR, ["10"])); // default to base 10
                }
                args.push(primaryExpr());
                // Finish the log function
                return newNode(Model.LOG, args);
                break;
              case TK_LIM:
                return limitExpr();
              case TK_INT:
                return integralExpr();
              case TK_SUM:
              case TK_PROD:
              case TK_CUP:
              case TK_BIGCUP:
              case TK_CAP:
              case TK_BIGCAP:
                next();
                args = [];
                // Collect the subscript and expression
                if (hd() === TK_UNDERSCORE) {
                  next({ oneCharToken: true });
                  args.push(primaryExpr());
                  if (hd() === TK_CARET) {
                    eat(TK_CARET, { oneCharToken: true });
                    args.push(primaryExpr());
                  }
                }
                args.push(commaExpr());
                return newNode(tokenToOperator[tk], args);
              case TK_EXISTS:
                next();
                return newNode(Model.EXISTS, [equalExpr()]);
              case TK_FORALL:
              case TK_CAPRIGHTARROW:
              case TK_RIGHTARROW:
              case TK_LEFTARROW:
              case TK_LONGRIGHTARROW:
              case TK_LONGLEFTARROW:
              case TK_OVERRIGHTARROW:
              case TK_OVERLEFTARROW:
              case TK_CAPLEFTRIGHTARROW:
              case TK_LEFTRIGHTARROW:
              case TK_LONGLEFTRIGHTARROW:
              case TK_OVERLEFTRIGHTARROW:
                next();
                return newNode(tokenToOperator[tk], [commaExpr()]);
              case TK_EXP:
                next();
                return newNode(Model.EXP, [additiveExpr()]);
              case TK_M:
                next();
                return newNode(Model.M, [multiplicativeExpr()]);
              case TK_OVERLINE:
              case TK_DOT:
              case TK_MATHFIELD:
                next();
                return newNode(tokenToOperator[tk], [braceExpr()]);
              case TK_OVERSET:
              case TK_UNDERSET:
                next();
                expr1 = braceExpr();
                expr2 = braceExpr();
                return newNode(tokenToOperator[tk], [expr1, expr2]);
              case TK_MATHBF:
                // Erase this token.
                next();
                expr1 = braceExpr();
                return newNode(Model.MATHBF, [expr1]);
              case TK_QMARK:
                next();
                return newNode(Model.VAR, ["?"]);
              case TK_DELTA:
                next();
                if (hd() === TK_VAR) {
                  var _name = lexeme();
                  next();
                  return newNode(Model.VAR, ["delta_" + _name]);
                }
                break;
              default:
                (0, _assert.assert)(!Model.option("strict"), message(1006, [tokenToOperator[tk]]));
                node = nodeEmpty;
                break;
            }
            return node;
          }
          // Parse '1 & 2 & 3 \\ a & b & c'
          function matrixExpr() {
            var args = [];
            var node = void 0,
                t = void 0;
            args.push(rowExpr());
            while ((t = hd()) === TK_NEWROW) {
              next();
              args.push(rowExpr());
            }
            return newNode(tokenToOperator[TK_NEWROW], args);
          }
          // Parse '1 & 2 & 3'
          function rowExpr() {
            var args = [];
            var t = void 0;
            args.push(equalExpr());
            while ((t = hd()) === TK_NEWCOL) {
              next();
              args.push(equalExpr());
            }
            return newNode(tokenToOperator[TK_NEWCOL], args);
          }
          // Parse '| expr |'
          function absExpr() {
            eat(TK_VERTICALBAR);
            var e = additiveExpr();
            eat(TK_VERTICALBAR);
            return unaryNode(Model.ABS, [e]);
          }
          // Parse '{ expr }'
          function braceExpr() {
            var node = void 0;
            eat(TK_LEFTBRACE);
            if (hd() === TK_RIGHTBRACE) {
              eat(TK_RIGHTBRACE);
              node = nodeEmpty;
            } else {
              node = commaExpr();
              eat(TK_RIGHTBRACE);
            }
            node.lbrk = TK_LEFTBRACE;
            node.rbrk = TK_RIGHTBRACE;
            return node;
          }
          // Parse '[ expr ]'
          var bracketTokenCount = 0;
          function bracketExpr() {
            eat(TK_LEFTBRACKET);
            var e = commaExpr();
            eat(TK_RIGHTBRACKET);
            return e;
          }
          // Parse '( expr )' and '( expr ]' and '[ expr )' and '[ expr ]'
          function parenExpr(tk) {
            // Handle grouping and intervals.
            var e = void 0;
            var tk2 = void 0;
            eat(tk);
            if (hd() === TK_RIGHTPAREN || hd() === TK_RIGHTBRACKET) {
              eat(tk === TK_LEFTPAREN ? TK_RIGHTPAREN : TK_RIGHTBRACKET);
              e = newNode(Model.COMMA, []);
            } else {
              e = commaExpr();
              // (..], [..], [..), (..)
              eat(tk2 = hd() === TK_RIGHTPAREN ? TK_RIGHTPAREN : TK_RIGHTBRACKET);
            }
            // intervals: (1, 3), [1, 3], [1, 3), (1, 3]
            if (e.args.length === 2 && e.op === Model.COMMA && (tk === TK_LEFTPAREN || tk === TK_LEFTBRACKET) && (tk2 === TK_RIGHTPAREN || tk2 === TK_RIGHTBRACKET)) {
              // Make bracket tokens part of the node for comparision.
              //        e.args.push(numberNode(tk));
              //        e.args.push(numberNode(tk2));
              e = newNode(Model.PAREN, [e]);
            } else if (tk === TK_LEFTPAREN || tk === TK_LEFTBRACKET) {
              e = newNode(Model.PAREN, [e]);
            }
            // Save the brackets as attributes on the node for later use.
            e.lbrk = tk;
            e.rbrk = tk2;
            return e;
          }
          // Parse 'x^2'
          function exponentialExpr() {
            var t = void 0,
                args = [primaryExpr()];
            while ((t = hd()) === TK_CARET) {
              next({ oneCharToken: true });
              var _t2 = void 0;
              if ((isMathSymbol(args[0]) || isChemCore()) && ((_t2 = hd()) === TK_ADD || _t2 === TK_SUB)) {
                next();
                // Na^+
                args.push(unaryNode(tokenToOperator[_t2], [nodeOne]));
              } else {
                var n = unaryExpr();
                if (n.op === Model.VAR && n.args[0] === "\\circ") {
                  // 90^{\circ} -> degree 90
                  if (hd() === TK_VAR && lexeme() === "K" || lexeme() === "C" || lexeme() === "F") {
                    n = multiplyNode([args.pop(), unaryNode(Model.VAR, ["\\degree " + lexeme()])]);
                    next();
                  } else {
                    n = multiplyNode([args.pop(), unaryNode(Model.VAR, ["\\degree"])]);
                  }
                  args.push(n);
                } else {
                  // x^2
                  args.push(n);
                }
              }
            }
            if (args.length > 1) {
              var expo = args.pop();
              (0, _backward.forEach)(args.reverse(), function (base) {
                expo = newNode(Model.POW, [base, expo]);
              });
              expo.isPolynomial = isPolynomial(expo);
              return expo;
            } else {
              var node = args[0];
              node.isPolynomial = isPolynomial(node);
              return node;
            }
          }
          // Parse '10%', '4!'
          function postfixExpr() {
            var t = void 0;
            var expr = exponentialExpr();
            switch (t = hd()) {
              case TK_PERCENT:
                next();
                expr = newNode(Model.PERCENT, [expr]);
                break;
              case TK_BANG:
                next();
                expr = newNode(Model.FACT, [expr]);
                break;
              default:
                if (t === TK_VAR && lexeme() === "\\degree") {
                  next();
                  if (hd() === TK_VAR && (lexeme() === "K" || lexeme() === "C" || lexeme() === "F")) {
                    expr = multiplyNode([expr, unaryNode(Model.VAR, ["\\degree " + lexeme()])]);
                    next();
                  } else {
                    expr = multiplyNode([expr, unaryNode(Model.VAR, ["\\degree"])]);
                  }
                } else if (t === TK_VERTICALBAR && lookahead() === TK_UNDERSCORE) {
                  // x|_{x=3}, x|_1^2
                  next();
                  var args = [expr];
                  next({ oneCharToken: true });
                  args.push(newNode(Model.SUBSCRIPT, [equalExpr()]));
                  expr = newNode(Model.PIPE, args);
                } else if (isChemCore() && (t === TK_ADD || t === TK_SUB) && lookahead() === TK_RIGHTBRACE) {
                  next();
                  // 3+, ion
                  expr = unaryNode(tokenToOperator[t], [expr]);
                } // Otherwise we're in the middle of a binary expr.
                break;
            }
            return expr;
          }
          // Parse '+x', '\pm y'
          function unaryExpr() {
            var t = void 0,
                expr = void 0,
                op = void 0;
            switch (t = hd()) {
              case TK_ADD:
              case TK_NOT:
              case TK_SUB:
                next();
                expr = newNode(tokenToOperator[t], [unaryExpr()]);
                break;
              case TK_UNDERSCORE:
                // _1, _1^2, _+^-
                op = tokenToOperator[t];
                next({ oneCharToken: true });
                if ((t = hd()) === TK_ADD || t === TK_SUB) {
                  next();
                  // ^+, ^-
                  expr = nodeOne;
                } else {
                  expr = unaryExpr();
                }
                expr = newNode(op, [expr]);
                if ((t = hd()) === TK_CARET) {
                  var args = [expr];
                  // _1, _1^2, _+^-
                  op = tokenToOperator[t];
                  next({ oneCharToken: true });
                  if ((t = hd()) === TK_ADD || t === TK_SUB) {
                    next();
                    // ^+, ^-
                    expr = nodeOne;
                  } else {
                    expr = unaryExpr();
                  }
                  args.push(expr);
                  expr = newNode(op, args);
                }
                break;
              case TK_CARET:
                op = tokenToOperator[t];
                next({ oneCharToken: true });
                if ((t = hd()) === TK_ADD || t === TK_SUB) {
                  next();
                  // ^+, ^-
                  expr = nodeOne;
                } else {
                  expr = unaryExpr();
                }
                expr = newNode(op, [expr]);
                break;
              default:
                if (t === TK_VAR && lexeme() === "$") {
                  next();
                  if (hd()) {
                    // Give $1 a higher precedence than ordinary multiplication.
                    expr = multiplyNode([newNode(Model.VAR, ["$"]), postfixExpr()]);
                    expr.args[1].isPolynomialTerm = true;
                  } else {
                    // Standalone "$". Probably not useful but we had a test case for it.
                    expr = newNode(Model.VAR, ["$"]);
                  }
                } else {
                  expr = postfixExpr();
                }
                break;
            }
            return expr;
          }
          // Parse 'x_2'
          function subscriptExpr() {
            var t = void 0,
                args = [unaryExpr()];
            if ((t = hd()) === TK_UNDERSCORE) {
              next({ oneCharToken: true });
              args.push(exponentialExpr());
              if (isChemCore()) {
                if (hd() === TK_LEFTBRACE) {
                  // C_2{}^3 -> C_2^3
                  eat(TK_LEFTBRACE);
                  eat(TK_RIGHTBRACE);
                }
              }
            }
            if (args.length > 1) {
              return newNode(Model.SUBSCRIPT, args);
            } else {
              return args[0];
            }
          }
          // Parse '1/2/3/4'
          function fractionExpr() {
            var t = void 0,
                node = subscriptExpr();
            while ((t = hd()) === TK_SLASH || t === TK_COLON) {
              next();
              node = newNode(tokenToOperator[t], [node, subscriptExpr()]);
              node.isFraction = isSimpleFraction(node);
            }
            return node;
          }
          //
          function isChemSymbol(n) {
            var id = void 0;
            if (n.op === Model.VAR) {
              id = n.args[0];
            } else if (n.op === Model.POW) {
              id = n.args[0].args[0];
            } else {
              return false;
            }
            var sym = Model.env[id];
            return sym && sym.mass ? true : false; // Has mass so must be (?) a chem symbol.
          }
          //
          function isMathSymbol(n) {
            if (n.op !== Model.VAR) {
              return false;
            }
            var sym = Model.env[n.args[0]];
            return sym && sym.name ? true : false; // This is somewhat ad hoc, update as needed
          }
          //
          function isVar(n, id) {
            (0, _assert.assert)(typeof id === "undefined" || typeof id === "string", "Internal error in 'isVar()'");
            if (n.op !== Model.VAR) {
              return false;
            }
            return id === undefined ? true : n.args[0] === id;
          }
          // Parse 'a \times b', 'a * b'
          function isOneOrMinusOne(node) {
            return isOne(node) || isMinusOne(node);
          }
          function isOne(node) {
            return node.op === Model.NUM && node.args[0] === "1";
          }
          function isMinusOne(node) {
            return node.op === Model.SUB && node.args.length === 1 && isOne(node.args[0]);
          }
          function isDerivative(n) {
            if (n.op !== Model.FRAC) {
              return false;
            }
            var numer = n.args[0];
            var numerHead = numer.op === Model.MUL && numer.args[0].op === Model.VAR && numer.args[0].args[0] || numer.op === Model.VAR && numer.args[0] || numer.op === Model.POW && numer.args[0].op === Model.VAR && numer.args[0].args[0];
            var denom = n.args[1];
            var denomHead = denom.op === Model.MUL && denom.args[0].op === Model.VAR && denom.args[0].args[0];
            return numerHead === "d" && denomHead === "d" && (denom.args[1] && denom.args[1].op === Model.VAR || denom.args[1] && denom.args[1].op === Model.POW && denom.args[1].args[0] && denom.args[1].args[0].op === Model.VAR);
          }
          function derivativeExpr(node) {
            if (node.op !== Model.FRAC) {
              return;
            }
            var numer = node.args[0];
            var denom = node.args[1];
            var n = numer.op === Model.MUL && numer.args.slice(1).length > 0 && multiplyNode(numer.args.slice(1)) || nodeOne;
            (0, _assert.assert)(denom.args.length === 2);
            var arg = denom.args[1];
            var sym = arg.op === Model.POW && arg.args[0] || arg;
            var order = arg.op === Model.POW && arg.args[1] || nodeOne;
            return newNode(Model.DERIV, [n, sym, order]);
          }
          function multiplicativeExpr() {
            var t,
                expr,
                explicitOperator = false,
                isFraction,
                args = [];
            var n0;
            expr = fractionExpr();
            if (isDerivative(expr)) {
              expr = derivativeExpr(expr);
            }
            if (expr.op === Model.MUL && !expr.isBinomial && expr.args[expr.args.length - 1].op !== Model.VAR && expr.args[expr.args.length - 1].args[0] === "\\degree") {
              // FIXME binomials and all other significant syntax should not be desugared
              // during parsing. It breaks equivLiteral and equivSyntax.
              args = expr.args;
            } else {
              args = [expr];
            }
            // While lookahead is not a lower precedent operator
            // FIXME need a better way to organize this condition
            var loopCount = 0;
            while ((t = hd()) && !isAdditive(t) && !isRelational(t) && !isImplies(t) && t !== TK_COMMA && !isEquality(t) && t !== TK_RIGHTBRACE && t !== TK_RIGHTPAREN && t !== TK_RIGHTBRACKET && t !== TK_RIGHTARROW && t !== TK_CAPRIGHTARROW && t !== TK_LT && t !== TK_VERTICALBAR && t !== TK_NEWROW && t !== TK_NEWCOL && t !== TK_END) {
              explicitOperator = false;
              if (isMultiplicative(t)) {
                next();
                explicitOperator = true;
              }
              expr = fractionExpr();
              if (isDerivative(expr)) {
                expr = derivativeExpr(expr);
              }
              if (t === TK_DIV || t === TK_DOT) {
                expr = newNode(tokenToOperator[t], [args.pop(), expr]);
              }
              (0, _assert.assert)(explicitOperator || args.length === 0 || expr.lbrk || args[args.length - 1].op !== Model.NUM || args[args.length - 1].lbrk || isRepeatingDecimal([args[args.length - 1], expr]) || expr.op !== Model.NUM, message(1010));
              if (isChemCore() && t === TK_LEFTPAREN && isVar(args[args.length - 1], "M")) {
                // M(x) -> \M(x)
                args.pop();
                expr = unaryNode(Model.M, [expr]);
              } else if (!explicitOperator) {
                if (args.length > 0 && isMixedFraction(args[args.length - 1], expr)) {
                  // 3 \frac{1}{2} -> 3 + \frac{1}{2}
                  t = args.pop();
                  expr = binaryNode(Model.ADD, [t, expr]);
                  expr.isMixedFraction = true;
                } else if (args.length > 0 && args[args.length - 1].op === Model.VAR && expr.op === Model.VAR && expr.args[0].indexOf("'") === 0) {
                  // Merge previous var with current '.
                  expr = binaryNode(Model.POW, [args.pop(), expr]);
                  expr.isImplicit = expr.args[0].isImplicit;
                } else if (args.length > 0 && (args[args.length - 1].op === Model.MUL || args[args.length - 1].op === Model.DOT) && // 2x', 2*x', 2\cdot x'
                args[args.length - 1].args[args[args.length - 1].args.length - 1].op === Model.VAR && expr.op === Model.VAR && expr.args[0].indexOf("'") === 0) {
                  t = args.pop();
                  expr = multiplyNode(t.args.concat(binaryNode(Model.POW, [t.args.pop(), expr])));
                  expr.isImplicit = expr.args[0].isImplicit;
                } else if (args.length > 0 && args[args.length - 1].op === Model.VAR && expr.op === Model.POW && expr.args[0].op === Model.VAR && expr.args[0].args[0].indexOf("'") === 0) {
                  // Merge previous var with current ' and raise to the power.
                  expr = newNode(Model.POW, [binaryNode(Model.POW, [args.pop(), expr.args[0]])].concat(expr.args.slice(1)));
                  expr.isImplicit = expr.args[0].args[0].isImplicit;
                } else if (Model.option("ignoreCoefficientOne") && args.length === 1 && isOneOrMinusOne(args[0]) && isPolynomialTerm(args[0], expr)) {
                  // 1x -> x
                  if (isOne(args[0])) {
                    args.pop();
                  } else {
                    expr = negate(expr);
                  }
                } else if (args.length > 0 && (n0 = isRepeatingDecimal([args[args.length - 1], expr]))) {
                  args.pop();
                  expr = n0;
                } else if (isENotation(args, expr)) {
                  // 1E2, 1E-2, 1e2
                  var tmp = args.pop();
                  expr = binaryNode(Model.POW, [numberNode("10"), unaryExpr()]);
                  expr = binaryNode(Model.MUL, [tmp, expr]);
                  expr.isScientific = true;
                } else if (!isChemCore() && isPolynomialTerm(args[args.length - 1], expr)) {
                  // 2x, -3y but not CH (in chem)
                  expr.isPolynomialTerm = true;
                  var t = args.pop();
                  if (!t.isPolynomialTerm) {
                    expr = binaryNode(Model.MUL, [t, expr]);
                    expr.isImplicit = t.isImplicit;
                    t.isImplicit = undefined;
                  } else {
                    args.push(t);
                  }
                } else if (args[args.length - 1].op === Model.DERIV) {
                  // Fold expr into derivative expr.
                  var arg = args.pop();
                  var e = arg.args[0];
                  var e = isOne(e) && expr || multiplyNode([e, expr]);
                  expr = newNode(Model.DERIV, [e].concat(arg.args.slice(1)));
                } else {
                  // 2(x), (y+1)z
                  expr.isImplicit = true;
                }
              } else if (t === TK_MUL && args.length > 0 && isScientific([args[args.length - 1], expr])) {
                // 1.2 \times 10 ^ {-3}
                t = args.pop();
                if (isNeg(t)) {
                  expr = binaryNode(Model.MUL, [nodeMinusOne, expr]);
                }
                expr = binaryNode(Model.MUL, [t, expr]);
                expr.isScientific = true;
              }
              if (expr.op === Model.MUL && !expr.isScientific && !expr.isBinomial && args.length && !args[args.length - 1].isImplicit && !args[args.length - 1].isPolynomialTerm && expr.isImplicit && expr.isPolynomialTerm) {
                args = args.concat(expr.args);
              } else {
                args.push(expr);
              }
              (0, _assert.assert)(loopCount++ < 1000, message(1000, ["Stuck in loop in mutliplicativeExpr()"]));
            }
            var n = void 0;
            if (args.length > 1) {
              n = binaryNode(Model.MUL, args);
            } else {
              n = args[0];
            }
            n.isPolynomial = isPolynomial(n);
            return n;
            //
            function isMultiplicative(t) {
              return t === TK_MUL || t === TK_DIV || t === TK_SLASH || t === TK_DOT;
              // / is only multiplicative for parsing
            }
          }

          function isNumber(n) {
            return n.op === Model.NUM;
          }

          function isMixedFraction(n0, n1) {
            // 3\frac{1}{2} but not 3(\frac{1}{2}) or 3 1.0/2
            if (n0.op === Model.SUB && n0.args.length === 1) {
              n0 = n0.args[0];
            }
            if (!n0.lbrk && !n1.lbrk && n0.op === Model.NUM && isSimpleFraction(n1)) {
              return true;
            }
            return false;
          }

          function isPolynomialTerm(n0, n1) {
            // 3x but not 3(x)
            if (n0.op === Model.SUB && n0.args.length === 1) {
              n0 = n0.args[0];
            }
            if (!n0.lbrk && !n1.lbrk && (n0.op === Model.NUM && isVar(n1) || isVar(n0) && n1.op === Model.NUM || n0.op === Model.NUM && n1.op === Model.NUM || isVar(n0) && isVar(n1) || n0.op === Model.MUL && n0.args[n0.args.length - 1].isPolynomialTerm && (isVar(n1) || n1.op === Model.NUM))) {
              return true;
            }
            return false;
          }

          function isInteger(node) {
            var n = void 0;
            if (node.op === Model.NUM) {
              n = node.args[0];
            } else {
              n = node;
            }
            return !isNaN(parseInt(n));
          }

          function isPolynomial(node) {
            // This recognizes some common shapes of polynomials.
            var degree = 0;
            if (node.op === Model.POW) {
              var base = node.args[0];
              var expo = node.args[1];
              if ((base.op === Model.VAR || base.isPolynomial || base.op === Model.PAREN && isPolynomial(base.args[0])) && isInteger(expo)) {
                degree = parseInt(expo.args[0]);
              }
            } else if (node.op === Model.VAR) {
              degree = 1;
            } else if (node.op === Model.ADD || node.op === Model.SUB) {
              node.args.forEach(function (n) {
                var d = isPolynomial(n);
                degree = d > degree && d || degree;
              });
            } else if (node.op === Model.MUL) {
              node.args.forEach(function (n) {
                var d = isPolynomial(n);
                degree = d > degree && d || degree;
              });
            }
            return degree;
          }

          function isRepeatingDecimal(args) {
            // "3." "\overline{..}"
            // "3." "(..)"
            // "3." "\dot{..}"
            var expr = void 0,
                n0 = void 0,
                n1 = void 0;
            // if (args[0].isRepeating) {
            //   // We already have a repeating decimal so append additional digits to it.
            //   let n = args[0].op === Model.ADD && args[0].args[1].op === Model.NUM
            //     ? args[0].args[1]
            //     : args[0];
            //   console.log("isRepeating() n=" + JSON.stringify(n, null, 2));
            //   assert(n.op === Model.NUM || n.op === Model.VAR && n.args[0] === "?");
            //   let arg1;
            //   if (args[1].op === Model.DOT) {
            //     assert(args[1].args[0].op === Model.NUM);
            //     arg1 = numberNode(n.args[0] + args[1].args[0].args[0]);
            //   } else {
            //     assert(args[1].op === Model.NUM);
            //     arg1 = numberNode(n.args[0] + args[1].args[0]);
            //   }
            //   arg1.isRepeating = true;
            //   if (args[0].op === Model.ADD) {
            //     args[0].args[1] = arg1;
            //     expr = args[0];
            //   } else {
            //     expr = arg1;
            //   }
            // } else
            if (!args[0].lbrk && (args[0].op === Model.NUM && args[0].numberFormat === "decimal" || args[0].op === Model.VAR && args[0].args[0] === "?" || args[0].op === Model.TYPE && args[0].args[0].op === Model.VAR && args[0].args[0].args[0] === "decimal")) {
              // No lbrk so we are in the same number literal.
              if (args[1].lbrk === 40 && (isInteger(args[1]) || args[1].op === Model.TYPE && args[1].args[0].op === Model.VAR && args[1].args[0].args[0] === "integer")) {
                n0 = args[0];
                n1 = args[1];
              } else if (!args[1].lbrk && args[1].op === Model.OVERLINE) {
                // 3.\overline{12} --> 3.0+(0.12, repeating)
                // 0.3\overline{12} --> 0.3+0.1*(.12, repeating)
                n0 = args[0];
                n1 = args[1];
                if (n1.args[0].op === Model.NUM) {
                  n1.args[0].args[0] = n1.args[0].args[0].split("").join(" ");
                }
              } else if (!args[1].lbrk && args[1].op === Model.DOT) {
                // 3.\dot{1}\dot{2} --> 3.0+(0.12, repeating)
                // 0.3\overline{12} --> 0.3+0.1*(.12, repeating)
                n0 = args[0];
                n1 = args[1];
              } else {
                return null;
              }
              // n1 = numberNode("." + n1.args[0]);
              n1.isRepeating = true;
              // if (indexOf(n0.args[0], ".") >= 0) {
              //   let decimalPlaces = n0.args[0].length - indexOf(n0.args[0], ".")- 1;
              //   n1 = multiplyNode([n1, binaryNode(Model.POW, [numberNode("10"), numberNode("-" + decimalPlaces)])]);
              // }
              // if (n0.op === Model.NUM && +n0.args[0] === 0) {
              //   // 0.\overline{..} or 0.00\overline{..}. Leading zero, so don't add it.
              //   expr = n1;
              // } else {
              expr = binaryNode(Model.ADD, [n0, n1]);
              // }
              expr.numberFormat = "decimal";
              expr.isRepeating = true;
            } else {
              expr = null;
            }
            return expr;
          }

          function isENotation(args, expr, t) {
            var n;
            var eulers = Model.option("allowEulersNumber");
            if (args.length > 0 && isNumber(args[args.length - 1]) && expr.op === Model.VAR && (expr.args[0] === "E" || expr.args[0] === "e" && !eulers) && (hd() === TK_NUM || (hd() === 45 || hd() === 43) && lookahead() === TK_NUM)) {
              // 1E-2, 1E2
              return true;
            }
            return false;
          }

          function isScientific(args) {
            if (args.length === 1) {
              // 1.2, 10^2
              if (args[0].op === Model.NUM && (args[0].args[0].length === 1 || (0, _backward.indexOf)(args[0].args[0], ".") === 1)) {
                return true;
              } else if (args[0].op === Model.POW && args[0].args[0].op === Model.NUM && args[0].args[0].args[0] === "10" && args[0].args[1].numberFormat === "integer") {
                return true;
              }
              return false;
            } else if (args.length === 2) {
              // 1.0 \times 10 ^ 1
              var a = args[0];
              var e = args[1];
              if (a.op === Model.NUM && (a.args[0].length === 1 || (0, _backward.indexOf)(a.args[0], ".") === 1) && e.op === Model.POW && e.args[0].op === Model.NUM && e.args[0].args[0] === "10" && e.args[1].numberFormat === "integer") {
                return true;
              }
              return false;
            }
          }

          function isNeg(n) {
            if (typeof n === "number") {
              return n < 0;
            } else if (n.args.length === 1) {
              return n.op === OpStr.SUB && n.args[0].args[0] > 0 || // is unary minus
              n.op === Model.NUM && +n.args[0] < 0; // is negative number
            } else if (n.args.length === 2) {
              return n.op === OpStr.MUL && isNeg(n.args[0]); // leading term is neg
            }
          }
          // Return the numeric inverse of the argument.
          function negate(n) {
            if (typeof n === "number") {
              return -n;
            } else if (n.op === Model.MUL) {
              var args = n.args.slice(0); // copy
              return multiplyNode([negate(args.shift())].concat(args));
            } else if (n.op === Model.POW && isMinusOne(n.args[1])) {
              return binaryNode(Model.POW, [negate(n.args[0]), nodeMinusOne]);
            }
            return unaryNode(Model.SUB, [n]);
          }
          //
          function isAdditive(t) {
            return t === TK_ADD || t === TK_SUB || t === TK_PM || t === TK_BACKSLASH || t === TK_CUP || t === TK_CAP;
          }
          // Parse 'a + b'
          function additiveExpr() {
            var expr = multiplicativeExpr();
            var t = void 0;
            while (isAdditive(t = hd())) {
              next();
              var expr2 = multiplicativeExpr();
              switch (t) {
                case TK_BACKSLASH:
                case TK_CUP:
                case TK_CAP:
                  if (expr.lbrk === TK_LEFTBRACE && expr.rbrk === TK_RIGHTBRACE) {
                    expr = newNode(Model.SET, [expr]);
                  }
                  if (expr2.lbrk === TK_LEFTBRACE && expr2.rbrk === TK_RIGHTBRACE) {
                    expr2 = newNode(Model.SET, [expr2]);
                  }
                  expr = binaryNode(tokenToOperator[t], [expr, expr2]);
                  break;
                case TK_PM:
                  expr = binaryNode(Model.PM, [expr, expr2]);
                  break;
                case TK_SUB:
                  expr = binaryNode(Model.SUB, [expr, expr2]);
                  break;
                default:
                  expr = binaryNode(Model.ADD, [expr, expr2]);
                  break;
              }
            }
            expr.isPolynomial = isPolynomial(expr);
            return expr;
          }
          function flattenNestedNodes(node) {
            var args = [];
            if (node.op === Model.NUM || node.op === Model.VAR) {
              return node;
            }
            (0, _backward.forEach)(node.args, function (n) {
              n = flattenNestedNodes(n);
              if (n.op === node.op) {
                args = args.concat(n.args);
              } else {
                args.push(n);
              }
            });
            var isMixedNumber = node.isMixedNumber;
            node = newNode(node.op, args);
            node.isMixedNumber = isMixedNumber;
            return node;
          }
          // Parse '\int a + b dx'
          function hasDX(node) {
            var len = node.args.length;
            var dvar = node.args[len - 2];
            var ivar = node.args[len - 1];
            return node && node.op === Model.MUL && dvar.op === Model.VAR && dvar.args[0] === "d" && ivar.op === Model.VAR && ivar || null;
          }
          function stripDX(node) {
            (0, _assert.assert)(node.op === Model.MUL);
            // Strip off last two args ('dx')
            return multiplyNode(node.args.slice(0, node.args.length - 2));
          }
          function integralExpr() {
            eat(TK_INT);
            var args = [];
            // Collect the subscript and expression
            if (hd() === TK_UNDERSCORE) {
              next({ oneCharToken: true });
              args.push(primaryExpr());
              if (hd() === TK_CARET) {
                eat(TK_CARET, { oneCharToken: true });
                args.push(primaryExpr());
              }
            }
            var expr;
            if (hd() === TK_INT) {
              // FIXME nested integrals are still broken.
              expr = integralExpr();
            } else {
              expr = flattenNestedNodes(multiplicativeExpr());
              var t;
              var dx = hasDX(expr);
              expr = dx && stripDX(expr) || expr;
              while (isAdditive(t = hd()) && !dx) {
                next();
                var expr2 = multiplicativeExpr();
                dx = hasDX(expr2);
                expr2 = dx && stripDX(expr2) || expr2;
                switch (t) {
                  case TK_SUB:
                    expr = binaryNode(Model.SUB, [expr, expr2]);
                    break;
                  default:
                    expr = binaryNode(Model.ADD, [expr, expr2], true /*flatten*/);
                    break;
                }
              }
            }
            args.push(expr);
            args.push(dx || nodeEmpty);
            // [sub, sup,  expr, var], [expr, var]
            return newNode(Model.INTEGRAL, args);
          }
          function limitExpr() {
            eat(TK_LIM);
            var args = [];
            // Collect the subscript and expression
            if (hd() === TK_UNDERSCORE) {
              next({ oneCharToken: true });
              args.push(primaryExpr());
            }
            args.push(multiplicativeExpr());
            return newNode(Model.LIM, args);
          }
          function isRelational(t) {
            return t === TK_LT || t === TK_LE || t === TK_GT || t === TK_GE || t === TK_IN || t === TK_TO || t === TK_PERP || t === TK_PROPTO || t === TK_NGTR || t === TK_NLESS || t === TK_NI || t === TK_NOT || t === TK_SUBSETEQ || t === TK_SUPSETEQ || t === TK_SUBSET || t === TK_SUPSET || t === TK_PARALLEL || t === TK_NPARALLEL || t === TK_SIM || t === TK_CONG;
          }
          // Parse 'x < y'
          // x + y > z ==> (x + y) > z, x + (y > z)
          function relationalExpr() {
            var t = hd();
            var expr = additiveExpr();
            var args = [];
            var isNot = false;
            while (isRelational(t = hd())) {
              // x < y < z -> [x < y, y < z]
              next();
              if (t === TK_NOT) {
                // Remember it and continue.
                isNot = true;
                continue;
              }
              var expr2 = additiveExpr();
              expr = newNode(tokenToOperator[t], [expr, expr2]);
              if (isNot) {
                // Modify with not.
                expr.op = "n" + expr.op; // Negate the operator: subset --> nsubset.
                isNot = false;
              }
              args.push(expr);
              // Make a copy of the reused node.
              expr = Model.create(expr2);
            }
            if (args.length === 0) {
              expr = expr;
            } else if (args.length === 1) {
              expr = args[0];
            } else {
              expr = newNode(Model.COMMA, args);
            }
            return expr;
          }
          // Parse 'x = 10'
          function isEquality(t) {
            return t === TK_EQL || t === TK_NE || t === TK_APPROX;
          }
          function equalExpr() {
            var expr = relationalExpr();
            var t = void 0;
            var args = [];
            while (isEquality(t = hd())) {
              // x = y = z -> [x = y, y = z]
              next();
              var expr2 = additiveExpr();
              expr = newNode(tokenToOperator[t], [expr, expr2]);
            }
            return expr;
          }
          function isImplies(t) {
            return t === TK_IMPLIES || t === TK_RIGHTARROW || t === TK_CAPRIGHTARROW || t === TK_LEFTARROW || t === TK_LONGRIGHTARROW || t === TK_LONGLEFTARROW || t === TK_OVERRIGHTARROW || t === TK_OVERLEFTARROW || t === TK_CAPLEFTRIGHTARROW || t === TK_LEFTRIGHTARROW || t === TK_LONGLEFTRIGHTARROW || t === TK_OVERLEFTRIGHTARROW || t === TK_VERTICALBAR;
          }
          function impliesExpr() {
            var expr = equalExpr();
            var t = void 0;
            var args = [];
            while (isImplies(t = hd())) {
              next();
              var expr2 = equalExpr();
              expr = newNode(tokenToOperator[t], [expr, expr2]);
            }
            return expr;
          }
          // Parse 'a, b, c, d'
          function commaExpr() {
            var expr = impliesExpr();
            var args = [expr];
            var t = void 0;
            while ((t = hd()) === TK_COMMA) {
              next();
              args.push(impliesExpr());
            }
            if (args.length > 1) {
              expr = newNode(tokenToOperator[TK_COMMA], args);
            }
            return expr;
          }
          // Root syntax.
          function tokenize() {
            // Just return a list of lexemes.
            var args = [];
            start();
            while (hd()) {
              var lex = lexeme();
              args.push(newNode(hd(), lex ? [lex] : []));
              next();
            }
            var node = newNode(Model.COMMA, args);
            return node;
          }

          function expr() {
            start();
            if (hd()) {
              var n = commaExpr();
              if (n.lbrk === TK_LEFTBRACE && n.rbrk === TK_RIGHTBRACE) {
                // Top level {..} is a set, so make a comma expr.
                n = newNode(Model.SET, [n]);
              }
              (0, _assert.assert)(!hd(), message(1003, [scan.pos(), scan.lexeme()]));
              return n;
            }
            // No meaningful input. Return a dummy node to avoid choking.
            return nodeNone;
          }
          // Return a parser object.
          return {
            expr: expr,
            tokenize: tokenize
          };
          //
          // SCANNER
          //
          // Find tokens in the input stream.
          //
          function scanner(src) {
            var curIndex = 0;
            var _lexeme = "";
            var lexemeToToken = {
              "\\Delta": TK_DELTA,
              "\\cdot": TK_DOT,
              "\\times": TK_MUL,
              "\\div": TK_DIV,
              "\\dfrac": TK_FRAC,
              "\\frac": TK_FRAC,
              "\\sqrt": TK_SQRT,
              "\\vec": TK_VEC,
              "\\pm": TK_PM,
              "\\not": TK_NOT,
              "\\sin": TK_SIN,
              "\\cos": TK_COS,
              "\\tan": TK_TAN,
              "\\sec": TK_SEC,
              "\\cot": TK_COT,
              "\\csc": TK_CSC,
              "\\arcsin": TK_ARCSIN,
              "\\arccos": TK_ARCCOS,
              "\\arctan": TK_ARCTAN,
              "\\arcsec": TK_ARCSEC,
              "\\arccot": TK_ARCCOT,
              "\\arccsc": TK_ARCCSC,
              "\\sinh": TK_SINH,
              "\\cosh": TK_COSH,
              "\\tanh": TK_TANH,
              "\\sech": TK_SECH,
              "\\coth": TK_COTH,
              "\\csch": TK_CSCH,
              "\\arcsinh": TK_ARCSINH,
              "\\arccosh": TK_ARCCOSH,
              "\\arctanh": TK_ARCTANH,
              "\\arcsech": TK_ARCSECH,
              "\\arccsch": TK_ARCCSCH,
              "\\arccoth": TK_ARCCOTH,
              "\\ln": TK_LN,
              "\\lg": TK_LG,
              "\\log": TK_LOG,
              "\\left": null, // whitespace
              "\\right": null,
              "\\big": null,
              "\\Big": null,
              "\\bigg": null,
              "\\Bigg": null,
              "\\ ": null,
              "\\quad": null,
              "\\qquad": null,
              "\\text": TK_TEXT,
              "\\textrm": TK_TEXT,
              "\\textit": TK_TEXT,
              "\\textbf": TK_TEXT,
              "\\operatorname": TK_OPERATORNAME,
              "\\lt": TK_LT,
              "\\le": TK_LE,
              "\\leq": TK_LE,
              "\\gt": TK_GT,
              "\\ge": TK_GE,
              "\\geq": TK_GE,
              "\\ne": TK_NE,
              "\\neq": TK_NE,
              "\\ngtr": TK_NGTR,
              "\\nless": TK_NLESS,
              "\\ni": TK_NI,
              "\\subseteq": TK_SUBSETEQ,
              "\\supseteq": TK_SUPSETEQ,
              "\\subset": TK_SUBSET,
              "\\supset": TK_SUPSET,
              "\\approx": TK_APPROX,
              "\\implies": TK_IMPLIES,
              "\\Rightarrow": TK_CAPRIGHTARROW,
              "\\rightarrow": TK_RIGHTARROW,
              "\\leftarrow": TK_LEFTARROW,
              "\\longrightarrow": TK_LONGRIGHTARROW,
              "\\longleftarrow": TK_LONGLEFTARROW,
              "\\overrightarrow": TK_OVERRIGHTARROW,
              "\\overleftarrow": TK_OVERLEFTARROW,
              "\\Leftrightarrow": TK_CAPLEFTRIGHTARROW,
              "\\leftrightarrow": TK_LEFTRIGHTARROW,
              "\\longleftrightarrow": TK_LONGLEFTRIGHTARROW,
              "\\overleftrightarrow": TK_OVERLEFTRIGHTARROW,
              "\\perp": TK_PERP,
              "\\propto": TK_PROPTO,
              "\\parallel": TK_PARALLEL,
              "\\nparallel": TK_NPARALLEL,
              "\\sim": TK_SIM,
              "\\cong": TK_CONG,
              "\\exists": TK_EXISTS,
              "\\in": TK_IN,
              "\\forall": TK_FORALL,
              "\\lim": TK_LIM,
              "\\exp": TK_EXP,
              "\\to": TK_TO,
              "\\sum": TK_SUM,
              "\\int": TK_INT,
              "\\prod": TK_PROD,
              "\\cup": TK_CUP,
              "\\bigcup": TK_BIGCUP,
              "\\cap": TK_CAP,
              "\\bigcap": TK_BIGCAP,
              "\\%": TK_PERCENT,
              "\\binom": TK_BINOM,
              "\\begin": TK_BEGIN,
              "\\end": TK_END,
              "\\colon": TK_COLON,
              "\\vert": TK_VERTICALBAR,
              "\\lvert": TK_VERTICALBAR,
              "\\rvert": TK_VERTICALBAR,
              "\\mid": TK_VERTICALBAR,
              "\\type": TK_TYPE,
              "\\overline": TK_OVERLINE,
              "\\overset": TK_OVERSET,
              "\\underset": TK_UNDERSET,
              "\\backslash": TK_BACKSLASH,
              "\\mathbf": TK_MATHBF,
              "\\abs": TK_ABS,
              "\\dot": TK_DOT,
              "\\MathQuillMathField": TK_MATHFIELD,
              "\\ldots": TK_VAR, // ... and var are close syntactic alternatives
              "\\vdots": TK_VAR,
              "\\ddots": TK_VAR
            };
            var unicodeToLaTeX = {
              0x00B0: "\\degree",
              0x2200: "\\forall",
              0x2201: "\\complement",
              0x2202: "\\partial",
              0x2203: "\\exists",
              0x2204: "\\nexists",
              0x2205: "\\varnothing",
              0x2206: "\\triangle",
              0x2207: "\\nabla",
              0x2208: "\\in",
              0x2209: "\\notin",
              0x220A: "\\in",
              0x220B: "\\ni",
              0x220C: "\\notni",
              0x220D: "\\ni",
              0x220E: "\\blacksquare",
              0x220F: "\\sqcap",
              0x2210: "\\amalg",
              0x2211: "\\sigma",
              0x2212: "-",
              0x2213: "\\mp",
              0x2214: "\\dotplus",
              0x2215: "/",
              0x2216: "\\setminus",
              0x2217: "*",
              0x2218: "\\circ",
              0x2219: "\\bullet",
              0x221A: "\\sqrt",
              0x221B: null,
              0x221C: null,
              0x221D: "\\propto",
              0x221E: "\\infty",
              0x221F: "\\llcorner",
              0x2220: "\\angle",
              0x2221: "\\measuredangle",
              0x2222: "\\sphericalangle",
              0x2223: "\\divides",
              0x2224: "\\notdivides",
              0x2225: "\\parallel",
              0x2226: "\\nparallel",
              0x2227: "\\wedge",
              0x2228: "\\vee",
              0x2229: "\\cap",
              0x222A: "\\cup",
              0x222B: "\\int",
              0x222C: "\\iint",
              0x222D: "\\iiint",
              0x222E: "\\oint",
              0x222F: "\\oiint",
              0x2230: "\\oiiint",
              0x2231: null,
              0x2232: null,
              0x2233: null,
              0x2234: "\\therefore",
              0x2235: "\\because",
              0x2236: "\\colon",
              0x2237: null,
              0x2238: null,
              0x2239: null,
              0x223A: null,
              0x223B: null,
              0x223C: "\\sim",
              0x223D: "\\backsim",
              0x223E: null,
              0x223F: null,
              0x2240: "\\wr",
              0x2241: "\\nsim",
              0x2242: "\\eqsim",
              0x2243: "\\simeq",
              0x2244: null,
              0x2245: "\\cong",
              0x2246: null,
              0x2247: "\\ncong",
              0x2248: "\\approx",
              0x2249: null,
              0x224A: "\\approxeq",
              0x224B: null,
              0x224C: null,
              0x224D: "\\asymp",
              0x224E: "\\Bumpeq",
              0x224F: "\\bumpeq",
              0x2250: "\\doteq",
              0x2251: "\\doteqdot",
              0x2252: "\\fallingdotseq",
              0x2253: "\\risingdotseq",
              0x2254: null,
              0x2255: null,
              0x2256: "\\eqcirc",
              0x2257: "\\circeq",
              0x2258: null,
              0x2259: null,
              0x225A: null,
              0x225B: null,
              0x225C: "\\triangleq",
              0x225D: null,
              0x225E: null,
              0x225F: null,
              0x2260: "\\ne",
              0x2261: "\\equiv",
              0x2262: null,
              0x2263: null,
              0x2264: "\\le",
              0x2265: "\\ge",
              0x2266: "\\leqq",
              0x2267: "\\geqq",
              0x2268: "\\lneqq",
              0x2269: "\\gneqq",
              0x226A: "\\ll",
              0x226B: "\\gg",
              0x226C: "\\between",
              0x226D: null,
              0x226E: "\\nless",
              0x226F: "\\ngtr",
              0x2270: "\\nleq",
              0x2271: "\\ngeq",
              0x2272: "\\lessim",
              0x2273: "\\gtrsim",
              0x2274: null,
              0x2275: null,
              0x2276: "\\lessgtr",
              0x2277: "\\gtrless",
              0x2278: null,
              0x2279: null,
              0x227A: "\\prec",
              0x227B: "\\succ",
              0x227C: "\\preccurlyeq",
              0x227D: "\\succcurlyeq",
              0x227E: "\\precsim",
              0x227F: "\\succsim",
              0x2280: "\\nprec",
              0x2281: "\\nsucc",
              0x2282: "\\subset",
              0x2283: "\\supset",
              0x2284: null,
              0x2285: null,
              0x2286: "\\subseteq",
              0x2287: "\\supseteq",
              0x2288: "\\nsubseteq",
              0x2289: "\\nsupseteq",
              0x228A: "\\subsetneq",
              0x228B: "\\supsetneq",
              0x228C: null,
              0x228D: null,
              0x228E: null,
              0x228F: "\\sqsubset",
              0x2290: "\\sqsupset",
              0x2291: null,
              0x2292: null,
              0x2293: "\\sqcap",
              0x2294: "\\sqcup",
              0x2295: "\\oplus",
              0x2296: "\\ominus",
              0x2297: "\\otimes",
              0x2298: "\\oslash",
              0x2299: "\\odot",
              0x229A: "\\circledcirc",
              0x229B: "\\circledast",
              0x229C: null,
              0x229D: "\\circleddash",
              0x229E: "\\boxplus",
              0x229F: "\\boxminus",
              0x22A0: "\\boxtimes",
              0x22A1: "\\boxdot",
              0x22A2: "\\vdash",
              0x22A3: "\\dashv",
              0x22A4: "\\top",
              0x22A5: "\\bot",
              0x22A6: null,
              0x22A7: "\\models",
              0x22A8: "\\vDash",
              0x22A9: "\\Vdash",
              0x22AA: "\\Vvdash",
              0x22AB: "\\VDash*",
              0x22AC: "\\nvdash",
              0x22AD: "\\nvDash",
              0x22AE: "\\nVdash",
              0x22AF: "\\nVDash",
              0x22B0: null,
              0x22B1: null,
              0x22B2: "\\vartriangleleft",
              0x22B3: "\\vartriangleright",
              0x22B4: "\\trianglelefteq",
              0x22B5: "\\trianglerighteq",
              0x22B6: null,
              0x22B7: null,
              0x22B8: "\\multimap",
              0x22B9: null,
              0x22BA: "\\intercal",
              0x22BB: "\\veebar",
              0x22BC: "\\barwedge",
              0x22BD: null,
              0x22BE: null,
              0x22BF: null,
              0x22C0: "\\wedge",
              0x22C1: "\\vee",
              0x22C2: "\\cap",
              0x22C3: "\\cup",
              0x22C4: "\\diamond",
              0x22C5: "\\cdot",
              0x22C6: "\\star",
              0x22C7: null,
              0x22C8: "\\bowtie",
              0x22C9: "\\ltimes",
              0x22CA: "\\rtimes",
              0x22CB: "\\leftthreetimes",
              0x22CC: "\\rightthreetimes",
              0x22CD: "\\backsimeq",
              0x22CE: "\\curlyvee",
              0x22CF: "\\curlywedge",
              0x22D0: "\\Subset",
              0x22D1: "\\Supset",
              0x22D2: "\\Cap",
              0x22D3: "\\Cup",
              0x22D4: "\\pitchfork",
              0x22D5: "\\lessdot",
              0x22D6: "\\gtrdot",
              0x22D7: null,
              0x22D8: "\\lll",
              0x22D9: "\\ggg",
              0x22DA: "\\lesseqgtr",
              0x22DB: "\\gtreqless",
              0x22DC: null,
              0x22DD: null,
              0x22DE: "\\curlyeqprec",
              0x22DF: "\\curlyeqsucc",
              0x22E0: null,
              0x22E1: null,
              0x22E2: null,
              0x22E3: null,
              0x22E4: null,
              0x22E5: null,
              0x22E6: "\\lnsim",
              0x22E7: "\\gnsim",
              0x22E8: "\\precnsim",
              0x22E9: "\\succnsim",
              0x22EA: "\\ntriangleleft",
              0x22EB: "\\ntriangleright",
              0x22EC: "\\ntrianglelefteq",
              0x22ED: "\\ntrianglerighteq",
              0x22EE: "\\vdots",
              0x22EF: "\\cdots",
              0x22F0: null,
              0x22F1: "\\ddots",
              0x22F2: null,
              0x22F3: null,
              0x22F4: null,
              0x22F5: null,
              0x22F6: null,
              0x22F7: null,
              0x22F8: null,
              0x22F9: null,
              0x22FA: null,
              0x22FB: null,
              0x22FC: null,
              0x22FD: null,
              0x22FE: null,
              0x22FF: null
            };
            var identifiers = (0, _backward.keys)(env);
            // Start scanning for one token.
            function start(options) {
              if (!options) {
                options = {};
              }
              var c = void 0;
              _lexeme = "";
              var t;
              while (curIndex < src.length) {
                switch (c = src.charCodeAt(curIndex++)) {
                  case 32: // space
                  case 9: // tab
                  case 10: // new line
                  case 13:
                    // carriage return
                    continue;
                  case 38:
                    // ampersand (new column or entity)
                    if ((0, _backward.indexOf)(src.substring(curIndex), "nbsp;") === 0) {
                      // Skip &nbsp;
                      curIndex += 5;
                      continue;
                    }
                    return TK_NEWCOL;
                  case 92:
                    // backslash
                    _lexeme += String.fromCharCode(c);
                    switch (src.charCodeAt(curIndex)) {
                      case 92:
                        curIndex++;
                        return TK_NEWROW; // double backslash = new row
                      case 123: // left brace
                      case 124: // vertical bar
                      case 125:
                        // right brace
                        // Erase backslash.
                        return src.charCodeAt(curIndex++);
                    }
                    var _tk = latex();
                    if (_tk !== null) {
                      return _tk;
                    }
                    _lexeme = "";
                    continue; // whitespace
                  case 45:
                    // dash
                    if (src.charCodeAt(curIndex) === 62) {
                      curIndex++;
                      return TK_RIGHTARROW;
                    }
                  case 33:
                    // bang, exclamation point
                    if (src.charCodeAt(curIndex) === 61) {
                      // equals
                      curIndex++;
                      return TK_NE;
                    }
                    return c; // char code is the token id
                  case 37: // percent
                  case 40: // left paren
                  case 41: // right paren
                  case 42: // asterisk
                  case 43: // plus
                  case 44: // comma
                  case 47: // slash
                  case 58: // colon
                  case 61: // equal
                  case 63: // question mark
                  case 91: // left bracket
                  case 93: // right bracket
                  case 94: // caret
                  case 95: // underscore
                  case 123: // left brace
                  case 124: // vertical bar
                  case 125:
                    // right brace
                    _lexeme += String.fromCharCode(c);
                    return c; // char code is the token id
                  case 36:
                    // dollar
                    _lexeme += String.fromCharCode(c);
                    return TK_VAR;
                  case 39:
                    // prime (single quote)
                    return prime(c);
                  case 60:
                    // left angle
                    if (src.charCodeAt(curIndex) === 61) {
                      // equals
                      curIndex++;
                      return TK_LE;
                    }
                    return TK_LT;
                  case 62:
                    // right angle
                    if (src.charCodeAt(curIndex) === 61) {
                      // equals
                      curIndex++;
                      return TK_GE;
                    }
                    return TK_GT;
                  default:
                    if (isAlphaCharCode(c) || c === CC_SINGLEQUOTE) {
                      return variable(c);
                    } else if (t = unicodeToLaTeX[c]) {
                      _lexeme = t;
                      var _tk = lexemeToToken[_lexeme];
                      if (_tk === void 0) {
                        _tk = TK_VAR; // e.g. \\theta
                      }
                      return _tk;
                    } else if (matchDecimalSeparator(String.fromCharCode(c)) || isNumberCharCode(c)) {
                      if (options.oneCharToken) {
                        _lexeme += String.fromCharCode(c);
                        return TK_NUM;
                      }
                      return number(c);
                    } else {
                      (0, _assert.assert)(false, message(1004, [String.fromCharCode(c), c]));
                      return 0;
                    }
                }
              }
              return 0;
            }
            // Recognize 1, 1.2, 0.3, .3
            var lastSeparator = void 0;
            function number(c) {
              while (isNumberCharCode(c) || matchDecimalSeparator(String.fromCharCode(c)) || (lastSeparator = matchThousandsSeparator(String.fromCharCode(c), lastSeparator)) && isNumberCharCode(src.charCodeAt(curIndex))) {
                // Make sure the next char is a num.
                _lexeme += String.fromCharCode(c);
                c = src.charCodeAt(curIndex++);
                if (c === 92 && src.charCodeAt(curIndex) === 32) {
                  // Convert '\ ' to ' '.
                  c = 32;
                  curIndex++;
                }
              }
              if (_lexeme === "." && ((0, _backward.indexOf)(src.substring(curIndex), "overline") === 0 || (0, _backward.indexOf)(src.substring(curIndex), "dot") === 0)) {
                // .\overline --> 0.\overline
                // .\dot --> 0.\dot
                _lexeme = "0.";
              }
              curIndex--;
              return TK_NUM;
            }
            // Recognize x, cm, kg.
            function variable(c) {
              // Normal variables are a single character, but we treat units as
              // variables too so we need to scan the whole unit string as a variable
              // name.
              var ch = String.fromCharCode(c);
              _lexeme += ch;
              // All single character names are valid variable lexemes. Now we check
              // for longer matches against unit names. The longest one wins.

              var _loop = function _loop() {
                var ch = String.fromCharCode(c);
                var prefix = _lexeme + ch;
                var match = (0, _backward.some)(identifiers, function (u) {
                  return (0, _backward.indexOf)(u, prefix) === 0;
                });
                if (!match) {
                  return "break";
                }
                _lexeme += ch;
              };

              while (isAlphaCharCode(c = src.charCodeAt(curIndex++))) {
                var _ret = _loop();

                if (_ret === "break") break;
              }
              // Group primes into a single var.
              while (_lexeme.lastIndexOf("'") === _lexeme.length - 1 && c === CC_SINGLEQUOTE) {
                _lexeme += String.fromCharCode(c);
                c = src.charCodeAt(curIndex++);
              }
              curIndex--;
              return TK_VAR;
            }
            // Recognize \frac, \sqrt.
            function latex() {
              var c = void 0;
              c = src.charCodeAt(curIndex++);
              if (c === CC_DOLLAR) {
                // don't include \
                _lexeme = String.fromCharCode(c);
              } else if (c === CC_PERCENT) {
                _lexeme += String.fromCharCode(c);
              } else if ((0, _backward.indexOf)([CC_SPACE, CC_COLON, CC_SEMICOLON, CC_COMMA, CC_BANG], c) >= 0) {
                _lexeme = "\\ ";
              } else {
                while (isAlphaCharCode(c)) {
                  _lexeme += String.fromCharCode(c);
                  c = src.charCodeAt(curIndex++);
                }
                curIndex--;
              }
              var tk = lexemeToToken[_lexeme];
              if (tk === void 0) {
                tk = TK_VAR; // e.g. \\theta
              } else if (tk === TK_OPERATORNAME) {
                c = src.charCodeAt(curIndex++);
                // Skip whitespace before '{'
                while (c && c !== CC_LEFTBRACE) {
                  c = src.charCodeAt(curIndex++);
                }
                _lexeme = "";
                c = src.charCodeAt(curIndex++);
                while (c && c !== CC_RIGHTBRACE) {
                  var ch = String.fromCharCode(c);
                  if (ch === "&" && (0, _backward.indexOf)(src.substring(curIndex), "nbsp;") === 0) {
                    // Skip &nbsp;
                    curIndex += 5;
                  } else if (ch === " " || ch === "\t") {
                    // Skip space and tab
                  } else {
                    _lexeme += ch;
                  }
                  c = src.charCodeAt(curIndex++);
                }
                tk = lexemeToToken["\\" + _lexeme];
                if (tk === void 0) {
                  tk = TK_VAR; // e.g. \\theta
                }
              } else if (tk === TK_TEXT || tk === TK_TYPE) {
                c = src.charCodeAt(curIndex++);
                // Skip whitespace before '{'
                while (c && c !== CC_LEFTBRACE) {
                  c = src.charCodeAt(curIndex++);
                }
                _lexeme = "";
                c = src.charCodeAt(curIndex++);
                while (c && c !== CC_RIGHTBRACE) {
                  var _ch = String.fromCharCode(c);
                  _lexeme += _ch;
                  c = src.charCodeAt(curIndex++);
                }
                if (tk !== TK_TYPE) {
                  // Not a type, so convert to a var.
                  if (!_lexeme || Model.option("ignoreText")) {
                    tk = null; // treat as whitespace
                  } else {
                    tk = TK_VAR; // treat as variable
                  }
                }
              }
              return tk;
            }
            function prime(c) {
              (0, _assert.assert)(c === 39);
              _lexeme = "'";
              while (src.charCodeAt(curIndex) === 39) {
                curIndex++;
                _lexeme += "'";
              }
              return TK_VAR;
            }
            // Return a scanner object.
            return {
              start: start,
              lexeme: function lexeme() {
                if (_lexeme) {
                  return _lexeme;
                }
              },
              pos: function pos() {
                return curIndex;
              }
            };
          }
        };
        return Model;
      }(); /*
            * Copyright 2013 Art Compiler LLC
            *
            * Licensed under the Apache License, Version 2.0 (the "License");
            * you may not use this file except in compliance with the License.
            * You may obtain a copy of the License at
            *
            *     http://www.apache.org/licenses/LICENSE-2.0
            *
            * Unless required by applicable law or agreed to in writing, software
            * distributed under the License is distributed on an "AS IS" BASIS,
            * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
            * See the License for the specific language governing permissions and
            * limitations under the License.
            */

      /*
        This module defines an object model for evaluating and comparing LaTex
        strings. The primary data structure is the Model class. Instances of the
        Model class contain an AST (Ast instance) and zero or more plugins that
        provide functions for evaluating, transforming and comparing models.
      
        Basic Terms
      
        Node - a node is a raw JavaScript object that consists of an 'op' property
        that is a string indicating the node type, an 'args' property that is an array
        that holds the operands of the operation, and any other "attribute" properties
        used by plugins to elaborate the mean meaning of the node.
      
        AST - an AST is an a Node that is an instance of the Ast class. The Ast class
        provides methods for constructing and managing nodes.
      
        Model - a model is a Node that is an instance of the Model class, which
        inherits from the Ast class. The model class adds methods for creating nodes
        from LaTex strings and rendering them to LaTex strings. Model values are
        configured by Model plugins that implement operations for evaluating,
        transforming and comparing nodes.
      
        Overview
      
        Every model object is also a factory for other model objects that share
        the same set of plugins.
      
          Model.fn.isEquivalent; // register plugin function
          let model = new Model;
          let expected = model.create("1 + 2");
          let actual = model.create(response);
          model.isEquivalent(expected, actual);
          expected.isEquivalent(actual);
      
        When all models in a particular JavaScript sandbox (global scope) use the same
        plugins, those plugins can be registered with the Model class as default
        plugins, as follows:
      
      */
    }, { "./assert.js": 1, "./ast.js": 2, "./backward.js": 3 }], 6: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var rules = exports.rules = { "data": {}, "words": { "\\infty": "oo", "\\pi": "pi", "e": "E", "i": "I" }, "types": { "integerPosNeg": ["(\\type{integerPosNeg})", "\\type{integer}", "-\\type{integer}"], "integerExpr": ["\\type{integerPosNeg}", "(\\type{integerExpr})", "\\type{integerExpr}\\times\\type{integerExpr}", "\\type{integerExpr}+\\type{integerExpr}", "\\type{integerExpr}-\\type{integerExpr}", "\\type{integerExpr}^\\type{integerExpr}"], "commonFraction": ["\\frac{\\type{integer}}{2}", "\\frac{\\type{integer}}{3}", "\\frac{\\type{integer}}{4}", "\\frac{\\type{integer}}{5}", "\\frac{\\type{integer}}{6}", "\\frac{\\type{integer}}{7}", "\\frac{\\type{integer}}{8}", "\\frac{\\type{integer}}{9}", "\\frac{\\type{integer}}{10}"], "simpleExpression": ["\\type{commonFraction}", "\\type{number}", "-\\type{number}", "-\\type{variable}", "\\type{variable}", "\\type{variable}\\type{variable}", "\\type{number}\\type{variable}"], "matrix": ["\\begin{bmatrix}?&?&?\\end{bmatrix}"] }, "rules": { "\\mathbb{N}": ["Naturals"], "\\mathbb{Z}": ["Integers"], "\\mathbb{R}": ["Reals"], "\\mathbb{C}": ["Complexes"], "?%": ["(S(1)/100*%1)"], "?!": ["factorial(%1)"], "\\ln{?}": ["ln(%2)"], "\\log{?}": ["log(%2,%1)"], "\\log_?{?}": ["log(%2,%1)"], "\\type{matrix}": [{ "Matrix([%1])": { "\\type{row}": "[%*],", "\\type{column}": "%*," } }], "?'?": [{ "Derivative(%1,(%2,1))": { "?' ": "%1" } }], "?''?": [{ "Derivative(%1,(%2,2))": { "?'' ": "%1" } }], "?'''?": [{ "Derivative(%1,(%2,3))": { "?''' ": "%1" } }], "?' ": ["%1_prime"], "?'' ": ["%1_doubleprime"], "?''' ": ["%1_tripleprime"], "\\frac{d^?}{d?^?}?": ["diff(%1, (%2,%3))"], "\\int \\int ? d? d?": ["integrate %1 %2 %3"], "\\int_?^? ? d?": ["integrate(%3,(%4,%1,%2))"], "\\int ? d?": ["integrate(%1,%2)"], "\\lim_? ?": [{ "limit(%2, %1, '+-')": { "? \\rightarrow ?": "%1, %2", "? \\to ?": "%1, %2", "(?,?)": "(%1, %2)" } }], "\\sum_?^? ?": [{ "summation(%3,(%1,%2))": { "? = ?": "%1,%2" } }], "\\sin{?}": ["sin(%1)"], "\\cos{?}": ["cos(%1)"], "\\tan{?}": ["tan(%1)"], "\\cot{?}": ["cot(%1)"], "\\sec{?}": ["sec(%1)"], "\\csc{?}": ["csc(%1)"], "\\sin^{-1}{?}": ["asin(%1)"], "\\cos^{-1}{?}": ["acos(%1)"], "\\tan^{-1}{?}": ["atan(%1)"], "\\cot^{-1}{?}": ["acot(%1)"], "\\sec^{-1}{?}": ["asec(%1)"], "\\csc^{-1}{?}": ["acsc(%1)"], "\\sinh{?}": ["sinh(%1)"], "\\cosh{?}": ["cosh(%1)"], "\\tanh{?}": ["tanh(%1)"], "\\coth{?}": ["coth(%1)"], "\\sech{?}": ["sech(%1)"], "\\csch{?}": ["csch(%1)"], "\\sinh^{-1}{?}": ["asinh(%1)"], "\\cosh^{-1}{?}": ["acosh(%1)"], "\\tanh^{-1}{?}": ["atanh(%1)"], "\\coth^{-1}{?}": ["acoth(%1)"], "\\sech^{-1}{?}": ["asech(%1)"], "\\csch^{-1}{?}": ["acsch(%1)"], "\\frac{\\type{integerExpr}}{\\type{integerExpr}}": ["(S(%1)/%2)"], "\\frac{?}{?}": ["(%1/%2)"], "|?|": ["Abs(%1)"], "\\abs{?}": ["Abs(%1)"], "\\angle ?": ["angle_%2%3%4"], "?\\degree": ["rad(%1)"], "\\type{integerExpr}^\\type{integerExpr}": ["S(%1)**%2"], "?^?": ["(%1)**%2"], "\\sqrt{?}": ["sqrt(%1)"], "\\sqrt[?]{?}": ["root(%1,%2)"], "-?": ["-%1"], "?+?": ["(%1+%2)"], "?-?": ["(%1-%2)"], "?*?": ["(%1*%2)"], "?\\cdot?": ["(%1*%2)"], "\\type{integerExpr}\\div\\type{integerExpr}": ["(S(%1)/%2)"], "?\\div?": ["(%1/%2)"], "\\type{integerExpr}:\\type{integerExpr}": ["(S(%1)/%2)"], "?:?": ["(%1/%2)"], "?<?": ["Lt(%1-%2,0)"], "?\\nless?": ["Ge(%1-%2,0)"], "?\\le?": ["Le(%1-%2,0)"], "?>?": ["Gt(%1-%2,0)"], "?\\ge?": ["Ge(%1-%2,0)"], "?\\ngtr?": ["Le(%1-%2,0)"], "?=?": [{ "Eq(%1-%2,0)": { "\\frac{d^?}{d?^?}?": "Derivative(%1,(%2,%3))" } }], "?\\ne?": ["Ne(%1-%2,0)"], "?\\approx?": [{ "Eq(%1-%2,0)": { "\\frac{d^?}{d?^?}?": "Derivative(%1,(%2,%3))" } }], "?_?": ["%1_%2"], "(\\type{simpleExpression})": ["%1"], "(?)": ["(%1)"], "? ?": ["(%1*%2)"], "?,?": ["%1,%2"], "?": ["%1"] } };
    }, {}], 7: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var version = exports.version = "v0.2.0";
    }, {}] }, {}, [4])(4);
});