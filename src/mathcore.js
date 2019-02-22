/*
 * Mathcore unversioned - ca21b69
 * Copyright 2014 Learnosity Ltd. All Rights Reserved.
 *
 */

"use strict";
var name = '';
var MathCore = (function () {
/*
 Copyright (c) 2012 Daniel Trebbien and other contributors
Portions Copyright (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany
Portions Copyright (c) 1995-2001 International Business Machines Corporation and others

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, provided that the above copyright notice(s) and this permission notice appear in all copies of the Software and that both the above copyright notice(s) and this permission notice appear in supporting documentation.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization of the copyright holder.
*/
'use strict';var boxedString = Object("a"), splitString = boxedString[0] != "a" || !(0 in boxedString);
var forEach = function forEach(array, fun) {
  var thisp = arguments[2];
  if(Array.prototype.indexOf) {
    return array.forEach(fun)
  }
  var object = toObject(array), self = splitString && _toString(object) == "[object String]" ? object.split("") : object, i = -1, length = self.length >>> 0;
  if(_toString(fun) != "[object Function]") {
    throw new TypeError;
  }
  while(++i < length) {
    if(i in self) {
      fun.call(thisp, self[i], i, object)
    }
  }
};
var filter = function filter(array, fun) {
  var thisp = arguments[2];
  if(Array.prototype.filter) {
    return array.filter(fun)
  }
  var object = toObject(array), self = splitString && _toString(array) == "[object String]" ? array.split("") : object, length = self.length >>> 0, result = [], value;
  if(_toString(fun) != "[object Function]") {
    throw new TypeError(fun + " is not a function");
  }
  for(var i = 0;i < length;i++) {
    if(i in self) {
      value = self[i];
      if(fun.call(thisp, value, i, object)) {
        result.push(value)
      }
    }
  }
  return result
};
var every = function every(array, fun) {
  var thisp = arguments[2];
  if(Array.prototype.every) {
    return array.every(fun, thisp)
  }
  var object = toObject(array), self = splitString && _toString(array) == "[object String]" ? array.split("") : object, length = self.length >>> 0;
  if(_toString(fun) != "[object Function]") {
    throw new TypeError(fun + " is not a function");
  }
  for(var i = 0;i < length;i++) {
    if(i in self && !fun.call(thisp, self[i], i, object)) {
      return false
    }
  }
  return true
};
var some = function some(array, fun) {
  var thisp = arguments[2];
  if(Array.prototype.some) {
    return array.some(fun, thisp)
  }
  var object = toObject(array), self = splitString && _toString(array) == "[object String]" ? array.split("") : object, length = self.length >>> 0;
  if(_toString(fun) != "[object Function]") {
    throw new TypeError(fun + " is not a function");
  }
  for(var i = 0;i < length;i++) {
    if(i in self && fun.call(thisp, self[i], i, object)) {
      return true
    }
  }
  return false
};
var indexOf = function indexOf(array, sought) {
  var fromIndex = arguments[2];
  if(Array.prototype.indexOf || typeof array === "string") {
    return array.indexOf(sought, fromIndex)
  }
  var self = splitString && _toString(array) == "[object String]" ? array.split("") : toObject(array), length = self.length >>> 0;
  if(!length) {
    return-1
  }
  var i = 0;
  if(arguments.length > 2) {
    i = toInteger(fromIndex)
  }
  i = i >= 0 ? i : Math.max(0, length + i);
  for(;i < length;i++) {
    if(i in self && self[i] === sought) {
      return i
    }
  }
  return-1
};
var keys = function keys(object) {
  if(Object.keys) {
    return Object.keys(object)
  }
  var hasDontEnumBug = true, dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], dontEnumsLength = dontEnums.length;
  for(var key in{"toString":null}) {
    hasDontEnumBug = false
  }
  if(typeof object != "object" && typeof object != "function" || object === null) {
    throw new TypeError("Object.keys called on a non-object");
  }
  var keys = [];
  for(var name in object) {
    if(owns(object, name)) {
      keys.push(name)
    }
  }
  if(hasDontEnumBug) {
    for(var i = 0, ii = dontEnumsLength;i < ii;i++) {
      var dontEnum = dontEnums[i];
      if(owns(object, dontEnum)) {
        keys.push(dontEnum)
      }
    }
  }
  return keys
};
var toObject = function(o) {
  if(o == null) {
    throw new TypeError("can't convert " + o + " to object");
  }
  return Object(o)
};
var prototypeOfObject = Object.prototype;
var _toString = function(val) {
  return prototypeOfObject.toString.apply(val)
};
var owns = function(object, name) {
  return prototypeOfObject.hasOwnProperty.call(object, name)
};
var create = function create(o) {
  if(Object.create) {
    return Object.create(o)
  }
  var F = function() {
  };
  if(arguments.length != 1) {
    throw new Error("Object.create implementation only accepts one parameter.");
  }
  F.prototype = o;
  return new F
};
if(typeof window !== "undefined" && !window.JSON) {
  window.JSON = {parse:function(sJSON) {
    return eval("(" + sJSON + ")")
  }, stringify:function() {
    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function(a) {
      return toString.call(a) === "[object Array]"
    };
    var escMap = {'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
    var escFunc = function(m) {
      return escMap[m] || "\\u" + (m.charCodeAt(0) + 65536).toString(16).substr(1)
    };
    var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
    return function stringify(value) {
      if(value == null) {
        return"null"
      }else {
        if(typeof value === "number") {
          return isFinite(value) ? value.toString() : "null"
        }else {
          if(typeof value === "boolean") {
            return value.toString()
          }else {
            if(typeof value === "object") {
              if(typeof value.toJSON === "function") {
                return stringify(value.toJSON())
              }else {
                if(isArray(value)) {
                  var res = "[";
                  for(var i = 0;i < value.length;i++) {
                    res += (i ? ", " : "") + stringify(value[i])
                  }
                  return res + "]"
                }else {
                  if(toString.call(value) === "[object Object]") {
                    var tmp = [];
                    for(var k in value) {
                      if(value.hasOwnProperty(k)) {
                        tmp.push(stringify(k) + ": " + stringify(value[k]))
                      }
                    }
                    return"{" + tmp.join(", ") + "}"
                  }
                }
              }
            }
          }
        }
      }
      return'"' + value.toString().replace(escRE, escFunc) + '"'
    }
  }()}
}
Math.sinh = Math.sinh || function(x) {
  return(Math.exp(x) - Math.exp(-x)) / 2
};
Math.cosh = Math.cosh || function(x) {
  return(Math.exp(x) + Math.exp(-x)) / 2
};
Math.tanh = Math.tanh || function(x) {
  if(x === Infinity) {
    return 1
  }else {
    if(x === -Infinity) {
      return-1
    }else {
      return(Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))
    }
  }
};
Math.asinh = Math.asinh || function(x) {
  if(x === -Infinity) {
    return x
  }else {
    return Math.log(x + Math.sqrt(x * x + 1))
  }
};
Math.acosh = Math.acosh || function(x) {
  return Math.log(x + Math.sqrt(x * x - 1))
};
Math.atanh = Math.atanh || function(x) {
  return Math.log((1 + x) / (1 - x)) / 2
};
var ASSERT = true;
var assert = function() {
  return!ASSERT ? function() {
  } : function(val, str, location) {
    if(str === void 0) {
      str = "failed!"
    }
    if(!val) {
      var err = new Error(str);
      err.location = location ? location : Assert.location;
      throw err;
    }
  }
}();
var message = function(errorCode, args) {
  var str = Assert.messages[errorCode];
  var location = Assert.location;
  if(args) {
    forEach(args, function(arg, i) {
      str = str.replace("%" + (i + 1), arg)
    })
  }
  return errorCode + ": " + str
};
var reserveCodeRange = function(first, last, moduleName) {
  assert(first <= last, "Invalid code range");
  var noConflict = every(Assert.reservedCodes, function(range) {
    return last < range.first || first > range.last
  });
  assert(noConflict, "Conflicting request for error code range");
  Assert.reservedCodes.push({first:first, last:last, name:moduleName})
};
var setLocation = function(location) {
  Assert.location = location
};
var clearLocation = function() {
  Assert.location = null
};
var setTimeout_ = function(timeout, message) {
  if(timeout === undefined) {
    return undefined
  }
  Assert.timeout = timeout ? Date.now() + timeout : 0;
  Assert.timeoutMessage = message ? message : "ERROR timeout exceeded"
};
var checkTimeout = function() {
  assert(!Assert.timeout || Assert.timeout > Date.now(), Assert.timeoutMessage)
};
var Assert = {assert:assert, message:message, messages:{}, reserveCodeRange:reserveCodeRange, reservedCodes:[], setLocation:setLocation, clearLocation:clearLocation, checkTimeout:checkTimeout, setTimeout:setTimeout_};
var TRACE = false;
var global = this;
var trace = function() {
  return!TRACE ? function() {
  } : function trace(str) {
    if(global.console && global.console.log) {
      console.log(str)
    }else {
      if(global.print) {
        print(str)
      }else {
        throw"No trace function defined!";
      }
    }
  }
}();
var Ast = function() {
  function Ast() {
    this.nodePool = ["unused"];
    this.nodeMap = {}
  }
  Ast.prototype.create = function create(op, args) {
    var node = create(this);
    if(typeof op === "string") {
      node.op = op;
      if(args instanceof Array) {
        node.args = args
      }else {
        node.args = []
      }
    }else {
      if(op !== null && typeof op === "object") {
        var obj = op;
        forEach(keys(obj), function(v, i) {
          node[v] = obj[v]
        })
      }
    }
    return node
  };
  Ast.prototype.arg = function arg(node) {
    if(!isNode(this)) {
      throw"Malformed node";
    }
    this.args.push(node);
    return this
  };
  Ast.prototype.argN = function argN(i, node) {
    if(!isNode(this)) {
      throw"Malformed node";
    }
    if(node === undefined) {
      return this.args[i]
    }
    this.args[i] = node;
    return this
  };
  Ast.prototype.args = function args(a) {
    if(!isNode(this)) {
      throw"Malformed node";
    }
    if(a === undefined) {
      return this.args
    }
    this.args = a;
    return this
  };
  Ast.prototype.isNode = isNode;
  function isNode(obj) {
    if(obj === undefined) {
      obj = this
    }
    return obj.op && obj.args
  }
  Ast.prototype.intern = function intern(node) {
    if(this instanceof Ast && (node === undefined && isNode(this))) {
      node = this
    }
    assert(typeof node === "object", "node not an object");
    var op = node.op;
    var count = node.args.length;
    var args = "";
    var args_nids = [];
    for(var i = 0;i < count;i++) {
      args += " ";
      if(typeof node.args[i] === "string") {
        args += args_nids[i] = node.args[i]
      }else {
        args += args_nids[i] = this.intern(node.args[i])
      }
    }
    var key = op + count + args;
    var nid = this.nodeMap[key];
    if(nid === void 0) {
      this.nodePool.push({op:op, args:args_nids});
      nid = this.nodePool.length - 1;
      this.nodeMap[key] = nid
    }
    return nid
  };
  Ast.prototype.node = function node(nid) {
    var n = JSON.parse(JSON.stringify(this.nodePool[nid]));
    for(var i = 0;i < n.args.length;i++) {
      if(typeof n.args[i] !== "string") {
        n.args[i] = this.node(n.args[i])
      }
    }
    return n
  };
  Ast.prototype.dumpAll = function dumpAll() {
    var s = "";
    var ast = this;
    forEach(this.nodePool, function(n, i) {
      s += "\n" + i + ": " + Ast.dump(n)
    });
    return s
  };
  Ast.dump = Ast.prototype.dump = function dump(n) {
    if(typeof n === "string") {
      var s = '"' + n + '"'
    }else {
      if(typeof n === "number") {
        var s = n
      }else {
        var s = '{ op: "' + n.op + '", args: [ ';
        for(var i = 0;i < n.args.length;i++) {
          if(i > 0) {
            s += " , "
          }
          s += dump(n.args[i])
        }
        s += " ] }"
      }
    }
    return s
  };
  var RUN_SELF_TESTS = false;
  function test() {
    (function() {
      trace("Ast self testing");
      var ast = new Ast;
      var node1 = {op:"+", args:[10, 20]};
      var node2 = {op:"+", args:[10, 30]};
      var node3 = {op:"num", args:[10]};
      var node4 = ast.create("+").arg(10).arg(30);
      var node5 = ast.create("+", [10, 20]);
      var node6 = ast.create({op:"+", args:[10, 20]});
      var nid1 = ast.intern(node1);
      var nid2 = ast.intern(node2);
      var nid3 = ast.intern(node3);
      var nid4 = node4.intern();
      var nid5 = node5.intern();
      var nid6 = node6.intern();
      var result = nid2 === nid4 ? "PASS" : "FAIL";
      trace(result + ": " + "nid2 === nid4");
      var result = nid1 === nid5 ? "PASS" : "FAIL";
      trace(result + ": " + "nid1 === nid5");
      var result = nid5 === nid6 ? "PASS" : "FAIL";
      trace(result + ": " + "nid5 === nid6")
    })()
  }
  if(RUN_SELF_TESTS) {
    test()
  }
  return Ast
}();
var MathContext = function() {
  MathContext.prototype.getDigits = getDigits;
  MathContext.prototype.getForm = getForm;
  MathContext.prototype.getLostDigits = getLostDigits;
  MathContext.prototype.getRoundingMode = getRoundingMode;
  MathContext.prototype.toString = toString;
  MathContext.prototype.isValidRound = isValidRound;
  MathContext.PLAIN = MathContext.prototype.PLAIN = 0;
  MathContext.SCIENTIFIC = MathContext.prototype.SCIENTIFIC = 1;
  MathContext.ENGINEERING = MathContext.prototype.ENGINEERING = 2;
  MathContext.ROUND_CEILING = MathContext.prototype.ROUND_CEILING = 2;
  MathContext.ROUND_DOWN = MathContext.prototype.ROUND_DOWN = 1;
  MathContext.ROUND_FLOOR = MathContext.prototype.ROUND_FLOOR = 3;
  MathContext.ROUND_HALF_DOWN = MathContext.prototype.ROUND_HALF_DOWN = 5;
  MathContext.ROUND_HALF_EVEN = MathContext.prototype.ROUND_HALF_EVEN = 6;
  MathContext.ROUND_HALF_UP = MathContext.prototype.ROUND_HALF_UP = 4;
  MathContext.ROUND_UNNECESSARY = MathContext.prototype.ROUND_UNNECESSARY = 7;
  MathContext.ROUND_UP = MathContext.prototype.ROUND_UP = 0;
  MathContext.prototype.DEFAULT_FORM = MathContext.prototype.SCIENTIFIC;
  MathContext.prototype.DEFAULT_DIGITS = 9;
  MathContext.prototype.DEFAULT_LOSTDIGITS = false;
  MathContext.prototype.DEFAULT_ROUNDINGMODE = MathContext.prototype.ROUND_HALF_UP;
  MathContext.prototype.MIN_DIGITS = 0;
  MathContext.prototype.MAX_DIGITS = 999999999;
  MathContext.prototype.ROUNDS = new Array(MathContext.prototype.ROUND_HALF_UP, MathContext.prototype.ROUND_UNNECESSARY, MathContext.prototype.ROUND_CEILING, MathContext.prototype.ROUND_DOWN, MathContext.prototype.ROUND_FLOOR, MathContext.prototype.ROUND_HALF_DOWN, MathContext.prototype.ROUND_HALF_EVEN, MathContext.prototype.ROUND_UP);
  MathContext.prototype.ROUNDWORDS = new Array("ROUND_HALF_UP", "ROUND_UNNECESSARY", "ROUND_CEILING", "ROUND_DOWN", "ROUND_FLOOR", "ROUND_HALF_DOWN", "ROUND_HALF_EVEN", "ROUND_UP");
  MathContext.prototype.DEFAULT = new MathContext(MathContext.prototype.DEFAULT_DIGITS, MathContext.prototype.DEFAULT_FORM, MathContext.prototype.DEFAULT_LOSTDIGITS, MathContext.prototype.DEFAULT_ROUNDINGMODE);
  function MathContext() {
    this.digits = 0;
    this.form = 0;
    this.lostDigits = false;
    this.roundingMode = 0;
    var setform = this.DEFAULT_FORM;
    var setlostdigits = this.DEFAULT_LOSTDIGITS;
    var setroundingmode = this.DEFAULT_ROUNDINGMODE;
    if(arguments.length == 4) {
      setform = arguments[1];
      setlostdigits = arguments[2];
      setroundingmode = arguments[3]
    }else {
      if(arguments.length == 3) {
        setform = arguments[1];
        setlostdigits = arguments[2]
      }else {
        if(arguments.length == 2) {
          setform = arguments[1]
        }else {
          if(arguments.length != 1) {
            throw"MathContext(): " + arguments.length + " arguments given; expected 1 to 4";
          }
        }
      }
    }
    var setdigits = arguments[0];
    if(setdigits != this.DEFAULT_DIGITS) {
      if(setdigits < this.MIN_DIGITS) {
        throw"MathContext(): Digits too small: " + setdigits;
      }
      if(setdigits > this.MAX_DIGITS) {
        throw"MathContext(): Digits too large: " + setdigits;
      }
    }
    if(setform == this.SCIENTIFIC) {
    }else {
      if(setform == this.ENGINEERING) {
      }else {
        if(setform == this.PLAIN) {
        }else {
          throw"MathContext() Bad form value: " + setform;
        }
      }
    }
    if(!this.isValidRound(setroundingmode)) {
      throw"MathContext(): Bad roundingMode value: " + setroundingmode;
    }
    this.digits = setdigits;
    this.form = setform;
    this.lostDigits = setlostdigits;
    this.roundingMode = setroundingmode;
    return
  }
  function getDigits() {
    return this.digits
  }
  function getForm() {
    return this.form
  }
  function getLostDigits() {
    return this.lostDigits
  }
  function getRoundingMode() {
    return this.roundingMode
  }
  function toString() {
    var formstr = null;
    var r = 0;
    var roundword = null;
    if(this.form == this.SCIENTIFIC) {
      formstr = "SCIENTIFIC"
    }else {
      if(this.form == this.ENGINEERING) {
        formstr = "ENGINEERING"
      }else {
        formstr = "PLAIN"
      }
    }
    var $1 = this.ROUNDS.length;
    r = 0;
    r:for(;$1 > 0;$1--, r++) {
      if(this.roundingMode == this.ROUNDS[r]) {
        roundword = this.ROUNDWORDS[r];
        break r
      }
    }
    return"digits=" + this.digits + " " + "form=" + formstr + " " + "lostDigits=" + (this.lostDigits ? "1" : "0") + " " + "roundingMode=" + roundword
  }
  function isValidRound(testround) {
    var r = 0;
    var $2 = this.ROUNDS.length;
    r = 0;
    r:for(;$2 > 0;$2--, r++) {
      if(testround == this.ROUNDS[r]) {
        return true
      }
    }
    return false
  }
  return MathContext
}();
var BigDecimal = function(MathContext) {
  function div(a, b) {
    return(a - a % b) / b
  }
  BigDecimal.prototype.div = div;
  function arraycopy(src, srcindex, dest, destindex, length) {
    var i;
    if(destindex > srcindex) {
      for(i = length - 1;i >= 0;--i) {
        dest[i + destindex] = src[i + srcindex]
      }
    }else {
      for(i = 0;i < length;++i) {
        dest[i + destindex] = src[i + srcindex]
      }
    }
  }
  BigDecimal.prototype.arraycopy = arraycopy;
  function createArrayWithZeros(length) {
    var retVal = new Array(length);
    var i;
    for(i = 0;i < length;++i) {
      retVal[i] = 0
    }
    return retVal
  }
  BigDecimal.prototype.createArrayWithZeros = createArrayWithZeros;
  BigDecimal.prototype.abs = abs;
  BigDecimal.prototype.add = add;
  BigDecimal.prototype.compareTo = compareTo;
  BigDecimal.prototype.divide = divide;
  BigDecimal.prototype.divideInteger = divideInteger;
  BigDecimal.prototype.max = max;
  BigDecimal.prototype.min = min;
  BigDecimal.prototype.multiply = multiply;
  BigDecimal.prototype.negate = negate;
  BigDecimal.prototype.plus = plus;
  BigDecimal.prototype.pow = pow;
  BigDecimal.prototype.remainder = remainder;
  BigDecimal.prototype.subtract = subtract;
  BigDecimal.prototype.equals = equals;
  BigDecimal.prototype.format = format;
  BigDecimal.prototype.intValueExact = intValueExact;
  BigDecimal.prototype.movePointLeft = movePointLeft;
  BigDecimal.prototype.movePointRight = movePointRight;
  BigDecimal.prototype.scale = scale;
  BigDecimal.prototype.setScale = setScale;
  BigDecimal.prototype.signum = signum;
  BigDecimal.prototype.toString = toString;
  BigDecimal.prototype.layout = layout;
  BigDecimal.prototype.intcheck = intcheck;
  BigDecimal.prototype.dodivide = dodivide;
  BigDecimal.prototype.bad = bad;
  BigDecimal.prototype.badarg = badarg;
  BigDecimal.prototype.extend = extend;
  BigDecimal.prototype.byteaddsub = byteaddsub;
  BigDecimal.prototype.diginit = diginit;
  BigDecimal.prototype.clone = clone;
  BigDecimal.prototype.checkdigits = checkdigits;
  BigDecimal.prototype.round = round;
  BigDecimal.prototype.allzero = allzero;
  BigDecimal.prototype.finish = finish;
  BigDecimal.prototype.isGreaterThan = isGreaterThan;
  BigDecimal.prototype.isLessThan = isLessThan;
  BigDecimal.prototype.isGreaterThanOrEqualTo = isGreaterThanOrEqualTo;
  BigDecimal.prototype.isLessThanOrEqualTo = isLessThanOrEqualTo;
  BigDecimal.prototype.isPositive = isPositive;
  BigDecimal.prototype.isNegative = isNegative;
  BigDecimal.prototype.isZero = isZero;
  BigDecimal.ROUND_CEILING = BigDecimal.prototype.ROUND_CEILING = MathContext.prototype.ROUND_CEILING;
  BigDecimal.ROUND_DOWN = BigDecimal.prototype.ROUND_DOWN = MathContext.prototype.ROUND_DOWN;
  BigDecimal.ROUND_FLOOR = BigDecimal.prototype.ROUND_FLOOR = MathContext.prototype.ROUND_FLOOR;
  BigDecimal.ROUND_HALF_DOWN = BigDecimal.prototype.ROUND_HALF_DOWN = MathContext.prototype.ROUND_HALF_DOWN;
  BigDecimal.ROUND_HALF_EVEN = BigDecimal.prototype.ROUND_HALF_EVEN = MathContext.prototype.ROUND_HALF_EVEN;
  BigDecimal.ROUND_HALF_UP = BigDecimal.prototype.ROUND_HALF_UP = MathContext.prototype.ROUND_HALF_UP;
  BigDecimal.ROUND_UNNECESSARY = BigDecimal.prototype.ROUND_UNNECESSARY = MathContext.prototype.ROUND_UNNECESSARY;
  BigDecimal.ROUND_UP = BigDecimal.prototype.ROUND_UP = MathContext.prototype.ROUND_UP;
  BigDecimal.prototype.ispos = 1;
  BigDecimal.prototype.iszero = 0;
  BigDecimal.prototype.isneg = -1;
  BigDecimal.prototype.MinExp = -999999999;
  BigDecimal.prototype.MaxExp = 999999999;
  BigDecimal.prototype.MinArg = -999999999;
  BigDecimal.prototype.MaxArg = 999999999;
  BigDecimal.prototype.plainMC = new MathContext(0, MathContext.prototype.PLAIN);
  BigDecimal.prototype.bytecar = new Array(90 + 99 + 1);
  BigDecimal.prototype.bytedig = diginit();
  BigDecimal.ZERO = BigDecimal.prototype.ZERO = new BigDecimal("0");
  BigDecimal.ONE = BigDecimal.prototype.ONE = new BigDecimal("1");
  BigDecimal.TEN = BigDecimal.prototype.TEN = new BigDecimal("10");
  function BigDecimal() {
    this.ind = 0;
    this.form = MathContext.prototype.PLAIN;
    this.mant = null;
    this.exp = 0;
    if(arguments.length == 0) {
      return
    }
    var inchars;
    var offset;
    var length;
    if(arguments.length == 1) {
      inchars = arguments[0];
      offset = 0;
      length = inchars.length
    }else {
      inchars = arguments[0];
      offset = arguments[1];
      length = arguments[2]
    }
    if(typeof inchars == "string") {
      inchars = inchars.split("")
    }
    var exotic;
    var hadexp;
    var d;
    var dotoff;
    var last;
    var i = 0;
    var si = 0;
    var eneg = false;
    var k = 0;
    var elen = 0;
    var j = 0;
    var sj = 0;
    var dvalue = 0;
    var mag = 0;
    if(length <= 0) {
      this.bad("BigDecimal(): ", inchars)
    }
    this.ind = this.ispos;
    if(inchars[0] == "-") {
      length--;
      if(length == 0) {
        this.bad("BigDecimal(): ", inchars)
      }
      this.ind = this.isneg;
      offset++
    }else {
      if(inchars[0] == "+") {
        length--;
        if(length == 0) {
          this.bad("BigDecimal(): ", inchars)
        }
        offset++
      }
    }
    exotic = false;
    hadexp = false;
    d = 0;
    dotoff = -1;
    last = -1;
    var $1 = length;
    i = offset;
    i:for(;$1 > 0;$1--, i++) {
      si = inchars[i];
      if(si >= "0") {
        if(si <= "9") {
          last = i;
          d++;
          continue i
        }
      }
      if(si == ".") {
        if(dotoff >= 0) {
          this.bad("BigDecimal(): ", inchars)
        }
        dotoff = i - offset;
        continue i
      }
      if(si != "e") {
        if(si != "E") {
          if(si < "0" || si > "9") {
            this.bad("BigDecimal(): ", inchars)
          }
          exotic = true;
          last = i;
          d++;
          continue i
        }
      }
      if(i - offset > length - 2) {
        this.bad("BigDecimal(): ", inchars)
      }
      eneg = false;
      if(inchars[i + 1] == "-") {
        eneg = true;
        k = i + 2
      }else {
        if(inchars[i + 1] == "+") {
          k = i + 2
        }else {
          k = i + 1
        }
      }
      elen = length - (k - offset);
      if(elen == 0 || elen > 9) {
        this.bad("BigDecimal(): ", inchars)
      }
      var $2 = elen;
      j = k;
      j:for(;$2 > 0;$2--, j++) {
        sj = inchars[j];
        if(sj < "0") {
          this.bad("BigDecimal(): ", inchars)
        }
        if(sj > "9") {
          this.bad("BigDecimal(): ", inchars)
        }else {
          dvalue = sj - "0"
        }
        this.exp = this.exp * 10 + dvalue
      }
      if(eneg) {
        this.exp = -this.exp
      }
      hadexp = true;
      break i
    }
    if(d == 0) {
      this.bad("BigDecimal(): ", inchars)
    }
    if(dotoff >= 0) {
      this.exp = this.exp + dotoff - d
    }
    var $3 = last - 1;
    i = offset;
    i:for(;i <= $3;i++) {
      si = inchars[i];
      if(si == "0") {
        offset++;
        dotoff--;
        d--
      }else {
        if(si == ".") {
          offset++;
          dotoff--
        }else {
          if(si <= "9") {
            break i
          }else {
            break i
          }
        }
      }
    }
    this.mant = new Array(d);
    j = offset;
    if(exotic) {
      exotica:do {
        var $4 = d;
        i = 0;
        i:for(;$4 > 0;$4--, i++) {
          if(i == dotoff) {
            j++
          }
          sj = inchars[j];
          if(sj <= "9") {
            this.mant[i] = sj - "0"
          }else {
            this.bad("BigDecimal(): ", inchars)
          }
          j++
        }
      }while(false)
    }else {
      simple:do {
        var $5 = d;
        i = 0;
        i:for(;$5 > 0;$5--, i++) {
          if(i == dotoff) {
            j++
          }
          this.mant[i] = inchars[j] - "0";
          j++
        }
      }while(false)
    }
    if(this.mant[0] == 0) {
      this.ind = this.iszero;
      if(this.exp > 0) {
        this.exp = 0
      }
      if(hadexp) {
        this.mant = this.ZERO.mant;
        this.exp = 0
      }
    }else {
      if(hadexp) {
        this.form = MathContext.prototype.SCIENTIFIC;
        mag = this.exp + this.mant.length - 1;
        if(mag < this.MinExp || mag > this.MaxExp) {
          this.bad("BigDecimal(): ", inchars)
        }
      }
    }
    return
  }
  function abs() {
    var set;
    if(arguments.length == 1) {
      set = arguments[0]
    }else {
      if(arguments.length == 0) {
        set = this.plainMC
      }else {
        throw"abs(): " + arguments.length + " arguments given; expected 0 or 1";
      }
    }
    if(this.ind == this.isneg) {
      return this.negate(set)
    }
    return this.plus(set)
  }
  function add() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"add(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    var lhs;
    var reqdig;
    var res;
    var usel;
    var usellen;
    var user;
    var userlen;
    var newlen = 0;
    var tlen = 0;
    var mult = 0;
    var t = null;
    var ia = 0;
    var ib = 0;
    var ea = 0;
    var eb = 0;
    var ca = 0;
    var cb = 0;
    if(set.lostDigits) {
      this.checkdigits(rhs, set.digits)
    }
    lhs = this;
    if(lhs.ind == 0) {
      if(set.form != MathContext.prototype.PLAIN) {
        return rhs.plus(set)
      }
    }
    if(rhs.ind == 0) {
      if(set.form != MathContext.prototype.PLAIN) {
        return lhs.plus(set)
      }
    }
    reqdig = set.digits;
    if(reqdig > 0) {
      if(lhs.mant.length > reqdig) {
        lhs = this.clone(lhs).round(set)
      }
      if(rhs.mant.length > reqdig) {
        rhs = this.clone(rhs).round(set)
      }
    }
    res = new BigDecimal;
    usel = lhs.mant;
    usellen = lhs.mant.length;
    user = rhs.mant;
    userlen = rhs.mant.length;
    padder:do {
      if(lhs.exp == rhs.exp) {
        res.exp = lhs.exp
      }else {
        if(lhs.exp > rhs.exp) {
          newlen = usellen + lhs.exp - rhs.exp;
          if(newlen >= userlen + reqdig + 1) {
            if(reqdig > 0) {
              res.mant = usel;
              res.exp = lhs.exp;
              res.ind = lhs.ind;
              if(usellen < reqdig) {
                res.mant = this.extend(lhs.mant, reqdig);
                res.exp = res.exp - (reqdig - usellen)
              }
              return res.finish(set, false)
            }
          }
          res.exp = rhs.exp;
          if(newlen > reqdig + 1) {
            if(reqdig > 0) {
              tlen = newlen - reqdig - 1;
              userlen = userlen - tlen;
              res.exp = res.exp + tlen;
              newlen = reqdig + 1
            }
          }
          if(newlen > usellen) {
            usellen = newlen
          }
        }else {
          newlen = userlen + rhs.exp - lhs.exp;
          if(newlen >= usellen + reqdig + 1) {
            if(reqdig > 0) {
              res.mant = user;
              res.exp = rhs.exp;
              res.ind = rhs.ind;
              if(userlen < reqdig) {
                res.mant = this.extend(rhs.mant, reqdig);
                res.exp = res.exp - (reqdig - userlen)
              }
              return res.finish(set, false)
            }
          }
          res.exp = lhs.exp;
          if(newlen > reqdig + 1) {
            if(reqdig > 0) {
              tlen = newlen - reqdig - 1;
              usellen = usellen - tlen;
              res.exp = res.exp + tlen;
              newlen = reqdig + 1
            }
          }
          if(newlen > userlen) {
            userlen = newlen
          }
        }
      }
    }while(false);
    if(lhs.ind == this.iszero) {
      res.ind = this.ispos
    }else {
      res.ind = lhs.ind
    }
    if((lhs.ind == this.isneg ? 1 : 0) == (rhs.ind == this.isneg ? 1 : 0)) {
      mult = 1
    }else {
      signdiff:do {
        mult = -1;
        swaptest:do {
          if(rhs.ind == this.iszero) {
          }else {
            if(usellen < userlen || lhs.ind == this.iszero) {
              t = usel;
              usel = user;
              user = t;
              tlen = usellen;
              usellen = userlen;
              userlen = tlen;
              res.ind = -res.ind
            }else {
              if(usellen > userlen) {
              }else {
                ia = 0;
                ib = 0;
                ea = usel.length - 1;
                eb = user.length - 1;
                compare:for(;;) {
                  if(ia <= ea) {
                    ca = usel[ia]
                  }else {
                    if(ib > eb) {
                      if(set.form != MathContext.prototype.PLAIN) {
                        return this.ZERO
                      }
                      break compare
                    }
                    ca = 0
                  }
                  if(ib <= eb) {
                    cb = user[ib]
                  }else {
                    cb = 0
                  }
                  if(ca != cb) {
                    if(ca < cb) {
                      t = usel;
                      usel = user;
                      user = t;
                      tlen = usellen;
                      usellen = userlen;
                      userlen = tlen;
                      res.ind = -res.ind
                    }
                    break compare
                  }
                  ia++;
                  ib++
                }
              }
            }
          }
        }while(false)
      }while(false)
    }
    res.mant = this.byteaddsub(usel, usellen, user, userlen, mult, false);
    return res.finish(set, false)
  }
  function compareTo() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"compareTo(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    var thislength = 0;
    var i = 0;
    var newrhs;
    if(set.lostDigits) {
      this.checkdigits(rhs, set.digits)
    }
    if(this.ind == rhs.ind && this.exp == rhs.exp) {
      thislength = this.mant.length;
      if(thislength < rhs.mant.length) {
        return-this.ind
      }
      if(thislength > rhs.mant.length) {
        return this.ind
      }
      if(thislength <= set.digits || set.digits == 0) {
        var $6 = thislength;
        i = 0;
        i:for(;$6 > 0;$6--, i++) {
          if(this.mant[i] < rhs.mant[i]) {
            return-this.ind
          }
          if(this.mant[i] > rhs.mant[i]) {
            return this.ind
          }
        }
        return 0
      }
    }else {
      if(this.ind < rhs.ind) {
        return-1
      }
      if(this.ind > rhs.ind) {
        return 1
      }
    }
    newrhs = this.clone(rhs);
    newrhs.ind = -newrhs.ind;
    return this.add(newrhs, set).ind
  }
  function divide() {
    var set;
    var scale = -1;
    if(arguments.length == 2) {
      if(typeof arguments[1] == "number") {
        set = new MathContext(0, MathContext.prototype.PLAIN, false, arguments[1])
      }else {
        set = arguments[1]
      }
    }else {
      if(arguments.length == 3) {
        scale = arguments[1];
        if(scale < 0) {
          throw"divide(): Negative scale: " + scale;
        }
        set = new MathContext(0, MathContext.prototype.PLAIN, false, arguments[2])
      }else {
        if(arguments.length == 1) {
          set = this.plainMC
        }else {
          throw"divide(): " + arguments.length + " arguments given; expected between 1 and 3";
        }
      }
    }
    var rhs = arguments[0];
    return this.dodivide("D", rhs, set, scale)
  }
  function divideInteger() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"divideInteger(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    return this.dodivide("I", rhs, set, 0)
  }
  function max() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"max(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    if(this.compareTo(rhs, set) >= 0) {
      return this.plus(set)
    }else {
      return rhs.plus(set)
    }
  }
  function min() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"min(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    if(this.compareTo(rhs, set) <= 0) {
      return this.plus(set)
    }else {
      return rhs.plus(set)
    }
  }
  function multiply() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"multiply(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    var lhs;
    var padding;
    var reqdig;
    var multer = null;
    var multand = null;
    var multandlen;
    var acclen = 0;
    var res;
    var acc;
    var n = 0;
    var mult = 0;
    if(set.lostDigits) {
      this.checkdigits(rhs, set.digits)
    }
    lhs = this;
    padding = 0;
    reqdig = set.digits;
    if(reqdig > 0) {
      if(lhs.mant.length > reqdig) {
        lhs = this.clone(lhs).round(set)
      }
      if(rhs.mant.length > reqdig) {
        rhs = this.clone(rhs).round(set)
      }
    }else {
      if(lhs.exp > 0) {
        padding = padding + lhs.exp
      }
      if(rhs.exp > 0) {
        padding = padding + rhs.exp
      }
    }
    if(lhs.mant.length < rhs.mant.length) {
      multer = lhs.mant;
      multand = rhs.mant
    }else {
      multer = rhs.mant;
      multand = lhs.mant
    }
    multandlen = multer.length + multand.length - 1;
    if(multer[0] * multand[0] > 9) {
      acclen = multandlen + 1
    }else {
      acclen = multandlen
    }
    res = new BigDecimal;
    acc = this.createArrayWithZeros(acclen);
    var $7 = multer.length;
    n = 0;
    n:for(;$7 > 0;$7--, n++) {
      mult = multer[n];
      if(mult != 0) {
        acc = this.byteaddsub(acc, acc.length, multand, multandlen, mult, true)
      }
      multandlen--
    }
    res.ind = lhs.ind * rhs.ind;
    res.exp = lhs.exp + rhs.exp - padding;
    if(padding == 0) {
      res.mant = acc
    }else {
      res.mant = this.extend(acc, acc.length + padding)
    }
    return res.finish(set, false)
  }
  function negate() {
    var set;
    if(arguments.length == 1) {
      set = arguments[0]
    }else {
      if(arguments.length == 0) {
        set = this.plainMC
      }else {
        throw"negate(): " + arguments.length + " arguments given; expected 0 or 1";
      }
    }
    var res;
    if(set.lostDigits) {
      this.checkdigits(null, set.digits)
    }
    res = this.clone(this);
    res.ind = -res.ind;
    return res.finish(set, false)
  }
  function plus() {
    var set;
    if(arguments.length == 1) {
      set = arguments[0]
    }else {
      if(arguments.length == 0) {
        set = this.plainMC
      }else {
        throw"plus(): " + arguments.length + " arguments given; expected 0 or 1";
      }
    }
    if(set.lostDigits) {
      this.checkdigits(null, set.digits)
    }
    if(set.form == MathContext.prototype.PLAIN) {
      if(this.form == MathContext.prototype.PLAIN) {
        if(this.mant.length <= set.digits) {
          return this
        }
        if(set.digits == 0) {
          return this
        }
      }
    }
    return this.clone(this).finish(set, false)
  }
  function pow() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"pow(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    var n;
    var lhs;
    var reqdig;
    var workdigits = 0;
    var L = 0;
    var workset;
    var res;
    var seenbit;
    var i = 0;
    if(set.lostDigits) {
      this.checkdigits(rhs, set.digits)
    }
    n = rhs.intcheck(this.MinArg, this.MaxArg);
    lhs = this;
    reqdig = set.digits;
    if(reqdig == 0) {
      if(rhs.ind == this.isneg) {
        throw"pow(): Negative power: " + rhs.toString();
      }
      workdigits = 0
    }else {
      if(rhs.mant.length + rhs.exp > reqdig) {
        throw"pow(): Too many digits: " + rhs.toString();
      }
      if(lhs.mant.length > reqdig) {
        lhs = this.clone(lhs).round(set)
      }
      L = rhs.mant.length + rhs.exp;
      workdigits = reqdig + L + 1
    }
    workset = new MathContext(workdigits, set.form, false, set.roundingMode);
    res = this.ONE;
    if(n == 0) {
      return res
    }
    if(n < 0) {
      n = -n
    }
    seenbit = false;
    i = 1;
    i:for(;;i++) {
      n <<= 1;
      if(n < 0) {
        seenbit = true;
        res = res.multiply(lhs, workset)
      }
      if(i == 31) {
        break i
      }
      if(!seenbit) {
        continue i
      }
      res = res.multiply(res, workset)
    }
    if(rhs.ind < 0) {
      res = this.ONE.divide(res, workset)
    }
    return res.finish(set, true)
  }
  function remainder() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"remainder(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    return this.dodivide("R", rhs, set, -1)
  }
  function subtract() {
    var set;
    if(arguments.length == 2) {
      set = arguments[1]
    }else {
      if(arguments.length == 1) {
        set = this.plainMC
      }else {
        throw"subtract(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var rhs = arguments[0];
    var newrhs;
    if(set.lostDigits) {
      this.checkdigits(rhs, set.digits)
    }
    newrhs = this.clone(rhs);
    newrhs.ind = -newrhs.ind;
    return this.add(newrhs, set)
  }
  function equals(obj) {
    var rhs;
    var i = 0;
    var lca = null;
    var rca = null;
    if(obj == null) {
      return false
    }
    if(!(obj instanceof BigDecimal)) {
      return false
    }
    rhs = obj;
    if(this.ind != rhs.ind) {
      return false
    }
    if(this.mant.length == rhs.mant.length && this.exp == rhs.exp && this.form == rhs.form) {
      var $8 = this.mant.length;
      i = 0;
      i:for(;$8 > 0;$8--, i++) {
        if(this.mant[i] != rhs.mant[i]) {
          return false
        }
      }
    }else {
      lca = this.layout();
      rca = rhs.layout();
      if(lca.length != rca.length) {
        return false
      }
      var $9 = lca.length;
      i = 0;
      i:for(;$9 > 0;$9--, i++) {
        if(lca[i] != rca[i]) {
          return false
        }
      }
    }
    return true
  }
  function format() {
    var explaces;
    var exdigits;
    var exformint;
    var exround;
    if(arguments.length == 6) {
      explaces = arguments[2];
      exdigits = arguments[3];
      exformint = arguments[4];
      exround = arguments[5]
    }else {
      if(arguments.length == 2) {
        explaces = -1;
        exdigits = -1;
        exformint = MathContext.prototype.SCIENTIFIC;
        exround = this.ROUND_HALF_UP
      }else {
        throw"format(): " + arguments.length + " arguments given; expected 2 or 6";
      }
    }
    var before = arguments[0];
    var after = arguments[1];
    var num;
    var mag = 0;
    var thisafter = 0;
    var lead = 0;
    var newmant = null;
    var chop = 0;
    var need = 0;
    var oldexp = 0;
    var a;
    var p = 0;
    var newa = null;
    var i = 0;
    var places = 0;
    if(before < -1 || before == 0) {
      this.badarg("format", 1, before)
    }
    if(after < -1) {
      this.badarg("format", 2, after)
    }
    if(explaces < -1 || explaces == 0) {
      this.badarg("format", 3, explaces)
    }
    if(exdigits < -1) {
      this.badarg("format", 4, exdigits)
    }
    if(exformint == MathContext.prototype.SCIENTIFIC) {
    }else {
      if(exformint == MathContext.prototype.ENGINEERING) {
      }else {
        if(exformint == -1) {
          exformint = MathContext.prototype.SCIENTIFIC
        }else {
          this.badarg("format", 5, exformint)
        }
      }
    }
    if(exround != this.ROUND_HALF_UP) {
      try {
        if(exround == -1) {
          exround = this.ROUND_HALF_UP
        }else {
          new MathContext(9, MathContext.prototype.SCIENTIFIC, false, exround)
        }
      }catch($10) {
        this.badarg("format", 6, exround)
      }
    }
    num = this.clone(this);
    setform:do {
      if(exdigits == -1) {
        num.form = MathContext.prototype.PLAIN
      }else {
        if(num.ind == this.iszero) {
          num.form = MathContext.prototype.PLAIN
        }else {
          mag = num.exp + num.mant.length;
          if(mag > exdigits) {
            num.form = exformint
          }else {
            if(mag < -5) {
              num.form = exformint
            }else {
              num.form = MathContext.prototype.PLAIN
            }
          }
        }
      }
    }while(false);
    if(after >= 0) {
      setafter:for(;;) {
        if(num.form == MathContext.prototype.PLAIN) {
          thisafter = -num.exp
        }else {
          if(num.form == MathContext.prototype.SCIENTIFIC) {
            thisafter = num.mant.length - 1
          }else {
            lead = (num.exp + num.mant.length - 1) % 3;
            if(lead < 0) {
              lead = 3 + lead
            }
            lead++;
            if(lead >= num.mant.length) {
              thisafter = 0
            }else {
              thisafter = num.mant.length - lead
            }
          }
        }
        if(thisafter == after) {
          break setafter
        }
        if(thisafter < after) {
          newmant = this.extend(num.mant, num.mant.length + after - thisafter);
          num.mant = newmant;
          num.exp = num.exp - (after - thisafter);
          if(num.exp < this.MinExp) {
            throw"format(): Exponent Overflow: " + num.exp;
          }
          break setafter
        }
        chop = thisafter - after;
        if(chop > num.mant.length) {
          num.mant = this.ZERO.mant;
          num.ind = this.iszero;
          num.exp = 0;
          continue setafter
        }
        need = num.mant.length - chop;
        oldexp = num.exp;
        num.round(need, exround);
        if(num.exp - oldexp == chop) {
          break setafter
        }
      }
    }
    a = num.layout();
    if(before > 0) {
      var $11 = a.length;
      p = 0;
      p:for(;$11 > 0;$11--, p++) {
        if(a[p] == ".") {
          break p
        }
        if(a[p] == "E") {
          break p
        }
      }
      if(p > before) {
        this.badarg("format", 1, before)
      }
      if(p < before) {
        newa = new Array(a.length + before - p);
        var $12 = before - p;
        i = 0;
        i:for(;$12 > 0;$12--, i++) {
          newa[i] = " "
        }
        this.arraycopy(a, 0, newa, i, a.length);
        a = newa
      }
    }
    if(explaces > 0) {
      var $13 = a.length - 1;
      p = a.length - 1;
      p:for(;$13 > 0;$13--, p--) {
        if(a[p] == "E") {
          break p
        }
      }
      if(p == 0) {
        newa = new Array(a.length + explaces + 2);
        this.arraycopy(a, 0, newa, 0, a.length);
        var $14 = explaces + 2;
        i = a.length;
        i:for(;$14 > 0;$14--, i++) {
          newa[i] = " "
        }
        a = newa
      }else {
        places = a.length - p - 2;
        if(places > explaces) {
          this.badarg("format", 3, explaces)
        }
        if(places < explaces) {
          newa = new Array(a.length + explaces - places);
          this.arraycopy(a, 0, newa, 0, p + 2);
          var $15 = explaces - places;
          i = p + 2;
          i:for(;$15 > 0;$15--, i++) {
            newa[i] = "0"
          }
          this.arraycopy(a, p + 2, newa, i, places);
          a = newa
        }
      }
    }
    return a.join("")
  }
  function intValueExact() {
    var lodigit;
    var useexp = 0;
    var result;
    var i = 0;
    var topdig = 0;
    if(this.ind == this.iszero) {
      return 0
    }
    lodigit = this.mant.length - 1;
    if(this.exp < 0) {
      lodigit = lodigit + this.exp;
      if(!this.allzero(this.mant, lodigit + 1)) {
        throw"intValueExact(): Decimal part non-zero: " + this.toString();
      }
      if(lodigit < 0) {
        return 0
      }
      useexp = 0
    }else {
      if(this.exp + lodigit > 9) {
        throw"intValueExact(): Conversion overflow: " + this.toString();
      }
      useexp = this.exp
    }
    result = 0;
    var $16 = lodigit + useexp;
    i = 0;
    i:for(;i <= $16;i++) {
      result = result * 10;
      if(i <= lodigit) {
        result = result + this.mant[i]
      }
    }
    if(lodigit + useexp == 9) {
      topdig = div(result, 1E9);
      if(topdig != this.mant[0]) {
        if(result == -2147483648) {
          if(this.ind == this.isneg) {
            if(this.mant[0] == 2) {
              return result
            }
          }
        }
        throw"intValueExact(): Conversion overflow: " + this.toString();
      }
    }
    if(this.ind == this.ispos) {
      return result
    }
    return-result
  }
  function movePointLeft(n) {
    var res;
    res = this.clone(this);
    res.exp = res.exp - n;
    return res.finish(this.plainMC, false)
  }
  function movePointRight(n) {
    var res;
    res = this.clone(this);
    res.exp = res.exp + n;
    return res.finish(this.plainMC, false)
  }
  function scale() {
    if(this.exp >= 0) {
      return 0
    }
    return-this.exp
  }
  function setScale() {
    var round;
    if(arguments.length == 2) {
      round = arguments[1]
    }else {
      if(arguments.length == 1) {
        round = this.ROUND_UNNECESSARY
      }else {
        throw"setScale(): " + arguments.length + " given; expected 1 or 2";
      }
    }
    var scale = +arguments[0];
    var ourscale;
    var res;
    var padding = 0;
    var newlen = 0;
    ourscale = this.scale();
    if(ourscale == scale) {
      if(this.form == MathContext.prototype.PLAIN) {
        return this
      }
    }
    res = this.clone(this);
    if(ourscale <= scale) {
      if(ourscale == 0) {
        padding = res.exp + scale
      }else {
        padding = scale - ourscale
      }
      res.mant = this.extend(res.mant, res.mant.length + padding);
      res.exp = -scale
    }else {
      if(scale < 0) {
        throw"setScale(): Negative scale: " + scale;
      }
      newlen = res.mant.length - (ourscale - scale);
      res = res.round(newlen, round);
      if(res.exp != -scale) {
        res.mant = this.extend(res.mant, res.mant.length + 1);
        res.exp = res.exp - 1
      }
    }
    res.form = MathContext.prototype.PLAIN;
    return res
  }
  function signum() {
    return this.ind
  }
  function toString() {
    return this.layout().join("")
  }
  function layout() {
    var cmant;
    var i = 0;
    var sb = null;
    var euse = 0;
    var sig = 0;
    var csign = 0;
    var rec = null;
    var needsign;
    var mag;
    var len = 0;
    cmant = new Array(this.mant.length);
    var $18 = this.mant.length;
    i = 0;
    i:for(;$18 > 0;$18--, i++) {
      cmant[i] = this.mant[i] + ""
    }
    if(this.form != MathContext.prototype.PLAIN) {
      sb = "";
      if(this.ind == this.isneg) {
        sb += "-"
      }
      euse = this.exp + cmant.length - 1;
      if(this.form == MathContext.prototype.SCIENTIFIC) {
        sb += cmant[0];
        if(cmant.length > 1) {
          sb += "."
        }
        sb += cmant.slice(1).join("")
      }else {
        engineering:do {
          sig = euse % 3;
          if(sig < 0) {
            sig = 3 + sig
          }
          euse = euse - sig;
          sig++;
          if(sig >= cmant.length) {
            sb += cmant.join("");
            var $19 = sig - cmant.length;
            for(;$19 > 0;$19--) {
              sb += "0"
            }
          }else {
            sb += cmant.slice(0, sig).join("");
            sb += ".";
            sb += cmant.slice(sig).join("")
          }
        }while(false)
      }
      if(euse != 0) {
        if(euse < 0) {
          csign = "-";
          euse = -euse
        }else {
          csign = "+"
        }
        sb += "E";
        sb += csign;
        sb += euse
      }
      return sb.split("")
    }
    if(this.exp == 0) {
      if(this.ind >= 0) {
        return cmant
      }
      rec = new Array(cmant.length + 1);
      rec[0] = "-";
      this.arraycopy(cmant, 0, rec, 1, cmant.length);
      return rec
    }
    needsign = this.ind == this.isneg ? 1 : 0;
    mag = this.exp + cmant.length;
    if(mag < 1) {
      len = needsign + 2 - this.exp;
      rec = new Array(len);
      if(needsign != 0) {
        rec[0] = "-"
      }
      rec[needsign] = "0";
      rec[needsign + 1] = ".";
      var $20 = -mag;
      i = needsign + 2;
      i:for(;$20 > 0;$20--, i++) {
        rec[i] = "0"
      }
      this.arraycopy(cmant, 0, rec, needsign + 2 - mag, cmant.length);
      return rec
    }
    if(mag > cmant.length) {
      len = needsign + mag;
      rec = new Array(len);
      if(needsign != 0) {
        rec[0] = "-"
      }
      this.arraycopy(cmant, 0, rec, needsign, cmant.length);
      var $21 = mag - cmant.length;
      i = needsign + cmant.length;
      i:for(;$21 > 0;$21--, i++) {
        rec[i] = "0"
      }
      return rec
    }
    len = needsign + 1 + cmant.length;
    rec = new Array(len);
    if(needsign != 0) {
      rec[0] = "-"
    }
    this.arraycopy(cmant, 0, rec, needsign, mag);
    rec[needsign + mag] = ".";
    this.arraycopy(cmant, mag, rec, needsign + mag + 1, cmant.length - mag);
    return rec
  }
  function intcheck(min, max) {
    var i;
    i = this.intValueExact();
    if(i < min || i > max) {
      throw"intcheck(): Conversion overflow: " + i;
    }
    return i
  }
  function dodivide(code, rhs, set, scale) {
    var lhs;
    var reqdig;
    var newexp;
    var res;
    var newlen;
    var var1;
    var var1len;
    var var2;
    var var2len;
    var b2b;
    var have;
    var thisdigit = 0;
    var i = 0;
    var v2 = 0;
    var ba = 0;
    var mult = 0;
    var start = 0;
    var padding = 0;
    var d = 0;
    var newvar1 = null;
    var lasthave = 0;
    var actdig = 0;
    var newmant = null;
    if(set.lostDigits) {
      this.checkdigits(rhs, set.digits)
    }
    lhs = this;
    if(rhs.ind == 0) {
      throw"dodivide(): Divide by 0";
    }
    if(lhs.ind == 0) {
      if(set.form != MathContext.prototype.PLAIN) {
        return this.ZERO
      }
      if(scale == -1) {
        return lhs
      }
      return lhs.setScale(scale)
    }
    reqdig = set.digits;
    if(reqdig > 0) {
      if(lhs.mant.length > reqdig) {
        lhs = this.clone(lhs).round(set)
      }
      if(rhs.mant.length > reqdig) {
        rhs = this.clone(rhs).round(set)
      }
    }else {
      if(scale == -1) {
        scale = lhs.scale()
      }
      reqdig = lhs.mant.length;
      if(scale != -lhs.exp) {
        reqdig = reqdig + scale + lhs.exp
      }
      reqdig = reqdig - (rhs.mant.length - 1) - rhs.exp;
      if(reqdig < lhs.mant.length) {
        reqdig = lhs.mant.length
      }
      if(reqdig < rhs.mant.length) {
        reqdig = rhs.mant.length
      }
    }
    newexp = lhs.exp - rhs.exp + lhs.mant.length - rhs.mant.length;
    if(newexp < 0) {
      if(code != "D") {
        if(code == "I") {
          return this.ZERO
        }
        return this.clone(lhs).finish(set, false)
      }
    }
    res = new BigDecimal;
    res.ind = lhs.ind * rhs.ind;
    res.exp = newexp;
    res.mant = this.createArrayWithZeros(reqdig + 1);
    newlen = reqdig + reqdig + 1;
    var1 = this.extend(lhs.mant, newlen);
    var1len = newlen;
    var2 = rhs.mant;
    var2len = newlen;
    b2b = var2[0] * 10 + 1;
    if(var2.length > 1) {
      b2b = b2b + var2[1]
    }
    have = 0;
    outer:for(;;) {
      thisdigit = 0;
      inner:for(;;) {
        if(var1len < var2len) {
          break inner
        }
        if(var1len == var2len) {
          compare:do {
            var $22 = var1len;
            i = 0;
            i:for(;$22 > 0;$22--, i++) {
              if(i < var2.length) {
                v2 = var2[i]
              }else {
                v2 = 0
              }
              if(var1[i] < v2) {
                break inner
              }
              if(var1[i] > v2) {
                break compare
              }
            }
            thisdigit++;
            res.mant[have] = thisdigit;
            have++;
            var1[0] = 0;
            break outer
          }while(false);
          ba = var1[0]
        }else {
          ba = var1[0] * 10;
          if(var1len > 1) {
            ba = ba + var1[1]
          }
        }
        mult = div(ba * 10, b2b);
        if(mult == 0) {
          mult = 1
        }
        thisdigit = thisdigit + mult;
        var1 = this.byteaddsub(var1, var1len, var2, var2len, -mult, true);
        if(var1[0] != 0) {
          continue inner
        }
        var $23 = var1len - 2;
        start = 0;
        start:for(;start <= $23;start++) {
          if(var1[start] != 0) {
            break start
          }
          var1len--
        }
        if(start == 0) {
          continue inner
        }
        this.arraycopy(var1, start, var1, 0, var1len)
      }
      if(have != 0 || thisdigit != 0) {
        res.mant[have] = thisdigit;
        have++;
        if(have == reqdig + 1) {
          break outer
        }
        if(var1[0] == 0) {
          break outer
        }
      }
      if(scale >= 0) {
        if(-res.exp > scale) {
          break outer
        }
      }
      if(code != "D") {
        if(res.exp <= 0) {
          break outer
        }
      }
      res.exp = res.exp - 1;
      var2len--
    }
    if(have == 0) {
      have = 1
    }
    if(code == "I" || code == "R") {
      if(have + res.exp > reqdig) {
        throw"dodivide(): Integer overflow";
      }
      if(code == "R") {
        remainder:do {
          if(res.mant[0] == 0) {
            return this.clone(lhs).finish(set, false)
          }
          if(var1[0] == 0) {
            return this.ZERO
          }
          res.ind = lhs.ind;
          padding = reqdig + reqdig + 1 - lhs.mant.length;
          res.exp = res.exp - padding + lhs.exp;
          d = var1len;
          i = d - 1;
          i:for(;i >= 1;i--) {
            if(!(res.exp < lhs.exp && res.exp < rhs.exp)) {
              break
            }
            if(var1[i] != 0) {
              break i
            }
            d--;
            res.exp = res.exp + 1
          }
          if(d < var1.length) {
            newvar1 = new Array(d);
            this.arraycopy(var1, 0, newvar1, 0, d);
            var1 = newvar1
          }
          res.mant = var1;
          return res.finish(set, false)
        }while(false)
      }
    }else {
      if(var1[0] != 0) {
        lasthave = res.mant[have - 1];
        if(lasthave % 5 == 0) {
          res.mant[have - 1] = lasthave + 1
        }
      }
    }
    if(scale >= 0) {
      scaled:do {
        if(have != res.mant.length) {
          res.exp = res.exp - (res.mant.length - have)
        }
        actdig = res.mant.length - (-res.exp - scale);
        res.round(actdig, set.roundingMode);
        if(res.exp != -scale) {
          res.mant = this.extend(res.mant, res.mant.length + 1);
          res.exp = res.exp - 1
        }
        return res.finish(set, true)
      }while(false)
    }
    if(have == res.mant.length) {
      res.round(set);
      have = reqdig
    }else {
      if(res.mant[0] == 0) {
        return this.ZERO
      }
      newmant = new Array(have);
      this.arraycopy(res.mant, 0, newmant, 0, have);
      res.mant = newmant
    }
    return res.finish(set, true)
  }
  function bad(prefix, s) {
    throw prefix + "Not a number: " + s;
  }
  function badarg(name, pos, value) {
    throw"Bad argument " + pos + " to " + name + ": " + value;
  }
  function extend(inarr, newlen) {
    var newarr;
    if(inarr.length == newlen) {
      return inarr
    }
    newarr = createArrayWithZeros(newlen);
    this.arraycopy(inarr, 0, newarr, 0, inarr.length);
    return newarr
  }
  function byteaddsub(a, avlen, b, bvlen, m, reuse) {
    var alength;
    var blength;
    var ap;
    var bp;
    var maxarr;
    var reb;
    var quickm;
    var digit;
    var op = 0;
    var dp90 = 0;
    var newarr;
    var i = 0;
    alength = a.length;
    blength = b.length;
    ap = avlen - 1;
    bp = bvlen - 1;
    maxarr = bp;
    if(maxarr < ap) {
      maxarr = ap
    }
    reb = null;
    if(reuse) {
      if(maxarr + 1 == alength) {
        reb = a
      }
    }
    if(reb == null) {
      reb = this.createArrayWithZeros(maxarr + 1)
    }
    quickm = false;
    if(m == 1) {
      quickm = true
    }else {
      if(m == -1) {
        quickm = true
      }
    }
    digit = 0;
    op = maxarr;
    op:for(;op >= 0;op--) {
      if(ap >= 0) {
        if(ap < alength) {
          digit = digit + a[ap]
        }
        ap--
      }
      if(bp >= 0) {
        if(bp < blength) {
          if(quickm) {
            if(m > 0) {
              digit = digit + b[bp]
            }else {
              digit = digit - b[bp]
            }
          }else {
            digit = digit + b[bp] * m
          }
        }
        bp--
      }
      if(digit < 10) {
        if(digit >= 0) {
          quick:do {
            reb[op] = digit;
            digit = 0;
            continue op
          }while(false)
        }
      }
      dp90 = digit + 90;
      reb[op] = this.bytedig[dp90];
      digit = this.bytecar[dp90]
    }
    if(digit == 0) {
      return reb
    }
    newarr = null;
    if(reuse) {
      if(maxarr + 2 == a.length) {
        newarr = a
      }
    }
    if(newarr == null) {
      newarr = new Array(maxarr + 2)
    }
    newarr[0] = digit;
    var $24 = maxarr + 1;
    i = 0;
    i:for(;$24 > 0;$24--, i++) {
      newarr[i + 1] = reb[i]
    }
    return newarr
  }
  function diginit() {
    var work;
    var op = 0;
    var digit = 0;
    work = new Array(90 + 99 + 1);
    op = 0;
    op:for(;op <= 90 + 99;op++) {
      digit = op - 90;
      if(digit >= 0) {
        work[op] = digit % 10;
        BigDecimal.prototype.bytecar[op] = div(digit, 10);
        continue op
      }
      digit = digit + 100;
      work[op] = digit % 10;
      BigDecimal.prototype.bytecar[op] = div(digit, 10) - 10
    }
    return work
  }
  function clone(dec) {
    var copy;
    copy = new BigDecimal;
    copy.ind = dec.ind;
    copy.exp = dec.exp;
    copy.form = dec.form;
    copy.mant = dec.mant;
    return copy
  }
  function checkdigits(rhs, dig) {
    if(dig == 0) {
      return
    }
    if(this.mant.length > dig) {
      if(!this.allzero(this.mant, dig)) {
        throw"Too many digits: " + this.toString();
      }
    }
    if(rhs == null) {
      return
    }
    if(rhs.mant.length > dig) {
      if(!this.allzero(rhs.mant, dig)) {
        throw"Too many digits: " + rhs.toString();
      }
    }
    return
  }
  function round() {
    var len;
    var mode;
    if(arguments.length == 2) {
      len = arguments[0];
      mode = arguments[1]
    }else {
      if(arguments.length == 1) {
        var set = arguments[0];
        len = set.digits;
        mode = set.roundingMode
      }else {
        throw"round(): " + arguments.length + " arguments given; expected 1 or 2";
      }
    }
    var adjust;
    var sign;
    var oldmant;
    var reuse = false;
    var first = 0;
    var increment;
    var newmant = null;
    adjust = this.mant.length - len;
    if(adjust <= 0) {
      return this
    }
    this.exp = this.exp + adjust;
    sign = this.ind;
    oldmant = this.mant;
    if(len > 0) {
      this.mant = new Array(len);
      this.arraycopy(oldmant, 0, this.mant, 0, len);
      reuse = true;
      first = oldmant[len]
    }else {
      this.mant = this.ZERO.mant;
      this.ind = this.iszero;
      reuse = false;
      if(len == 0) {
        first = oldmant[0]
      }else {
        first = 0
      }
    }
    increment = 0;
    modes:do {
      if(mode == this.ROUND_HALF_UP) {
        if(first >= 5) {
          increment = sign
        }
      }else {
        if(mode == this.ROUND_UNNECESSARY) {
          if(!this.allzero(oldmant, len)) {
            throw"round(): Rounding necessary";
          }
        }else {
          if(mode == this.ROUND_HALF_DOWN) {
            if(first > 5) {
              increment = sign
            }else {
              if(first == 5) {
                if(!this.allzero(oldmant, len + 1)) {
                  increment = sign
                }
              }
            }
          }else {
            if(mode == this.ROUND_HALF_EVEN) {
              if(first > 5) {
                increment = sign
              }else {
                if(first == 5) {
                  if(!this.allzero(oldmant, len + 1)) {
                    increment = sign
                  }else {
                    if(this.mant[this.mant.length - 1] % 2 == 1) {
                      increment = sign
                    }
                  }
                }
              }
            }else {
              if(mode == this.ROUND_DOWN) {
              }else {
                if(mode == this.ROUND_UP) {
                  if(!this.allzero(oldmant, len)) {
                    increment = sign
                  }
                }else {
                  if(mode == this.ROUND_CEILING) {
                    if(sign > 0) {
                      if(!this.allzero(oldmant, len)) {
                        increment = sign
                      }
                    }
                  }else {
                    if(mode == this.ROUND_FLOOR) {
                      if(sign < 0) {
                        if(!this.allzero(oldmant, len)) {
                          increment = sign
                        }
                      }
                    }else {
                      throw"round(): Bad round value: " + mode;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }while(false);
    if(increment != 0) {
      bump:do {
        if(this.ind == this.iszero) {
          this.mant = this.ONE.mant;
          this.ind = increment
        }else {
          if(this.ind == this.isneg) {
            increment = -increment
          }
          newmant = this.byteaddsub(this.mant, this.mant.length, this.ONE.mant, 1, increment, reuse);
          if(newmant.length > this.mant.length) {
            this.exp++;
            this.arraycopy(newmant, 0, this.mant, 0, this.mant.length)
          }else {
            this.mant = newmant
          }
        }
      }while(false)
    }
    if(this.exp > this.MaxExp) {
      throw"round(): Exponent Overflow: " + this.exp;
    }
    return this
  }
  function allzero(array, start) {
    var i = 0;
    if(start < 0) {
      start = 0
    }
    var $25 = array.length - 1;
    i = start;
    i:for(;i <= $25;i++) {
      if(array[i] != 0) {
        return false
      }
    }
    return true
  }
  function finish(set, strip) {
    var d = 0;
    var i = 0;
    var newmant = null;
    var mag = 0;
    var sig = 0;
    if(set.digits != 0) {
      if(this.mant.length > set.digits) {
        this.round(set)
      }
    }
    if(strip) {
      if(set.form != MathContext.prototype.PLAIN) {
        d = this.mant.length;
        i = d - 1;
        i:for(;i >= 1;i--) {
          if(this.mant[i] != 0) {
            break i
          }
          d--;
          this.exp++
        }
        if(d < this.mant.length) {
          newmant = new Array(d);
          this.arraycopy(this.mant, 0, newmant, 0, d);
          this.mant = newmant
        }
      }
    }
    this.form = MathContext.prototype.PLAIN;
    var $26 = this.mant.length;
    i = 0;
    i:for(;$26 > 0;$26--, i++) {
      if(this.mant[i] != 0) {
        if(i > 0) {
          delead:do {
            newmant = new Array(this.mant.length - i);
            this.arraycopy(this.mant, i, newmant, 0, this.mant.length - i);
            this.mant = newmant
          }while(false)
        }
        mag = this.exp + this.mant.length;
        if(mag > 0) {
          if(mag > set.digits) {
            if(set.digits != 0) {
              this.form = set.form
            }
          }
          if(mag - 1 <= this.MaxExp) {
            return this
          }
        }else {
          if(mag < -5) {
            this.form = set.form
          }
        }
        mag--;
        if(mag < this.MinExp || mag > this.MaxExp) {
          overflow:do {
            if(this.form == MathContext.prototype.ENGINEERING) {
              sig = mag % 3;
              if(sig < 0) {
                sig = 3 + sig
              }
              mag = mag - sig;
              if(mag >= this.MinExp) {
                if(mag <= this.MaxExp) {
                  break overflow
                }
              }
            }
            throw"finish(): Exponent Overflow: " + mag;
          }while(false)
        }
        return this
      }
    }
    this.ind = this.iszero;
    if(set.form != MathContext.prototype.PLAIN) {
      this.exp = 0
    }else {
      if(this.exp > 0) {
        this.exp = 0
      }else {
        if(this.exp < this.MinExp) {
          throw"finish(): Exponent Overflow: " + this.exp;
        }
      }
    }
    this.mant = this.ZERO.mant;
    return this
  }
  function isGreaterThan(other) {
    return this.compareTo(other) > 0
  }
  function isLessThan(other) {
    return this.compareTo(other) < 0
  }
  function isGreaterThanOrEqualTo(other) {
    return this.compareTo(other) >= 0
  }
  function isLessThanOrEqualTo(other) {
    return this.compareTo(other) <= 0
  }
  function isPositive() {
    return this.compareTo(BigDecimal.prototype.ZERO) > 0
  }
  function isNegative() {
    return this.compareTo(BigDecimal.prototype.ZERO) < 0
  }
  function isZero() {
    return this.equals(BigDecimal.prototype.ZERO)
  }
  return BigDecimal
}(MathContext);
var Model = function() {
  function error(str) {
    trace("error: " + str)
  }
  function Model() {
  }
  Model.fn = {};
  Model.env = env = {};
  var envStack = [];
  var env = {};
  Model.pushEnv = function pushEnv(e) {
    envStack.push(env);
    Model.env = env = e
  };
  Model.popEnv = function popEnv() {
    assert(envStack.length > 0, "1000: Empty envStack");
    Model.env = env = envStack.pop()
  };
  function isChemCore() {
    return!!Model.env["Au"]
  }
  var Mp = Model.prototype = new Ast;
  Assert.reserveCodeRange(1E3, 1999, "model");
  Assert.messages[1E3] = "Internal error. %1.";
  Assert.messages[1001] = "Invalid syntax. '%1' expected, '%2' found.";
  Assert.messages[1002] = "Only one decimal separator can be specified.";
  Assert.messages[1003] = "Extra characters in input at position: %1, lexeme: %2, prefix: %3.";
  Assert.messages[1004] = "Invalid character '%1' (%2) in input.";
  Assert.messages[1005] = "Misplaced thousands separator.";
  Assert.messages[1006] = "Invalid syntax. Expression expected, %1 found.";
  Assert.messages[1007] = "Unexpected character: '%1' in '%2'.";
  Assert.messages[1008] = "The same character '%1' is being used as a thousands and decimal separators.";
  Assert.messages[1009] = "Missing argument for '%1' command.";
  Assert.messages[1010] = "Expecting an operator between numbers.";
  Assert.messages[1011] = "Invalid grouping bracket.";
  var message = Assert.message;
  Model.create = Mp.create = function create(node, location) {
    assert(node != undefined, message(1011));
    if(node instanceof Model) {
      if(location) {
        node.location = location
      }
      return node
    }
    var model;
    if(node instanceof Array) {
      model = [];
      forEach(node, function(n) {
        model.push(create(n, location))
      });
      return model
    }
    if(!(this instanceof Model)) {
      return(new Model).create(node, location)
    }
    model = create(this);
    model.location = location;
    if(typeof node === "string") {
      var parser = parse(node, Model.env);
      node = parser.expr()
    }else {
      node = JSON.parse(JSON.stringify(node))
    }
    forEach(keys(Model.fn), function(v, i) {
      if(!Mp.hasOwnProperty(v)) {
        Mp[v] = function() {
          var fn = Model.fn[v];
          if(arguments.length > 1 && arguments[1] instanceof Model) {
            return fn.apply(this, arguments)
          }else {
            var args = [this];
            for(var i = 0;i < arguments.length;i++) {
              args.push(arguments[i])
            }
            return fn.apply(this, args)
          }
        }
      }
    });
    forEach(keys(node), function(v, i) {
      model[v] = node[v]
    });
    return model
  };
  Model.fromLaTex = Mp.fromLaTex = function fromLaTex(src) {
    assert(typeof src === "string", "1000: Model.prototype.fromLaTex");
    if(!this) {
      return Model.create(src)
    }
    return this.create(src)
  };
  Mp.toLaTex = function toLaTex(node) {
    return render(node)
  };
  var OpStr = {ADD:"+", SUB:"-", MUL:"mul", TIMES:"times", COEFF:"coeff", DIV:"div", FRAC:"frac", EQL:"=", ATAN2:"atan2", SQRT:"sqrt", VEC:"vec", PM:"pm", SIN:"sin", COS:"cos", TAN:"tan", SEC:"sec", COT:"cot", CSC:"csc", ARCSIN:"arcsin", ARCCOS:"arccos", ARCTAN:"arctan", ARCSEC:"arcsec", ARCCSC:"arccsc", ARCCOT:"arccot", SINH:"sinh", COSH:"cosh", TANH:"tanh", SECH:"sech", COTH:"coth", CSCH:"csch", ARCSINH:"arcsinh", ARCCOSH:"arccosh", ARCTANH:"arctanh", ARCSECH:"arcsech", ARCCSCH:"arccsch", ARCCOTH:"arccoth", 
  LOG:"log", LN:"ln", LG:"lg", VAR:"var", NUM:"num", CST:"cst", COMMA:",", POW:"^", SUBSCRIPT:"_", ABS:"abs", PAREN:"()", HIGHLIGHT:"hi", LT:"lt", LE:"le", GT:"gt", GE:"ge", NE:"ne", NGTR:"ngtr", NLESS:"nless", APPROX:"approx", INTERVAL:"interval", LIST:"list", EXISTS:"exists", IN:"in", FORALL:"forall", LIM:"lim", EXP:"exp", TO:"to", SUM:"sum", DERIV:"deriv", PIPE:"pipe", INTEGRAL:"integral", PROD:"prod", PERCENT:"%", M:"M", RIGHTARROW:"rightarrow", FACT:"fact", BINOM:"binom", ROW:"row", COL:"col", 
  COLON:"colon", MATRIX:"matrix", FORMAT:"format", OVERSET:"overset", UNDERSET:"underset", OVERLINE:"overline", DEGREE:"degree", BACKSLASH:"backslash", MATHBF:"mathbf", DOT:"dot", MATHFIELD:"mathfield", DELTA:"delta", NONE:"none"};
  forEach(keys(OpStr), function(v, i) {
    Model[v] = OpStr[v]
  });
  var OpToLaTeX = {};
  OpToLaTeX[OpStr.ADD] = "+";
  OpToLaTeX[OpStr.SUB] = "-";
  OpToLaTeX[OpStr.MUL] = "*";
  OpToLaTeX[OpStr.DIV] = "\\div";
  OpToLaTeX[OpStr.FRAC] = "\\frac";
  OpToLaTeX[OpStr.EQL] = "=";
  OpToLaTeX[OpStr.ATAN2] = "\\atan2";
  OpToLaTeX[OpStr.POW] = "^";
  OpToLaTeX[OpStr.SUBSCRIPT] = "_";
  OpToLaTeX[OpStr.PM] = "\\pm";
  OpToLaTeX[OpStr.SIN] = "\\sin";
  OpToLaTeX[OpStr.COS] = "\\cos";
  OpToLaTeX[OpStr.TAN] = "\\tan";
  OpToLaTeX[OpStr.ARCSIN] = "\\arcsin";
  OpToLaTeX[OpStr.ARCCOS] = "\\arccos";
  OpToLaTeX[OpStr.ARCTAN] = "\\arctan";
  OpToLaTeX[OpStr.ARCSEC] = "\\arcsec";
  OpToLaTeX[OpStr.ARCCSC] = "\\arccsc";
  OpToLaTeX[OpStr.ARCCOT] = "\\arccot";
  OpToLaTeX[OpStr.SEC] = "\\sec";
  OpToLaTeX[OpStr.COT] = "\\cot";
  OpToLaTeX[OpStr.CSC] = "\\csc";
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
  OpToLaTeX[OpStr.INT] = "\\int";
  Model.fold = function fold(node, env) {
    var args = [], val;
    forEach(node.args, function(n) {
      args.push(fold(n, env))
    });
    node.args = args;
    switch(node.op) {
      case OpStr.VAR:
        if(val = env[node.args[0]]) {
          node = val
        }
        break;
      default:
        break
    }
    return node
  };
  var render = function render(n) {
    var text = "";
    if(typeof n === "string") {
      text = n
    }else {
      if(typeof n === "number") {
        text = n
      }else {
        if(typeof n === "object") {
          var args = [];
          for(var i = 0;i < n.args.length;i++) {
            args[i] = render(n.args[i])
          }
          switch(n.op) {
            case OpStr.VAR:
            ;
            case OpStr.CST:
            ;
            case OpStr.NUM:
              text = "(" + n.args[0] + ")";
              break;
            case OpStr.SUB:
              if(n.args.length === 1) {
                text = OpToLaTeX[n.op] + " " + args[0]
              }else {
                text = args[0] + " " + OpToLaTeX[n.op] + " " + args[1]
              }
              break;
            case OpStr.DIV:
            ;
            case OpStr.PM:
            ;
            case OpStr.EQL:
              text = args[0] + " " + OpToLaTeX[n.op] + " " + args[1];
              break;
            case OpStr.POW:
              var lhs = n.args[0];
              var rhs = n.args[1];
              if(lhs.args && lhs.args.length === 2 || rhs.args && rhs.args.length === 2) {
                if(lhs.op === OpStr.ADD || (lhs.op === OpStr.SUB || (lhs.op === OpStr.MUL || (lhs.op === OpStr.DIV || lhs.op === OpStr.SQRT)))) {
                  args[0] = " (" + args[0] + ") "
                }
              }
              text = "{" + args[0] + "^{" + args[1] + "}}";
              break;
            case OpStr.SIN:
            ;
            case OpStr.COS:
            ;
            case OpStr.TAN:
            ;
            case OpStr.ARCSIN:
            ;
            case OpStr.ARCCOS:
            ;
            case OpStr.ARCTAN:
            ;
            case OpStr.ARCSEC:
            ;
            case OpStr.ARCCSC:
            ;
            case OpStr.ARCCOT:
            ;
            case OpStr.SEC:
            ;
            case OpStr.COT:
            ;
            case OpStr.CSC:
            ;
            case OpStr.SINH:
            ;
            case OpStr.COSH:
            ;
            case OpStr.TANH:
            ;
            case OpStr.ARCSINH:
            ;
            case OpStr.ARCCOSH:
            ;
            case OpStr.ARCTANH:
            ;
            case OpStr.ARCSECH:
            ;
            case OpStr.ARCCSCH:
            ;
            case OpStr.ARCCOTH:
            ;
            case OpStr.SECH:
            ;
            case OpStr.COTH:
            ;
            case OpStr.CSCH:
            ;
            case OpStr.LN:
            ;
            case OpStr.M:
              text = "{" + OpToLaTeX[n.op] + "{" + args[0] + "}}";
              break;
            case OpStr.FRAC:
              text = "\\frac{" + args[0] + "}{" + args[1] + "}";
              break;
            case OpStr.BINOM:
              text = "\\binom{" + args[0] + "}{" + args[1] + "}";
              break;
            case OpStr.SQRT:
              switch(args.length) {
                case 1:
                  text = "\\sqrt{" + args[0] + "}";
                  break;
                case 2:
                  text = "\\sqrt[" + args[0] + "]{" + args[1] + "}";
                  break
              }
              break;
            case OpStr.INT:
              text = "\\int " + args[0];
              break;
            case OpStr.VEC:
              text = "\\vec{" + args[0] + "}";
              break;
            case OpStr.MUL:
              var prevTerm;
              text = "";
              forEach(n.args, function(term, index) {
                if(term.args && term.args.length >= 2) {
                  if(term.op === OpStr.ADD || term.op === OpStr.SUB) {
                    args[index] = "(" + args[index] + ")"
                  }
                  if(index !== 0 && typeof term === "number") {
                    text += OpToLaTeX[n.op] + " "
                  }
                  text += args[index]
                }else {
                  if(term.op === OpStr.PAREN || (term.op === OpStr.VAR || (term.op === OpStr.CST || typeof prevTerm === "number" && typeof term !== "number"))) {
                    text += args[index]
                  }else {
                    if(index !== 0) {
                      text += " " + OpToLaTeX[n.op] + " "
                    }
                    text += args[index]
                  }
                }
                prevTerm = term
              });
              break;
            case OpStr.ADD:
            ;
            case OpStr.COMMA:
              forEach(args, function(value, index) {
                if(index === 0) {
                  text = value
                }else {
                  text = text + " " + OpToLaTeX[n.op] + " " + value
                }
              });
              break;
            default:
              assert(false, "1000: Unimplemented operator translating to LaTeX: " + n.op);
              break
          }
        }else {
          assert(false, "1000: Invalid expression type")
        }
      }
    }
    return text
  };
  var CC_SPACE = 32;
  var CC_BANG = 33;
  var CC_DOLLAR = 36;
  var CC_PERCENT = 37;
  var CC_LEFTPAREN = 40;
  var CC_MUL = 42;
  var CC_ADD = 43;
  var CC_COMMA = 44;
  var CC_SUB = 45;
  var CC_RIGHTPAREN = 41;
  var CC_SLASH = 47;
  var CC_NUM = 48;
  var CC_COLON = 58;
  var CC_SEMICOLON = 59;
  var CC_EQL = 61;
  var CC_QMARK = 63;
  var CC_CONST = 65;
  var CC_LEFTBRACKET = 91;
  var CC_RIGHTBRACKET = 93;
  var CC_CARET = 94;
  var CC_UNDERSCORE = 95;
  var CC_VAR = 97;
  var CC_LEFTBRACE = 123;
  var CC_VERTICALBAR = 124;
  var CC_RIGHTBRACE = 125;
  var CC_SINGLEQUOTE = 39;
  var TK_NONE = 0;
  var TK_ADD = CC_ADD;
  var TK_CARET = CC_CARET;
  var TK_UNDERSCORE = CC_UNDERSCORE;
  var TK_SLASH = CC_SLASH;
  var TK_EQL = CC_EQL;
  var TK_LEFTBRACE = CC_LEFTBRACE;
  var TK_VERTICALBAR = CC_VERTICALBAR;
  var TK_LEFTBRACKET = CC_LEFTBRACKET;
  var TK_LEFTPAREN = CC_LEFTPAREN;
  var TK_MUL = CC_MUL;
  var TK_NUM = CC_NUM;
  var TK_RIGHTBRACE = CC_RIGHTBRACE;
  var TK_RIGHTBRACKET = CC_RIGHTBRACKET;
  var TK_RIGHTPAREN = CC_RIGHTPAREN;
  var TK_SUB = CC_SUB;
  var TK_VAR = CC_VAR;
  var TK_CONST = CC_CONST;
  var TK_COMMA = CC_COMMA;
  var TK_PERCENT = CC_PERCENT;
  var TK_QMARK = CC_QMARK;
  var TK_BANG = CC_BANG;
  var TK_COLON = CC_COLON;
  var TK_SEMICOLON = CC_SEMICOLON;
  var TK_FRAC = 256;
  var TK_SQRT = 257;
  var TK_PM = 258;
  var TK_SIN = 259;
  var TK_TAN = 260;
  var TK_COS = 261;
  var TK_SEC = 262;
  var TK_LN = 263;
  var TK_COT = 264;
  var TK_CSC = 265;
  var TK_NEXT = 266;
  var TK_LG = 267;
  var TK_LOG = 268;
  var TK_TEXT = 269;
  var TK_LT = 270;
  var TK_LE = 271;
  var TK_GT = 272;
  var TK_GE = 273;
  var TK_EXISTS = 274;
  var TK_IN = 275;
  var TK_FORALL = 276;
  var TK_LIM = 277;
  var TK_EXP = 278;
  var TK_TO = 279;
  var TK_SUM = 280;
  var TK_INT = 281;
  var TK_PROD = 282;
  var TK_M = 283;
  var TK_RIGHTARROW = 284;
  var TK_BINOM = 285;
  var TK_NEWROW = 286;
  var TK_NEWCOL = 287;
  var TK_BEGIN = 288;
  var TK_END = 289;
  var TK_VEC = 290;
  var TK_ARCSIN = 291;
  var TK_ARCCOS = 292;
  var TK_ARCTAN = 293;
  var TK_DIV = 294;
  var TK_TYPE = 295;
  var TK_OVERLINE = 296;
  var TK_OVERSET = 297;
  var TK_UNDERSET = 298;
  var TK_BACKSLASH = 299;
  var TK_MATHBF = 300;
  var TK_NE = 301;
  var TK_APPROX = 302;
  var TK_ABS = 303;
  var TK_DOT = 304;
  var TK_NGTR = 305;
  var TK_NLESS = 306;
  var TK_SINH = 307;
  var TK_COSH = 308;
  var TK_TANH = 309;
  var TK_SECH = 310;
  var TK_COTH = 311;
  var TK_CSCH = 312;
  var TK_ARCSINH = 313;
  var TK_ARCCOSH = 314;
  var TK_ARCTANH = 315;
  var TK_ARCSEC = 321;
  var TK_ARCCSC = 322;
  var TK_ARCCOT = 323;
  var TK_MATHFIELD = 324;
  var TK_CUP = 325;
  var TK_BIGCUP = 326;
  var TK_CAP = 327;
  var TK_BIGCAP = 328;
  var TK_PERP = 329;
  var TK_PROPTO = 330;
  var unused = 331;
  var TK_FORMAT = 332;
  var TK_NI = 333;
  var TK_SUBSETEQ = 334;
  var TK_SUPSETEQ = 335;
  var TK_SUBSET = 336;
  var TK_SUPSET = 337;
  var TK_NOT = 338;
  var TK_PARALLEL = 339;
  var TK_NPARALLEL = 340;
  var TK_SIM = 341;
  var TK_CONG = 342;
  var TK_LEFTARROW = 343;
  var TK_LONGRIGHTARROW = 344;
  var TK_LONGLEFTARROW = 345;
  var TK_OVERRIGHTARROW = 346;
  var TK_OVERLEFTARROW = 347;
  var TK_LONGLEFTRIGHTARROW = 348;
  var TK_OVERLEFTRIGHTARROW = 349;
  var TK_IMPLIES = 350;
  var TK_ARCSECH = 351;
  var TK_ARCCSCH = 352;
  var TK_ARCCOTH = 353;
  var TK_OPERATORNAME = 354;
  var TK_DELTA = 338;
  var T0 = TK_NONE;
  var T1 = TK_NONE;
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
  tokenToOperator[TK_LN] = OpStr.LN;
  tokenToOperator[TK_LG] = OpStr.LG;
  tokenToOperator[TK_LOG] = OpStr.LOG;
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
  tokenToOperator[TK_RIGHTARROW] = OpStr.RIGHTARROW;
  tokenToOperator[TK_LEFTARROW] = OpStr.LEFTARROW;
  tokenToOperator[TK_LONGRIGHTARROW] = OpStr.LONGRIGHTARROW;
  tokenToOperator[TK_LONGLEFTARROW] = OpStr.LONGLEFTARROW;
  tokenToOperator[TK_OVERRIGHTARROW] = OpStr.OVERRIGHTARROW;
  tokenToOperator[TK_OVERLEFTARROW] = OpStr.OVERLEFTARROW;
  tokenToOperator[TK_LONGLEFTRIGHTARROW] = OpStr.LONGLEFTRIGHTARROW;
  tokenToOperator[TK_OVERLEFTRIGHTARROW] = OpStr.OVERLEFTRIGHTARROW;
  tokenToOperator[TK_BANG] = OpStr.FACT;
  tokenToOperator[TK_BINOM] = OpStr.BINOM;
  tokenToOperator[TK_NEWROW] = OpStr.ROW;
  tokenToOperator[TK_NEWCOL] = OpStr.COL;
  tokenToOperator[TK_COLON] = OpStr.COLON;
  tokenToOperator[TK_SEMICOLON] = OpStr.SEMICOLON;
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
      return{op:op, args:args}
    }
    function matchThousandsSeparator(ch, last) {
      if(Model.option("allowThousandsSeparator")) {
        var separators = Model.option("setThousandsSeparator");
        if(!separators) {
          return ch === "," ? ch : ""
        }else {
          if(ch === last || !last && indexOf(separators, ch) >= 0) {
            return ch
          }else {
            return""
          }
        }
      }
      return""
    }
    function matchDecimalSeparator(ch) {
      var decimalSeparator = Model.option("setDecimalSeparator");
      var thousandsSeparators = Model.option("setThousandsSeparator");
      if(typeof decimalSeparator === "string") {
        assert(decimalSeparator.length === 1, message(1002));
        var separator = decimalSeparator;
        if(thousandsSeparators instanceof Array && indexOf(thousandsSeparators, separator) >= 0) {
          assert(false, message(1008, [separator]))
        }
        return ch === separator
      }
      if(decimalSeparator instanceof Array) {
        forEach(decimalSeparator, function(separator) {
          if(thousandsSeparators instanceof Array && indexOf(thousandsSeparators, separator) >= 0) {
            assert(false, message(1008, [separator]))
          }
        });
        return indexOf(decimalSeparator, ch) >= 0
      }
      return ch === "."
    }
    function numberNode(n0, doScale, roundOnly) {
      var ignoreTrailingZeros = Model.option("ignoreTrailingZeros");
      var n1 = n0.toString();
      var n2 = "";
      var i, ch;
      var lastSeparatorIndex, lastSignificantIndex;
      var separatorCount = 0;
      var numberFormat = "integer";
      var hasLeadingZero, hasTrailingZero;
      if(n0 === ".") {
        assert(false, message(1004, [n0, n0.charCodeAt(0)]))
      }
      for(i = 0;i < n1.length;i++) {
        if(matchThousandsSeparator(ch = n1.charAt(i))) {
          if(separatorCount && lastSeparatorIndex !== i - 4 || !separatorCount && i > 4) {
            assert(false, message(1005))
          }
          lastSeparatorIndex = i;
          separatorCount++
        }else {
          if(matchDecimalSeparator(ch)) {
            if(numberFormat === "decimal") {
              assert(false, message(1007, [ch, n2 + ch]))
            }
            ch = ".";
            numberFormat = "decimal";
            if(separatorCount && lastSeparatorIndex !== i - 4) {
              assert(false, message(1005))
            }
            if(n2 === "0") {
              hasLeadingZero = true
            }
            lastSignificantIndex = n2.length;
            lastSeparatorIndex = i;
            separatorCount++
          }else {
            if(numberFormat === "decimal") {
              if(ch !== "0") {
                lastSignificantIndex = n2.length
              }
            }
          }
          n2 += ch
        }
      }
      if(numberFormat !== "decimal" && (lastSeparatorIndex && lastSeparatorIndex !== i - 4)) {
        assert(false, message(1005))
      }
      if(lastSignificantIndex !== undefined) {
        if(lastSignificantIndex + 1 < n2.length) {
          hasTrailingZero = true
        }
        if(ignoreTrailingZeros) {
          n2 = n2.substring(0, lastSignificantIndex + 1);
          if(n2 === ".") {
            n2 = "0"
          }
        }
      }
      n2 = new BigDecimal(n2);
      if(doScale) {
        var scale = option("decimalPlaces");
        if(!roundOnly || n2.scale() > scale) {
          n2 = n2.setScale(scale, BigDecimal.ROUND_HALF_UP)
        }
      }
      return{op:Model.NUM, args:[String(n2)], hasThousandsSeparator:separatorCount !== 0, numberFormat:numberFormat, hasLeadingZero:hasLeadingZero, hasTrailingZero:hasTrailingZero}
    }
    function multiplyNode(args, flatten) {
      if(args.length === 0) {
        args = [nodeOne]
      }
      return binaryNode(Model.MUL, args, flatten)
    }
    function fractionNode(n, d) {
      return multiplyNode([n, binaryNode(Model.POW, [d, nodeMinusOne])], true)
    }
    function unaryNode(op, args) {
      assert(args.length === 1, "1000: Wrong number of arguments for unary node");
      return newNode(op, args)
    }
    function binaryNode(op, args, flatten) {
      assert(args.length > 0, "1000: Too few argument for binary node");
      if(args.length < 2) {
        return args[0]
      }
      var aa = [];
      forEach(args, function(n) {
        if(flatten && n.op === op) {
          aa = aa.concat(n.args)
        }else {
          aa.push(n)
        }
      });
      return newNode(op, aa)
    }
    var nodeOne = numberNode("1");
    var nodeMinusOne = unaryNode(Model.SUB, [numberNode("1")]);
    var nodeNone = newNode(Model.NONE, [numberNode("0")]);
    var nodeEmpty = newNode(Model.VAR, ["0"]);
    var lexemeT0, lexemeT1;
    var scan = scanner(src);
    function start(options) {
      T0 = scan.start(options);
      lexemeT0 = scan.lexeme()
    }
    function hd() {
      return T0
    }
    function lexeme() {
      assert(lexemeT0 !== undefined, "1000: Lexeme for token is missing");
      return lexemeT0
    }
    function next(options) {
      if(T1 === TK_NONE) {
        T0 = scan.start(options);
        lexemeT0 = scan.lexeme()
      }else {
        T0 = T1;
        lexemeT0 = lexemeT1;
        T1 = TK_NONE
      }
    }
    function lookahead(options) {
      if(T1 === TK_NONE) {
        T1 = scan.start(options);
        lexemeT1 = scan.lexeme()
      }
      return T1
    }
    function eat(tc, options) {
      var tk = hd();
      if(tk !== tc) {
        var expected = String.fromCharCode(tc);
        var found = tk ? String.fromCharCode(tk) : "EOS";
        assert(false, message(1001, [expected, found]))
      }
      next(options)
    }
    function isSimpleFraction(node) {
      if(node.op === Model.FRAC) {
        var n0 = node.args[0];
        var n1 = node.args[1];
        return n0.op === Model.NUM && (n0.numberFormat === "integer" && (n1.op === Model.NUM && n1.numberFormat === "integer"))
      }
      return false
    }
    function isProperFraction(node) {
      if(node.op === Model.FRAC) {
        var n0 = node.args[0];
        var n1 = node.args[1];
        return n0.op === Model.NUM && (n0.numberFormat === "integer" && (n1.op === Model.NUM && (n1.numberFormat === "integer" && +n0.args[0] < n1.args[0])))
      }
      return false
    }
    function isMinusOne(node) {
      return node.op === Model.SUB && (node.args.length === 1 && (node.args[0].op === Model.NUM && (node.args[0].args.length === 1 && node.args[0].args[0] === "1")))
    }
    function isUnit(node) {
      var env = Model.env;
      if(node.op === Model.POW) {
        return isInteger(node.args[1]) && isUnit(node.args[0])
      }
      return node.op === Model.VAR && (node.args.length === 1 && (env[node.args[0]] && env[node.args[0]].type === "unit"))
    }
    function foldUnit(n, u) {
      if(n.op === Model.POW) {
        var b = n.args[0];
        var e = n.args[1];
        return binaryNode(Model.POW, [binaryNode(Model.MUL, [b, u]), e])
      }else {
        if(n.op === Model.FRAC && n.isSlash) {
          var nu = n.args[0];
          var d = n.args[1];
          return binaryNode(Model.FRAC, [nu, binaryNode(Model.MUL, [d, u])])
        }
      }
      return binaryNode(Model.MUL, [n, u])
    }
    function primaryExpr() {
      var e;
      var tk;
      var op;
      switch(tk = hd()) {
        case CC_CONST:
        ;
        case TK_VAR:
          var args = [lexeme()];
          next();
          e = newNode(Model.VAR, args);
          if(isChemCore()) {
            if(hd() === TK_LEFTBRACE && lookahead() === TK_RIGHTBRACE) {
              eat(TK_LEFTBRACE);
              eat(TK_RIGHTBRACE)
            }
          }
          break;
        case TK_NUM:
          e = numberNode(lexeme());
          next();
          break;
        case TK_LEFTBRACKET:
        ;
        case TK_LEFTPAREN:
          e = parenExpr(tk);
          break;
        case TK_RIGHTBRACKET:
          if(Model.option("allowInterval") && !inParenExpr) {
            e = parenExpr(tk)
          }else {
            e = nodeEmpty
          }
          break;
        case TK_LEFTBRACE:
          e = braceExpr();
          break;
        case TK_BEGIN:
          next();
          var figure = braceExpr();
          var tbl = matrixExpr();
          eat(TK_END);
          braceExpr();
          if(indexOf(figure.args[0], "matrix") >= 0) {
            e = newNode(Model.MATRIX, [tbl])
          }else {
            assert(false, "1000: Unrecognized LaTeX name")
          }
          break;
        case TK_VERTICALBAR:
          e = absExpr();
          break;
        case TK_ABS:
          next();
          var e = unaryNode(Model.ABS, [braceExpr()]);
          break;
        case TK_FRAC:
          next();
          var expr1 = braceExpr();
          var expr2 = braceExpr();
          expr1 = expr1.args.length === 0 ? newNode(Model.COMMA, [nodeNone]) : expr1;
          expr2 = expr1.args.length === 0 ? newNode(Model.COMMA, [nodeNone]) : expr2;
          e = newNode(Model.FRAC, [expr1, expr2]);
          e.isFraction = isSimpleFraction(e);
          break;
        case TK_BINOM:
          next();
          var n = braceExpr();
          var k = braceExpr();
          var num = unaryNode(Model.FACT, [n]);
          var den = binaryNode(Model.POW, [binaryNode(Model.MUL, [unaryNode(Model.FACT, [k]), unaryNode(Model.FACT, [binaryNode(Model.ADD, [n, negate(k)])])]), nodeMinusOne]);
          e = binaryNode(Model.MUL, [num, den]);
          e.isBinomial = true;
          break;
        case TK_SQRT:
          next();
          switch(hd()) {
            case TK_LEFTBRACKET:
              var root = bracketExpr();
              var base = braceExpr();
              e = newNode(Model.POW, [base, newNode(Model.POW, [root, nodeMinusOne])]);
              break;
            case TK_LEFTBRACE:
              var base = braceExpr();
              e = newNode(Model.POW, [base, newNode(Model.POW, [newNode(Model.NUM, ["2"]), nodeMinusOne])]);
              break;
            default:
              assert(false, message(1001, ["{ or (", String.fromCharCode(hd())]));
              break
          }
          break;
        case TK_VEC:
          next();
          var name = braceExpr();
          e = newNode(Model.VEC, [name]);
          break;
        case TK_SIN:
        ;
        case TK_COS:
        ;
        case TK_TAN:
        ;
        case TK_SEC:
        ;
        case TK_COT:
        ;
        case TK_CSC:
        ;
        case TK_SINH:
        ;
        case TK_COSH:
        ;
        case TK_TANH:
        ;
        case TK_SECH:
        ;
        case TK_COTH:
        ;
        case TK_CSCH:
          next();
          var t, args = [];
          while((t = hd()) === TK_CARET) {
            next({oneCharToken:true});
            args.push(unaryExpr())
          }
          if(args.length === 1 && isMinusOne(args[0])) {
            op = "arc" + tokenToOperator[tk];
            args = []
          }else {
            op = tokenToOperator[tk]
          }
          args.unshift(newNode(op, [postfixExpr()]));
          if(args.length > 1) {
            return newNode(Model.POW, args)
          }else {
            return args[0]
          }
          break;
        case TK_ARCSIN:
        ;
        case TK_ARCCOS:
        ;
        case TK_ARCTAN:
        ;
        case TK_ARCSEC:
        ;
        case TK_ARCCSC:
        ;
        case TK_ARCCOT:
        ;
        case TK_ARCSINH:
        ;
        case TK_ARCCOSH:
        ;
        case TK_ARCTANH:
        ;
        case TK_ARCSECH:
        ;
        case TK_ARCCSCH:
        ;
        case TK_ARCCOTH:
          next();
          var t, args = [];
          while((t = hd()) === TK_CARET) {
            next({oneCharToken:true});
            args.push(unaryExpr())
          }
          args.unshift(newNode(tokenToOperator[tk], [primaryExpr()]));
          if(args.length > 1) {
            return newNode(Model.POW, args)
          }else {
            return args[0]
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
          var t, args = [];
          if((t = hd()) === TK_UNDERSCORE) {
            next({oneCharToken:true});
            args.push(primaryExpr())
          }else {
            args.push(newNode(Model.NUM, ["10"]))
          }
          args.push(primaryExpr());
          return newNode(Model.LOG, args);
          break;
        case TK_LIM:
          return limitExpr();
        case TK_INT:
          return integralExpr();
        case TK_SUM:
        ;
        case TK_PROD:
          next();
          var t, args = [];
          if(hd() === TK_UNDERSCORE) {
            next({oneCharToken:true});
            args.push(primaryExpr());
            eat(TK_CARET, {oneCharToken:true});
            args.push(primaryExpr())
          }
          args.push(commaExpr());
          return newNode(tokenToOperator[tk], args);
        case TK_EXISTS:
          next();
          return newNode(Model.EXISTS, [equalExpr()]);
        case TK_FORALL:
          next();
          return newNode(Model.FORALL, [commaExpr()]);
        case TK_EXP:
          next();
          return newNode(Model.EXP, [additiveExpr()]);
        case TK_M:
          next();
          return newNode(Model.M, [multiplicativeExpr()]);
        case TK_FORMAT:
          next();
          return newNode(Model.FORMAT, [braceExpr()]);
        case TK_OVERLINE:
          next();
          return newNode(Model.OVERLINE, [braceExpr()]);
        case TK_DOT:
          next();
          return newNode(Model.DOT, [braceExpr()]);
        case TK_OVERSET:
        ;
        case TK_UNDERSET:
          next();
          var expr1 = braceExpr();
          var expr2 = braceExpr();
          expr2.args.push(newNode(tokenToOperator[tk], [expr1]));
          return expr2;
        case TK_MATHBF:
          next();
          var expr1 = braceExpr();
          return expr1;
        case TK_DELTA:
          next();
          if(hd() === TK_VAR) {
            var name = lexeme();
            next();
            return newNode(Model.VAR, ["delta_" + name])
          }
          break;
        default:
          assert(!Model.option("strict"), message(1006, [tokenToOperator[tk]]));
          e = nodeEmpty;
          break
      }
      return e
    }
    function matrixExpr() {
      var args = [];
      var node, t;
      args.push(rowExpr());
      while((t = hd()) === TK_NEWROW) {
        next();
        args.push(rowExpr())
      }
      return newNode(tokenToOperator[TK_NEWROW], args)
    }
    function rowExpr() {
      var args = [];
      var t;
      args.push(equalExpr());
      while((t = hd()) === TK_NEWCOL) {
        next();
        args.push(equalExpr())
      }
      return newNode(tokenToOperator[TK_NEWCOL], args)
    }
    var pipeTokenCount = 0;
    function absExpr() {
      pipeTokenCount++;
      eat(TK_VERTICALBAR);
      var e = additiveExpr();
      eat(TK_VERTICALBAR);
      pipeTokenCount--;
      return unaryNode(Model.ABS, [e])
    }
    function braceExpr() {
      var e;
      eat(TK_LEFTBRACE);
      if(hd() === TK_RIGHTBRACE) {
        eat(TK_RIGHTBRACE);
        e = newNode(Model.COMMA, [])
      }else {
        e = commaExpr();
        eat(TK_RIGHTBRACE)
      }
      e.lbrk = TK_LEFTBRACE;
      e.rbrk = TK_RIGHTBRACE;
      return e
    }
    var bracketTokenCount = 0;
    function bracketExpr() {
      bracketTokenCount++;
      eat(TK_LEFTBRACKET);
      var e = commaExpr();
      eat(TK_RIGHTBRACKET);
      bracketTokenCount--;
      return e
    }
    var inParenExpr;
    function parenExpr(tk) {
      var e;
      var tk2;
      var allowInterval = Model.option("allowInterval");
      bracketTokenCount++;
      eat(tk);
      if(hd() === TK_RIGHTPAREN || hd() === TK_RIGHTBRACKET) {
        eat(tk2 = tk === TK_LEFTPAREN ? TK_RIGHTPAREN : TK_RIGHTBRACKET);
        e = newNode(Model.COMMA, [])
      }else {
        inParenExpr = true;
        var allowSemicolon = allowInterval;
        e = commaExpr(allowSemicolon);
        if(allowInterval) {
          eat(tk2 = hd() === TK_RIGHTPAREN ? TK_RIGHTPAREN : hd() === TK_LEFTBRACKET ? TK_LEFTBRACKET : TK_RIGHTBRACKET)
        }else {
          eat(tk2 = tk === TK_LEFTPAREN ? TK_RIGHTPAREN : TK_RIGHTBRACKET)
        }
      }
      e.lbrk = tk = tk === TK_RIGHTBRACKET ? TK_LEFTPAREN : tk;
      e.rbrk = tk2 = tk2 === TK_LEFTBRACKET ? TK_RIGHTPAREN : tk2;
      if(allowInterval && (e.args.length === 2 && ((tk === TK_LEFTPAREN || (tk === TK_LEFTBRACKET || tk === TK_RIGHTBRACKET)) && (tk2 === TK_RIGHTPAREN || (tk2 === TK_RIGHTBRACKET || tk2 === TK_LEFTBRACKET))))) {
        e.op = Model.INTERVAL;
        e.args.push(numberNode(tk));
        e.args.push(numberNode(tk2));
        e = newNode(Model.PAREN, [e])
      }else {
        if(e.op === Model.COMMA) {
          assert(tk === TK_LEFTPAREN && tk2 === TK_RIGHTPAREN || tk === TK_LEFTBRACKET && tk2 === TK_RIGHTBRACKET, message(1011));
          e.op = Model.LIST;
          e = newNode(Model.PAREN, [e])
        }
      }
      bracketTokenCount--;
      inParenExpr = false;
      e.lbrk = tk;
      e.rbrk = tk2;
      return e
    }
    function exponentialExpr() {
      var t, args = [primaryExpr()];
      while((t = hd()) === TK_CARET) {
        next({oneCharToken:true});
        var t;
        if((isMathSymbol(args[0]) || isChemCore()) && ((t = hd()) === TK_ADD || t === TK_SUB)) {
          next();
          args.push(unaryNode(tokenToOperator[t], [nodeOne]))
        }else {
          var n = unaryExpr();
          if(n.op === Model.VAR && n.args[0] === "\\circ") {
            if(hd() === TK_VAR && lexeme() === "K" || (lexeme() === "C" || lexeme() === "F")) {
              n = multiplyNode([args.pop(), unaryNode(Model.VAR, ["\\degree " + lexeme()])]);
              next()
            }else {
              n = multiplyNode([args.pop(), unaryNode(Model.VAR, ["\\degree"])])
            }
            args.push(n)
          }else {
            args.push(n)
          }
        }
      }
      if(args.length > 1) {
        var expo = args.pop();
        forEach(args.reverse(), function(base) {
          expo = newNode(Model.POW, [base, expo])
        });
        return expo
      }else {
        return args[0]
      }
    }
    function postfixExpr() {
      var t;
      var expr = exponentialExpr();
      switch(t = hd()) {
        case TK_PERCENT:
          next();
          expr = newNode(Model.PERCENT, [expr]);
          break;
        case TK_BANG:
          next();
          expr = newNode(Model.FACT, [expr]);
          break;
        default:
          if(t === TK_VAR && lexeme() === "\\degree") {
            next();
            if(hd() === TK_VAR && (lexeme() === "K" || (lexeme() === "C" || lexeme() === "F"))) {
              expr = multiplyNode([expr, unaryNode(Model.VAR, ["\\degree " + lexeme()])]);
              next()
            }else {
              expr = multiplyNode([expr, unaryNode(Model.VAR, ["\\degree"])])
            }
          }else {
            if(isChemCore() && ((t === TK_ADD || t === TK_SUB) && lookahead() === TK_RIGHTBRACE)) {
              next();
              expr = unaryNode(tokenToOperator[t], [expr])
            }
          }
          break
      }
      return expr
    }
    function unaryExpr() {
      var t;
      var expr;
      switch(t = hd()) {
        case TK_ADD:
          next();
          expr = newNode(Model.ADD, [unaryExpr()]);
          break;
        case TK_SUB:
          next();
          expr = newNode(Model.SUB, [unaryExpr()]);
          break;
        case TK_PM:
          next();
          expr = unaryExpr();
          expr = newNode(tokenToOperator[t], [expr]);
          break;
        case TK_UNDERSCORE:
          var op = tokenToOperator[t];
          next({oneCharToken:true});
          if((t = hd()) === TK_ADD || t === TK_SUB) {
            next();
            expr = nodeOne
          }else {
            expr = unaryExpr()
          }
          expr = newNode(op, [expr]);
          if((t = hd()) === TK_CARET) {
            var args = [expr];
            var op = tokenToOperator[t];
            next({oneCharToken:true});
            if((t = hd()) === TK_ADD || t === TK_SUB) {
              next();
              expr = nodeOne
            }else {
              expr = unaryExpr()
            }
            args.push(expr);
            expr = newNode(op, args)
          }
          break;
        case TK_CARET:
          var op = tokenToOperator[t];
          next({oneCharToken:true});
          if((t = hd()) === TK_ADD || t === TK_SUB) {
            next();
            expr = nodeOne
          }else {
            expr = unaryExpr()
          }
          expr = newNode(op, [expr]);
          break;
        default:
          if(t === TK_VAR && lexeme() === "$") {
            next();
            if((t = hd()) && (t !== TK_RIGHTBRACE && t !== TK_SLASH)) {
              expr = multiplyNode([newNode(Model.VAR, ["$"]), postfixExpr()])
            }else {
              expr = newNode(Model.VAR, ["$"])
            }
          }else {
            expr = postfixExpr()
          }
          break
      }
      return expr
    }
    function subscriptExpr() {
      var t, args = [unaryExpr()];
      if((t = hd()) === TK_UNDERSCORE) {
        next({oneCharToken:true});
        args.push(exponentialExpr());
        if(isChemCore()) {
          if(hd() === TK_LEFTBRACE) {
            eat(TK_LEFTBRACE);
            eat(TK_RIGHTBRACE)
          }
        }
      }
      if(args.length > 1) {
        return newNode(Model.SUBSCRIPT, args)
      }else {
        return args[0]
      }
    }
    function fractionExpr() {
      var t, node = subscriptExpr();
      if(isNumber(node) && (hd() === TK_FRAC || hd() === TK_NUM && lookahead() === TK_SLASH)) {
        var frac = fractionExpr();
        if(isMixedNumber(node, frac)) {
          if(isNeg(node)) {
            frac = binaryNode(Model.MUL, [nodeMinusOne, frac])
          }
          node = binaryNode(Model.ADD, [node, frac]);
          node.isMixedNumber = true
        }else {
          node = binaryNode(Model.MUL, [node, frac]);
          frac.isImplicit = true
        }
      }
      while((t = hd()) === TK_SLASH) {
        next();
        node = newNode(Model.FRAC, [node, subscriptExpr()]);
        node.isFraction = isSimpleFraction(node);
        node.isSlash = true
      }
      return node
    }
    function isChemSymbol(n) {
      var id;
      if(n.op === Model.VAR) {
        id = n.args[0]
      }else {
        if(n.op === Model.POW) {
          id = n.args[0].args[0]
        }else {
          return false
        }
      }
      var sym = Model.env[id];
      return sym && sym.mass ? true : false
    }
    function isMathSymbol(n) {
      if(n.op !== Model.VAR) {
        return false
      }
      var sym = Model.env[n.args[0]];
      return sym && sym.name ? true : false
    }
    function isVar(n, id) {
      assert(typeof id === "undefined" || typeof id === "string", "1000: Invalid id");
      if(n.op === Model.VAR) {
        return id === undefined ? true : n.args[0] === id
      }else {
        if(n.op === Model.POW && (isVar(n.args[0]) && isInteger(n.args[1]))) {
          return id === undefined ? true : n.args[0].args[0] === id
        }
      }
      return false
    }
    function isOneOrMinusOne(node) {
      return isOne(node) || isMinusOne(node)
    }
    function isOne(node) {
      return node.op === Model.NUM && node.args[0] === "1"
    }
    function isMinusOne(node) {
      return node.op === Model.SUB && (node.args.length === 1 && isOne(node.args[0]))
    }
    function isDerivative(n) {
      if(n.op !== Model.FRAC) {
        return
      }
      var numer = n.args[0];
      var numerHead = numer.op === Model.MUL && (numer.args[0].op === Model.VAR && numer.args[0].args[0]) || (numer.op === Model.VAR && numer.args[0] || numer.op === Model.POW && (numer.args[0].op === Model.VAR && numer.args[0].args[0]));
      var denom = n.args[1];
      var denomHead = denom.op === Model.MUL && (denom.args[0].op === Model.VAR && denom.args[0].args[0]);
      return numerHead === "d" && (denomHead === "d" && (denom.args[1] && denom.args[1].op === Model.VAR || denom.args[1] && (denom.args[1].op === Model.POW && (denom.args[1].args[0] && denom.args[1].args[0].op === Model.VAR))))
    }
    function derivativeExpr(node) {
      if(node.op !== Model.FRAC) {
        return
      }
      var numer = node.args[0];
      var denom = node.args[1];
      var n = numer.op === Model.MUL && (numer.args.slice(1).length > 0 && multiplyNode(numer.args.slice(1))) || nodeOne;
      assert(denom.args.length === 2);
      var arg = denom.args[1];
      var sym = arg.op === Model.POW && arg.args[0] || arg;
      var order = arg.op === Model.POW && arg.args[1] || nodeOne;
      return newNode(Model.DERIV, [n, sym, order])
    }
    function multiplicativeExpr() {
      var t, expr, explicitOperator = false, prevExplicitOperator, isFraction, args = [];
      var n0;
      expr = fractionExpr();
      if(isDerivative(expr)) {
        expr = derivativeExpr(expr)
      }
      if(expr.op === Model.MUL && !expr.isBinomial) {
        args = expr.args
      }else {
        args = [expr]
      }
      var loopCount = 0;
      while((t = hd()) && (!isAdditive(t) && (!isRelational(t) && (t !== TK_COMMA && (t !== TK_SEMICOLON && (!isEquality(t) && (t !== TK_RIGHTBRACE && (t !== TK_RIGHTPAREN && (!((t === TK_LEFTBRACKET || t === TK_RIGHTBRACKET) && bracketTokenCount > 0) && (t !== TK_RIGHTARROW && (t !== TK_LT && (!(t === TK_VERTICALBAR && pipeTokenCount > 0) && (t !== TK_NEWROW && (t !== TK_NEWCOL && t !== TK_END)))))))))))))) {
        if(isDerivative(expr)) {
          expr.isDerivative = true
        }
        prevExplicitOperator = explicitOperator;
        explicitOperator = false;
        if(isMultiplicative(t)) {
          next();
          explicitOperator = true
        }
        expr = fractionExpr();
        if(isDerivative(expr)) {
          expr = derivativeExpr(expr)
        }
        if(t === TK_DIV) {
          expr = newNode(Model.POW, [expr, nodeMinusOne])
        }
        assert(explicitOperator || (args.length === 0 || (expr.lbrk || (args[args.length - 1].op !== Model.NUM || (args[args.length - 1].lbrk || (isRepeatingDecimal([args[args.length - 1], expr]) || expr.op !== Model.NUM))))), message(1010));
        if(isChemCore() && (t === TK_LEFTPAREN && isVar(args[args.length - 1], "M"))) {
          args.pop();
          expr = unaryNode(Model.M, [expr])
        }else {
          if(!explicitOperator) {
            if(args.length > 0 && isMixedNumber(args[args.length - 1], expr)) {
              t = args.pop();
              if(isNeg(t)) {
                expr = binaryNode(Model.MUL, [nodeMinusOne, expr])
              }
              expr = binaryNode(Model.ADD, [t, expr]);
              expr.isMixedNumber = true
            }else {
              if(Model.option("ignoreCoefficientOne") && (args.length === 1 && (isOneOrMinusOne(args[0]) && isPolynomialTerm(args[0], expr)))) {
                if(isOne(args[0])) {
                  args.pop()
                }else {
                  expr = negate(expr)
                }
              }else {
                if(args.length > 0 && (n0 = isRepeatingDecimal([args[args.length - 1], expr]))) {
                  args.pop();
                  expr = n0
                }else {
                  if(isENotation(args, expr)) {
                    var tmp = args.pop();
                    expr = binaryNode(Model.POW, [numberNode("10"), unaryExpr()]);
                    expr = binaryNode(Model.MUL, [tmp, expr]);
                    expr.isScientific = true
                  }else {
                    if(!isChemCore() && isPolynomialTerm(args[args.length - 1], expr)) {
                      expr.isPolynomial = true;
                      var t = args.pop();
                      if(!t.isPolynomial) {
                        if(t.op === Model.MUL && t.args[t.args.length - 1].isPolynomial) {
                          assert(t.args.length === 2);
                          var prefix = t.args[0];
                          var suffix = t.args[1];
                          expr.isPolynomial = suffix.isPolynomial = false;
                          expr.isImplicit = true;
                          expr = binaryNode(Model.MUL, [prefix, binaryNode(Model.MUL, [suffix, expr], true)]);
                          expr.args[1].isPolynomial = true;
                          expr.args[1].isImplicit = true
                        }else {
                          expr = binaryNode(Model.MUL, [t, expr])
                        }
                        expr.isImplicit = t.isImplicit;
                        t.isImplicit = undefined
                      }
                    }else {
                      if(args[args.length - 1].op === Model.DERIV) {
                        var arg = args.pop();
                        var e = arg.args[0];
                        var e = isOne(e) && expr || multiplyNode([e, expr]);
                        expr = newNode(Model.DERIV, [e].concat(arg.args.slice(1)))
                      }else {
                        expr.isImplicit = true
                      }
                    }
                  }
                }
              }
            }
          }else {
            if(t === TK_MUL && (args.length > 0 && isScientific([args[args.length - 1], expr]))) {
              t = args.pop();
              expr = binaryNode(Model.MUL, [t, expr]);
              expr.isScientific = true
            }
          }
        }
        if(expr.op === Model.MUL && (!expr.isScientific && (!expr.isBinomial && (args.length && (!args[args.length - 1].isImplicit && (!args[args.length - 1].isPolynomial && (expr.isImplicit && expr.isPolynomial))))))) {
          args = args.concat(expr.args)
        }else {
          args.push(expr)
        }
        assert(loopCount++ < 1E3, "1000: Stuck in loop in mutliplicativeExpr()")
      }
      if(args.length > 1) {
        return trimEmptyBraces(multiplyNode(args))
      }else {
        return args[0]
      }
      function isMultiplicative(t) {
        return t === TK_MUL || (t === TK_DIV || t === TK_SLASH)
      }
    }
    function trimEmptyBraces(node) {
      assert(node.op === Model.MUL, "1000: Internal error");
      var args = node.args;
      if(args[0].op === Model.COMMA && args[0].args.length === 0) {
        args = args.slice(1, args.length);
        args[0].isImplicit = false
      }
      if(args[args.length - 1].op === Model.COMMA && args[args.length - 1].args.length === 0) {
        args = args.slice(0, args.length - 1)
      }
      return newNode(node.op, args)
    }
    function isNumber(n) {
      if((n.op === Model.SUB || n.op === Model.ADD) && n.args.length === 1) {
        n = n.args[0]
      }
      if(n.op === Model.NUM) {
        return n
      }
      return false
    }
    function isMixedNumber(n0, n1) {
      if(n0.op === Model.SUB && n0.args.length === 1) {
        n0 = n0.args[0]
      }
      if(!n0.lbrk && (!n1.lbrk && (n0.op === Model.NUM && isProperFraction(n1)))) {
        return true
      }
      return false
    }
    function isPolynomialTerm(n0, n1) {
      if(n0.op === Model.SUB && n0.args.length === 1) {
        n0 = n0.args[0]
      }
      if(!n0.lbrk && (!n1.lbrk && (n0.op === Model.NUM && isVar(n1) || (isVar(n0) && n1.op === Model.NUM || (n0.op === Model.NUM && n1.op === Model.NUM || n0.op === Model.MUL && (n0.args[n0.args.length - 1].isPolynomial && isVar(n1))))))) {
        return true
      }
      return false
    }
    function isInteger(node) {
      var mv;
      if(!node) {
        return false
      }
      if(node.op === Model.SUB && node.args.length === 1) {
        node = node.args[0]
      }
      if(node.op === Model.NUM && ((mv = new BigDecimal(node.args[0])) && isInteger(mv))) {
        return true
      }else {
        if(node instanceof BigDecimal) {
          return node.remainder(bigOne).compareTo(bigZero) === 0
        }
      }
      return false
    }
    var bigZero = new BigDecimal("0");
    var bigOne = new BigDecimal("1");
    function isRepeatingDecimal(args) {
      var expr, n0, n1;
      if(args[0].isRepeating === Model.DOT) {
        var n = args[0].op === Model.ADD && args[0].args[1].op === Model.NUM ? args[0].args[1] : args[0];
        assert(n.op === Model.NUM, "1000: Expecting a number");
        var arg1;
        if(args[1].op === Model.DOT) {
          assert(args[1].args[0].op === Model.NUM, "1000: Expecting a number");
          arg1 = numberNode(n.args[0] + args[1].args[0].args[0])
        }else {
          assert(args[1].op === Model.NUM, "1000: Expecting a number");
          arg1 = numberNode(n.args[0] + args[1].args[0])
        }
        arg1.isRepeating = Model.DOT;
        if(args[0].op === Model.ADD) {
          args[0].args[1] = arg1;
          expr = args[0]
        }else {
          expr = arg1
        }
      }else {
        if(!args[0].lbrk && (args[0].op === Model.NUM && args[0].numberFormat === "decimal")) {
          if(args[1].lbrk === 40 && isInteger(args[1])) {
            n0 = args[0];
            n1 = args[1]
          }else {
            if(!args[1].lbrk && args[1].op === Model.OVERLINE) {
              n0 = args[0];
              n1 = args[1].args[0]
            }else {
              if(!args[1].lbrk && args[1].op === Model.DOT) {
                n0 = args[0];
                n1 = args[1].args[0]
              }else {
                return null
              }
            }
          }
          n1 = numberNode("." + n1.args[0]);
          n1.isRepeating = args[1].op;
          if(indexOf(n0.args[0], ".") >= 0) {
            var decimalPlaces = n0.args[0].length - indexOf(n0.args[0], ".") - 1;
            n1 = multiplyNode([n1, binaryNode(Model.POW, [numberNode("10"), numberNode("-" + decimalPlaces)])])
          }
          if(n0.op === Model.NUM && +n0.args[0] === 0) {
            expr = n1
          }else {
            expr = binaryNode(Model.ADD, [n0, n1])
          }
          expr.numberFormat = "decimal";
          expr.isRepeating = args[1].op
        }else {
          expr = null
        }
      }
      return expr
    }
    function isENotation(args, expr, t) {
      var n;
      var eulers = Model.option("allowEulersNumber");
      if(args.length > 0 && (isNumber(args[args.length - 1]) && (expr.op === Model.VAR && ((expr.args[0] === "E" || expr.args[0] === "e" && !eulers) && (hd() === TK_NUM || (hd() === 45 || hd() === 43) && lookahead() === TK_NUM))))) {
        return true
      }
      return false
    }
    function isScientific(args) {
      var n;
      if(args.length === 1) {
        if((n = isNumber(args[0])) && (n.args[0].length === 1 || indexOf(n.args[0], ".") === 1)) {
          return true
        }else {
          if(args[0].op === Model.POW && ((n = isNumber(args[0].args[0])) && (n.args[0] === "10" && isInteger(args[0].args[1])))) {
            return true
          }
        }
        return false
      }else {
        if(args.length === 2) {
          var a = args[0];
          var e = args[1];
          if((n = isNumber(a)) && ((n.args[0].length === 1 || indexOf(n.args[0], ".") === 1) && (e.op === Model.POW && ((n = isNumber(e.args[0])) && (n.args[0] === "10" && isInteger(e.args[1])))))) {
            return true
          }
          return false
        }
      }
    }
    function isNeg(n) {
      if(typeof n === "number") {
        return n < 0
      }else {
        if(n.args.length === 1) {
          return n.op === OpStr.SUB && n.args[0].args[0] > 0 || n.op === Model.NUM && +n.args[0] < 0
        }else {
          if(n.args.length === 2) {
            return n.op === OpStr.MUL && isNeg(n.args[0])
          }
        }
      }
    }
    function negate(n) {
      if(typeof n === "number") {
        return-n
      }else {
        if(n.op === Model.MUL) {
          var args = n.args.slice(0);
          return multiplyNode([negate(args.shift())].concat(args))
        }else {
          if(n.op === Model.POW && isMinusOne(n.args[1])) {
            return binaryNode(Model.POW, [negate(n.args[0]), nodeMinusOne])
          }
        }
      }
      return unaryNode(Model.SUB, [n])
    }
    function isAdditive(t) {
      return t === TK_ADD || (t === TK_SUB || (t === TK_PM || t === TK_BACKSLASH))
    }
    function additiveExpr() {
      var expr = multiplicativeExpr();
      var t;
      while(isAdditive(t = hd())) {
        next();
        var expr2 = multiplicativeExpr();
        switch(t) {
          case TK_BACKSLASH:
            expr = binaryNode(Model.BACKSLASH, [expr, expr2]);
            break;
          case TK_PM:
            expr = binaryNode(Model.PM, [expr, expr2]);
            break;
          case TK_SUB:
            expr = binaryNode(Model.SUB, [expr, expr2]);
            break;
          default:
            expr = binaryNode(Model.ADD, [expr, expr2], true);
            break
        }
      }
      return expr
    }
    function flattenNestedNodes(node) {
      var args = [];
      if(node.op === Model.NUM || node.op === Model.VAR) {
        return node
      }
      forEach(node.args, function(n) {
        n = flattenNestedNodes(n);
        if(n.op === node.op) {
          args = args.concat(n.args)
        }else {
          args.push(n)
        }
      });
      var isMixedNumber = node.isMixedNumber;
      node = newNode(node.op, args);
      node.isMixedNumber = isMixedNumber;
      return node
    }
    function hasDX(node) {
      var len = node.args.length;
      if(node.op === Model.MUL && node.args[len - 1].op === Model.FRAC) {
        node = node.args[len - 1].args[0];
        len = node.args.length
      }else {
        if(node.op === Model.FRAC) {
          node = node.args[0]
        }
      }
      var dvar = node.args[len - 2];
      var ivar = node.args[len - 1];
      return node && (node.op === Model.MUL && (dvar.op === Model.VAR && (dvar.args[0] === "d" && (ivar.op === Model.VAR && ivar)))) || null
    }
    function stripDX(node) {
      assert(node.op === Model.MUL || node.op === Model.FRAC);
      var nodeLast = node.args[node.args.length - 1];
      if(node.op === Model.MUL && nodeLast.op === Model.FRAC) {
        nodeLast = fractionNode(multiplyNode(nodeLast.args.slice(0, nodeLast.args[0].args.length - 2)), nodeLast.args[1]);
        node = multiplyNode(node.args.slice(0, node.args.length - 1).concat(nodeLast))
      }else {
        if(node.op === Model.FRAC) {
          node = fractionNode(multiplyNode(node.args.slice(0, node.args[0].args.length - 2)), node.args[1])
        }else {
          node = multiplyNode(node.args.slice(0, node.args.length - 2))
        }
      }
      return node
    }
    function integralExpr() {
      eat(TK_INT);
      var args = [];
      if(hd() === TK_UNDERSCORE) {
        next({oneCharToken:true});
        args.push(primaryExpr());
        if(hd() === TK_CARET) {
          eat(TK_CARET, {oneCharToken:true});
          args.push(primaryExpr())
        }
      }
      var expr;
      if(hd() === TK_INT) {
        expr = integralExpr()
      }else {
        expr = flattenNestedNodes(multiplicativeExpr());
        var t;
        var dx = hasDX(expr);
        expr = dx && stripDX(expr) || expr;
        while(isAdditive(t = hd()) && !dx) {
          next();
          var expr2 = multiplicativeExpr();
          dx = hasDX(expr2);
          expr2 = dx && stripDX(expr2) || expr2;
          switch(t) {
            case TK_SUB:
              expr = binaryNode(Model.SUB, [expr, expr2]);
              break;
            default:
              expr = binaryNode(Model.ADD, [expr, expr2], true);
              break
          }
        }
      }
      args.push(expr);
      args.push(dx || nodeEmpty);
      return newNode(Model.INTEGRAL, args)
    }
    function limitExpr() {
      eat(TK_LIM);
      var args = [];
      if(hd() === TK_UNDERSCORE) {
        next({oneCharToken:true});
        args.push(primaryExpr())
      }
      args.push(multiplicativeExpr());
      return newNode(Model.LIM, args)
    }
    function isRelational(t) {
      return t === TK_LT || (t === TK_LE || (t === TK_GT || (t === TK_GE || (t === TK_NGTR || (t === TK_NLESS || (t === TK_IN || (t === TK_TO || (t === TK_COLON || t === TK_VAR && lexeme() === "to"))))))))
    }
    function relationalExpr() {
      var t = hd();
      var expr = additiveExpr();
      var args = [];
      while(isRelational(t = hd())) {
        if(t === TK_VAR && lexeme() === "to") {
          t = TK_COLON
        }
        next();
        var expr2 = additiveExpr();
        expr = newNode(tokenToOperator[t], [expr, expr2]);
        args.push(expr);
        expr = Model.create(expr2)
      }
      if(args.length === 0) {
        return expr
      }else {
        if(args.length === 1) {
          return args[0]
        }else {
          return newNode(Model.COMMA, args)
        }
      }
    }
    function isEquality(t) {
      return t === TK_EQL || (t === TK_NE || t === TK_APPROX)
    }
    function equalExpr() {
      var expr = relationalExpr();
      var t;
      var args = [];
      while(isEquality(t = hd()) || t === TK_RIGHTARROW) {
        next();
        var expr2 = additiveExpr();
        expr = newNode(tokenToOperator[t], [expr, expr2]);
        args.push(expr);
        expr = Model.create(expr2)
      }
      if(args.length === 0) {
        return expr
      }else {
        if(args.length === 1) {
          return args[0]
        }else {
          return newNode(Model.COMMA, args)
        }
      }
    }
    function commaExpr(allowSemicolon) {
      var expr = equalExpr();
      var args = [expr];
      var t;
      while((t = hd()) === TK_COMMA || allowSemicolon && t === TK_SEMICOLON) {
        next();
        args.push(equalExpr())
      }
      if(args.length > 1) {
        return newNode(tokenToOperator[TK_COMMA], args)
      }else {
        return expr
      }
    }
    function tokenize() {
      var args = [];
      start();
      while(hd()) {
        var lex = lexeme();
        args.push(newNode(hd(), lex ? [lex] : []));
        next()
      }
      var node = newNode(Model.COMMA, args);
      return node
    }
    function expr() {
      start();
      if(hd()) {
        var n = commaExpr();
        if(n.op !== Model.COMMA && (n.lbrk === TK_LEFTBRACE && n.rbrk === TK_RIGHTBRACE)) {
          n = newNode(Model.COMMA, [n])
        }
        assert(!hd(), message(1003, [scan.pos(), scan.lexeme(), "'" + src.substring(scan.pos() - 1) + "'"]));
        return n
      }
      return nodeNone
    }
    return{expr:expr, tokenize:tokenize};
    function isInvisibleCharCode(c) {
      return isControlCharCode(c)
    }
    function isWhitespaceCharCode(c) {
      return c === 32 || (c === 9 || (c === 10 || c === 13))
    }
    function isNumberCharCode(c) {
      return c >= 48 && c <= 57
    }
    function isControlCharCode(c) {
      return c >= 1 && c <= 31 || c >= 127 && c <= 159
    }
    function stripInvisible(src) {
      var out = "";
      var c, lastCharCode;
      var curIndex = 0;
      while(curIndex < src.length) {
        while(curIndex < src.length && isInvisibleCharCode(c = src.charCodeAt(curIndex++))) {
          if(lastCharCode === 32) {
            continue
          }
          c = 9;
          lastCharCode = c
        }
        if(c === 92) {
          out += String.fromCharCode(c);
          if(curIndex < src.length) {
            c = src.charCodeAt(curIndex++)
          }
        }else {
          if(c === 9) {
            if(isNumberCharCode(out.charCodeAt(out.length - 1)) && isNumberCharCode(src.charCodeAt(curIndex))) {
              c = src.charCodeAt(curIndex++)
            }
          }
        }
        out += String.fromCharCode(c)
      }
      return out
    }
    function scanner(src) {
      var curIndex = 0;
      var lexeme = "";
      var lexemeToToken = {"\\Delta":TK_DELTA, "\\cdot":TK_MUL, "\\times":TK_MUL, "\\div":TK_DIV, "\\dfrac":TK_FRAC, "\\frac":TK_FRAC, "\\sqrt":TK_SQRT, "\\vec":TK_VEC, "\\pm":TK_PM, "\\sin":TK_SIN, "\\cos":TK_COS, "\\tan":TK_TAN, "\\sec":TK_SEC, "\\cot":TK_COT, "\\csc":TK_CSC, "\\arcsin":TK_ARCSIN, "\\arccos":TK_ARCCOS, "\\arctan":TK_ARCTAN, "\\arcsec":TK_ARCSEC, "\\arccsc":TK_ARCCSC, "\\arccot":TK_ARCCOT, "\\sinh":TK_SINH, "\\cosh":TK_COSH, "\\tanh":TK_TANH, "\\sech":TK_SECH, "\\coth":TK_COTH, 
      "\\csch":TK_CSCH, "\\arcsinh":TK_ARCSINH, "\\arccosh":TK_ARCCOSH, "\\arctanh":TK_ARCTANH, "\\arcsech":TK_ARCSECH, "\\arccsch":TK_ARCCSCH, "\\arccoth":TK_ARCCOTH, "\\ln":TK_LN, "\\lg":TK_LG, "\\log":TK_LOG, "\\left":null, "\\right":null, "\\big":null, "\\Big":null, "\\bigg":null, "\\Bigg":null, "\\ ":null, "\\quad":null, "\\qquad":null, "\\text":TK_TEXT, "\\textrm":TK_TEXT, "\\textit":TK_TEXT, "\\textbf":TK_TEXT, "\\operatorname":TK_OPERATORNAME, "\\lt":TK_LT, "\\le":TK_LE, "\\gt":TK_GT, "\\ge":TK_GE, 
      "\\ne":TK_NE, "\\ngtr":TK_NGTR, "\\nless":TK_NLESS, "\\approx":TK_APPROX, "\\exists":TK_EXISTS, "\\in":TK_IN, "\\forall":TK_FORALL, "\\lim":TK_LIM, "\\exp":TK_EXP, "\\to":TK_TO, "\\sum":TK_SUM, "\\int":TK_INT, "\\prod":TK_PROD, "\\%":TK_PERCENT, "\\rightarrow":TK_RIGHTARROW, "\\longrightarrow":TK_RIGHTARROW, "\\binom":TK_BINOM, "\\begin":TK_BEGIN, "\\end":TK_END, "\\colon":TK_COLON, "\\vert":TK_VERTICALBAR, "\\lvert":TK_VERTICALBAR, "\\rvert":TK_VERTICALBAR, "\\mid":TK_VERTICALBAR, "\\format":TK_FORMAT, 
      "\\overline":TK_OVERLINE, "\\overset":TK_OVERSET, "\\underset":TK_UNDERSET, "\\backslash":TK_BACKSLASH, "\\mathbf":TK_MATHBF, "\\abs":TK_ABS, "\\dot":TK_DOT};
      var unicodeToLaTeX = {8704:"\\forall", 8705:"\\complement", 8706:"\\partial", 8707:"\\exists", 8708:"\\nexists", 8709:"\\varnothing", 8710:"\\triangle", 8711:"\\nabla", 8712:"\\in", 8713:"\\notin", 8714:"\\in", 8715:"\\ni", 8716:"\\notni", 8717:"\\ni", 8718:"\\blacksquare", 8719:"\\sqcap", 8720:"\\amalg", 8721:"\\sigma", 8722:"-", 8723:"\\mp", 8724:"\\dotplus", 8725:"/", 8726:"\\setminus", 8727:"*", 8728:"\\circ", 8729:"\\bullet", 8730:"\\sqrt", 8731:null, 8732:null, 8733:"\\propto", 8734:"\\infty", 
      8735:"\\llcorner", 8736:"\\angle", 8737:"\\measuredangle", 8738:"\\sphericalangle", 8739:"\\divides", 8740:"\\notdivides", 8741:"\\parallel", 8742:"\\nparallel", 8743:"\\wedge", 8744:"\\vee", 8745:"\\cap", 8746:"\\cup", 8747:"\\int", 8748:"\\iint", 8749:"\\iiint", 8750:"\\oint", 8751:"\\oiint", 8752:"\\oiiint", 8753:null, 8754:null, 8755:null, 8756:"\\therefore", 8757:"\\because", 8758:"\\colon", 8759:null, 8760:null, 8761:null, 8762:null, 8763:null, 8764:"\\sim", 8765:"\\backsim", 8766:null, 
      8767:null, 8768:"\\wr", 8769:"\\nsim", 8770:"\\eqsim", 8771:"\\simeq", 8772:null, 8773:"\\cong", 8774:null, 8775:"\\ncong", 8776:"\\approx", 8777:null, 8778:"\\approxeq", 8779:null, 8780:null, 8781:"\\asymp", 8782:"\\Bumpeq", 8783:"\\bumpeq", 8784:"\\doteq", 8785:"\\doteqdot", 8786:"\\fallingdotseq", 8787:"\\risingdotseq", 8788:null, 8789:null, 8790:"\\eqcirc", 8791:"\\circeq", 8792:null, 8793:null, 8794:null, 8795:null, 8796:"\\triangleq", 8797:null, 8798:null, 8799:null, 8800:"\\ne", 8801:"\\equiv", 
      8802:null, 8803:null, 8804:"\\le", 8805:"\\ge", 8806:"\\leqq", 8807:"\\geqq", 8808:"\\lneqq", 8809:"\\gneqq", 8810:"\\ll", 8811:"\\gg", 8812:"\\between", 8813:null, 8814:"\\nless", 8815:"\\ngtr", 8816:"\\nleq", 8817:"\\ngeq", 8818:"\\lessim", 8819:"\\gtrsim", 8820:null, 8821:null, 8822:"\\lessgtr", 8823:"\\gtrless", 8824:null, 8825:null, 8826:"\\prec", 8827:"\\succ", 8828:"\\preccurlyeq", 8829:"\\succcurlyeq", 8830:"\\precsim", 8831:"\\succsim", 8832:"\\nprec", 8833:"\\nsucc", 8834:"\\subset", 
      8835:"\\supset", 8836:null, 8837:null, 8838:"\\subseteq", 8839:"\\supseteq", 8840:"\\nsubseteq", 8841:"\\nsupseteq", 8842:"\\subsetneq", 8843:"\\supsetneq", 8844:null, 8845:null, 8846:null, 8847:"\\sqsubset", 8848:"\\sqsupset", 8849:null, 8850:null, 8851:"\\sqcap", 8852:"\\sqcup", 8853:"\\oplus", 8854:"\\ominus", 8855:"\\otimes", 8856:"\\oslash", 8857:"\\odot", 8858:"\\circledcirc", 8859:"\\circledast", 8860:null, 8861:"\\circleddash", 8862:"\\boxplus", 8863:"\\boxminus", 8864:"\\boxtimes", 
      8865:"\\boxdot", 8866:"\\vdash", 8867:"\\dashv", 8868:"\\top", 8869:"\\bot", 8870:null, 8871:"\\models", 8872:"\\vDash", 8873:"\\Vdash", 8874:"\\Vvdash", 8875:"\\VDash*", 8876:"\\nvdash", 8877:"\\nvDash", 8878:"\\nVdash", 8879:"\\nVDash", 8880:null, 8881:null, 8882:"\\vartriangleleft", 8883:"\\vartriangleright", 8884:"\\trianglelefteq", 8885:"\\trianglerighteq", 8886:null, 8887:null, 8888:"\\multimap", 8889:null, 8890:"\\intercal", 8891:"\\veebar", 8892:"\\barwedge", 8893:null, 8894:null, 8895:null, 
      8896:"\\wedge", 8897:"\\vee", 8898:"\\cap", 8899:"\\cup", 8900:"\\diamond", 8901:"\\cdot", 8902:"\\star", 8903:null, 8904:"\\bowtie", 8905:"\\ltimes", 8906:"\\rtimes", 8907:"\\leftthreetimes", 8908:"\\rightthreetimes", 8909:"\\backsimeq", 8910:"\\curlyvee", 8911:"\\curlywedge", 8912:"\\Subset", 8913:"\\Supset", 8914:"\\Cap", 8915:"\\Cup", 8916:"\\pitchfork", 8917:"\\lessdot", 8918:"\\gtrdot", 8919:null, 8920:"\\lll", 8921:"\\ggg", 8922:"\\lesseqgtr", 8923:"\\gtreqless", 8924:null, 8925:null, 
      8926:"\\curlyeqprec", 8927:"\\curlyeqsucc", 8928:null, 8929:null, 8930:null, 8931:null, 8932:null, 8933:null, 8934:"\\lnsim", 8935:"\\gnsim", 8936:"\\precnsim", 8937:"\\succnsim", 8938:"\\ntriangleleft", 8939:"\\ntriangleright", 8940:"\\ntrianglelefteq", 8941:"\\ntrianglerighteq", 8942:"\\vdots", 8943:"\\cdots", 8944:null, 8945:"\\ddots", 8946:null, 8947:null, 8948:null, 8949:null, 8950:null, 8951:null, 8952:null, 8953:null, 8954:null, 8955:null, 8956:null, 8957:null, 8958:null, 8959:null};
      var identifiers = keys(env);
      identifiers.push("to");
      function isAlphaCharCode(c) {
        return c >= 65 && c <= 90 || c >= 97 && c <= 122
      }
      function start(options) {
        if(!options) {
          options = {}
        }
        var c;
        lexeme = "";
        var t;
        while(curIndex < src.length) {
          switch(c = src.charCodeAt(curIndex++)) {
            case 32:
            ;
            case 9:
            ;
            case 10:
            ;
            case 13:
              continue;
            case 38:
              if(indexOf(src.substring(curIndex), "nbsp;") === 0) {
                curIndex += 5;
                continue
              }
              return TK_NEWCOL;
            case 92:
              lexeme += String.fromCharCode(c);
              switch(src.charCodeAt(curIndex)) {
                case 92:
                  curIndex++;
                  return TK_NEWROW;
                case 123:
                ;
                case 124:
                ;
                case 125:
                  return src.charCodeAt(curIndex++)
              }
              var tk = latex();
              if(tk !== null) {
                return tk
              }
              lexeme = "";
              continue;
            case 42:
            ;
            case 8727:
              return TK_MUL;
            case 45:
            ;
            case 8722:
              if(src.charCodeAt(curIndex) === 62) {
                curIndex++;
                return TK_RIGHTARROW
              }
              return TK_SUB;
            case 47:
            ;
            case 8725:
              return TK_SLASH;
            case 33:
              if(src.charCodeAt(curIndex) === 61) {
                curIndex++;
                return TK_NE
              }
              return c;
            case 58:
            ;
            case 8758:
              return TK_COLON;
            case 59:
              return TK_SEMICOLON;
            case 37:
            ;
            case 40:
            ;
            case 41:
            ;
            case 43:
            ;
            case 44:
            ;
            case 61:
            ;
            case 91:
            ;
            case 93:
            ;
            case 94:
            ;
            case 95:
            ;
            case 123:
            ;
            case 124:
            ;
            case 125:
              lexeme += String.fromCharCode(c);
              return c;
            case 36:
              lexeme += String.fromCharCode(c);
              return TK_VAR;
            case 60:
              if(src.charCodeAt(curIndex) === 61) {
                curIndex++;
                return TK_LE
              }
              return TK_LT;
            case 62:
              if(src.charCodeAt(curIndex) === 61) {
                curIndex++;
                return TK_GE
              }
              return TK_GT;
            default:
              if(isAlphaCharCode(c) || c === CC_SINGLEQUOTE) {
                return variable(c)
              }else {
                if(t = unicodeToLaTeX[c]) {
                  lexeme = t;
                  var tk = lexemeToToken[lexeme];
                  if(tk === void 0) {
                    tk = TK_VAR
                  }
                  return tk
                }else {
                  if(matchDecimalSeparator(String.fromCharCode(c)) || isNumberCharCode(c)) {
                    if(options.oneCharToken) {
                      lexeme += String.fromCharCode(c);
                      return TK_NUM
                    }
                    return number(c)
                  }else {
                    assert(false, message(1004, [String.fromCharCode(c), c]));
                    return 0
                  }
                }
              }
          }
        }
        return 0
      }
      var lastSeparator;
      function number(c) {
        while(isNumberCharCode(c) || (matchDecimalSeparator(String.fromCharCode(c)) || (lastSeparator = matchThousandsSeparator(String.fromCharCode(c), lastSeparator)) && isNumberCharCode(src.charCodeAt(curIndex)))) {
          lexeme += String.fromCharCode(c);
          c = src.charCodeAt(curIndex++);
          if(c === 92 && src.charCodeAt(curIndex) === 32) {
            c = 32;
            curIndex++
          }
        }
        if(lexeme === "." && (indexOf(src.substring(curIndex), "overline") === 0 || indexOf(src.substring(curIndex), "dot") === 0)) {
          lexeme = "0."
        }
        curIndex--;
        return TK_NUM
      }
      function variable(c) {
        var ch = String.fromCharCode(c);
        lexeme += ch;
        var identifier = lexeme;
        var startIndex = curIndex + 1;
        while(isAlphaCharCode(c) || c === CC_SINGLEQUOTE) {
          c = src.charCodeAt(curIndex++);
          if(!isAlphaCharCode(c)) {
            break
          }
          var ch = String.fromCharCode(c);
          var match = some(identifiers, function(u) {
            var ident = identifier + ch;
            return indexOf(u, ident) === 0
          });
          if(!match) {
            break
          }
          identifier += ch
        }
        if(indexOf(identifiers, identifier) >= 0) {
          lexeme = identifier
        }else {
          curIndex = startIndex
        }
        while(c === CC_SINGLEQUOTE) {
          lexeme += String.fromCharCode(c);
          c = src.charCodeAt(curIndex++)
        }
        curIndex--;
        return TK_VAR
      }
      function latex() {
        var c = src.charCodeAt(curIndex++);
        if(c === CC_DOLLAR) {
          lexeme = String.fromCharCode(c)
        }else {
          if(c === CC_PERCENT) {
            lexeme += String.fromCharCode(c)
          }else {
            if(indexOf([CC_SPACE, CC_COLON, CC_SEMICOLON, CC_COMMA, CC_BANG], c) >= 0) {
              lexeme = "\\ "
            }else {
              while(isAlphaCharCode(c)) {
                lexeme += String.fromCharCode(c);
                c = src.charCodeAt(curIndex++)
              }
              curIndex--
            }
          }
        }
        var tk = lexemeToToken[lexeme];
        if(tk === void 0) {
          tk = TK_VAR
        }else {
          if(tk === TK_OPERATORNAME) {
            var c = src.charCodeAt(curIndex++);
            while(c && c !== CC_LEFTBRACE) {
              c = src.charCodeAt(curIndex++)
            }
            lexeme = "";
            var c = src.charCodeAt(curIndex++);
            while(c && c !== CC_RIGHTBRACE) {
              var ch = String.fromCharCode(c);
              if(ch === "&" && indexOf(src.substring(curIndex), "nbsp;") === 0) {
                curIndex += 5
              }else {
                if(ch === " " || ch === "\t") {
                }else {
                  lexeme += ch
                }
              }
              c = src.charCodeAt(curIndex++)
            }
            var tk = lexemeToToken["\\" + lexeme];
            if(tk === void 0) {
              tk = TK_VAR
            }
          }else {
            if(tk === TK_TEXT) {
              var c = src.charCodeAt(curIndex++);
              while(c && c !== CC_LEFTBRACE) {
                c = src.charCodeAt(curIndex++)
              }
              lexeme = "";
              var c = src.charCodeAt(curIndex++);
              var keepTextWhitespace = Model.option("keepTextWhitespace");
              while(c && c !== CC_RIGHTBRACE) {
                var ch = String.fromCharCode(c);
                if(!keepTextWhitespace && (ch === "&" && indexOf(src.substring(curIndex), "nbsp;") === 0)) {
                  curIndex += 5
                }else {
                  if(!keepTextWhitespace && (ch === " " || ch === "\t")) {
                  }else {
                    lexeme += ch
                  }
                }
                c = src.charCodeAt(curIndex++)
              }
              if(!lexeme || Model.option("ignoreText")) {
                tk = null
              }else {
                tk = TK_VAR
              }
            }
          }
        }
        return tk
      }
      return{start:start, lexeme:function() {
        return lexeme
      }, pos:function() {
        return curIndex
      }}
    }
  };
  return Model
}();
(function(ast) {
  var LOCAL = false;
  var latexSympy = require("./latexsympy.js").Core;
  var http = require("http");
  var https = require("https");
  function texToSympy(tex, resume) {
    var errs = [];
    if(tex) {
      try {
        latexSympy.translate({}, tex, function(err, val) {
          if(err && err.length) {
            errs = errs.concat(err);
            val = ""
          }
          resume(errs, val)
        })
      }catch(e) {
        errs = errs.concat(e.message);
        resume(errs, "")
      }
    }
  }
  function putCode(lang, src, resume) {
    var path = "/code";
    var data = {language:lang, src:src};
    var encodedData = JSON.stringify(data);
    var options = {method:"PUT", host:LOCAL && "localhost" || "www.graffiticode.com", port:LOCAL && "3000" || "443", path:path, headers:{"Content-Type":"text/plain", "Content-Length":encodedData.length}};
    var req = http.request(options, function(res) {
      var data = "";
      res.on("data", function(chunk) {
        data += chunk
      }).on("end", function() {
        try {
          resume([], JSON.parse(data))
        }catch(e) {
          resume(["ERROR putCode(): " + encodedData], {})
        }
      }).on("error", function() {
        console.log("error() status=" + res.statusCode + " data=" + data);
        resume([], {})
      })
    });
    req.write(encodedData);
    req.end();
    req.on("error", function(e) {
      console.log("ERROR: " + e);
      resume([].concat(e), [])
    })
  }
  function putComp(auth, data, resume) {
    var encodedData = JSON.stringify(data);
    var options = {host:LOCAL && "localhost" || "www.graffiticode.com", port:LOCAL && "3000" || "443", path:"/comp", method:"PUT", headers:{"Content-Type":"text/plain", "Content-Length":Buffer.byteLength(encodedData), "Authorization":auth}};
    var req = http.request(options);
    req.on("response", function(res) {
      var data = "";
      res.on("data", function(chunk) {
        data += chunk
      }).on("end", function() {
        resume(null, JSON.parse(data))
      }).on("error", function(err) {
        console.log("[13] ERROR " + err);
        resume(err)
      })
    });
    req.end(encodedData);
    req.on("error", function(err) {
      console.log("[14] ERROR " + err);
      resume(err)
    })
  }
  var messages = Assert.messages;
  Assert.reserveCodeRange(2E3, 2999, "mathmodel");
  messages[2E3] = "Internal error. %1";
  messages[2001] = "Factoring of multi-variate polynomials with all terms of degree greater than one is not supported";
  messages[2002] = "Expression not supported.";
  messages[2003] = "Factoring non-polynomials is not supported.";
  messages[2004] = "Compound units not supported with tolerances.";
  messages[2005] = "Non-numeric expressions cannot be compared with equivValue.";
  messages[2006] = "More that two equals symbols in equation.";
  messages[2007] = "Tolerances are not supported in lists.";
  messages[2008] = "deprecated";
  messages[2009] = "Undefined value in 'equivValue'";
  messages[2010] = "Invalid option name %1.";
  messages[2011] = "Invalid option value %2 for option %1.";
  messages[2012] = "Expressions with comparison or equality operators cannot be compared with equivValue.";
  messages[2013] = "Incompatible values with matrix arithmetic";
  messages[2014] = "Incomplete expression found.";
  messages[2015] = "Invalid format name '%1'.";
  messages[2016] = "Exponents should be wrapped in braces.";
  messages[2017] = "Units with different base units not allowed in a single expression. Found: %1";
  var visitor = new Visitor(ast);
  var bigZero = new BigDecimal("0");
  var bigOne = new BigDecimal("1");
  var bigTwo = new BigDecimal("2");
  var bigThree = new BigDecimal("3");
  var bigFour = new BigDecimal("4");
  var bigFive = new BigDecimal("5");
  var bigMinusOne = new BigDecimal("-1");
  var nodeZero = numberNode("0");
  var nodeOne = numberNode("1");
  var nodeTwo = numberNode("2");
  var nodeMinusOne = numberNode("-1");
  var nidMinusOne = ast.intern(nodeMinusOne);
  var nodePositiveInfinity = numberNode("Infinity");
  var nodeNegativeInfinity = numberNode("-Infinity");
  var nodeOneHalf = binaryNode(Model.POW, [nodeTwo, nodeMinusOne]);
  var nodeImaginary = variableNode("i");
  var nodeE = variableNode("e");
  var nodePI = variableNode("\\pi");
  function stripNids(node) {
    forEach(keys(node), function(k) {
      if(indexOf(k, "Nid") > 0) {
        delete node[k]
      }
    });
    if(node.args) {
      forEach(node.args, function(n) {
        stripNids(n)
      })
    }
    return node
  }
  function stripMetadata(node) {
    forEach(keys(node), function(k) {
      if(k !== "op" && k !== "args") {
        delete node[k]
      }
    });
    if(node.args) {
      forEach(node.args, function(n) {
        stripNids(n)
      })
    }
    return node
  }
  function hashCode(str) {
    var hash = 0, i, chr, len;
    if(str.length == 0) {
      return hash
    }
    for(i = 0, len = str.length;i < len;i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0
    }
    return hash
  }
  function isChemCore() {
    return!!Model.env["Au"]
  }
  function undefinedNode(node) {
    if(isUndefined(node)) {
      return node
    }
    var node = numberNode(JSON.stringify(node));
    node.isUndefined = true;
    return node
  }
  function isUndefined(node) {
    if(node.op === Model.NUM) {
      return!!node.isUndefined
    }else {
      if(node.args) {
        return some(node.args, function(n) {
          return isUndefined(n)
        })
      }
    }
    return false
  }
  function isImaginary(node) {
    if(node.op) {
      return ast.intern(nodeImaginary) === ast.intern(node)
    }
    return false
  }
  function newNode(op, args) {
    return{op:op, args:args}
  }
  function binaryNode(op, args, flatten) {
    assert(args.length > 0, "2000: Invalid node shape.");
    if(args.length < 2) {
      return args[0]
    }
    var aa = [];
    forEach(args, function(n) {
      if(flatten && n.op === op) {
        aa = aa.concat(n.args)
      }else {
        aa.push(n)
      }
    });
    return newNode(op, aa)
  }
  function abs(n) {
    if(n === null) {
      return null
    }else {
      if(n instanceof BigDecimal) {
        if(n === null) {
          return null
        }
        n = toNumber(n)
      }else {
        if(n.op) {
          n = mathValue(n, true);
          if(n === null) {
            return null
          }
        }else {
          if(isNaN(n)) {
            return null
          }
        }
      }
    }
    return toDecimal(Math.abs(n))
  }
  function isNeg(n) {
    var mv;
    if(n === null) {
      return false
    }
    if(n.op) {
      if(n.op === Model.POW) {
        n = n.args[0]
      }
      var cp = constantPart(n);
      mv = mathValue(cp, true);
      if(!mv) {
        if(n.op === Model.MUL && isMinusOne(n.args[0]) || n.op === Model.NUM && n.args[0] === "-Infinity") {
          return true
        }
        return false
      }
    }else {
      if(!(n instanceof BigDecimal)) {
        return false
      }else {
        mv = n
      }
    }
    return mv.compareTo(bigZero) < 0
  }
  function numberNode(val, doScale, roundOnly, isRepeating) {
    assert(!(val instanceof Array), "2000: Expecting a scalar");
    var mv, node, minusOne;
    if(doScale) {
      var scale = option("decimalPlaces");
      if(isRepeating) {
      }
      mv = toDecimal(val);
      if(isNeg(mv) && !isMinusOne(mv)) {
        minusOne = bigMinusOne.setScale(scale, BigDecimal.ROUND_HALF_UP);
        mv = bigMinusOne.multiply(mv)
      }
      if(mv !== null && (!roundOnly || mv.scale() > scale)) {
        mv = mv.setScale(scale, BigDecimal.ROUND_HALF_UP)
      }
    }else {
      mv = toDecimal(val);
      if(isNeg(mv) && !isMinusOne(mv)) {
        minusOne = bigMinusOne;
        mv = bigMinusOne.multiply(mv)
      }
    }
    if(minusOne) {
      node = multiplyNode([newNode(Model.NUM, [String(minusOne)]), newNode(Model.NUM, [String(mv)])])
    }else {
      if(mv) {
        node = newNode(Model.NUM, [String(mv)])
      }else {
        node = newNode(Model.NUM, [String(val)])
      }
    }
    return node
  }
  function multiplyNode(args, flatten) {
    if(args.length === 0) {
      args = [nodeOne]
    }
    return binaryNode(Model.MUL, args, flatten)
  }
  function addNode(args, flatten) {
    if(args.length === 0) {
      args = [nodeOne]
    }
    return binaryNode(Model.ADD, args, flatten)
  }
  function fractionNode(n, d) {
    return multiplyNode([n, binaryNode(Model.POW, [d, nodeMinusOne])], true)
  }
  function unaryNode(op, args) {
    if(op === Model.ADD) {
      return args[0]
    }else {
      return newNode(op, args)
    }
  }
  function variableNode(name) {
    assert(typeof name === "string", "2000: Expecting a string");
    return newNode(Model.VAR, [name])
  }
  function negate(n, isNormalizing) {
    if(typeof n === "number") {
      return-n
    }else {
      if(n.op === Model.MUL || (n.op === Model.COEFF || n.op === Model.TIMES)) {
        var args = n.args.slice(0);
        if(isMinusOne(n.args[0])) {
          args.shift();
          return binaryNode(n.op, args, true)
        }else {
          var didNegate = false;
          done:for(var i = 0;i < args.length;i++) {
            if(isMinusOne(args[i])) {
              if(i === 0) {
                args.shift()
              }else {
                if(i === args.length - 1) {
                  args.pop()
                }else {
                  args = args.slice(0, i).concat(args.slice(i + 1))
                }
              }
              i--;
              didNegate = true;
              break done
            }else {
              if(isNeg(args[i])) {
                args[i] = negate(args[i]);
                didNegate = true;
                break done
              }
            }
          }
          if(!didNegate) {
            args = [negate(args.shift())].concat(args)
          }
          return binaryNode(n.op, args, true)
        }
      }else {
        if(n.op === Model.ADD && !isNormalizing) {
          var args = [];
          forEach(n.args, function(n) {
            args.push(negate(n))
          });
          return binaryNode(n.op, args, true)
        }else {
          if(n.op === Model.NUM) {
            if(n.args[0] === "1") {
              return nodeMinusOne
            }else {
              if(n.args[0] === "-1") {
                return nodeOne
              }else {
                if(n.args[0] === "Infinity") {
                  return nodeNegativeInfinity
                }else {
                  if(n.args[0] === "-Infinity") {
                    return nodePositiveInfinity
                  }else {
                    if(n.args[0].charAt(0) === "-") {
                      return unaryNode(Model.SUB, [n])
                    }else {
                      return numberNode("-" + n.args[0])
                    }
                  }
                }
              }
            }
          }else {
            if(n.op === Model.POW && isMinusOne(n.args[1])) {
              if(isZero(n.args[0])) {
                return nodeNegativeInfinity
              }else {
                return binaryNode(Model.POW, [negate(n.args[0]), nodeMinusOne])
              }
            }else {
              if(n.op === Model.INTEGRAL && n.args.length === 3) {
                return newNode(Model.INTEGRAL, [n.args[1], n.args[0], n.args[2]])
              }
            }
          }
        }
      }
    }
    return multiplyNode([nodeMinusOne, n], true)
  }
  function isPositiveInfinity(n) {
    if(n === Number.POSITIVE_INFINITY || n.op === Model.NUM && n.args[0] === "Infinity") {
      return true
    }
    return false
  }
  function isNegativeInfinity(n) {
    if(n === Number.NEGATIVE_INFINITY || n.op === Model.NUM && n.args[0] === "-Infinity") {
      return true
    }
    return false
  }
  function isInfinity(n) {
    if(n === Number.POSITIVE_INFINITY || (n === Number.NEGATIVE_INFINITY || n.op === Model.NUM && (n.args[0] === "Infinity" || n.args[0] === "-Infinity"))) {
      return true
    }
    return false
  }
  function isE(n) {
    if(n === null) {
      return false
    }else {
      if(n instanceof BigDecimal) {
        return!bigE.compareTo(n)
      }else {
        if(typeof n === "number") {
          return n === Math.E
        }else {
          if(n.op === Model.NUM && +n.args[0] === Math.E) {
            return true
          }else {
            if(n.op === Model.VAR && n.args[0] === "e") {
              return true
            }else {
              return false
            }
          }
        }
      }
    }
  }
  function isZero(n) {
    if(n === null) {
      return false
    }else {
      if(n instanceof BigDecimal) {
        return!bigZero.compareTo(n)
      }else {
        if(typeof n === "number") {
          return n === 0
        }else {
          if(n.op === Model.NUM && +n.args[0] === 0) {
            return true
          }else {
            return false
          }
        }
      }
    }
  }
  function isOne(n) {
    var mv;
    if(n === null) {
      return false
    }else {
      if(n instanceof BigDecimal) {
        return!bigOne.compareTo(n)
      }else {
        if(typeof n === "number") {
          return n === 1
        }else {
          if(n.op === Model.NUM) {
            var mv = mathValue(n);
            if(mv) {
              return!bigOne.compareTo(mv)
            }
            return false
          }
        }
      }
    }
  }
  function isMinusOne(n) {
    if(n === null || (n === undefined || typeof n === "string")) {
      return false
    }else {
      if(typeof n === "number") {
        return n === -1
      }else {
        if(n instanceof BigDecimal) {
          return!bigMinusOne.compareTo(n)
        }else {
          if(n.op) {
            if(ast.intern(n) === nidMinusOne) {
              return true
            }
            var mv = mathValue(n, true);
            if(mv) {
              return!bigMinusOne.compareTo(mathValue(n, true))
            }else {
              return false
            }
          }
        }
      }
    }
    assert(false, "2000: Unable to compare with zero.")
  }
  function isInteger(node) {
    var mv;
    if(!node) {
      return false
    }
    if(node.op === Model.NUM && ((mv = mathValue(node, true)) !== null && isInteger(mv))) {
      return true
    }else {
      if(node instanceof BigDecimal) {
        return node.remainder(bigOne).compareTo(bigZero) === 0
      }
    }
    return false
  }
  function isDecimal(node) {
    var mv;
    if(!node) {
      return false
    }
    if(node.op === Model.NUM && ((mv = mathValue(node, true)) !== null && !isInteger(mv))) {
      return true
    }else {
      if(node instanceof BigDecimal && !isInteger(node)) {
        return true
      }
    }
    return false
  }
  function isEven(node) {
    var mv;
    if(!node) {
      return false
    }
    if(node.op === Model.NUM && ((mv = mathValue(node, true)) !== null && isEven(mv))) {
      return true
    }else {
      if(node instanceof BigDecimal) {
        return node.remainder(bigTwo).compareTo(bigZero) === 0
      }
    }
    return false
  }
  function isOdd(node) {
    var mv = mathValue(node, true);
    return isInteger(mv) && !isEven(mv)
  }
  function isOddFraction(node) {
    var ff = factors(node, {}, true, true);
    var nn = [nodeOne], dd = [nodeOne];
    forEach(ff, function(f) {
      if(f.op !== Model.POW || !isNeg(mathValue(f.args[1], true))) {
        nn.push(f)
      }else {
        dd.push(f.args[1])
      }
    });
    var n = multiplyNode(nn);
    var d = multiplyNode(dd);
    return isOdd(n) && isOdd(d)
  }
  function isPolynomial(node) {
    var n0 = JSON.parse(JSON.stringify(node));
    var tt = terms(expand(n0));
    var a = bigZero, b = bigZero, c = bigZero, notPolynomial = false;
    var cc = [];
    forEach(tt, function(v) {
      var d = degree(v, true);
      if(isImaginary(v) || (d === Number.POSITIVE_INFINITY || (d < 0 || (d !== Math.floor(d) || (d > 10 || mathValue(constantPart(v), true) === null))))) {
        notPolynomial = true;
        return
      }
      if(cc[d] === undefined) {
        var i = d;
        while(i >= 0 && cc[i] === undefined) {
          cc[i] = 0;
          i--
        }
      }
      cc[d] = cc[d] + toNumber(mathValue(constantPart(v), true))
    });
    if(notPolynomial || variables(node).length > 1) {
      return null
    }
    return cc
  }
  function toNumber(n) {
    var str;
    if(n === null) {
      return Number.NaN
    }else {
      if(typeof n === "number") {
        return n
      }else {
        if(n instanceof BigDecimal) {
          str = n.toString()
        }else {
          if(n.op === Model.NUM) {
            str = n.args[0]
          }else {
            return Number.NaN
          }
        }
      }
    }
    return parseFloat(str)
  }
  function toDecimal(val) {
    var str;
    if(val === null || (isNaN(val) || (isInfinity(val) || (isImaginary(val) || typeof val === "string" && indexOf(val, "Infinity") >= 0)))) {
      return null
    }else {
      if(val instanceof BigDecimal) {
        return val
      }else {
        if(val.op === Model.NUM) {
          str = val.args[0]
        }else {
          str = val.toString()
        }
      }
    }
    return new BigDecimal(str)
  }
  function toRadians(node) {
    assert(node.op, "2000: Invalid node");
    var val = bigOne, uu;
    var args = [];
    if(node.op === Model.MUL) {
      forEach(node.args, function(n) {
        if(n.op === Model.VAR) {
          switch(n.args[0]) {
            case "\\degree":
              args.push(numberNode((new BigDecimal("" + Math.PI)).divide(new BigDecimal("180"))));
              break;
            case "\\radians":
              break;
            default:
              args.push(toRadians(n));
              break
          }
        }else {
          args.push(n)
        }
      });
      node = multiplyNode(args)
    }
    return node
  }
  function logBase(b, v) {
    var n = Math.log(toNumber(v)) / Math.log(toNumber(b));
    if(!isNaN(n)) {
      return new BigDecimal(String(n))
    }
    return null
  }
  function factorial(n) {
    var i = 2;
    var result = bigOne;
    for(;i <= n;i++) {
      Assert.checkTimeout();
      result = result.multiply(new BigDecimal(i.toString()))
    }
    return result
  }
  var varMap = {};
  var varNames = [];
  function reset() {
    varMap = {};
    varNames = []
  }
  function hint(val, node, str) {
    if(!val) {
      if(!node.hints) {
        node.hints = []
      }
      node.hints.push(str)
    }
  }
  var normalNumber = numberNode("298230487121230434902874");
  normalNumber.is_normal = true;
  function Visitor(ast) {
    function visit(node, visit, resume) {
      assert(node.op && node.args, "2000: Visitor.visit() op=" + node.op + " args = " + node.args);
      switch(node.op) {
        case Model.NUM:
          node = visit.numeric(node, resume);
          break;
        case Model.ADD:
        ;
        case Model.SUB:
        ;
        case Model.PM:
        ;
        case Model.BACKSLASH:
          if(node.args.length === 1) {
            node = visit.unary(node, resume)
          }else {
            node = visit.additive(node, resume)
          }
          break;
        case Model.MUL:
        ;
        case Model.TIMES:
        ;
        case Model.COEFF:
        ;
        case Model.DIV:
        ;
        case Model.FRAC:
          node = visit.multiplicative(node, resume);
          break;
        case Model.POW:
        ;
        case Model.LOG:
          node = visit.exponential(node, resume);
          break;
        case Model.VAR:
        ;
        case Model.SUBSCRIPT:
          node = visit.variable(node, resume);
          break;
        case Model.SQRT:
        ;
        case Model.SIN:
        ;
        case Model.COS:
        ;
        case Model.TAN:
        ;
        case Model.ARCSIN:
        ;
        case Model.ARCCOS:
        ;
        case Model.ARCTAN:
        ;
        case Model.ARCSEC:
        ;
        case Model.ARCCSC:
        ;
        case Model.ARCCOT:
        ;
        case Model.SEC:
        ;
        case Model.CSC:
        ;
        case Model.COT:
        ;
        case Model.SINH:
        ;
        case Model.COSH:
        ;
        case Model.TANH:
        ;
        case Model.ARCSINH:
        ;
        case Model.ARCCOSH:
        ;
        case Model.ARCTANH:
        ;
        case Model.ARCSECH:
        ;
        case Model.ARCCSCH:
        ;
        case Model.ARCCOTH:
        ;
        case Model.SECH:
        ;
        case Model.CSCH:
        ;
        case Model.COTH:
        ;
        case Model.PERCENT:
        ;
        case Model.M:
        ;
        case Model.ABS:
        ;
        case Model.FACT:
        ;
        case Model.FORALL:
        ;
        case Model.EXISTS:
        ;
        case Model.IN:
        ;
        case Model.SUM:
        ;
        case Model.LIM:
        ;
        case Model.EXP:
        ;
        case Model.TO:
        ;
        case Model.RIGHTARROW:
        ;
        case Model.DERIV:
        ;
        case Model.INTEGRAL:
        ;
        case Model.PROD:
        ;
        case Model.ION:
        ;
        case Model.POW:
        ;
        case Model.SUBSCRIPT:
        ;
        case Model.OVERLINE:
        ;
        case Model.OVERSET:
        ;
        case Model.UNDERSET:
        ;
        case Model.NONE:
        ;
        case Model.DEGREE:
        ;
        case Model.DOT:
        ;
        case Model.PAREN:
          node = visit.unary(node, resume);
          break;
        case Model.COMMA:
        ;
        case Model.MATRIX:
        ;
        case Model.VEC:
        ;
        case Model.ROW:
        ;
        case Model.COL:
        ;
        case Model.INTERVAL:
        ;
        case Model.LIST:
          node = visit.comma(node, resume);
          break;
        case Model.EQL:
        ;
        case Model.LT:
        ;
        case Model.LE:
        ;
        case Model.GT:
        ;
        case Model.GE:
        ;
        case Model.NE:
        ;
        case Model.NGTR:
        ;
        case Model.NLESS:
        ;
        case Model.APPROX:
        ;
        case Model.COLON:
        ;
        case Model.RIGHTARROW:
          node = visit.equals(node, resume);
          break;
        case Model.FORMAT:
          node = visit.format(node);
          break;
        default:
          if(visit.name !== "normalizeLiteral" && visit.name !== "sort") {
            assert(false, "2000: Should not get here. Unhandled node operator " + JSON.stringify(node))
          }
          break
      }
      return node
    }
    function degree(root, notAbsolute) {
      assert(root && root.args, "2000: Invalid node");
      return visit(root, {name:"degree", exponential:function(node) {
        var args = node.args;
        var d;
        if(node.op === Model.POW) {
          var expo = mathValue(args[1], true);
          if(expo) {
            if(notAbsolute) {
              d = degree(args[0], notAbsolute) * toNumber(expo)
            }else {
              d = degree(args[0], notAbsolute) * Math.abs(toNumber(expo))
            }
          }else {
            if(!isNeg(args[1])) {
              d = Number.POSITIVE_INFINITY
            }else {
              d = Number.NEGATIVE_INFINITY
            }
          }
        }else {
          if(node.op === Model.LOG) {
            d = Number.POSITIVE_INFINITY
          }
        }
        return d
      }, multiplicative:function(node) {
        var args = node.args;
        var d = 0;
        forEach(args, function(n) {
          d += degree(n, notAbsolute)
        });
        return d
      }, additive:function(node) {
        var args = node.args;
        var d = 0;
        var t;
        forEach(args, function(n) {
          t = degree(n, notAbsolute);
          if(t > d) {
            d = t
          }
        });
        return d
      }, numeric:function(node) {
        return 0
      }, unary:function(node) {
        var args = node.args;
        var d = degree(args[0], notAbsolute);
        switch(node.op) {
          case Model.ADD:
          ;
          case Model.SUB:
          ;
          case Model.PM:
          ;
          case Model.PERCENT:
          ;
          case Model.M:
          ;
          case Model.ABS:
            return d;
          case Model.SIN:
          ;
          case Model.COS:
          ;
          case Model.TAN:
          ;
          case Model.ARCSIN:
          ;
          case Model.ARCCOS:
          ;
          case Model.ARCTAN:
          ;
          case Model.ARCSEC:
          ;
          case Model.ARCCSC:
          ;
          case Model.ARCCOT:
          ;
          case Model.SEC:
          ;
          case Model.CSC:
          ;
          case Model.COT:
          ;
          case Model.SINH:
          ;
          case Model.COSH:
          ;
          case Model.TANH:
          ;
          case Model.ARCSINH:
          ;
          case Model.ARCCOSH:
          ;
          case Model.ARCTANH:
          ;
          case Model.ARCSECH:
          ;
          case Model.ARCCSCH:
          ;
          case Model.ARCCOTH:
          ;
          case Model.SECH:
          ;
          case Model.CSCH:
          ;
          case Model.COTH:
            return 1;
          case Model.SQRT:
            assert(args.length === 1, message(2003));
            return d / 2;
          case Model.FACT:
            if(d !== 0) {
              return nodePositiveInfinity
            }
            return 0;
          case Model.INTEGRAL:
            return Number.POSITIVE_INFINITY;
          case Model.DEGREE:
          ;
          case Model.NONE:
          ;
          default:
            return 0
        }
      }, variable:function(node) {
        if(!name || node.args[0] === name) {
          return 1
        }
        return 0
      }, comma:function(node) {
        return[]
      }, equals:function(node) {
        var args = node.args;
        var d = 0;
        var t;
        forEach(args, function(n) {
          t = degree(n, notAbsolute);
          if(t > d) {
            d = t
          }
        });
        return d
      }})
    }
    function constantPart(root) {
      var env = Model.env;
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"constantPart", exponential:function(node) {
        if(variablePart(node) === null) {
          return node
        }
        return nodeOne
      }, multiplicative:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          var cp = constantPart(n);
          if(!isOne(cp)) {
            var mv = mathValue(cp, env, true);
            if(isOne(mv)) {
            }else {
              if(isZero(mv)) {
                args.push(nodeZero)
              }else {
                args.push(n)
              }
            }
          }
        });
        if(args.length === 0) {
          return nodeOne
        }else {
          if(args.length === 1) {
            return args[0]
          }
        }
        return multiplyNode(args)
      }, additive:function(node) {
        var result = some(node.args, function(n) {
          return variablePart(n) !== null
        });
        if(!result) {
          return node
        }
        return nodeOne
      }, unary:function(node) {
        var result = some(node.args, function(n) {
          return variablePart(n) !== null
        });
        if(!result) {
          return node
        }
        return nodeOne
      }, numeric:function(node) {
        return node
      }, variable:function(node) {
        if(variablePart(node) === null) {
          return node
        }
        return nodeOne
      }, comma:function(node) {
        if(variablePart(node) === null) {
          return node
        }
        return nodeOne
      }, equals:function(node) {
        if(variablePart(node) === null) {
          return node
        }
        return nodeOne
      }})
    }
    function variables(root) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"variables", exponential:function(node) {
        var args = node.args;
        var val = [];
        forEach(args, function(n) {
          var vars = variables(n);
          forEach(vars, function(v) {
            if(indexOf(val, v) < 0) {
              val.push(v)
            }
          })
        });
        return val
      }, multiplicative:function(node) {
        var args = node.args;
        var val = [];
        forEach(args, function(n) {
          var vars = variables(n);
          forEach(vars, function(v) {
            if(indexOf(val, v) < 0) {
              val.push(v)
            }
          })
        });
        return val
      }, additive:function(node) {
        var args = node.args;
        var val = [];
        forEach(args, function(n) {
          var vars = variables(n);
          forEach(vars, function(v) {
            if(indexOf(val, v) < 0) {
              val.push(v)
            }
          })
        });
        return val
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(variables(n))
        });
        return args
      }, numeric:function(node) {
        return[]
      }, variable:function(node) {
        if(node.args[0] === "0") {
          return[]
        }
        if(node.op === Model.SUBSCRIPT) {
          node = node.args[0]
        }
        return[node.args[0]]
      }, comma:function(node) {
        var args = node.args;
        var val = [];
        forEach(args, function(n) {
          var vars = variables(n);
          forEach(vars, function(v) {
            if(indexOf(val, v) < 0) {
              val.push(v)
            }
          })
        });
        return val
      }, equals:function(node) {
        var args = node.args;
        var val = [];
        forEach(args, function(n) {
          var vars = variables(n);
          forEach(vars, function(v) {
            if(indexOf(val, v) < 0) {
              val.push(v)
            }
          })
        });
        return val
      }})
    }
    function hint(root) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"hints", exponential:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        forEach(node.args, function(n) {
          hints = hints.concat(hint(n))
        });
        if(!node.args[1].lbrk) {
          hints.push(message(2016))
        }
        return hints
      }, multiplicative:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        forEach(node.args, function(n) {
          hints = hints.concat(hint(n))
        });
        return hints
      }, additive:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        forEach(node.args, function(n) {
          hints = hints.concat(hint(n))
        });
        return hints
      }, unary:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        forEach(node.args, function(n) {
          hints = hints.concat(hint(n))
        });
        return hints
      }, numeric:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        return hints
      }, variable:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        return hints
      }, comma:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        forEach(node.args, function(n) {
          hints = hints.concat(hint(n))
        });
        return hints
      }, equals:function(node) {
        var hints = [];
        if(node.hints instanceof Array) {
          hints = hints.concat(node.hints)
        }
        forEach(node.args, function(n) {
          hints = hints.concat(hint(n))
        });
        return hints
      }})
    }
    function variablePart(root) {
      var env = Model.env;
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"variablePart", exponential:function(node) {
        if(variablePart(node.args[0]) || variablePart(node.args[1])) {
          return node
        }
        return null
      }, multiplicative:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          var v = variablePart(n);
          if(v !== null) {
            args.push(v)
          }
        });
        if(args.length === 0) {
          return null
        }else {
          if(args.length === 1) {
            return args[0]
          }
        }
        return multiplyNode(args)
      }, additive:function(node) {
        var result = some(node.args, function(n) {
          return variablePart(n) !== null
        });
        if(result) {
          return node
        }
        return null
      }, unary:function(node) {
        var vp = variablePart(node.args[0]);
        if(vp !== null) {
          return node
        }
        return null
      }, numeric:function(node) {
        return null
      }, variable:function(node) {
        var val;
        if(mathValue(node, true) === null) {
          return node
        }
        return null
      }, comma:function(node) {
        var vars = [];
        forEach(node.args, function(n) {
          vars = vars.concat(variables(n, env))
        });
        if(vars.length !== 0) {
          return node
        }
        return null
      }, equals:function(node) {
        var vars = [];
        forEach(node.args, function(n) {
          vars = vars.concat(variables(n, env))
        });
        if(vars.length !== 0) {
          return node
        }
        return null
      }})
    }
    function terms(root) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"terms", exponential:function(node) {
        return[node]
      }, multiplicative:function(node) {
        return[node]
      }, additive:function(node) {
        var vals = [];
        forEach(node.args, function(n) {
          vals = vals.concat(terms(n))
        });
        return vals
      }, unary:function(node) {
        return[node]
      }, numeric:function(node) {
        return[node]
      }, variable:function(node) {
        return[node]
      }, comma:function(node) {
        var vals = [];
        forEach(node.args, function(n) {
          vals = vals.concat(terms(n))
        });
        return vals
      }, equals:function(node) {
        var vals = [];
        forEach(node.args, function(n) {
          vals = vals.concat(terms(n))
        });
        return vals
      }})
    }
    function normalizeFormatObject(fmt) {
      var list = [];
      switch(fmt.op) {
        case Model.VAR:
          list.push({code:fmt.args[0]});
          break;
        case Model.MUL:
          var code = "";
          var length = undefined;
          forEach(fmt.args, function(f) {
            if(f.op === Model.VAR) {
              code += f.args[0]
            }else {
              if(f.op === Model.NUM) {
                length = +f.args[0]
              }
            }
          });
          list.push({code:code, length:length});
          break;
        case Model.COMMA:
          forEach(fmt.args, function(f) {
            list = list.concat(normalizeFormatObject(f))
          });
          break
      }
      return list
    }
    function checkNumberFormat(fmt, node) {
      var fmtList = normalizeFormatObject(fmt);
      return some(fmtList, function(f) {
        var code = f.code;
        var length = f.length;
        switch(code) {
          case "\\integer":
            if(node.numberFormat === "integer") {
              if(length === undefined || length === node.args[0].length) {
                return true
              }
            }
            break;
          case "\\decimal":
            if(node.numberFormat === "decimal" && node.isRepeating) {
              if(length === undefined) {
                return true
              }else {
                return false
              }
            }
            if(node.numberFormat === "decimal") {
              if(length === undefined || (length === 0 && indexOf(node.args[0], ".") === -1 || length === node.args[0].substring(indexOf(node.args[0], ".") + 1).length)) {
                return true
              }
            }
            break;
          case "\\number":
            if(node.numberFormat === "decimal" && node.isRepeating) {
              if(length === undefined) {
                return true
              }else {
                return false
              }
            }
            if(node.numberFormat === "integer" || node.numberFormat === "decimal") {
              var brk = indexOf(node.args[0], ".");
              if(length === undefined || (length === 0 && brk === -1 || brk >= 0 && length === node.args[0].substring(brk + 1).length)) {
                return true
              }
            }
            break;
          case "\\scientific":
            if(node.isScientific) {
              var coeff = node.args[0].args[0];
              if(length === undefined || (length === 0 && indexOf(coeff, ".") === -1 || length === coeff.substring(indexOf(coeff, ".") + 1).length)) {
                return true
              }
            }
            break;
          case "\\fraction":
            if(node.isFraction || node.isMixedNumber) {
              return true
            }
            break;
          case "\\simpleFraction":
          ;
          case "\\nonMixedNumber":
            if(node.isFraction) {
              return true
            }
            break;
          case "\\mixedFraction":
          ;
          case "\\mixedNumber":
            if(node.isMixedNumber) {
              return true
            }
            break;
          case "\\fractionOrDecimal":
            if(node.isFraction || (node.isMixedNumber || node.numberFormat === "decimal")) {
              return true
            }
            break;
          default:
            assert(false, message(2015, [code]));
            break
        }
      })
    }
    function toMixedNumber(node) {
      var n, d, nmv, dmv;
      switch(node.op) {
        case Model.FRAC:
          n = node.args[0];
          d = node.args[1];
          nmv = mathValue(n);
          dmv = mathValue(d);
          if(isLessThan(nmv, dmv)) {
            return node
          }else {
            var mv = mathValue(normalize(node), true);
            var ip = mv.mant.slice(0, mv.mant.length + mv.exp).join("");
            var np = String(nmv - dmv.multiply(toDecimal(ip)));
            var dp = String(dmv);
            node = binaryNode(Model.MUL, [numberNode(ip), binaryNode(Model.FRAC, [numberNode(np), numberNode(dp)])]);
            node.isMixedNumber = true;
            return node
          }
          break;
        case Model.NUM:
          if(node.numberFormat === "decimal") {
            var mv = mathValue(normalize(node), true);
            var ip = mv.mant.slice(0, mv.mant.length + mv.exp).join("");
            var np = mv.mant.slice(mv.mant.length + mv.exp).join("");
            var dp = String(Math.pow(10, Math.abs(mv.exp)));
            var fp = simplify(expand(fractionNode(numberNode(np), numberNode(dp))));
            if(fp.op === Model.POW) {
              assert(fp.args[0].op === Model.NUM && (fp.args[1].op === Model.NUM && fp.args[1].args[0] === "-1"));
              np = nodeOne;
              dp = fp.args[0]
            }else {
              assert(fp.op === Model.MUL && (fp.args[0].op === Model.NUM && (fp.args[1].op === Model.POW && (fp.args[1].args[0].op === Model.NUM && (fp.args[1].args[1].op === Model.NUM && fp.args[1].args[1].args[0] === "-1")))));
              np = fp.args[0];
              dp = fp.args[1].args[0]
            }
            node = binaryNode(Model.MUL, [numberNode(ip), binaryNode(Model.FRAC, [np, dp])]);
            node.isMixedNumber = true
          }else {
            return node
          }
        ;
        default:
          return node
      }
    }
    function formatExpression(fmt, node) {
      var fmtList = normalizeFormatObject(fmt);
      assert(fmtList.length === 1, "2000: Internal error.");
      var fmt = fmtList[0];
      var code = fmt.code;
      var length = fmt.length;
      switch(code) {
        case "\\integer":
          if(node.numberFormat === "integer") {
            if(length === undefined || length === node.args[0].length) {
              return true
            }
          }
          break;
        case "\\decimal":
        ;
        case "\\scientific":
        ;
        case "\\number":
          if(node.numberFormat === "decimal" && node.isRepeating) {
            if(length === undefined) {
              return node
            }else {
              return node
            }
          }
          return formatNumber(fmt, node);
        case "\\fraction":
          if(node.isFraction || node.isMixedNumber) {
            return node
          }
          assert(false, "FIXME missing conversion to fraction");
          break;
        case "\\simpleFraction":
        ;
        case "\\nonMixedFraction":
          if(node.isFraction) {
            return node
          }
          assert(false, "FIXME missing conversion to fraction");
          break;
        case "\\mixedFraction":
        ;
        case "\\mixedNumber":
          if(node.isMixedNumber) {
            return node
          }
          return toMixedNumber(node);
        case "\\fractionOrDecimal":
          if(node.isFraction || (node.isMixedNumber || node.numberFormat === "decimal")) {
            return node
          }
          assert(false, "FIXME missing conversion to fraction or decimal");
          break;
        default:
          assert(false, message(2015, [code]));
          break
      }
    }
    function formatNumber(fmt, node) {
      var mv = mathValue(normalize(node), true);
      var before = -1, after = -1, explaces = -1, exdigits = -1, exform = MathContext.SCIENTIFIC, exround = -1;
      switch(fmt.code) {
        case "\\decimal":
          after = fmt.length;
          break;
        case "\\scientific":
        ;
        case "\\engineering":
          exdigits = 1;
          after = fmt.length || -1;
          break;
        default:
          break
      }
      var str = mv.format(before, after, explaces, exdigits, exform, exround);
      if(fmt.code === "\\scientific" && str.indexOf("E+") >= 0) {
        str = str.replace("E+", "\\times10^{") + "}"
      }
      return str
    }
    function formatMath(root, ref) {
      var options = Model.options ? Model.options : {};
      if(!ref || !ref.args) {
        ref = {args:[]}
      }
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      var node = Model.create(visit(root, {name:"formatMath", numeric:function(node) {
        if(ref && (ref.op === Model.SUB && (ref.args.length === 1 && ref.args[0].op === Model.FORMAT))) {
          ref = ref.args[0]
        }
        return formatExpression(ref.args[0], node)
      }, additive:function(node) {
        var args = [];
        if(ref && ref.op === Model.FORMAT) {
          return formatExpression(ref.args[0], node)
        }
        forEach(node.args, function(n, i) {
          n = formatMath(n, ref.args[i]);
          args.push(n)
        });
        return binaryNode(node.op, args)
      }, multiplicative:function(node) {
        ref = flattenNestedMultiplyNodes(ref);
        node = flattenNestedMultiplyNodes(node);
        var args = [];
        if(ref && ref.op === Model.FORMAT) {
          return formatExpression(ref.args[0], node)
        }
        forEach(node.args, function(n, i) {
          n = formatMath(n, ref.args[i]);
          args.push(n)
        });
        return multiplyNode(args)
      }, unary:function(node) {
        var arg0 = formatMath(node.args[0], ref.args[0]);
        switch(node.op) {
          case Model.PERCENT:
            node = unaryNode(node.op, [arg0]);
            break;
          case Model.SUB:
            if(ref && ref.op === Model.FORMAT) {
              return formatExpression(ref.args[0], node)
            }
            node = negate(arg0, true);
            break;
          default:
            node = unaryNode(node.op, [arg0]);
            break
        }
        return node
      }, variable:function(node) {
        return node
      }, exponential:function(node) {
        var args = [];
        if(ref && ref.op === Model.FORMAT) {
          return formatExpression(ref.args[0], node)
        }
        forEach(node.args, function(n, i) {
          n = formatMath(n, ref.args[i]);
          args.push(n)
        });
        return binaryNode(node.op, args)
      }, comma:function(node) {
        var vals = [];
        forEach(node.args, function(n, i) {
          vals = vals.concat(formatMath(n, ref.args[i]))
        });
        var node = newNode(node.op, vals);
        return node
      }, equals:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          n = formatMath(n, ref.args[i]);
          args.push(n)
        });
        return binaryNode(node.op, args)
      }}), root.location);
      return node
    }
    function checkVariableFormat(fmt, id) {
      var fmtList = normalizeFormatObject(fmt);
      assert(fmtList.length === 1, "2000: Internal error.");
      var code = fmtList[0].code;
      var length = fmtList[0].length;
      var name;
      switch(code) {
        case "\\variable":
          if(length === undefined) {
            name = "_"
          }else {
            if(!(name = varMap[id])) {
              if(indexOf(varNames, "_" + length) < 0) {
                varMap[id] = name = "_" + length;
                varNames.push(name)
              }else {
                name = id
              }
            }
          }
          break;
        case "\\integer":
        ;
        case "\\decimal":
        ;
        case "\\number":
        ;
        case "\\scientific":
        ;
        case "\\fraction":
        ;
        case "\\mixedFraction":
        ;
        case "\\mixedNumber":
        ;
        case "\\nonMixedNumber":
        ;
        case "\\fractionOrDecimal":
          name = id;
          break;
        default:
          assert(false, message(2015, [code]));
          break
      }
      return name
    }
    function isEmptyNode(node) {
      return node.op === Model.VAR && node.args[0] === "0"
    }
    function flattenNestedMultiplyNodes(node) {
      var args = [];
      if(node.op !== Model.MUL || node.isScientific) {
        return node
      }
      forEach(node.args, function(n) {
        if(n.op === Model.MUL) {
          forEach(n.args, function(n) {
            args = args.concat(flattenNestedMultiplyNodes(n))
          })
        }else {
          args.push(n)
        }
      });
      return multiplyNode(args, true)
    }
    function normalizeSyntax(root, ref) {
      var options = Model.options ? Model.options : {};
      if(!ref || !ref.args) {
        ref = {args:[]}
      }
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      var node = Model.create(visit(root, {name:"normalizeSyntax", format:function(node) {
        var fmtList = normalizeFormatObject(node.args[0]);
        if(fmtList[0].code === "\\variable") {
          var id;
          if(fmtList[0].length === undefined) {
            id = "_"
          }else {
            id = "_" + fmtList[0].length
          }
          return variableNode(id)
        }
        return normalNumber
      }, numeric:function(node) {
        if(ref && (ref.op === Model.SUB && (ref.args.length === 1 && ref.args[0].op === Model.FORMAT))) {
          ref = ref.args[0]
        }
        if(ref && (ref.op === Model.FORMAT && checkNumberFormat(ref.args[0], node))) {
          return normalNumber
        }
        return node
      }, additive:function(node) {
        var args = [];
        if(ref && (ref.op === Model.FORMAT && checkNumberFormat(ref.args[0], node))) {
          return normalNumber
        }
        forEach(node.args, function(n, i) {
          n = normalizeSyntax(n, ref.args[i]);
          args.push(n)
        });
        return addNode(args)
      }, multiplicative:function(node) {
        ref = flattenNestedMultiplyNodes(ref);
        node = flattenNestedMultiplyNodes(node);
        var args = [];
        if(ref && (ref.op === Model.FORMAT && checkNumberFormat(ref.args[0], node))) {
          return normalNumber
        }
        forEach(node.args, function(n, i) {
          n = normalizeSyntax(n, ref.args[i]);
          if(!isMinusOne(n)) {
            args.push(n)
          }
        });
        return multiplyNode(args)
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          args = args.concat(normalizeSyntax(n, ref.args[i]))
        });
        switch(node.op) {
          case Model.PERCENT:
            node = unaryNode(node.op, args);
            break;
          case Model.ADD:
            node = args[0];
            break;
          case Model.SUB:
            if(ref && (ref.op === Model.FORMAT && checkNumberFormat(ref.args[0], node.args[0]))) {
              return normalNumber
            }
            node = negate(args[0], true);
            break;
          default:
            node = newNode(node.op, args);
            break
        }
        return node
      }, variable:function(node) {
        var id = node.args[0];
        var name;
        if(ref && ref.op === Model.FORMAT) {
          name = checkVariableFormat(ref.args[0], id)
        }else {
          name = id
        }
        return variableNode(name)
      }, exponential:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          n = normalizeSyntax(n, ref.args[i]);
          args.push(n)
        });
        return binaryNode(node.op, args)
      }, comma:function(node) {
        var vals = [];
        forEach(node.args, function(n, i) {
          vals = vals.concat(normalizeSyntax(n, ref.args[i]))
        });
        var node = newNode(node.op, vals);
        return node
      }, equals:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          n = normalizeSyntax(n, ref.args[i]);
          args.push(n)
        });
        return binaryNode(node.op, args)
      }}), root.location);
      return node
    }
    function cancelFactors(node) {
      if(node.op !== Model.MUL) {
        return node
      }
      var changed = false;
      var numers = {};
      var denoms = {};
      forEach(node.args, function(n, i) {
        var f;
        if(isMinusOne(n)) {
          n = newNode(Model.POW, [nodeMinusOne, nodeMinusOne]);
          changed = true
        }
        var ff = factors(n, {}, false, true, true);
        forEach(ff, function(f) {
          var isDenom = f.op === Model.POW && isNeg(f.args[1]);
          var k = isDenom && (isMinusOne(f.args[1]) && f.args[0]) || (isDenom && newNode(Model.POW, [f.args[0], negate(f.args[1])]) || f);
          var mv = mathValue(k, true);
          if(isOne(mv)) {
            return
          }
          var key = mv !== null ? String(mv) : "nid$" + ast.intern(k);
          if(isDenom) {
            if(!denoms[key]) {
              denoms[key] = []
            }
            denoms[key].push(f)
          }else {
            if(!numers[key]) {
              numers[key] = []
            }
            numers[key].push(f)
          }
        })
      });
      assert(!numers["1"] && !denoms["1"], "2000: Identity multiplication should be factored out by now.");
      if(numers["-1"]) {
        if(numers["-1"].length % 2 === 0) {
          delete numers["-1"]
        }else {
          if(denoms.length > 0) {
            delete numers["-1"];
            denoms["-1"] = (denoms["-1"] || []).concat(binaryNode(Model.POW, [nodeMinusOne, nodeMinusOne]))
          }else {
            numers["-1"] = [].concat(numers["-1"][0])
          }
        }
        changed = true
      }
      if(denoms["-1"]) {
        if(denoms["-1"].length % 2 === 0) {
          delete denoms["-1"]
        }else {
          denoms["-1"] = [].concat(denoms["-1"][0])
        }
        changed = true
      }
      var nKeys = keys(numers);
      var dKeys = keys(denoms);
      if(nKeys.length === 0 || (dKeys.length === 0 || dKeys.length === 1 && dKeys[0] === "-1")) {
        return node
      }
      forEach(nKeys, function(k) {
        var nn = numers[k];
        var dd = denoms[k];
        if(dd) {
          var count = dd.length > nn.length ? nn.length : dd.length;
          numers[k] = k === "0" ? nn.slice(0, 1) : nn.slice(count);
          denoms[k] = k === "0" ? dd.slice(0, 1) : dd.slice(count);
          changed = true
        }
      });
      if(!changed) {
        return node
      }
      var nargs = [];
      var dargs = [];
      forEach(nKeys, function(k) {
        nargs = nargs.concat(numers[k])
      });
      forEach(dKeys, function(k) {
        dargs = dargs.concat(denoms[k])
      });
      var n, d;
      if(nargs.length) {
        n = multiplyNode(nargs, true)
      }else {
        n = null
      }
      if(dargs.length) {
        d = multiplyNode(dargs, true)
      }else {
        d = null
      }
      if(!n && !d) {
        return nodeOne
      }else {
        if(!d) {
          return n
        }else {
          if(!n) {
            return d
          }else {
            return multiplyNode([n, d], true)
          }
        }
      }
    }
    function cancelTerms(node, location) {
      if(node.op !== Model.ADD) {
        return node
      }
      var pos = {};
      var neg = {};
      forEach(node.args, function(n, i) {
        var isNegative = false;
        var f;
        if(isNeg(constantPart(n))) {
          isNegative = true;
          f = negate(n)
        }else {
          f = n
        }
        var mv = mathValue(f, true);
        var key = mv !== null ? String(mv) : "nid$" + ast.intern(f);
        if(isNegative) {
          if(!neg[key]) {
            neg[key] = []
          }
          neg[key].push(n)
        }else {
          if(!pos[key]) {
            pos[key] = []
          }
          pos[key].push(n)
        }
      });
      var pKeys = keys(pos);
      var nKeys = keys(neg);
      if(pKeys.length === 0 || (nKeys.length === 0 || nKeys.length === 1 && nKeys[0] === "-1")) {
        return node
      }
      var args = [];
      var changed = false;
      forEach(pKeys, function(k) {
        var nn = pos[k];
        var dd = neg[k];
        if(dd) {
          var count = dd.length > nn.length ? nn.length : dd.length;
          pos[k] = nn.slice(count);
          neg[k] = dd.slice(count);
          changed = true
        }
      });
      if(!changed) {
        return node
      }
      forEach(pKeys, function(k) {
        args = args.concat(pos[k])
      });
      forEach(nKeys, function(k) {
        args = args.concat(neg[k])
      });
      if(args.length) {
        return addNode(args)
      }else {
        return nodeZero
      }
    }
    function cancelEquals(node) {
      if(!isComparison(node.op) || (node.args.length != 2 || (isZero(node.args[0]) || isZero(node.args[1])))) {
        return node
      }
      var lnode = node.args[0];
      var rnode = node.args[1];
      var largs, rargs;
      if(lnode.op === Model.MUL) {
        largs = lnode.args
      }else {
        largs = [lnode]
      }
      if(rnode.op === Model.MUL) {
        rargs = rnode.args
      }else {
        rargs = [rnode]
      }
      var lhs = {};
      var rhs = {};
      forEach(largs, function(n) {
        var mv = mathValue(n, true);
        var key = mv !== null ? String(mv) : "lvars";
        if(!lhs[key]) {
          lhs[key] = []
        }
        lhs[key].push(n)
      });
      forEach(rargs, function(n) {
        var mv = mathValue(n, true);
        var key = mv !== null ? String(mv) : "rvars";
        if(!rhs[key]) {
          rhs[key] = []
        }
        rhs[key].push(n)
      });
      var lKeys = keys(lhs);
      var rKeys = keys(rhs);
      var args = [];
      var changed = false;
      forEach(lKeys, function(k) {
        var ll = lhs[k];
        var rr = rhs[k];
        if(rr) {
          var count = rr.length > ll.length ? ll.length : rr.length;
          lhs[k] = ll.slice(count);
          rhs[k] = rr.slice(count);
          changed = true
        }
      });
      if(!changed) {
        return node
      }
      var largs = [];
      var rargs = [];
      forEach(lKeys, function(k) {
        largs = largs.concat(lhs[k])
      });
      forEach(rKeys, function(k) {
        rargs = rargs.concat(rhs[k])
      });
      var larg, rarg;
      if(largs.length === 0) {
        larg = nodeOne
      }else {
        larg = multiplyNode(largs)
      }
      if(rargs.length === 0) {
        rarg = nodeOne
      }else {
        rarg = multiplyNode(rargs)
      }
      var lmv, rmv;
      if((lmv = mathValue(larg)) && ((rmv = mathValue(rarg)) && lmv.compareTo(rmv) === 0)) {
        larg = rarg = nodeZero
      }
      return binaryNode(node.op, [larg, rarg])
    }
    function factorQuadratic(node) {
      var coeffs, vars, roots;
      if((coeffs = isPolynomial(node)) && (coeffs.length === 3 && (vars = variables(node)).length === 1)) {
        roots = solveQuadratic(coeffs[2], coeffs[1], coeffs[0]);
        if(roots) {
          node = multiplyNode([addNode([variableNode(vars[0]), negate(numberNode(roots[0]))]), addNode([variableNode(vars[0]), negate(numberNode(roots[1]))])])
        }
      }
      return node
    }
    function combineLikeFactors(ff) {
      if(!ff || ff.length === 0) {
        return[]
      }
      var base;
      var expo = bigZero;
      var baseNid = 0;
      forEach(ff, function(f) {
        var b, e;
        if(f.op === Model.POW) {
          b = f.args[0];
          e = mathValue(f.args[1], true)
        }else {
          b = f;
          e = bigOne
        }
        assert(e !== null);
        assert(baseNid === 0 || ast.intern(b) === baseNid);
        baseNid = ast.intern(b);
        base = b;
        expo = expo.add(e)
      });
      return[newNode(Model.POW, [base, numberNode(expo)])]
    }
    function factorCommonExpressions(node) {
      if(node.op !== Model.ADD) {
        return node
      }
      var changed = false;
      var nargs = node.args.slice(0);
      var n1 = nargs.shift();
      var nn1 = {};
      var nnf = {};
      var args = n1.op === Model.MUL ? n1.args : [n1];
      forEach(args, function(n, i) {
        var mv = mathValue(n, true);
        var key = mv !== null ? String(mv) : n.op === Model.POW && mathValue(n.args[1]) ? "nid$" + ast.intern(n.args[0]) : "nid$" + ast.intern(n);
        if(!nnf[key]) {
          nnf[key] = []
        }
        nnf[key].push(n)
      });
      nn1["1"] = [nodeOne];
      var ttt = [nn1];
      var nnn2 = [];
      forEach(nargs, function(n2) {
        var nn2 = {};
        nnn2.push(nn2);
        var args = n2.op === Model.MUL ? n2.args : [n2];
        forEach(args, function(n, i) {
          var mv = mathValue(n, true);
          var key = mv !== null ? String(mv) : n.op === Model.POW && mathValue(n.args[1]) ? "nid$" + ast.intern(n.args[0]) : "nid$" + ast.intern(n);
          if(!nn2[key]) {
            nn2[key] = []
          }
          nn2[key].push(n)
        });
        var n1Keys = keys(nn1);
        var n2Keys = keys(nn2);
        var nfKeys = keys(nnf);
        if(nfKeys.length === 1 || (n1Keys.length === 0 || (n2Keys.length === 0 || n2Keys.length === 1 && n2Keys[0] === "-1"))) {
          return node
        }
        var ff = [];
        forEach(nfKeys, function(k) {
          if(nn2[k] && nn2[k].length) {
            var fff = nnf[k] = combineLikeFactors(nnf[k]);
            var ff1 = nn1[k] = combineLikeFactors(nn1[k]);
            var ff2 = nn2[k] = combineLikeFactors(nn2[k]);
            var fffLength = fff.length;
            var ff2Length = ff2.length;
            while(fffLength-- > 0 && ff2Length-- > 0) {
              var ff = fff.pop();
              var f2 = ff2.pop();
              var ef = ff.op === Model.POW && mathValue(ff.args[1]) ? mathValue(ff.args[1], true) : bigOne;
              var e2 = f2.op === Model.POW && mathValue(f2.args[1]) ? mathValue(f2.args[1], true) : bigOne;
              if(isLessThan(ef, e2)) {
                var e = e2.subtract(ef);
                var b = ff.op === Model.POW && mathValue(ff.args[1], true) ? ff.args[0] : ff;
                if(!isZero(e)) {
                  ff2.push(isOne(e) ? b : newNode(Model.POW, [b, numberNode(e)]))
                }
                if(!isZero(ef)) {
                  fff.push(isOne(ef) ? b : newNode(Model.POW, [b, numberNode(ef)]))
                }
              }else {
                var e = ef.subtract(e2);
                var b = ff.op === Model.POW && mathValue(ff.args[1], true) ? ff.args[0] : ff;
                if(!isZero(e)) {
                  ttt.forEach(function(nf1) {
                    var ff1 = nf1[k];
                    ff1.push(isOne(e) ? b : newNode(Model.POW, [b, numberNode(e)]))
                  })
                }
                if(!isZero(e2)) {
                  fff.push(isOne(e2) ? b : newNode(Model.POW, [b, numberNode(e2)]))
                }
              }
            }
            changed = true
          }else {
            var fff = nnf[k];
            while(fff.length > 0) {
              var ff = fff.pop();
              ttt.forEach(function(nf1) {
                var ff1 = nf1[k] || (nn1[k] = []);
                ff1.push(ff)
              })
            }
            changed = true
          }
        });
        ttt.push(nn2)
      });
      if(!changed) {
        return node
      }
      var args = [];
      var addArgs = [];
      forEach(keys(nn1), function(k) {
        args = args.concat(nn1[k])
      });
      if(args.length === 0) {
        n1 = nodeOne
      }else {
        if(args.length === 1) {
          n1 = args[0]
        }else {
          n1 = multiplyNode(args)
        }
      }
      addArgs.push(n1);
      forEach(nnn2, function(nn2) {
        var args = [];
        var n2;
        forEach(keys(nn2), function(k) {
          args = args.concat(nn2[k])
        });
        if(args.length === 0) {
          n2 = nodeOne
        }else {
          if(args.length === 1) {
            n2 = args[0]
          }else {
            n2 = multiplyNode(args)
          }
        }
        addArgs.push(n2)
      });
      var args = [];
      forEach(keys(nnf), function(k) {
        args = args.concat(nnf[k])
      });
      if(args.length === 0) {
        return node
      }
      return multiplyNode(args.concat(addNode(addArgs)))
    }
    function eraseCommonExpressions(n1, n2) {
      n1 = factorCommonExpressions(n1);
      n2 = factorCommonExpressions(n2);
      n1 = cancelFactors(n1);
      n2 = cancelFactors(n2);
      if(n1.op !== n2.op || n1.op !== Model.MUL) {
        return[n1, n2]
      }
      var changed = false;
      var nn1 = {};
      var nn2 = {};
      forEach(n1.args, function(n, i) {
        var mv = mathValue(n, true);
        var key = mv !== null ? String(mv) : n.op === Model.POW && mathValue(n.args[1]) ? "nid$" + ast.intern(n.args[0]) : "nid$" + ast.intern(n);
        if(!nn1[key]) {
          nn1[key] = []
        }
        nn1[key].push(n)
      });
      forEach(n2.args, function(n, i) {
        var mv = mathValue(n, true);
        var key = mv !== null ? String(mv) : n.op === Model.POW && mathValue(n.args[1]) ? "nid$" + ast.intern(n.args[0]) : "nid$" + ast.intern(n);
        if(!nn2[key]) {
          nn2[key] = []
        }
        nn2[key].push(n)
      });
      var nKeys = keys(nn1);
      var dKeys = keys(nn2);
      if(nKeys.length === 0 || (dKeys.length === 0 || dKeys.length === 1 && dKeys[0] === "-1")) {
        return[n1, n2]
      }
      forEach(nKeys, function(k) {
        if(!isNaN(+k)) {
          return
        }
        var nn = nn1[k];
        var dd = nn2[k];
        if(dd) {
          while(nn.length > 0 && dd.length > 0) {
            var n1 = nn.pop();
            var n2 = dd.pop();
            var e1 = n1.op === Model.POW && mathValue(n1.args[1]) ? mathValue(n1.args[1], true) : bigOne;
            var e2 = n2.op === Model.POW && mathValue(n2.args[1]) ? mathValue(n2.args[1], true) : bigOne;
            if(isLessThan(e1, e2)) {
              var e = e2.subtract(e1);
              var b = n1.op === Model.POW && mathValue(n1.args[1], true) ? n1.args[0] : n1;
              dd.push(isOne(e) ? b : newNode(Model.POW, [b, numberNode(e)]))
            }else {
              var e = e1.subtract(e2);
              var b = n1.op === Model.POW && mathValue(n1.args[1], true) ? n1.args[0] : n1;
              if(!isZero(e)) {
                nn.push(isOne(e) ? b : newNode(Model.POW, [b, numberNode(e)]))
              }
            }
          }
          changed = true
        }
      });
      if(!changed) {
        return[cancelFactors(n1), cancelFactors(n2)]
      }
      var args = [];
      forEach(nKeys, function(k) {
        args = args.concat(nn1[k])
      });
      if(args.length === 0) {
        n1 = nodeOne
      }else {
        if(args.length === 1) {
          args.push(nodeOne);
          n1 = newNode(n1.op, args)
        }else {
          n1 = newNode(n1.op, args)
        }
      }
      var args = [];
      forEach(dKeys, function(k) {
        args = args.concat(nn2[k])
      });
      if(args.length === 0) {
        n2 = nodeOne
      }else {
        if(args.length === 1) {
          args.push(nodeOne);
          n2 = newNode(n2.op, args)
        }else {
          n2 = newNode(n2.op, args)
        }
      }
      return[cancelFactors(n1), cancelFactors(n2)]
    }
    var normalizedNodes = [];
    function normalize(root) {
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.normalizeNid === nid) {
        return root
      }
      var cachedNode;
      if((cachedNode = normalizedNodes[nid]) !== undefined) {
        return cachedNode
      }
      var rootNid = nid;
      var node = Model.create(visit(root, {name:"normalize", numeric:function(node) {
        if(isRepeating(node) || !option("dontConvertDecimalToFraction") && isDecimal(node)) {
          node = decimalToFraction(node)
        }
        return node
      }, additive:function(node) {
        if(node.op === Model.SUB) {
          assert(node.args.length === 2, "2000: Internal error.");
          node = addNode([node.args[0], negate(node.args[1], true)], true)
        }else {
          if(node.op === Model.PM) {
            assert(node.args.length === 2, "2000: Operator pm can only be used on binary nodes");
            node = addNode([node.args[0], unaryNode(Model.PM, [node.args[1]])])
          }else {
            if(some(node.args, function(arg) {
              return arg.op === Model.INTEGRAL && arg.args.length === 3
            })) {
              return normalizeIntegralAddition(node)
            }
          }
        }
        if(node.op === Model.MATRIX || node.op === Model.BACKSLASH) {
          return node
        }
        var mv = bigZero;
        var args = [];
        forEach(node.args, function(n) {
          if(n.op === Model.NUM && (mathValue(n, true) && !option("dontConvertDecimalToFraction"))) {
            mv = mv.add(mathValue(n, true))
          }else {
            args = args.concat(normalize(n))
          }
        });
        var isMixedNumber = node.isMixedNumber;
        if(!isZero(mv) || args.length === 0) {
          args.unshift(numberNode(mv))
        }
        node = newNode(node.op, args);
        node.isMixedNumber = isMixedNumber;
        node = flattenNestedNodes(node);
        return sort(node)
      }, multiplicative:function(node) {
        assert(node.op !== Model.DIV, "2000: Divsion should be eliminated during parsing");
        if(node.op === Model.FRAC) {
          if(node.args[1].op === Model.POW) {
            var denom = node.args[1];
            var b = denom.args[0];
            var e = denom.args[1];
            node = multiplyNode([node.args[0], newNode(Model.POW, [b, negate(e, true)])])
          }else {
            node = multiplyNode([node.args[0], newNode(Model.POW, [node.args[1], nodeMinusOne])])
          }
        }
        var args = [];
        var hasPM;
        forEach(node.args, function(n) {
          n = normalize(n);
          if(ast.intern(n) === ast.intern(nodeOne)) {
            return
          }
          if(args.length > 0 && isMinusOne(args[args.length - 1])) {
            if(isMinusOne(n)) {
              args.pop();
              return
            }
            if(isPositiveInfinity(n)) {
              args.pop();
              args.push(nodeNegativeInfinity);
              return
            }
            if(isNegativeInfinity(n)) {
              args.pop();
              args.push(nodePositiveInfinity);
              return
            }
          }
          if(n.op === Model.MUL) {
            args = args.concat(n.args)
          }else {
            if(n.op === Model.PM) {
              hasPM = true;
              args.push(n.args[0])
            }else {
              args.push(n)
            }
          }
        });
        if(args.length === 0) {
          node = nodeOne
        }else {
          if(args.length === 1) {
            node = args[0]
          }else {
            node = sort(binaryNode(node.op, args))
          }
        }
        if(hasPM) {
          node = unaryNode(Model.PM, [node])
        }
        return node
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(normalize(n))
        });
        node = newNode(node.op, args);
        switch(node.op) {
          case Model.PAREN:
            node = node.args[0];
            break;
          case Model.SUB:
            if(node.args[0].op === Model.POW && isNeg(node.args[0].args[1])) {
              node = negate(node.args[0])
            }else {
              node = negate(node.args[0], true)
            }
            break;
          case Model.PERCENT:
            if(args[0].op === Model.NUM) {
              var mv = mathValue(args[0]);
              node = numberNode(divide(mv, 100))
            }else {
              node = multiplyNode([binaryNode(Model.POW, [numberNode("100"), nodeMinusOne]), args[0]])
            }
            break;
          case Model.PM:
            if(isNeg(mathValue(args[0], true))) {
              var args = node.args.slice(0);
              node = newNode(node.op, [negate(args.shift(), true)].concat(args))
            }
            break;
          case Model.FACT:
            var mv = mathValue(args[0]);
            if(mv) {
              node = numberNode(factorial(mv))
            }else {
              node = unaryNode(node.op, [args[0]])
            }
            break;
          case Model.INTEGRAL:
            node = normalizeIntegral(node);
            break;
          case Model.SIN:
          ;
          case Model.COS:
          ;
          case Model.SINH:
          ;
          case Model.COSH:
          ;
          case Model.ARCSINH:
          ;
          case Model.ARCCOSH:
            node = normalizeTrigIdent(node);
            break;
          case Model.TAN:
          ;
          case Model.TANH:
            var s = node.op === Model.TAN ? Model.SIN : Model.SINH;
            var c = node.op === Model.TAN ? Model.COS : Model.COSH;
            var arg0 = normalize(node.args[0]);
            node = multiplyNode([newNode(s, [arg0]), binaryNode(Model.POW, [newNode(c, [arg0]), nodeMinusOne])]);
            break;
          case Model.COT:
          ;
          case Model.COTH:
            var s = node.op === Model.COT ? Model.SIN : Model.SINH;
            var c = node.op === Model.COT ? Model.COS : Model.COSH;
            var arg0 = normalize(node.args[0]);
            node = multiplyNode([newNode(c, [arg0]), binaryNode(Model.POW, [newNode(s, [arg0]), nodeMinusOne])]);
            break;
          case Model.SEC:
          ;
          case Model.SECH:
            var c = node.op === Model.SEC ? Model.COS : Model.COSH;
            var arg0 = normalize(node.args[0]);
            node = multiplyNode([binaryNode(Model.POW, [newNode(c, [arg0]), nodeMinusOne])]);
            break;
          case Model.CSC:
          ;
          case Model.CSCH:
            var s = node.op === Model.CSC ? Model.SIN : Model.SINH;
            var arg0 = normalize(node.args[0]);
            node = multiplyNode([binaryNode(Model.POW, [newNode(s, [arg0]), nodeMinusOne])]);
            break;
          case Model.ABS:
            node = normalizeAbs(node);
            break;
          default:
            break
        }
        return node
      }, variable:function(node) {
        var val;
        if(node.args[0] === "i" && !option("dontSimplifyImaginary")) {
          node = nodeImaginary
        }else {
          if(node.args[0] === "\\infty") {
            node = nodePositiveInfinity
          }else {
            if(node.args[0] === "\\radian") {
              node = nodeOne
            }else {
              if(node.args[0] === "\\degree") {
                node = fractionNode(nodePI, numberNode("180"))
              }else {
                if(option("ignoreUnits") && (Model.env[node.args[0]] && Model.env[node.args[0]].type === "unit")) {
                  var vv = [];
                  node.args[0].split("").forEach(function(v) {
                    vv.push(variableNode(v))
                  });
                  return multiplyNode(vv)
                }else {
                  if((val = Model.env[node.args[0]]) && val.type === "param") {
                    node = val.value
                  }
                }
              }
            }
          }
        }
        return node
      }, exponential:function(node) {
        var base = node.args[0];
        var expo = node.args[1];
        if(node.op === Model.POW && (node.args.length === 2 && (base.op === Model.TANH && (expo.op === Model.NUM && expo.args[0] === "2")))) {
          return addNode([nodeOne, negate(binaryNode(Model.POW, [binaryNode(Model.POW, [newNode(Model.COSH, base.args), nodeTwo]), nodeMinusOne]))])
        }else {
          if(node.op === Model.POW && (node.args.length === 2 && (base.op === Model.SINH && ast.intern(expo) === ast.intern(nodeTwo)))) {
            return addNode([binaryNode(Model.POW, [newNode(Model.COSH, base.args), nodeTwo]), nodeMinusOne])
          }else {
            if(node.op === Model.POW && (node.args.length === 2 && (base.op === Model.COTH && (expo.op === Model.NUM && expo.args[0] === "2")))) {
              return addNode([nodeOne, binaryNode(Model.POW, [binaryNode(Model.POW, [newNode(Model.SINH, base.args), nodeTwo]), nodeMinusOne])])
            }else {
              if(node.op === Model.POW && (node.args.length === 2 && (base.op === Model.SECH && (expo.op === Model.NUM && expo.args[0] === "2")))) {
                return binaryNode(Model.POW, [binaryNode(Model.POW, [newNode(Model.COSH, base.args), nodeTwo]), nodeMinusOne])
              }else {
                if(node.op === Model.POW && (node.args.length === 2 && (base.op === Model.CSCH && (expo.op === Model.NUM && expo.args[0] === "2")))) {
                  return binaryNode(Model.POW, [binaryNode(Model.POW, [newNode(Model.SINH, base.args), nodeTwo]), nodeMinusOne])
                }
              }
            }
          }
        }
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(normalize(n))
        });
        node = newNode(node.op, args);
        var args = [];
        switch(node.op) {
          case Model.LOG:
            if(ast.intern(node.args[0]) === ast.intern(nodeE)) {
              args.push(nodeE)
            }else {
              args.push(normalize(node.args[0]))
            }
            if(node.args.length > 1) {
              args = args.concat(node.args.slice(1))
            }
            node = normalizeLogIdent(args[0], args[1]);
            break;
          case Model.POW:
            if(isMinusOne(node.args[0]) && toNumber(mathValue(node.args[1], true)) === 0.5) {
              return nodeImaginary
            }else {
              if(isMinusOne(node.args[0]) && isMinusOne(node.args[1])) {
                return nodeMinusOne
              }else {
                if(node.args.length === 2 && node.args[1].op === Model.LOG) {
                  var n1 = node.args[0];
                  var n2 = node.args[1].args[1];
                  var base = node.args[1].args[0];
                  var args = sort(multiplyNode([n1, n2])).args;
                  return binaryNode(Model.POW, [args[0], binaryNode(node.args[1].op, [base, args[1]])])
                }
              }
            }
            break;
          default:
            break
        }
        return node
      }, comma:function(node) {
        var vals = [];
        forEach(node.args, function(n) {
          vals = vals.concat(normalize(n))
        });
        var node = newNode(node.op, vals);
        return sort(node)
      }, equals:function(node) {
        assert(node.args.length === 2, "2000: Internal error.");
        var args = [];
        forEach(node.args, function(n) {
          n = normalize(n);
          args.push(n)
        });
        node = binaryNode(node.op, args);
        if(node.op === Model.GT || (node.op === Model.GE || node.op === Model.NLESS)) {
          node.op = node.op === Model.GT ? Model.LT : Model.LE;
          var t = node.args[0];
          node.args[0] = node.args[1];
          node.args[1] = t
        }else {
          if(node.op === Model.NGTR) {
            node.op = Model.LE
          }
        }
        node = sort(node);
        if(node.op !== Model.COLON && !isZero(mathValue(node.args[1], true))) {
          node = binaryNode(node.op, [addNode([node.args[0], multiplyNode([nodeMinusOne, node.args[1]], true)], true), nodeZero])
        }else {
          if(!isZero(mathValue(node.args[1], true)) && !isOne(mathValue(node.args[1], true))) {
            node = binaryNode(node.op, [multiplyNode([node.args[0], binaryNode(Model.POW, [node.args[1], nodeMinusOne])]), nodeOne])
          }
        }
        if(node.op === Model.COLON) {
          node = node.args[0]
        }
        return node
      }}), root.location);
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = normalize(node)
      }
      node.normalizeNid = nid;
      normalizedNodes[rootNid] = node;
      return node
    }
    function normalizeCalculate(root) {
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.normalizeCalculateNid === nid) {
        return root
      }
      var rootNid = nid;
      var node = Model.create(visit(root, {name:"normalizeCalculate", numeric:function(node) {
        if(isRepeating(node) || !option("dontConvertDecimalToFraction") && isDecimal(node)) {
          node = decimalToFraction(node)
        }else {
          if(isNeg(node)) {
            node = numberNode(node.args[0])
          }
        }
        return node
      }, additive:function(node) {
        if(node.op === Model.SUB) {
          assert(node.args.length === 2, "2000: Internal error.");
          node = addNode([node.args[0], negate(node.args[1])], true)
        }else {
          if(node.op === Model.PM) {
            assert(node.args.length === 2, "2000: Operator pm can only be used on binary nodes");
            node = addNode([node.args[0], unaryNode(Model.PM, [node.args[1]])])
          }
        }
        var args = [];
        if(node.op === Model.MATRIX) {
          return node
        }
        node = flattenNestedNodes(node);
        return sort(node)
      }, multiplicative:function(node) {
        assert(node.op !== Model.DIV, "2000: Divsion should be eliminated during parsing");
        if(node.op === Model.FRAC) {
          node = multiplyNode([node.args[0], newNode(Model.POW, [node.args[1], nodeMinusOne])])
        }
        var args = [];
        var hasPM;
        forEach(node.args, function(n) {
          n = normalizeCalculate(n);
          if(ast.intern(n) === ast.intern(nodeOne)) {
            return
          }
          if(args.length > 0 && isMinusOne(args[args.length - 1])) {
            if(isMinusOne(n)) {
              args.pop();
              return
            }
            if(isPositiveInfinity(n)) {
              args.pop();
              args.push(nodeNegativeInfinity);
              return
            }
            if(isNegativeInfinity(n)) {
              args.pop();
              args.push(nodePositiveInfinity);
              return
            }
          }
          if(n.op === Model.MUL) {
            args = args.concat(n.args)
          }else {
            if(n.op === Model.PM) {
              hasPM = true;
              args.push(n.args[0])
            }else {
              args.push(n)
            }
          }
        });
        if(args.length === 0) {
          node = nodeOne
        }else {
          if(args.length === 1) {
            node = args[0]
          }else {
            node = sort(binaryNode(node.op, args))
          }
        }
        if(hasPM) {
          node = unaryNode(Model.PM, [node])
        }
        return node
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(normalizeCalculate(n))
        });
        node = newNode(node.op, args);
        switch(node.op) {
          case Model.SUB:
            node = negate(args[0]);
            break;
          case Model.PERCENT:
            if(args[0].op === Model.NUM) {
              var mv = mathValue(args[0]);
              node = numberNode(divide(mv, 100))
            }else {
              node = multiplyNode([binaryNode(Model.POW, [numberNode("100"), nodeMinusOne]), args[0]])
            }
            break;
          case Model.PM:
            if(isNeg(mathValue(args[0], true))) {
              var args = node.args.slice(0);
              node = newNode(node.op, [negate(args.shift())].concat(args))
            }
            break;
          case Model.FACT:
            var mv = mathValue(args[0]);
            if(mv) {
              node = numberNode(factorial(mv))
            }else {
              node = unaryNode(node.op, [args[0]])
            }
            break;
          default:
            break
        }
        return node
      }, variable:function(node) {
        if(node.args[0] === "i" && !option("dontSimplifyImaginary")) {
          node = nodeImaginary
        }
        if(node.args[0] === "\\infty") {
          node = nodePositiveInfinity
        }
        return node
      }, exponential:function(node) {
        var args = [];
        switch(node.op) {
          case Model.LOG:
            if(ast.intern(node.args[0]) === ast.intern(nodeE)) {
              args.push(nodeE)
            }else {
              args.push(normalizeCalculate(node.args[0]))
            }
            break;
          case Model.POW:
            if(isMinusOne(node.args[0]) && toNumber(mathValue(node.args[1], true)) === 0.5) {
              return nodeImaginary
            }else {
              if(isOne(node.args[0])) {
                return nodeOne
              }else {
                if(isMinusOne(node.args[0]) && isMinusOne(node.args[1])) {
                  return nodeMinusOne
                }
              }
            }
          ;
          default:
            args.push(normalizeCalculate(node.args[0]));
            break
        }
        args.push(normalizeCalculate(node.args[1]));
        return binaryNode(node.op, args)
      }, comma:function(node) {
        var vals = [];
        forEach(node.args, function(n) {
          vals = vals.concat(normalizeCalculate(n))
        });
        var node = newNode(node.op, vals);
        return sort(node)
      }, equals:function(node) {
        assert(node.args.length === 2, message(2006));
        assert(isZero(node.args[1]), "2000: Internal error.");
        var coeffs = isPolynomial(node);
        assert(coeffs.length === 2, "2000: Internal error.");
        var c0 = coeffs[0] === undefined ? "1" : coeffs[0];
        var c1 = coeffs[1] === undefined ? "1" : coeffs[1];
        return fractionNode(negate(numberNode(c0)), numberNode(c1))
      }}), root.location);
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = normalizeCalculate(node)
      }
      node.normalizeCalculateNid = nid;
      return node
    }
    var sortedNodes = [];
    function sort(root) {
      Assert.checkTimeout();
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.sortNid === nid) {
        return root
      }
      var cachedNode;
      if((cachedNode = sortedNodes[nid]) !== undefined) {
        return cachedNode
      }
      var rootNid = nid;
      var node = visit(root, {name:"sort", numeric:function(node) {
        return node
      }, additive:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          if(i > 0 && node.op === Model.SUB) {
            n = negate(n)
          }
          args.push(sort(n))
        });
        var op = node.op === Model.SUB ? Model.ADD : node.op;
        var isMixedNumber = node.isMixedNumber;
        node = binaryNode(op, args, true);
        node.isMixedNumber = isMixedNumber;
        if(node.op === Model.PM || node.op === Model.BACKSLASH) {
          return node
        }
        var d0, d1;
        var n0, n1;
        var v0, v1;
        var c0, c1;
        var s0, s1;
        var cp0, cp1;
        for(var i = 0;i < node.args.length - 1;i++) {
          n0 = node.args[i];
          n1 = node.args[i + 1];
          d0 = degree(node.args[i]);
          d1 = degree(node.args[i + 1]);
          if(d0 < d1) {
            node.args[i] = n1;
            node.args[i + 1] = n0
          }else {
            if(d0 === d1) {
              v0 = variables(n0);
              v1 = variables(n1);
              if(v0.length !== v1.length) {
                if(v0.length < v1.length) {
                  node.args[i] = n1;
                  node.args[i + 1] = n0
                }
              }else {
                if(v0.length > 0) {
                  if((s0 = v0.join(",")) !== (s1 = v1.join(","))) {
                    if(s0 < s1) {
                      node.args[i] = n1;
                      node.args[i + 1] = n0
                    }
                  }else {
                    if((c0 = isPolynomial(n0)) && ((c1 = isPolynomial(n1)) && (s0 = c0.join(",")) !== (s1 = c1.join(",")))) {
                      if(s0 < s1) {
                        node.args[i] = n1;
                        node.args[i + 1] = n0
                      }
                    }else {
                      if(isLessThan(constantPart(n0), constantPart(n1))) {
                        node.args[i] = n1;
                        node.args[i + 1] = n0
                      }
                    }
                  }
                }else {
                  if(d0 === 0) {
                    if(exponent(n0) !== exponent(n1)) {
                      if(exponent(n0) < exponent(n1)) {
                        node.args[i] = n1;
                        node.args[i + 1] = n0
                      }
                    }else {
                      if(isLessThan(cp0 = constantPart(n0), cp1 = constantPart(n1))) {
                        node.args[i] = n1;
                        node.args[i + 1] = n0
                      }else {
                        if(!cp0 && cp1) {
                          node.args[i] = n1;
                          node.args[i + 1] = n0
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return node
      }, multiplicative:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          args.push(sort(n))
        });
        node = binaryNode(node.op, args);
        if(node.op === Model.FRAC || node.op === Model.COEFF) {
          return node
        }
        var d0, d1;
        var n0, n1;
        var v0, v1;
        var c0, c1;
        for(var i = 0;i < node.args.length - 1;i++) {
          var s0, s1;
          n0 = node.args[i];
          n1 = node.args[i + 1];
          d0 = degree(n0);
          d1 = degree(n1);
          if(d0 > d1) {
            node.args[i] = n1;
            node.args[i + 1] = n0
          }else {
            if(Math.abs(d0) === Math.abs(d1)) {
              v0 = variables(n0);
              v1 = variables(n1);
              var e0 = exponent(n0);
              var e1 = exponent(n1);
              if(e0 !== e1 && (!isNaN(e0) && !isNaN(e1))) {
                if(e0 < e1) {
                  node.args[i] = n1;
                  node.args[i + 1] = n0
                }
              }else {
                if(v0.length !== v1.length) {
                  if(v0.length < v1.length) {
                    node.args[i] = n1;
                    node.args[i + 1] = n0
                  }
                }else {
                  if(n0.op === Model.POW && (n1.op === Model.POW && v0.length === 0)) {
                    if(mathValue(n0.args[0]) < mathValue(n1.args[0])) {
                      node.args[i] = n1;
                      node.args[i + 1] = n0
                    }
                  }else {
                    if(n0.op !== n1.op) {
                      if(hashCode(n0.op) < hashCode(n1.op)) {
                        node.args[i] = n1;
                        node.args[i + 1] = n0
                      }
                    }else {
                      if(v0.length > 0) {
                        if((s0 = v0.join(",")) !== (s1 = v1.join(","))) {
                          if(s0 < s1) {
                            node.args[i] = n1;
                            node.args[i + 1] = n0
                          }
                        }else {
                          if((c0 = isPolynomial(n0)) && ((c1 = isPolynomial(n1)) && (s0 = c0.join(",")) !== (s1 = c1.join(",")))) {
                            if(s0 < s1) {
                              node.args[i] = n1;
                              node.args[i + 1] = n0
                            }
                          }else {
                            if(isLessThan(constantPart(n0), constantPart(n1))) {
                              node.args[i] = n1;
                              node.args[i + 1] = n0
                            }
                          }
                        }
                      }else {
                        if(isLessThan(leadingCoeff(n0), leadingCoeff(n1))) {
                          node.args[i] = n1;
                          node.args[i + 1] = n0
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return node
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(sort(n))
        });
        return newNode(node.op, args)
      }, exponential:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          args.push(sort(n))
        });
        node = binaryNode(node.op, args);
        return node
      }, variable:function(node) {
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(sort(n))
        });
        switch(node.op) {
          case Model.COMMA:
            args.sort(function(a, b) {
              a = JSON.stringify(a);
              b = JSON.stringify(b);
              if(a < b) {
                return-1
              }
              if(a > b) {
                return 1
              }
              return 0
            });
            break;
          default:
            break
        }
        return newNode(node.op, args)
      }, equals:function(node) {
        forEach(node.args, function(n, i) {
          node.args[i] = sort(n)
        });
        if(node.op === Model.COLON || (node.op === Model.RIGHTARROW || (node.op === Model.GT || (node.op === Model.GE || (node.op === Model.LT || (node.op === Model.LE || (node.op === Model.NGTR || (node.op === Model.NLESS || node.args.length === 2 && isZero(node.args[1]))))))))) {
          return node
        }
        var d0, d1;
        var n0, n1;
        var v0, v1;
        for(var i = 0;i < node.args.length - 1;i++) {
          n0 = node.args[i];
          n1 = node.args[i + 1];
          if((d0 = degree(node.args[i], true)) < (d1 = degree(node.args[i + 1], true))) {
            node.args[i] = n1;
            node.args[i + 1] = n0
          }else {
            if(d0 === d1) {
              v0 = variables(n0);
              v1 = variables(n1);
              if(v0.length !== v1.length) {
                if(v0.length < v1.length) {
                  var t = node.args[i];
                  node.args[i] = n1;
                  node.args[i + 1] = n0
                }
              }else {
                if(v0.length > 0) {
                  if(v0[0] < v1[0]) {
                    var t = node.args[i];
                    node.args[i] = n1;
                    node.args[i + 1] = n0
                  }
                }else {
                  if(!isZero(n1) && isLessThan(mathValue(n0), mathValue(n1))) {
                    var t = node.args[i];
                    node.args[i] = n1;
                    node.args[i + 1] = n0
                  }
                }
              }
            }
          }
        }
        return node
      }});
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = sort(node)
      }
      node.sortNid = nid;
      sortedNodes[rootNid] = node;
      return node
    }
    var sortedLiteralNodes = [];
    function sortLiteral(root) {
      Assert.checkTimeout();
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.sortLiteralNid === nid) {
        return root
      }
      var cachedNode;
      if((cachedNode = sortedLiteralNodes[nid]) !== undefined) {
        return cachedNode
      }
      var rootNid = nid;
      var node = visit(root, {name:"sortLiteral", numeric:function(node) {
        return node
      }, additive:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          if(i > 0 && node.op === Model.SUB) {
            n = negate(n, true)
          }
          args.push(sortLiteral(n))
        });
        var op = node.op === Model.SUB ? Model.ADD : node.op;
        node = binaryNode(op, args, true);
        if(node.op === Model.PM || node.op === Model.BACKSLASH) {
          return node
        }
        var id0, id1;
        var n0, n1;
        for(var i = 0;i < node.args.length - 1;i++) {
          n0 = node.args[i];
          n1 = node.args[i + 1];
          id0 = ast.intern(n0);
          id1 = ast.intern(n1);
          if(id0 < id1) {
            node.args[i] = n1;
            node.args[i + 1] = n0
          }
        }
        return node
      }, multiplicative:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          args.push(sortLiteral(n))
        });
        node = binaryNode(node.op, args);
        if(node.op === Model.FRAC || node.op === Model.COEFF) {
          return node
        }
        var id0, id1;
        var n0, n1;
        for(var i = 0;i < node.args.length - 1;i++) {
          n0 = node.args[i];
          n1 = node.args[i + 1];
          id0 = ast.intern(n0);
          id1 = ast.intern(n1);
          if(id0 < id1) {
            node.args[i] = n1;
            node.args[i + 1] = n0
          }
        }
        return node
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(sortLiteral(n))
        });
        return newNode(node.op, args)
      }, exponential:function(node) {
        var args = [];
        forEach(node.args, function(n, i) {
          args.push(sortLiteral(n))
        });
        node = binaryNode(node.op, args);
        return node
      }, variable:function(node) {
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(sortLiteral(n))
        });
        switch(node.op) {
          case Model.COMMA:
            args.sort(function(a, b) {
              a = JSON.stringify(a);
              b = JSON.stringify(b);
              if(a < b) {
                return-1
              }
              if(a > b) {
                return 1
              }
              return 0
            });
            break;
          default:
            break
        }
        return newNode(node.op, args)
      }, equals:function(node) {
        forEach(node.args, function(n, i) {
          node.args[i] = sortLiteral(n)
        });
        if(node.op === Model.COLON || (node.op === Model.RIGHTARROW || (node.op === Model.GT || (node.op === Model.GE || (node.op === Model.LT || (node.op === Model.LE || (node.op === Model.NGTR || node.op === Model.NLESS))))))) {
          return node
        }
        var id0, id1;
        var n0, n1;
        for(var i = 0;i < node.args.length - 1;i++) {
          n0 = node.args[i];
          n1 = node.args[i + 1];
          id0 = ast.intern(n0);
          id1 = ast.intern(n1);
          if(id0 < id1) {
            node.args[i] = n1;
            node.args[i + 1] = n0
          }
        }
        return node
      }});
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = sortLiteral(node)
      }
      node.sortLiteralNid = nid;
      sortedLiteralNodes[rootNid] = node;
      return node
    }
    function normalizeLiteral(root) {
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.normalizeLiteralNid === nid) {
        return root
      }
      var node = visit(root, {name:"normalizeLiteral", numeric:function(node) {
        return node
      }, additive:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeLiteral(n))
        });
        if(Model.option("ignoreOrder") && node.op === Model.SUB) {
          assert(args.length === 2, "2000: Internal error.");
          return addNode([args[0], negate(args[1], true)])
        }
        return binaryNode(node.op, args)
      }, multiplicative:function(node) {
        var args = [];
        var flatten = true;
        forEach(node.args, function(n) {
          if(Model.option("compatibility") === "v1.37") {
            args.push(normalizeLiteral(n))
          }else {
            if(n.isPolynomial) {
              assert(args.length > 0, "2000: Internal error.");
              args.push(binaryNode(Model.COEFF, [args.pop(), normalizeLiteral(n)], flatten))
            }else {
              if(n.isImplicit) {
                assert(args.length > 0, "2000: Internal error.");
                args.push(multiplyNode([args.pop(), normalizeLiteral(n)], flatten))
              }else {
                args.push(normalizeLiteral(n))
              }
            }
          }
        });
        var op = node.op === Model.MUL ? Model.TIMES : node.op;
        return binaryNode(op, args, true)
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeLiteral(n))
        });
        if(Model.option("ignoreOrder") && node.op === Model.SUB) {
          assert(args.length === 1, "2000: Internal error.");
          return negate(args[0], true)
        }
        return newNode(node.op, args)
      }, exponential:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeLiteral(n))
        });
        node.args = args;
        return node
      }, variable:function(node) {
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeLiteral(n))
        });
        node.args = args;
        return node
      }, equals:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeLiteral(n))
        });
        if(option("ignoreOrder") && (node.op === Model.GT || (node.op === Model.GE || node.op === Model.NGTR))) {
          assert(args.length === 2, "2000: Comparisons have only two operands.");
          var t = args[0];
          args[0] = args[1];
          args[1] = t;
          node.op = node.op === Model.GT ? Model.LT : node.op === Model.GE ? Model.LE : Model.NLESS;
          node.args = args
        }else {
          node.args = args
        }
        return node
      }});
      node.normalizeLiteralNid = ast.intern(node);
      return node
    }
    function normalizeExpanded(root) {
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.normalizeExpandedNid === nid) {
        return root
      }
      var node = visit(root, {name:"normalizeExpanded", numeric:function(node) {
        return node
      }, additive:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeExpanded(n))
        });
        node.args = args;
        return groupLikes(node)
      }, multiplicative:function(node) {
        var equivLiteralDivAndFrac = false;
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeExpanded(n))
        });
        node.args = args;
        return flattenNestedNodes(groupLikes(node))
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeExpanded(n))
        });
        node.args = args;
        return node
      }, exponential:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeExpanded(n))
        });
        node.args = args;
        return node
      }, variable:function(node) {
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeExpanded(n))
        });
        node.args = args;
        return node
      }, equals:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(normalizeExpanded(n))
        });
        node.args = args;
        return node
      }});
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = normalizeExpanded(node)
      }
      node.normalizeExpandedNid = nid;
      return node
    }
    function isAdditive(node) {
      return node.op === Model.ADD || (node.op === Model.SUB || (node.op === Model.PM || node.op === Model.BACKSLASH))
    }
    function isMultiplicative(node) {
      return node.op === Model.MUL || (node.op === Model.TIMES || (node.op === Model.COEFF || node.op === Model.DIV))
    }
    function isRepeating(node) {
      assert(node.op === Model.NUM, "2000: Internal error.");
      return node.isRepeating
    }
    function findRepeatingPattern(s, p, x) {
      if(!p) {
        assert(typeof s === "string" && s.length > 0, "2000: Internal error.");
        p = s.charAt(0);
        s = s.substring(1);
        x = ""
      }
      if(s.length === 0) {
        return p
      }
      if(indexOf(s, p) === 0) {
        x += p;
        s = s.substring(p.length);
        return findRepeatingPattern(s, p, x)
      }else {
        p += x + s.charAt(0);
        x = "";
        s = s.substring(1);
        return findRepeatingPattern(s, p, x)
      }
    }
    function repeatingDecimalToFraction(node) {
      assert(isRepeating(node), "2000: Internal error.");
      var str = node.args[0];
      if(str.charAt(0) === "0") {
        str = str.slice(1)
      }
      var pos = indexOf(str, ".");
      var integerPart = str.slice(0, pos);
      var decimalPart = findRepeatingPattern(str.slice(pos + 1));
      var decimalPlaces = decimalPart.length;
      var numer = numberNode(integerPart + decimalPart);
      var denom = addNode([binaryNode(Model.POW, [numberNode("10"), numberNode(decimalPlaces)]), nodeMinusOne]);
      return fractionNode(numer, denom)
    }
    function decimalToFraction(node) {
      assert(node.op === Model.NUM, "2000: Internal error.");
      if(isRepeating(node)) {
        return repeatingDecimalToFraction(node)
      }
      var str = node.args[0];
      if(str.charAt(0) === "0") {
        str = str.slice(1)
      }
      var pos = indexOf(str, ".");
      var decimalPlaces = str.length - pos - 1;
      var numer = numberNode(str.slice(0, pos) + str.slice(pos + 1));
      var denom = binaryNode(Model.POW, [numberNode("10"), negate(numberNode(decimalPlaces))]);
      return multiplyNode([numer, denom])
    }
    function isLessThan(n1, n2) {
      if(n1 && n1.op !== undefined) {
        n1 = mathValue(n1, true)
      }
      if(n2 && n2.op !== undefined) {
        n2 = mathValue(n2, true)
      }
      if(n1 === null || (!(n1 instanceof BigDecimal) || (n2 === null || !(n1 instanceof BigDecimal)))) {
        return false
      }
      return n1.compareTo(n2) < 0
    }
    function isPos(bd) {
      return bd.compareTo(bigZero) > 0
    }
    function pow(b, e) {
      var val;
      if(b === null || e === null) {
        return null
      }
      if(Math.abs(toNumber(e)) > 1E3) {
        e = toNumber(e);
        b = toNumber(b);
        return toDecimal(Math.pow(b, e))
      }
      if(b instanceof BigDecimal) {
        if(isInteger(e)) {
          val = b.pow(e.abs());
          if(isNeg(e)) {
            val = divide(bigOne, val)
          }
          return val
        }else {
          b = toNumber(b);
          e = toNumber(e);
          val = Math.pow(b, e);
          if(isNaN(val)) {
            return null
          }
          return toDecimal(val)
        }
      }else {
        return toDecimal(Math.pow(b, e))
      }
    }
    function sqrtNode(node) {
      return binaryNode(Model.POW, [node, nodeOneHalf])
    }
    var DECIMAL128 = new MathContext(34);
    function divide(n, d) {
      if(n === null || d === null) {
        return null
      }
      if(!(n instanceof BigDecimal)) {
        n = toDecimal(n)
      }
      if(!(d instanceof BigDecimal)) {
        d = toDecimal(d)
      }
      if(isZero(d)) {
        return null
      }
      return n.divide(d, DECIMAL128)
    }
    function sqrt(n) {
      if(n instanceof BigDecimal) {
        if(n === null) {
          return null
        }
        n = toNumber(n)
      }
      if(isNaN(n)) {
        return null
      }
      return toDecimal(Math.sqrt(n)).setScale(option("decimalPlaces"), BigDecimal.ROUND_HALF_UP)
    }
    function trig(n, op) {
      if(n === null) {
        return null
      }else {
        if(n instanceof BigDecimal) {
          n = toNumber(n)
        }else {
          if(isNaN(n)) {
            return null
          }
        }
      }
      var f;
      switch(op) {
        case Model.SIN:
          f = Math.sin;
          break;
        case Model.COS:
          f = Math.cos;
          break;
        case Model.TAN:
          f = Math.tan;
          break;
        case Model.ARCSIN:
          f = Math.asin;
          break;
        case Model.ARCCOS:
          f = Math.acos;
          break;
        case Model.ARCTAN:
          f = Math.atan;
          break;
        case Model.SINH:
          f = Math.sinh;
          break;
        case Model.COSH:
          f = Math.cosh;
          break;
        case Model.TANH:
          f = Math.tanh;
          break;
        case Model.ARCSINH:
          f = Math.asinh;
          break;
        case Model.ARCCOSH:
          f = Math.acosh;
          break;
        case Model.ARCTANH:
          f = Math.atanh;
          break;
        default:
          assert(false, "2000: Internal error.");
          break
      }
      return toDecimal(f(n))
    }
    function normalizeLogIdent(base, expo) {
      var args = [];
      var node;
      if(isMultiplicative(expo)) {
        var aa = [];
        forEach(expo.args, function(e) {
          if(e.op === Model.POW) {
            aa.push(multiplyNode([e.args[1], newNode(Model.LOG, [base, e.args[0]])]))
          }else {
            aa.push(newNode(Model.LOG, [base, e]))
          }
        });
        args.push(addNode(aa));
        node = binaryNode(Model.LOG, args)
      }else {
        if(expo.op === Model.POW) {
          args.push(multiplyNode([expo.args[1], newNode(Model.LOG, [base, expo.args[0]])]));
          assert(args.length > 0, "2000: Internal error");
          if(args.length > 1) {
            node = multiplyNode(args)
          }else {
            if(args.length === 1) {
              node = args[0]
            }
          }
        }else {
          node = newNode(Model.LOG, [base, expo])
        }
      }
      return node
    }
    function normalizeTrigIdent(node) {
      var op = node.op;
      var args = node.args;
      var neg = sign(args[0]) < 0;
      var tt = terms(args[0]);
      var mv = bigZero;
      var cp = [], vp = [];
      forEach(tt, function(t, i) {
        if(variablePart(t) === null) {
          mv = mv.add(mathValue(t, true, true));
          cp.push(t)
        }else {
          vp.push(t)
        }
      });
      var cycles = Math.floor(toNumber(mv) / (2 * Math.PI));
      var shift;
      if(cycles) {
        shift = addNode(cp.concat(negate(multiplyNode([nodeTwo, numberNode(cycles), nodePI]))))
      }else {
        shift = addNode(cp)
      }
      var phase = toNumber(mv) % (2 * Math.PI) / Math.PI;
      var node;
      var arg;
      if(vp.length > 0) {
        if(phase) {
          arg = addNode(vp.concat(shift))
        }else {
          arg = addNode(vp)
        }
      }else {
        vp.push(nodeZero);
        arg = args[0]
      }
      switch(op) {
        case Model.SIN:
          if(neg) {
            arg = negate(arg);
            node = unaryNode(Model.SIN, [arg]);
            node = neg ? negate(node) : node
          }else {
            switch(phase) {
              case 1:
              ;
              case -1:
                arg = addNode(vp);
                node = unaryNode(Model.SIN, [arg]);
                node = negate(node);
                break;
              case 1 / 2:
                node = unaryNode(Model.COS, [addNode(vp)]);
                break;
              case -1 / 2:
                node = negate(unaryNode(Model.COS, [addNode(vp)]));
                break;
              case 0:
                if(vp.length === 1) {
                  node = unaryNode(Model.SIN, [arg])
                }else {
                  var arg1 = vp[0];
                  var arg2 = addNode(vp.slice(1).concat(cp));
                  node = addNode([multiplyNode([unaryNode(Model.SIN, [arg1]), unaryNode(Model.COS, [arg2])]), multiplyNode([unaryNode(Model.COS, [arg1]), unaryNode(Model.SIN, [arg2])])])
                }
                break;
              default:
                if(!isZero(vp[0])) {
                  node = unaryNode(Model.COS, [addNode([fractionNode(nodePI, nodeTwo), negate(addNode(args))])])
                }else {
                  node = unaryNode(Model.SIN, args)
                }
                break
            }
          }
          break;
        case Model.COS:
          if(neg) {
            arg = negate(arg);
            node = unaryNode(Model.COS, [arg])
          }else {
            switch(phase) {
              case 1:
              ;
              case -1:
                arg = addNode(vp);
                node = unaryNode(Model.COS, [arg]);
                node = negate(node);
                break;
              case 1 / 2:
                arg = addNode(vp);
                node = negate(unaryNode(Model.SIN, [arg]));
                break;
              case -1 / 2:
                arg = addNode(vp);
                node = unaryNode(Model.SIN, [arg]);
                break;
              case 0:
                if(vp.length === 1) {
                  node = unaryNode(Model.COS, [arg])
                }else {
                  var arg1 = vp[0];
                  var arg2 = addNode(vp.slice(1).concat(cp));
                  node = addNode([multiplyNode([unaryNode(Model.COS, [arg1]), unaryNode(Model.COS, [arg2])]), negate(multiplyNode([unaryNode(Model.SIN, [arg1]), unaryNode(Model.SIN, [arg2])]))])
                }
                break;
              default:
                node = unaryNode(Model.COS, args);
                break
            }
          }
          break;
        case Model.SINH:
        ;
        case Model.COSH:
          break;
        case Model.ARCSINH:
          var arg = args[0];
          var doNegate;
          if(isNeg(arg)) {
            arg = negate(arg);
            doNegate = true
          }
          node = newNode(Model.LOG, [nodeE, addNode([arg, sqrtNode(addNode([binaryNode(Model.POW, [arg, nodeTwo]), nodeOne]))])]);
          if(doNegate) {
            node = negate(node)
          }
          break;
        case Model.ARCCOSH:
          var arg = args[0];
          var doNegate;
          if(isNeg(arg)) {
            arg = negate(arg)
          }
          node = newNode(Model.LOG, [nodeE, addNode([arg, sqrtNode(addNode([binaryNode(Model.POW, [arg, nodeTwo]), nodeMinusOne]))])]);
          break;
        default:
          assert(false, "2000: Internal error.");
          break
      }
      return node
    }
    function normalizeAbs(node) {
      assert(node.op === Model.ABS, "2000: Internal error");
      switch(node.args[0].op) {
        case Model.ADD:
          if(every(node.args[0].args, function(n) {
            return!isNeg(n)
          })) {
            var args = [];
            forEach(node.args[0].args, function(n) {
              args.push(unaryNode(Model.ABS, [n]))
            });
            node = addNode(args)
          }
          break
      }
      return node
    }
    function integralNode(start, stop, expr) {
      if(start) {
        return newNode(Model.INTEGRAL, [start, stop, expr])
      }else {
        return newNode(Model.INTEGRAL, [expr])
      }
    }
    function normalizeIntegralAddition(node) {
      var terms = {};
      var args = [];
      forEach(node.args, function(n) {
        if(n.op === Model.INTEGRAL && n.args.length === 3) {
          var nid = ast.intern(n.args[2]);
          if(!terms[nid]) {
            terms[nid] = []
          }
          terms[nid].push(n)
        }else {
          args.push(n)
        }
      });
      var kk = keys(terms);
      forEach(kk, function(k) {
        var tt = terms[k];
        var expr = tt[0].args[2];
        var starts = [], stops = [];
        forEach(tt, function(t) {
          var start = t.args[0];
          var stop = t.args[1];
          starts.push(ast.intern(start));
          stops.push(ast.intern(stop))
        });
        forEach(starts, function(start, stopIndex) {
          var startIndex = stops.indexOf(start);
          if(startIndex >= 0) {
            args.push(integralNode(ast.node(starts[startIndex]), ast.node(stops[stopIndex]), expr));
            delete starts[startIndex];
            delete stops[startIndex];
            delete starts[stopIndex];
            delete stops[stopIndex]
          }
        });
        forEach(starts, function(start, i) {
          var stop = stops[i];
          args.push(integralNode(ast.node(start), ast.node(stop), expr))
        })
      });
      return binaryNode(node.op, args)
    }
    function normalizeIntegral(node) {
      var start, stop, expr;
      if(node.args.length === 3) {
        start = node.args[0];
        stop = node.args[1];
        expr = node.args[2]
      }else {
        expr = node.args[0]
      }
      var cp, vp;
      if(start && ast.intern(start) === ast.intern(stop)) {
        node = nodeZero
      }else {
        if(isAdditive(expr)) {
          var args = [];
          forEach(expr.args, function(e) {
            args.push(integralNode(start, stop, e))
          });
          node = binaryNode(expr.op, args)
        }else {
          if(cp = constantPart(expr)) {
            vp = variablePart(expr);
            if(vp) {
              if(start && isNeg(cp)) {
                cp = negate(cp);
                var t = start;
                start = stop;
                stop = t
              }
              if(isOne(cp)) {
                node = integralNode(start, stop, vp)
              }else {
                node = multiplyNode([cp, integralNode(start, stop, vp)])
              }
            }else {
              if(start) {
                node = multiplyNode([cp, addNode([stop, negate(start)])])
              }
            }
          }
        }
      }
      return node
    }
    function flattenNestedNodes(node, doSimplify) {
      var args = [];
      if(node.op === Model.NUM || node.op === Model.VAR) {
        return node
      }
      forEach(node.args, function(n) {
        if(doSimplify) {
          n = simplify(n)
        }
        n = normalize(n);
        if(n.op === node.op) {
          args = args.concat(n.args)
        }else {
          args.push(n)
        }
      });
      var isMixedNumber = node.isMixedNumber;
      node = binaryNode(node.op, args);
      node.isMixedNumber = isMixedNumber;
      return node
    }
    function factorGroupingKey(root) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"factorGroupingKey", exponential:function(node) {
        return factorGroupingKey(node.args[1]) + Model.POW + factorGroupingKey(node.args[0])
      }, multiplicative:function(node) {
        var key = "";
        key += variables(node).join("");
        if(!key) {
          key = factorGroupingKey(node.args[0])
        }
        return key
      }, additive:function(node) {
        var key = "";
        forEach(node.args, function(n) {
          key += "+" + factorGroupingKey(n)
        });
        return key
      }, unary:function(node) {
        return factorGroupingKey(node.args[0])
      }, numeric:function(node) {
        return Model.NUM
      }, variable:function(node) {
        return node.args[0]
      }, comma:function(node) {
        return Model.COMMA
      }, equals:function(node) {
        return Model.EQL
      }})
    }
    var groupedNodes = [];
    function groupLikes(node) {
      var hash = {};
      var vp, keyid;
      if(node.op !== Model.MUL && node.op !== Model.ADD) {
        return node
      }
      assert(node.args.length > 1, "2000: Internal error.");
      var nid = ast.intern(node);
      var cachedNode;
      if((cachedNode = groupedNodes[nid]) !== undefined) {
        return cachedNode
      }
      var rootNid = nid;
      node = flattenNestedNodes(node);
      forEach(node.args, function(n, i) {
        var key;
        if(node.op === Model.MUL) {
          key = factorGroupingKey(n)
        }else {
          if(node.op === Model.ADD) {
            key = variablePart(n)
          }
        }
        if(!key) {
          var mv;
          if((mv = mathValue(n, true)) !== null) {
            if(n.op === Model.POW) {
              mv = abs(mathValue(n.args[0], true));
              if(mv !== null) {
                key = "number"
              }else {
                key = "none"
              }
            }else {
              mv = abs(mv);
              if(mv !== null) {
                key = "number"
              }else {
                key = "none"
              }
            }
          }else {
            key = n
          }
        }
        assert(key, "2000: Internal error.");
        if(typeof key === "string") {
          key = variableNode(key)
        }
        keyid = ast.intern(key);
        var list = hash[keyid] ? hash[keyid] : hash[keyid] = [];
        list.push(n)
      });
      var args = [];
      var numberArgs = [];
      var isMixedNumber = node.isMixedNumber;
      forEach(keys(hash), function(k) {
        var exprs = hash[k];
        assert(exprs, "2000: Internal error.");
        var cp = [];
        var vp = [];
        forEach(exprs, function(n) {
          var c = constantPart(n);
          if(c) {
            cp.push(c)
          }
        });
        forEach(exprs, function(n) {
          var c = variablePart(n);
          if(c) {
            vp.push(c)
          }
        });
        if(indexOf(cp, null) >= 0) {
          return node
        }
        if(node.op === Model.ADD) {
          var nd;
          if(cp.length > 0) {
            nd = binaryNode(node.op, cp);
            nd.isMixedNumber = node.isMixedNumber;
            var mv = mathValue(nd);
            var tempArgs = [];
            if(mv !== null) {
              nd = numberNode(mv)
            }else {
              nd = simplify(nd, {dontGroup:true})
            }
          }else {
            nd = nodeOne
          }
          if(vp.length > 0) {
            var v = vp[0];
            if(isZero(nd)) {
              args.push(nodeZero)
            }else {
              if(isOne(nd)) {
                args.push(v)
              }else {
                args.push(simplify(multiplyNode([nd, v]), {dontGroup:true}))
              }
            }
          }else {
            if(nd) {
              if(nd.op === Model.NUM) {
                numberArgs.push(nd)
              }else {
                args.push(nd)
              }
            }
          }
        }else {
          if(node.op === Model.MUL) {
            var nd;
            if(cp.length > 0) {
              nd = binaryNode(node.op, cp);
              var mv = mathValue(nd);
              var tempArgs = [];
              if(mv !== null) {
                if(isOne(mv)) {
                }else {
                  numberArgs.push(numberNode(mv.toString()))
                }
                nd = null
              }else {
                nd = simplify(nd, {dontGroup:true})
              }
            }else {
              nd = null
            }
            if(vp.length > 0) {
              if(nd === null || isOne(nd)) {
                args.push(simplify(multiplyNode(vp), {dontGroup:true}))
              }else {
                if(isZero(nd)) {
                  args.push(nodeZero)
                }else {
                  args.push(simplify(multiplyNode([nd].concat(vp)), {dontGroup:true}))
                }
              }
            }else {
              if(nd) {
                if(mathValue(nd, true)) {
                  numberArgs.push(nd)
                }else {
                  args.push(nd)
                }
              }
            }
          }else {
            args.push(binaryNode(node.op, exprs))
          }
        }
      });
      if(numberArgs.length > 0) {
        var nd = binaryNode(node.op, numberArgs);
        var mv = mathValue(nd);
        if(mv === null) {
          args.push(nd)
        }else {
          args.push(numberNode(mv))
        }
      }
      if(args.length === 0) {
        node = nodeOne
      }else {
        if(args.length === 1) {
          node = args[0]
        }else {
          node = binaryNode(node.op, args)
        }
      }
      node = sort(node);
      groupedNodes[rootNid] = node;
      node.isMixedNumber = isMixedNumber;
      return node
    }
    function hasLikeFactors(node) {
      if(node.op !== Model.MUL) {
        return false
      }
      var hash = {};
      var vp, vpnid, list;
      var result = !every(node.args, function(n) {
        vpnid = ast.intern(n);
        list = hash[vpnid] ? hash[vpnid] : hash[vpnid] = [];
        list.push(n);
        return list.length < 2 || isAdditive(n)
      });
      return result
    }
    function squareRoot(node) {
      var e = 2;
      var args;
      if(!option("dontExpandPowers") && node.op === Model.NUM) {
        args = factors(node, {}, false, true)
      }else {
        if(node.op === Model.MUL) {
          args = node.args
        }else {
          return sqrtNode(node)
        }
      }
      var hash = {};
      var vp, vpnid, list;
      forEach(args, function(n) {
        vpnid = ast.intern(n);
        list = hash[vpnid] ? hash[vpnid] : hash[vpnid] = [];
        list.push(n)
      });
      var inList = [], outList = [];
      forEach(keys(hash), function(k) {
        list = hash[k];
        if(list.length >= e) {
          while(list.length >= e) {
            outList.push(list[0]);
            list = list.slice(e)
          }
          inList = inList.concat(list)
        }else {
          inList = inList.concat(list)
        }
      });
      if(inList.length > 0) {
        outList = outList.concat(sqrtNode(simplify(multiplyNode(inList))))
      }
      return multiplyNode(outList)
    }
    function listNodeIDs(node) {
      var aa = [];
      if(node.op === Model.COMMA) {
        forEach(node.args, function(n) {
          aa.push(ast.intern(n))
        })
      }else {
        aa.push(ast.intern(node))
      }
      return aa
    }
    function diffSets(n1, n2) {
      if(n1.op === Model.MUL) {
        assert(n1.args.length === 2, "2000: Internal error.");
        assert(n1.args[1].op === Model.COMMA, message(2002));
        var t = n2;
        n2 = n1.args[1];
        n1 = t
      }
      var a1 = listNodeIDs(n1);
      var a2 = listNodeIDs(n2);
      var nids = filter(a1, function(i) {
        return indexOf(a2, i) < 0
      });
      var args = [];
      forEach(nids, function(nid) {
        args.push(ast.node(nid))
      });
      return newNode(Model.COMMA, args)
    }
    function isPolynomialDenominatorWithNegativeTerm(node) {
      return node.op === Model.POW && (isMinusOne(node.args[1]) && (node.args[0].op === Model.ADD && (variables(node.args[0]).length > 0 && some(node.args[0].args, function(n) {
        return isNeg(constantPart(n))
      }))))
    }
    var simplifiedNodes = [];
    function simplify(root, env, resume) {
      assert(root && root.args, "2000: Internal error.");
      assert(root.op !== Model.MUL || root.args.length > 1, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.simplifyNid === nid) {
        return root
      }
      var node = Model.create(visit(root, {name:"simplify", numeric:function(node) {
        return node
      }, additive:function(node) {
        assert(node.op !== Model.SUB, "2000: simplify() additive node not normalized: " + JSON.stringify(node));
        if(node.op === Model.PM) {
          return node
        }
        var isMixedNumber = node.isMixedNumber;
        node = cancelTerms(node);
        if(!env || !env.dontGroup) {
          node = groupLikes(node)
        }
        if(!isAdditive(node)) {
          return node
        }
        var args = [];
        forEach(node.args, function(n, i) {
          args = args.concat(simplify(n, env))
        });
        node = binaryNode(node.op, args);
        node.isMixedNumber = isMixedNumber;
        if(node.op === Model.PM) {
          return node
        }else {
          if(node.op === Model.BACKSLASH || node.op === Model.ADD && (node.args.length === 2 && (node.args[0].op === Model.MUL && (node.args[0].args.length === 2 && (node.args[0].args[0].op === Model.NUM && (node.args[0].args[0].args[0] === "-1" && (node.args[0].args[1].op === Model.COMMA && node.args[1].op === Model.COMMA))))))) {
            return diffSets(node.args[0], node.args[1])
          }
        }
        if(!option("dontFactorDenominators") || !isMixedNumber && mathValue(node, true)) {
          node = commonDenom(node)
        }
        if(!isAdditive(node)) {
          return node
        }
        var args = node.args.slice(0);
        var n0 = [simplify(args.shift(), env)];
        forEach(args, function(n1, i) {
          n1 = simplify(n1, env);
          n0 = n0.concat(fold(n0.pop(), n1))
        });
        if(n0.length < 2) {
          node = n0[0]
        }else {
          node = binaryNode(node.op, n0)
        }
        node.isMixedNumber = isMixedNumber;
        assert(node.args.length > 0, "2000: Internal error.");
        return node;
        function commonDenom(node) {
          var n0 = node.args;
          if(!isChemCore()) {
            var denoms = [];
            forEach(n0, function(n1) {
              denoms = denom(n1, denoms)
            });
            if(denoms.length > 1 || denoms.length === 1 && (!isMinusOne(denoms[0]) && !isOne(denoms[0]))) {
              var denominator = binaryNode(Model.POW, [multiplyNode(denoms, true), nodeMinusOne]);
              var n2 = [];
              forEach(n0, function(n1) {
                var d, n;
                d = denom(n1, []);
                n = numer(n1, d[0], denoms);
                n2 = n2.concat(n)
              });
              if(n2.length) {
                n0 = binaryNode(node.op, n2);
                node = multiplyNode([n0, denominator])
              }else {
                node = denominator
              }
            }else {
            }
          }
          return node
        }
        function numer(n, d, denoms) {
          denoms = denoms.slice(0);
          var ff = factors(n, {}, true, true);
          var hasNumer = false;
          var n0, nn = [];
          forEach(ff, function(n) {
            if(n.op !== Model.POW || !isNeg(mathValue(n.args[1], true))) {
              nn.push(n)
            }
          });
          if(nn.length === 0 || isOne(nn[0])) {
            n0 = []
          }else {
            n0 = [multiplyNode(nn)]
          }
          var nid0 = d ? ast.intern(d) : 0;
          var index = -1;
          some(denoms, function(n, i) {
            var nid1 = ast.intern(n);
            if(nid0 === nid1) {
              index = i;
              return true
            }
            return false
          });
          if(index > -1) {
            denoms.splice(index, 1)
          }
          if(n0.length || denoms.length) {
            return multiplyNode([].concat(n0).concat(denoms), true)
          }
          return nodeOne
        }
        function denom(n, denoms) {
          var ff = factors(n, {}, true, true);
          var hasDenom = false;
          var d0, dd = [];
          forEach(ff, function(n) {
            d0 = n.args[0];
            if(n.op === Model.POW && !isOne(n.args[0])) {
              if(isMinusOne(n.args[1])) {
                dd.push(d0)
              }else {
                if(isNeg(mathValue(n.args[1], true))) {
                  dd.push(binaryNode(Model.POW, [d0, simplify(negate(n.args[1]), env)]))
                }
              }
            }
          });
          if(dd.length === 0) {
            return denoms
          }else {
            d0 = multiplyNode(dd)
          }
          if(every(denoms, function(d) {
            return ast.intern(d) !== ast.intern(d0)
          })) {
            denoms.push(d0)
          }
          return denoms
        }
        function fold(lnode, rnode) {
          var ldegr = degree(lnode);
          var rdegr = degree(rnode);
          var lcoeff = constantPart(lnode);
          var rcoeff = constantPart(rnode);
          if(isZero(lcoeff)) {
            return rnode
          }
          if(isZero(rcoeff)) {
            return lnode
          }
          if(ldegr === rdegr) {
            var lvpart = variablePart(lnode);
            var rvpart = variablePart(rnode);
            if(lvpart !== null && (rvpart !== null && ast.intern(lvpart) === ast.intern(rvpart))) {
              var c = addNode([lcoeff, rcoeff]);
              var cmv = mathValue(c);
              if(isZero(cmv)) {
                return nodeZero
              }else {
                if(isOne(cmv)) {
                  return lvpart
                }
              }
              return multiplyNode([c, lvpart])
            }else {
              if(lnode.op === Model.LOG && (rnode.op === Model.LOG && ast.intern(lnode.args[0]) === ast.intern(rnode.args[0]))) {
                return simplify(newNode(Model.LOG, [lnode.args[0], multiplyNode([lnode.args[1], rnode.args[1]])]), env)
              }else {
                if(ldegr === 0 && rdegr === 0) {
                  var mv1 = mathValue(lnode, true);
                  var mv2 = mathValue(rnode, true);
                  if(isInteger(mv1) && isInteger(mv2)) {
                    return numberNode(mv1.add(mv2))
                  }else {
                    if(ast.intern(lnode) === ast.intern(rnode)) {
                      return multiplyNode([nodeTwo, lnode])
                    }else {
                      if((!env || !env.dontGroup) && (!option("dontFactorTerms") && commonFactors(lnode, rnode).length > 0)) {
                        return[factorTerms(lnode, rnode)]
                      }else {
                        return[lnode, rnode]
                      }
                    }
                  }
                }else {
                  if(ldegr === 2 && (rdegr === 2 && (isOne(lcoeff) && (isOne(rcoeff) && ((lnode.args[0].op === Model.SIN && rnode.args[0].op === Model.COS || lnode.args[0].op === Model.COS && rnode.args[0].op === Model.SIN) && ast.intern(lnode.args[0].args[0]) === ast.intern(rnode.args[0].args[0])))))) {
                    return nodeOne
                  }else {
                    if(ldegr === 2 && (rdegr === 2 && (isOne(lcoeff) && (isOne(rcoeff) && ((lnode.args[0].op === Model.SIN && rnode.args[0].op === Model.COS || lnode.args[0].op === Model.COS && rnode.args[0].op === Model.SIN) && ast.intern(lnode.args[0].args[0]) === ast.intern(rnode.args[0].args[0])))))) {
                      return nodeOne
                    }
                  }
                }
              }
            }
          }
          if(ast.intern(lnode) === ast.intern(rnode)) {
            return multiplyNode([nodeTwo, lnode])
          }else {
            if(isZero(mathValue(lcoeff))) {
              return rnode
            }else {
              if(isZero(mathValue(rcoeff))) {
                return lnode
              }else {
                if(!option("dontFactorTerms") && (!isOne(mathValue(lcoeff)) && !isOne(mathValue(rcoeff)))) {
                  if(commonFactors(lnode, rnode).length > 0) {
                    var node = [factorTerms(lnode, rnode)];
                    return node
                  }
                }
              }
            }
          }
          return[lnode, rnode]
        }
      }, multiplicative:function(node) {
        assert(node.op === Model.MUL, "2000: simplify() multiplicative node not normalized: " + JSON.stringify(node));
        node = cancelFactors(node);
        if(!env || !env.dontGroup) {
          node = groupLikes(node)
        }
        if(!isMultiplicative(node)) {
          return node
        }
        var nid = ast.intern(node);
        var args = node.args.slice(0);
        var n0 = [simplify(args.shift(), env)];
        if(n0[0].op === Model.MUL) {
          n0 = n0[0].args.slice(0)
        }
        forEach(args, function(n1, i) {
          n1 = simplify(n1, env);
          n0 = n0.concat(fold(n0.pop(), n1))
        });
        if(n0.length < 2) {
          node = n0[0]
        }else {
          assert(n0.length, "2000: Internal error.");
          node = sort(flattenNestedNodes(multiplyNode(n0)))
        }
        return node;
        function fold(lnode, rnode) {
          var ldegr = degree(lnode);
          var rdegr = degree(rnode);
          var lvars = variables(lnode);
          var rvars = variables(rnode);
          var lvpart = variablePart(lnode);
          var rvpart = variablePart(rnode);
          var lcoeff = constantPart(lnode);
          var rcoeff = constantPart(rnode);
          var lcoeffmv = mathValue(lcoeff, true);
          var rcoeffmv = mathValue(rcoeff, true);
          var lmv, rmv;
          if(ldegr === 0 && (isZero(lcoeffmv) && !isUndefined(rnode)) || rdegr === 0 && (isZero(rcoeffmv) && !isUndefined(lnode))) {
            if(units(lnode).length || units(rnode).length) {
              return[lnode, rnode]
            }else {
              return nodeZero
            }
          }
          if(isInteger(lmv = mathValue(lnode)) && isInteger(rmv = mathValue(rnode))) {
            return numberNode(lmv.multiply(rmv))
          }else {
            if(ldegr === 0 && isOne(lcoeffmv)) {
              return rnode
            }else {
              if(rdegr === 0 && isOne(rcoeffmv)) {
                return lnode
              }else {
                if(isInfinity(lnode)) {
                  if(isNeg(rnode)) {
                    return negate(lnode)
                  }else {
                    return lnode
                  }
                }else {
                  if(isInfinity(rnode)) {
                    if(isNeg(lnode)) {
                      return negate(rnode)
                    }else {
                      return rnode
                    }
                  }else {
                    if(ldegr === 0 && rdegr === 0) {
                      if(isOne(rcoeffmv) && isOne(lcoeffmv)) {
                        return nodeOne
                      }else {
                        if(isImaginary(lnode) && isImaginary(rnode)) {
                          return nodeMinusOne
                        }
                      }
                      var lexpo = exponent(lnode);
                      var rexpo = exponent(rnode);
                      var lbase = base(lnode);
                      var rbase = base(rnode);
                      if(lbase !== null && (rbase !== null && (Math.abs(lexpo) === 1 && Math.abs(rexpo) === 1))) {
                        if(lexpo === rexpo) {
                          if(isMinusOne(lbase) || isMinusOne(rbase)) {
                            node = [lnode, rnode]
                          }else {
                            node = multiplyNode([numberNode(lbase), numberNode(rbase)]);
                            if(mv = mathValue(node)) {
                              node = numberNode(mv)
                            }
                            if(lexpo === -1) {
                              node = binaryNode(Model.POW, [node, nodeMinusOne])
                            }
                          }
                        }else {
                          var mv;
                          if(isZero(lnode)) {
                            node = nodeZero
                          }else {
                            if(mv = mathValue(multiplyNode([lnode, rnode]))) {
                              node = numberNode(mv)
                            }else {
                              var lbaseN = toNumber(lbase);
                              var rbaseN = toNumber(rbase);
                              var d = gcd(lbaseN, rbaseN);
                              if(d === (d | 0)) {
                                lbase = divide(lbase, toDecimal(d));
                                rbase = divide(rbase, toDecimal(d))
                              }
                              if(lexpo < 0 && isOne(lbase)) {
                                node = numberNode(rbase)
                              }else {
                                if(rexpo < 0 && isOne(rbase)) {
                                  node = numberNode(lbase)
                                }else {
                                  var n = lexpo === 1 ? lbase : rbase;
                                  var d = lexpo === 1 ? rbase : lbase;
                                  if(isOne(n)) {
                                    node = binaryNode(Model.POW, [numberNode(d), nodeMinusOne])
                                  }else {
                                    var q = divide(n, d);
                                    if(isInteger(q)) {
                                      node = numberNode(q)
                                    }else {
                                      if(isNeg(n) && isNeg(d)) {
                                        n = n.multiply(toDecimal("-1"));
                                        d = d.multiply(toDecimal("-1"))
                                      }
                                      node = [numberNode(n), binaryNode(Model.POW, [numberNode(d), nodeMinusOne])]
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }else {
                        if(lnode.op === Model.POW && (rnode.op === Model.POW && ast.intern(lnode.args[1]) === ast.intern(rnode.args[1]))) {
                          var lbase = lnode.args[0];
                          var rbase = rnode.args[0];
                          var lexpo = exponent(lnode);
                          var rexpo = exponent(rnode);
                          if(lexpo === 0.5 && ast.intern(lbase) === ast.intern(rbase)) {
                            node = lbase
                          }else {
                            if(lexpo !== -1 && (!isMinusOne(lbase) && !isMinusOne(rbase))) {
                              node = binaryNode(Model.POW, [simplify(multiplyNode([lbase, rbase])), lnode.args[1]])
                            }else {
                              node = [lnode, rnode]
                            }
                          }
                        }else {
                          node = [lnode, rnode]
                        }
                      }
                    }else {
                      if(lvpart && (rvpart && ast.intern(lvpart) === ast.intern(rvpart))) {
                        var lnode = multiplyNode([lcoeff, rcoeff]);
                        if(lvpart.op === Model.POW) {
                          assert(lvpart.args.length === 2 && rvpart.args.length === 2, "2000: Exponents of exponents not handled here.");
                          var lexpo = lvpart.args[1];
                          var rexpo = rvpart.args[1];
                          var rnode = binaryNode(Model.POW, [lvpart.args[0], addNode([lexpo, rexpo])])
                        }else {
                          var rnode = binaryNode(Model.POW, [lvpart, nodeTwo])
                        }
                        if(isZero(mathValue(lnode))) {
                          node = []
                        }else {
                          if(isOne(mathValue(lnode))) {
                            node = rnode
                          }else {
                            node = [lnode, rnode]
                          }
                        }
                      }else {
                        if(ast.intern(lnode.op === Model.POW ? lnode.args[0] : lnode) === ast.intern(rnode.op === Model.POW ? rnode.args[0] : rnode)) {
                          var b, el, er;
                          if(lnode.op === Model.POW) {
                            b = lnode.args[0]
                          }else {
                            b = lnode
                          }
                          if(lnode.op === Model.POW) {
                            el = lnode.args[1]
                          }else {
                            el = nodeOne
                          }
                          if(rnode.op === Model.POW) {
                            er = rnode.args[1]
                          }else {
                            er = nodeOne
                          }
                          var e = simplify(addNode([el, er]), env);
                          if(isZero(e)) {
                            node = nodeOne
                          }else {
                            if(isOne(e)) {
                              node = b
                            }else {
                              node = binaryNode(Model.POW, [b, e])
                            }
                          }
                        }else {
                          if(ldegr === 0 && isOne(lcoeffmv)) {
                            return rnode
                          }else {
                            if(rdegr === 0 && isOne(rcoeffmv)) {
                              return lnode
                            }else {
                              if(ldegr === 0) {
                                if(sign(lnode) < 0 && isPolynomialDenominatorWithNegativeTerm(rnode)) {
                                  return[negate(lnode), expand(negate(rnode))]
                                }
                                var v = mathValue(lnode);
                                if(v !== null) {
                                  node = [numberNode(v), rnode]
                                }else {
                                  node = [lnode, rnode]
                                }
                              }else {
                                if(rdegr === 0) {
                                  var v = mathValue(rnode);
                                  if(v !== null) {
                                    node = [numberNode(v), lnode]
                                  }else {
                                    node = [lnode, rnode]
                                  }
                                }else {
                                  if(option("dontExpandPowers") && (lnode.op === Model.POW && (rnode.op === Model.POW && ast.intern(lnode.args[1]) === ast.intern(rnode.args[1])))) {
                                    var lbase = lnode.args[0];
                                    var rbase = rnode.args[0];
                                    var args = [];
                                    if(lbase.op === Model.MUL) {
                                      args = args.concat(lbase.args)
                                    }else {
                                      args.push(lbase)
                                    }
                                    if(rbase.op === Model.MUL) {
                                      args = args.concat(rbase.args)
                                    }else {
                                      args.push(rbase)
                                    }
                                    node = binaryNode(Model.POW, [simplify(multiplyNode(args)), lnode.args[1]])
                                  }else {
                                    node = [lnode, rnode]
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if(lnode.op === Model.PM || rnode.op === Model.PM) {
            if(node instanceof Array) {
              node = binaryNode(Model.PM, node)
            }else {
              node = unaryNode(Model.PM, [node])
            }
          }
          return node
        }
      }, unary:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(simplify(n, env))
        });
        node = newNode(node.op, args);
        switch(node.op) {
          case Model.SUB:
            node = negate(node.args[0]);
            break;
          case Model.ABS:
            var arg = simplify(node.args[0]);
            var cp = constantPart(arg);
            var vp = variablePart(arg);
            var ep;
            if(vp && (vp.op === Model.POW && vp.args.length === 2)) {
              ep = vp.args[1];
              vp = vp.args[0]
            }
            if(vp && sign(vp) < 0) {
              vp = unaryNode(Model.ABS, [simplify(expand(negate(vp)))])
            }else {
              vp = vp ? unaryNode(Model.ABS, [vp]) : nodeOne
            }
            if(ep) {
              vp = binaryNode(Model.POW, [vp, ep])
            }
            if(isOne(cp) || isMinusOne(cp)) {
              node = vp
            }else {
              if(isNeg(cp)) {
                node = multiplyNode([simplify(expand(negate(cp))), vp])
              }else {
                node = multiplyNode([cp, vp])
              }
            }
            break;
          case Model.M:
            var mv = mathValue(node);
            if(mv !== null) {
              node = numberNode(mv)
            }
            break;
          case Model.PM:
          ;
          default:
            node = unaryNode(node.op, args)
        }
        return node
      }, exponential:function(node) {
        var base = node.args[0];
        var nid = ast.intern(node);
        var args = node.args.slice(0).reverse();
        var n0 = [simplify(args.shift(), env)];
        forEach(args, function(n1, i) {
          n1 = simplify(n1, env);
          n0 = n0.concat(fold(node.op, n0.pop(), n1))
        });
        if(n0.length === 1) {
          var n = n0[0];
          if(n.op !== Model.NUM || (isInteger(n) || (isInfinity(n) || isUndefined(n)))) {
            node = n
          }
        }else {
          if(isInfinity(n0[1]) && isNeg(n0[0])) {
            return nodeZero
          }
          node = binaryNode(node.op, n0.reverse())
        }
        return node;
        function fold(op, expo, base) {
          var mv, node;
          var bmv = mathValue(base);
          var emv = mathValue(expo, {}, true);
          if(op === Model.POW) {
            if(isZero(bmv)) {
              if(isNeg(emv)) {
                return[undefinedNode(newNode(op, [base, expo]))]
              }else {
                return[nodeZero]
              }
            }else {
              if(isZero(emv)) {
                return[nodeOne]
              }else {
                if(isOne(bmv)) {
                  return[nodeOne]
                }else {
                  if(isOne(emv)) {
                    return[base]
                  }else {
                    if(isImaginary(base) && emv !== null) {
                      if(emv.remainder(bigFour).compareTo(bigZero) === 0) {
                        return[nodeOne]
                      }else {
                        if(emv.remainder(bigTwo).compareTo(bigZero) === 0) {
                          return[nodeMinusOne]
                        }else {
                          if(emv.remainder(bigThree).compareTo(bigZero) === 0) {
                            return[negate(nodeImaginary)]
                          }else {
                            if(emv.remainder(bigFive).compareTo(bigZero) === 0) {
                              return[nodeImaginary]
                            }
                          }
                        }
                      }
                      return[expo, base]
                    }else {
                      if(base.op === Model.POW) {
                        return binaryNode(Model.POW, [base.args[0], multiplyNode([base.args[1], expo])])
                      }else {
                        if(ast.intern(expo) === ast.intern(nodeOneHalf)) {
                          return squareRoot(base)
                        }else {
                          if(isMinusOne(base) && isOddFraction(expo)) {
                            return multiplyNode([nodeMinusOne, binaryNode(Model.POW, [negate(base), expo])])
                          }else {
                            if(!option("dontExpandPowers") && base.op === Model.MUL) {
                              var args = [];
                              forEach(base.args, function(n) {
                                if(n.op === Model.POW) {
                                  args.push(binaryNode(Model.POW, [n.args[0], multiplyNode([n.args[1], expo])]))
                                }else {
                                  args.push(binaryNode(Model.POW, [n, expo]))
                                }
                              });
                              return multiplyNode(args)
                            }else {
                              if(bmv !== null && (emv !== null && !isNeg(bmv))) {
                                var b = pow(bmv, emv);
                                base = numberNode(b);
                                return base
                              }else {
                                if(expo.op === Model.LOG && ast.intern(base) === ast.intern(expo.args[0])) {
                                  return expo.args[1]
                                }else {
                                  if(base.op === Model.SINH && ast.intern(expo) === ast.intern(nodeTwo)) {
                                    return addNode([binaryNode(Model.POW, [newNode(Model.COSH, base.args), nodeTwo]), nodeMinusOne])
                                  }else {
                                    var b = pow(bmv, emv);
                                    if(b !== null) {
                                      return numberNode(b)
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }else {
            if(op === Model.LOG) {
              if(emv !== null && isE(base)) {
                var mv = toDecimal(Math.log(toNumber(emv)));
                if(isInteger(mv)) {
                  return numberNode(mv)
                }
              }else {
                if(ast.intern(base) === ast.intern(expo)) {
                  return nodeOne
                }else {
                  if(!option("dontExpandPowers") && !isE(base)) {
                    return multiplyNode([binaryNode(Model.LOG, [nodeE, expo]), binaryNode(Model.POW, [binaryNode(Model.LOG, [nodeE, base]), nodeMinusOne])])
                  }
                }
              }
            }
          }
          return[expo, base]
        }
      }, variable:function(node) {
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(simplify(n, env))
        });
        return newNode(node.op, args)
      }, equals:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(simplify(n, env))
        });
        assert(args.length === 2, "2000: Internal error.");
        if(isZero(args[1])) {
          var mv = mathValue(args[0], true);
          if(mv !== null) {
            return newNode(node.op, args)
          }
          var ff = factors(args[0], {}, true, true, true);
          var erasedMinus = false;
          if(isMinusOne(ff[0])) {
            ff.shift();
            erasedMinus = true
          }
          var args0 = [];
          var foundZero = false;
          forEach(ff, function(n) {
            var mv = mathValue(n, true);
            if(erasedMinus && isInequality(node.op) || (mv !== null && (!isZero(mv) && ff.length > 1) || (n.op === Model.VAR && (units(n).length > 0 && ff.length > 1) || (n.op === Model.POW && (units(n.args[0]).length > 0 && (mathValue(n.args[0]) !== null && ff.length > 1)) || n.op === Model.POW && isNeg(n.args[1]))))) {
              if(args0.length > 0 && (node.op !== Model.EQL && (node.op !== Model.APPROX && isNeg(n)))) {
                args0.push(expand(negate(args0.pop())))
              }
            }else {
              if(isZero(mv)) {
                args0 = [nodeZero];
                foundZero = true
              }else {
                args0 = args0.concat(n)
              }
            }
          });
          if(args0.length > 0) {
            args[0] = multiplyNode(args0)
          }else {
            args[0] = nodeZero
          }
        }
        return newNode(node.op, args)
      }}), root.location);
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = simplify(node, env)
      }
      node.simplifyNid = nid;
      return node
    }
    function leadingCoeff(node) {
      var tt, cp;
      switch(node.op) {
        case Model.ADD:
          cp = constantPart(node.args[0]);
          break;
        default:
          cp = constantPart(node);
          break
      }
      return cp
    }
    function sign(node) {
      var s = 0;
      var tt = terms(node);
      forEach(tt, function(n) {
        var mv = mathValue(n);
        if(isNeg(leadingCoeff(n))) {
          s -= 1
        }else {
          s += 1
        }
      });
      if(s === 0) {
        if(isNeg(leadingCoeff(tt[0]))) {
          s = -1
        }else {
          s = 1
        }
      }
      return s
    }
    function base(node) {
      var op = node.op;
      var base = op === Model.POW ? mathValue(node.args[0]) : mathValue(node);
      return base
    }
    function exponent(node) {
      return node.op === Model.POW ? toNumber(mathValue(node.args[1], {}, true)) : 1
    }
    function log(b, x) {
      return Math.log(x) / Math.log(b)
    }
    function mathValue(root, env, allowDecimal, normalizeUnits) {
      if(!root || !root.args) {
        return null
      }
      if(env === undefined) {
        env = Model.env
      }else {
        if(typeof env === "boolean") {
          normalizeUnits = allowDecimal;
          allowDecimal = env;
          env = Model.env
        }
      }
      return visit(root, {name:"mathValue", numeric:function(node) {
        if(isUndefined(node) || isRepeating(node)) {
          return null
        }
        return toDecimal(node.args[0])
      }, additive:function(node) {
        if(node.op === Model.PM) {
          return null
        }
        var val = bigZero;
        forEach(node.args, function(n) {
          var mv = mathValue(n, env, true, normalizeUnits);
          if(mv && val) {
            val = val.add(mv)
          }else {
            val = null
          }
        });
        if(allowDecimal || isInteger(val)) {
          return val
        }else {
          return null
        }
      }, multiplicative:function(node) {
        var val = bigOne;
        var hasDecimal = false;
        forEach(node.args, function(n) {
          hasDecimal = hasDecimal || isDecimal(n);
          var mv = mathValue(n, env, true, normalizeUnits);
          if(val !== null && mv != null) {
            val = val.multiply(mv)
          }else {
            val = null
          }
        });
        if(allowDecimal || (isInteger(val) || hasDecimal && option("dontConvertDecimalToFraction"))) {
          return val
        }
        return null
      }, unary:function(node) {
        switch(node.op) {
          case Model.SUB:
            var val = mathValue(node.args[0], env, allowDecimal, normalizeUnits);
            if(val === null) {
              return null
            }
            return val.multiply(bigMinusOne);
          case Model.FACT:
            var n = mathValue(node.args[0], env, allowDecimal, normalizeUnits);
            if(n) {
              return toDecimal(factorial(n))
            }else {
              return null
            }
          ;
          case Model.M:
            var args = [];
            if(node.args[0].op === Model.MUL) {
              forEach(node.args[0].args, function(n) {
                assert(n.op === Model.VAR, "2000: Invalid arguments to the M tag");
                var sym = Model.env[n.args[0]];
                assert(sym && sym.mass, "2000: Missing chemical symbol");
                var count = n.args[1] ? toNumber(mathValue(n.args[1], env, allowDecimal, normalizeUnits)) : 1;
                args.push(numberNode(sym.mass * count))
              })
            }else {
              var n = node.args[0];
              assert(n.op === Model.VAR, "2000: Invalid arguments to the M tag");
              var sym = Model.env[n.args[0]];
              assert(sym && sym.mass, "2000: Missing chemical symbol");
              var count = n.args[1] ? toNumber(mathValue(n.args[1], env, allowDecimal, normalizeUnits)) : 1;
              args.push(numberNode(sym.mass * count))
            }
            return mathValue(makeTerm(args), env, allowDecimal, normalizeUnits);
          case Model.ABS:
            return abs(mathValue(node.args[0], env, allowDecimal, normalizeUnits));
          case Model.SIN:
          ;
          case Model.COS:
          ;
          case Model.TAN:
          ;
          case Model.ARCSIN:
          ;
          case Model.ARCCOS:
          ;
          case Model.ARCTAN:
          ;
          case Model.SINH:
          ;
          case Model.COSH:
          ;
          case Model.TANH:
          ;
          case Model.ARCSINH:
          ;
          case Model.ARCCOSH:
          ;
          case Model.ARCTANH:
            if(allowDecimal) {
              var val;
              if(isPositiveInfinity(node.args[0])) {
                val = Number.POSITIVE_INFINITY
              }else {
                if(isNegativeInfinity(node.args[0])) {
                  val = Number.NEGATIVE_INFINITY
                }else {
                  val = mathValue(toRadians(node.args[0]), env, allowDecimal, normalizeUnits)
                }
              }
              return trig(val, node.op)
            }
            return null;
          case Model.ADD:
            return mathValue(node.args[0], env, allowDecimal, normalizeUnits);
          case Model.DEGREE:
            return mathValue(toRadians(node.args[0]), env, allowDecimal, normalizeUnits);
          default:
            return null
        }
      }, exponential:function(node) {
        var args = node.args.slice(0).reverse();
        var val = mathValue(args.shift(), env, allowDecimal, normalizeUnits);
        var op = node.op;
        if(op === Model.POW) {
          forEach(args, function(n) {
            var mv = mathValue(n, env, true, normalizeUnits);
            if(val !== null && mv != null) {
              val = pow(mv, val)
            }else {
              val = null
            }
          })
        }else {
          if(op === Model.LOG) {
            assert(args.length === 1, "2000: Internal error.");
            var mv;
            var emv = val;
            var base = args[0];
            var bmv = mathValue(base, true, normalizeUnits);
            if(emv !== null) {
              if(bmv !== null) {
                val = logBase(bmv, emv)
              }else {
                if(base.op === Model.VAR && base.args[0] === "e") {
                  val = toDecimal(Math.log(toNumber(emv)))
                }
              }
            }
          }
        }
        if(allowDecimal || isInteger(val)) {
          return val
        }
        return null
      }, variable:function(node) {
        var val, n;
        if((val = env[node.args[0]]) && (val.type === "const" || val.type === "unit" && normalizeUnits)) {
          n = val.value
        }
        if(n && (allowDecimal || isInteger(n))) {
          return toDecimal(n)
        }
        return null
      }, comma:function(node) {
        return null
      }, equals:function(node) {
        return null
      }});
      function exponent(node) {
        return node.op === Model.POW ? +node.args[1].args[0] : 1
      }
    }
    function getUnique(list) {
      var u = {}, a = [];
      for(var i = 0, l = list.length;i < l;++i) {
        if(u.hasOwnProperty(list[i])) {
          continue
        }
        a.push(list[i]);
        u[list[i]] = 1
      }
      return a
    }
    function units(root, env) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"units", exponential:function(node) {
        var uu = units(node.args[0], env);
        if(uu.length > 0) {
          return[node]
        }
        return[]
      }, multiplicative:function(node) {
        var uu = [];
        forEach(node.args, function(n) {
          uu = uu.concat(units(n, env))
        });
        return uu
      }, additive:function(node) {
        var uu = [];
        forEach(node.args, function(n) {
          uu = uu.concat(units(n, env))
        });
        return uu
      }, unary:function(node) {
        return[]
      }, numeric:function(node) {
        return[]
      }, variable:function(node) {
        var val, env = Model.env;
        if(env && (val = env[node.args[0]])) {
          if(val.type === "unit") {
            return[node]
          }
        }
        return[]
      }, comma:function(node) {
        var uu = [];
        forEach(node.args, function(n) {
          uu = uu.concat(units(n, env))
        });
        return uu
      }, equals:function(node) {
        var uu = [];
        forEach(node.args, function(n) {
          uu = uu.concat(units(n, env))
        });
        return uu
      }})
    }
    function multiplyMatrix(lnode, rnode) {
      var snode, mnode;
      if(lnode.op !== Model.MATRIX) {
        return multiplyScalarAndMatrix(lnode, rnode)
      }else {
        if(rnode.op !== Model.MATRIX) {
          return multiplyScalarAndMatrix(rnode, lnode)
        }
      }
      var rowArgs = [];
      var rows = lnode.args[0].args;
      forEach(rows, function(row) {
        var colArgs = [];
        var cols = rnode.args[0].args[0].args;
        assert(rows.length === cols.length, message(2013));
        forEach(cols, function(col, n) {
          col = getMatrixCol(rnode, n);
          colArgs.push(multiplyVectors(row.args, col))
        });
        rowArgs.push(newNode(Model.COL, colArgs))
      });
      return newNode(Model.MATRIX, [newNode(Model.ROW, rowArgs)])
    }
    function addMatrix(lnode, rnode) {
      var snode, mnode;
      if(lnode.op !== Model.MATRIX) {
        return addScalarAndMatrix(lnode, rnode)
      }else {
        if(rnode.op !== Model.MATRIX) {
          return addScalarAndMatrix(rnode, lnode)
        }
      }
      var rowArgs = [];
      var lrows = lnode.args[0].args;
      forEach(lrows, function(lrow, i) {
        var colArgs = [];
        var rrows = rnode.args[0].args;
        assert(lrows.length === rrows.length, message(2013));
        var rrow = rrows[i];
        colArgs = addVectors(lrow.args, rrow.args);
        rowArgs.push(newNode(Model.COL, colArgs))
      });
      return newNode(Model.MATRIX, [newNode(Model.ROW, rowArgs)])
    }
    function getMatrixCol(mnode, n) {
      var vec = [];
      var rows = mnode.args[0].args;
      forEach(rows, function(row) {
        var cols = row.args;
        vec.push(cols[n])
      });
      return vec
    }
    function addVectors(v1, v2) {
      assert(v1.length === v2.length, message(2013));
      var args = [];
      forEach(v1, function(n1, i) {
        var n2 = v2[i];
        args.push(addNode([n1, n2]))
      });
      return args
    }
    function multiplyVectors(v1, v2) {
      var args = [];
      forEach(v1, function(n1, i) {
        var n2 = v2[i];
        args.push(multiplyNode([n1, n2]))
      });
      return addNode(args)
    }
    function multiplyScalarAndMatrix(snode, mnode) {
      var rowArgs = [];
      var rows = mnode.args[0].args;
      forEach(rows, function(row) {
        var colArgs = [];
        var cols = row.args;
        forEach(cols, function(col) {
          colArgs.push(multiplyNode([snode, col]))
        });
        rowArgs.push(newNode(Model.COL, colArgs))
      });
      return newNode(Model.MATRIX, [newNode(Model.ROW, rowArgs)])
    }
    function addScalarAndMatrix(snode, mnode) {
      var rowArgs = [];
      var rows = mnode.args[0].args;
      forEach(rows, function(row) {
        var colArgs = [];
        var cols = row.args;
        forEach(cols, function(col) {
          colArgs.push(addNode([snode, col]))
        });
        rowArgs.push(newNode(Model.COL, colArgs))
      });
      return newNode(Model.MATRIX, [newNode(Model.ROW, rowArgs)])
    }
    function multiplyTerms(lterms, rterms, expo) {
      var args = [];
      forEach(lterms, function(n0) {
        forEach(rterms, function(n1) {
          var args1 = [];
          if(n0.op === Model.MUL) {
            args1 = args1.concat(n0.args)
          }else {
            args1.push(n0)
          }
          if(n1.op === Model.MUL) {
            args1 = args1.concat(n1.args)
          }else {
            args1.push(n1)
          }
          args.push(multiplyNode(args1))
        })
      });
      var node = addNode(args);
      if(expo !== undefined) {
        node = binaryNode(Model.POW, [node, numberNode(expo.toString())])
      }
      return[sort(node)]
    }
    var expandedNodes = [];
    function expand(root, env) {
      assert(root && root.args, "2000: Internal error.");
      var nid = ast.intern(root);
      if(root.expandNid === nid) {
        return root
      }
      var cachedNode;
      if((cachedNode = expandedNodes[nid]) !== undefined) {
        return cachedNode
      }
      var rootNid = nid;
      var node = Model.create(visit(root, {name:"expand", numeric:function(node) {
        assert(typeof node.args[0] === "string", "2000: Internal error.");
        return node
      }, additive:function(node) {
        var nid = ast.intern(node);
        var isMixedNumber = node.isMixedNumber;
        var args = node.args.slice(0);
        var n0 = [expand(args.shift())];
        forEach(args, function(n1) {
          n1 = expand(n1);
          n0 = n0.concat(unfold(n0.pop(), n1))
        });
        if(n0.length < 2) {
          node = n0[0]
        }else {
          node = binaryNode(node.op, n0)
        }
        if(node.op === Model.MATRIX) {
          return node
        }
        node = cancelTerms(node, "expand");
        node.isMixedNumber = isMixedNumber;
        return node;
        function unfold(lnode, rnode) {
          if(lnode.op === Model.MATRIX || rnode.op === Model.MATRIX) {
            return addMatrix(lnode, rnode)
          }
          return[lnode, rnode]
        }
      }, multiplicative:function(node) {
        var nid = ast.intern(node);
        var args = node.args.slice(0);
        var n0 = [expand(args.shift())];
        forEach(args, function(n1, i) {
          n1 = expand(n1);
          n0 = n0.concat(unfold(n0.pop(), n1))
        });
        if(n0.length < 2) {
          node = n0[0]
        }else {
          node = multiplyNode(n0)
        }
        if(node.op === Model.MATRIX) {
          return node
        }
        return node;
        function unfold(lnode, rnode) {
          var expo, lterms, rterms;
          if(lnode.op === Model.MATRIX || rnode.op === Model.MATRIX) {
            return multiplyMatrix(lnode, rnode)
          }
          if(lnode.op === Model.POW && (rnode.op === Model.POW && exponent(lnode) === exponent(rnode))) {
            lterms = terms(lnode.args[0]);
            rterms = terms(rnode.args[0]);
            expo = exponent(lnode)
          }else {
            lterms = terms(lnode);
            rterms = terms(rnode)
          }
          if(lterms && (rterms && ((!isAggregate(lnode) && lterms.length > 1 || !isAggregate(rnode) && rterms.length > 1) && lterms.length * rterms.length < 64))) {
            return multiplyTerms(lterms, rterms, expo)
          }
          var result = [];
          if(lnode.op === Model.MUL) {
            result = result.concat(lnode.args)
          }else {
            result.push(lnode)
          }
          if(rnode.op === Model.MUL) {
            result = result.concat(rnode.args)
          }else {
            result.push(rnode)
          }
          return result
        }
      }, unary:function(node) {
        assert(node.op !== Model.SQRT, "2000: SQRT removed during parsing");
        switch(node.op) {
          case Model.ABS:
            var arg0 = expand(node.args[0]);
            if(arg0.op === Model.MUL) {
              var args = [];
              forEach(arg0.args, function(n) {
                args.push(unaryNode(Model.ABS, [n]))
              });
              node = multiplyNode(args)
            }else {
              node = unaryNode(Model.ABS, [arg0])
            }
            break;
          case Model.SUB:
            node = multiplyNode([expand(node.args[0]), nodeMinusOne]);
            node.args[0] = expand(node.args[0]);
            break;
          default:
            var args = [];
            forEach(node.args, function(n) {
              args.push(expand(n))
            });
            node = unaryNode(node.op, args);
            break
        }
        return node
      }, exponential:function(node) {
        var nid = ast.intern(node);
        var args = node.args.slice(0).reverse();
        var n0 = [expand(args.shift())];
        forEach(args, function(n1, i) {
          n1 = expand(n1);
          n0 = n0.concat(unfold(node.op, n0.pop(), n1))
        });
        var node2;
        if(n0.length < 2) {
          var n = n0[0];
          node2 = n
        }else {
          node2 = binaryNode(node.op, n0.reverse())
        }
        return node2;
        function unfold(op, expo, base) {
          var node;
          var dontExpandPowers = option("dontExpandPowers");
          var emv = mathValue(expo);
          if(op === Model.POW) {
            if(dontExpandPowers && (base.op === Model.VAR || base.op === Model.NUM)) {
              return[expo, base]
            }
            if(base.op === Model.POW && !(isNeg(base.args[1]) || isNeg(expo))) {
              expo = multiplyNode(base.args.slice(1).concat(expo));
              base = base.args[0];
              return[expo, base]
            }
            var ff = factors(base, null, false, true);
            if(ff.length === 0) {
              return nodeOne
            }
            var args = [];
            forEach(ff, function(n) {
              if(expo.op === Model.ADD) {
                forEach(expo.args, function(e) {
                  args.push(newNode(op, [n, e]))
                })
              }else {
                if(isInteger(emv)) {
                  var ea = Math.abs(toNumber(emv));
                  var bmv;
                  if(isZero(emv)) {
                    args.push(nodeOne)
                  }else {
                    if(isNeg(bmv = mathValue(n)) && !isNeg(emv)) {
                      var mv = pow(bmv, emv);
                      args.push(numberNode(mv))
                    }else {
                      if(ea < 5 || ea < 10 && (!isPolynomial(n) && !dontExpandPowers)) {
                        var invert = isNeg(emv);
                        for(var i = 0;i < ea;i++) {
                          if(invert) {
                            if(n.op === Model.POW && isMinusOne(n.args[1])) {
                              args.push(n.args[0])
                            }else {
                              if((isOne(n) || isMinusOne(n)) && isMinusOne(emv)) {
                                args.push(n)
                              }else {
                                args.push(binaryNode(Model.POW, [n, nodeMinusOne]))
                              }
                            }
                          }else {
                            args.push(n)
                          }
                        }
                      }else {
                        args.push(newNode(op, [n, expo]))
                      }
                    }
                  }
                }else {
                  args.push(newNode(op, [n, expo]))
                }
              }
            })
          }else {
            if(op === Model.LOG) {
              var args = [];
              if(isMultiplicative(expo)) {
                var aa = [];
                forEach(expo.args, function(e) {
                  if(e.op === Model.POW) {
                    aa.push(multiplyNode([e.args[1], newNode(Model.LOG, [base, e.args[0]])]))
                  }else {
                    aa.push(newNode(op, [base, e]))
                  }
                });
                args.push(addNode(aa))
              }else {
                if(expo.op === Model.POW) {
                  args.push(multiplyNode([expo.args[1], newNode(Model.LOG, [base, expo.args[0]])]))
                }
              }
            }
          }
          if(args.length > 1) {
            return[multiplyNode(args)]
          }else {
            if(args.length === 1) {
              return[args[0]]
            }
          }
          return[expo, base]
        }
      }, variable:function(node) {
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(expand(n))
        });
        return newNode(node.op, args)
      }, equals:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args = args.concat(expand(n))
        });
        return newNode(node.op, args)
      }}), root.location);
      while(nid !== ast.intern(node)) {
        nid = ast.intern(node);
        node = expand(node)
      }
      node.expandNid = nid;
      expandedNodes[rootNid] = node;
      return node
    }
    function factors(root, env, ignorePrimeFactors, preserveNeg, factorAdditive) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"factors", numeric:function(node) {
        if(ignorePrimeFactors || isInfinity(node)) {
          return[node]
        }
        var ff = [];
        if(preserveNeg && isNeg(node)) {
          ff.push(nodeMinusOne)
        }
        var absv = Math.abs(+node.args[0]);
        var pff = primeFactors(absv);
        if(pff.length === 0 && !isOne(absv)) {
          ff.push(numberNode(absv))
        }else {
          forEach(primeFactors(+node.args[0]), function(n) {
            ff.push(numberNode(n))
          })
        }
        return ff
      }, additive:function(node) {
        if(!factorAdditive) {
          return[node]
        }
        node = factorQuadratic(node);
        if(node.op === Model.MUL) {
          return[node]
        }
        var args = node.args.slice(0);
        var n0 = [multiplyNode(factors(args.shift(), {}, true, true))];
        forEach(args, function(n1, i) {
          n1 = multiplyNode(factors(n1, {}, true, true));
          var n;
          if(commonFactors(n = n0.pop(), n1).length > 0) {
            n0 = n0.concat(factorTerms(n, n1))
          }else {
            n0 = n0.concat([n, n1])
          }
        });
        if(n0.length === 1 && n0[0].op === Model.MUL) {
          return n0[0].args
        }
        return[node]
      }, multiplicative:function(node) {
        switch(node.op) {
          case Model.MUL:
          ;
          case Model.COEFF:
          ;
          case Model.TIMES:
            var ff = [];
            forEach(node.args, function(n) {
              ff = ff.concat(factors(n, env, ignorePrimeFactors, preserveNeg))
            });
            return ff;
          default:
            assert(false, "2000: Node not normalized");
            break
        }
        return[node]
      }, unary:function(node) {
        return[node]
      }, exponential:function(node) {
        if(option("dontExpandPowers")) {
          return[node]
        }
        if(node.op === Model.POW) {
          var isDenom;
          if(isNeg(mathValue(binaryNode(Model.POW, node.args.slice(1)), true))) {
            isDenom = true
          }
          var ff = [];
          var e = mathValue(node.args[1]);
          var ea = Math.abs(toNumber(e));
          if(ea < 5 || ea < 10 && !isPolynomial(node.args[0])) {
            var args = factors(node.args[0], {}, false, true, true);
            for(var j = 0;j < args.length;j++) {
              var f = isDenom ? newNode(Model.POW, [args[j], nodeMinusOne]) : args[j];
              for(var i = ea;i > 0;i--) {
                ff.push(f)
              }
            }
            return ff
          }else {
            return[node]
          }
        }else {
          if(node.op === Model.LOG) {
            return[node]
          }
        }
      }, variable:function(node) {
        return[node]
      }, comma:function(node) {
        return[node]
      }, equals:function(node) {
        return[node]
      }})
    }
    function commonFactors(lnode, rnode) {
      var t1 = [lnode, rnode];
      var t;
      var t2 = [];
      forEach(t1, function(n) {
        t = factors(n, null, false, true);
        var ff = [];
        forEach(t, function(n) {
          ff.push(ast.intern(n))
        });
        t2.push(ff)
      });
      var intersect = t2.shift();
      forEach(t2, function(a) {
        intersect = filter(intersect, function(n) {
          var i = indexOf(a, n);
          if(i !== -1) {
            delete a[i];
            return true
          }
          return false
        })
      });
      return intersect
    }
    function factorTerms(lnode, rnode) {
      var cfacts = commonFactors(lnode, rnode);
      var lfacts = factors(lnode, null, false, true);
      var rfacts = factors(rnode, null, false, true);
      var lfacts2 = [], rfacts2 = [];
      var cf = cfacts.slice(0);
      var i;
      forEach(lfacts, function(f) {
        if((i = indexOf(cf, ast.intern(f))) === -1) {
          lfacts2.push(f)
        }else {
          delete cf[i]
        }
      });
      var cf = cfacts.slice(0);
      forEach(rfacts, function(f) {
        if((i = indexOf(cf, ast.intern(f))) === -1) {
          rfacts2.push(f)
        }else {
          delete cf[i]
        }
      });
      var aa = [];
      aa = aa.concat(makeFactor(lfacts2));
      aa = aa.concat(makeFactor(rfacts2));
      var args = [];
      if(aa.length > 0) {
        args.push(makeTerm(aa))
      }
      forEach(cfacts, function(i) {
        args.push(ast.node(i))
      });
      return makeFactor(args)[0]
    }
    function makeFactor(args) {
      if(args.length === 0) {
        return[nodeOne]
      }else {
        if(args.length === 1) {
          return args
        }
      }
      return[multiplyNode(args)]
    }
    function makeTerm(args) {
      assert(args.length > 0, "2000: Too few arguments in makeTerm()");
      if(args.length === 1) {
        return args[0]
      }
      return addNode(args)
    }
    function isHyperbolicTangent(node) {
      return node.op === Model.MUL && (node.args.length > 1 && (node.args[0].op === Model.SINH && (node.args[1].op === Model.POW && (node.args[1].args[0].op === Model.COSH && isMinusOne(node.args[1].args[1])))))
    }
    function isHyperbolicCotangent(node) {
      return node.op === Model.MUL && (node.args.length > 1 && (node.args[0].op === Model.COSH && (node.args[1].op === Model.POW && (node.args[1].args[0].op === Model.SINH && isMinusOne(node.args[1].args[1])))))
    }
    function isHyperbolicSecant(node) {
      return node.op === Model.POW && (node.args.length > 1 && (node.args[0].op === Model.COSH && isMinusOne(node.args[1])))
    }
    function isHyperbolicCosecant(node) {
      return node.op === Model.POW && (node.args.length > 1 && (node.args[0].op === Model.SINH && isMinusOne(node.args[1])))
    }
    function scale(root) {
      assert(root && root.args, "2000: Internal error.");
      var node = Model.create(visit(root, {name:"scale", exponential:function(node) {
        var mv, nd;
        if((mv = mathValue(node, true)) && (nd = numberNode(String(mv), true))) {
          return nd
        }
        if(isHyperbolicSecant(node)) {
          var arg = node.args[0].args[0];
          var epx = binaryNode(Model.POW, [nodeE, arg]);
          var emx = binaryNode(Model.POW, [nodeE, negate(arg)]);
          var numer = nodeTwo;
          var denom = addNode([epx, emx]);
          node = fractionNode(numer, denom);
          node = scale(expand(normalize(simplify(expand(normalize(node))))))
        }else {
          if(isHyperbolicCosecant(node)) {
            var arg = node.args[0].args[0];
            var epx = binaryNode(Model.POW, [nodeE, arg]);
            var emx = binaryNode(Model.POW, [nodeE, negate(arg)]);
            var numer = nodeTwo;
            var denom = addNode([epx, negate(emx)]);
            node = fractionNode(numer, denom);
            node = scale(expand(normalize(simplify(expand(normalize(node))))))
          }
        }
        var args = [];
        forEach(node.args, function(n) {
          args.push(scale(n))
        });
        return newNode(node.op, args)
      }, multiplicative:function(node) {
        var mv, nd;
        if((mv = mathValue(node, true)) && (nd = numberNode(String(mv), true))) {
          return nd
        }
        if(isHyperbolicTangent(node)) {
          var arg = node.args[0].args[0];
          var epx = binaryNode(Model.POW, [nodeE, arg]);
          var emx = binaryNode(Model.POW, [nodeE, negate(arg)]);
          var numer = addNode([epx, negate(emx)]);
          var denom = addNode([epx, emx]);
          node = fractionNode(numer, denom);
          node = scale(expand(normalize(simplify(expand(normalize(node))))));
          return node
        }else {
          if(isHyperbolicCotangent(node)) {
            var arg = node.args[0].args[0];
            var epx = binaryNode(Model.POW, [nodeE, arg]);
            var emx = binaryNode(Model.POW, [nodeE, negate(arg)]);
            var numer = addNode([epx, emx]);
            var denom = addNode([epx, negate(emx)]);
            node = fractionNode(numer, denom);
            node = scale(expand(normalize(simplify(expand(normalize(node))))));
            return node
          }
        }
        var args = [];
        var mv2 = bigOne;
        forEach(node.args, function(n) {
          if(mv = mathValue(multiplyNode([numberNode(mv2), n]), true)) {
            mv2 = mv
          }else {
            args.push(scale(n))
          }
        });
        var n;
        if(!isOne(n = numberNode(mv2, true))) {
          args.unshift(n)
        }
        node = multiplyNode(args);
        if((mv = mathValue(node, true)) && (nd = numberNode(String(mv), true))) {
          return nd
        }
        return node
      }, additive:function(node) {
        var mv, nd;
        if((mv = mathValue(node, true)) && (nd = numberNode(String(mv), true))) {
          return nd
        }
        var lc, args = [];
        if(isPolynomial(node) && !isOne(abs(leadingCoeff(node)))) {
          forEach(node.args, function(n, i) {
            if(i === 0) {
              lc = constantPart(n);
              var vp = variablePart(n);
              if(vp) {
                args.push(vp)
              }
            }else {
              assert(lc, "2000: Internal error.");
              args.push(fractionNode(n, lc))
            }
          });
          node = newNode(Model.ADD, [multiplyNode([lc, addNode(args)])])
        }
        var args = [];
        var mv2 = bigZero;
        forEach(node.args, function(n) {
          if(mv = mathValue(addNode([numberNode(mv2), n]), true)) {
            mv2 = mv
          }else {
            args.push(scale(n))
          }
        });
        if(!isZero(mv2)) {
          args.unshift(numberNode(mv2, true))
        }
        if(args.length === 1) {
          node = args[0]
        }else {
          node = addNode(args)
        }
        if((mv = mathValue(node, true)) && (nd = numberNode(String(mv), true))) {
          return nd
        }
        return node
      }, unary:function(node) {
        var mv;
        if(mv = mathValue(node, true)) {
          return numberNode(mv, true)
        }
        var args = [];
        forEach(node.args, function(n) {
          args.push(scale(n))
        });
        switch(node.op) {
          case Model.SINH:
            var arg = args[0];
            node = addNode([fractionNode(binaryNode(Model.POW, [nodeE, arg]), nodeTwo), fractionNode(negate(binaryNode(Model.POW, [nodeE, negate(arg)])), nodeTwo)]);
            node = scale(expand(normalize(simplify(expand(normalize(node))))));
            break;
          case Model.COSH:
            var arg = args[0];
            node = addNode([fractionNode(binaryNode(Model.POW, [nodeE, arg]), nodeTwo), fractionNode(binaryNode(Model.POW, [nodeE, negate(arg)]), nodeTwo)]);
            node = scale(expand(normalize(simplify(expand(normalize(node))))));
            break;
          default:
            node = newNode(node.op, args);
            break
        }
        return node
      }, numeric:function(node) {
        if(isUndefined(node)) {
          return node
        }
        return numberNode(node.args[0], true)
      }, variable:function(node) {
        var val;
        if(val = Model.env[node.args[0]]) {
          if(val.type === "unit") {
            if(val.base === "\\radian") {
              node = numberNode(val.value)
            }else {
              if(val.value !== 1) {
                node = multiplyNode([numberNode(val.value, true), variableNode(val.base)])
              }
            }
          }else {
            if(val.type === "const") {
              node = numberNode(val.value, true)
            }
          }
        }
        return node
      }, comma:function(node) {
        var args = [];
        forEach(node.args, function(n) {
          args.push(scale(n))
        });
        return newNode(node.op, args)
      }, equals:function(node) {
        var args = [];
        var c, cc;
        if((node.op === Model.EQL || node.op === Model.APPROX) && ((cc = isPolynomial(node.args[0])) && cc[cc.length - 1] < 0 || !cc && sign(node.args[0]) < 0)) {
          node.args[0] = simplify(expand(negate(node.args[0])))
        }
        forEach(node.args, function(n) {
          args.push(scale(n))
        });
        return newNode(node.op, args)
      }}), root.location);
      return node
    }
    function isFactorised(root, env) {
      assert(root && root.args, "2000: Internal error.");
      return visit(root, {name:"isFactorised", numeric:function(node) {
        return true
      }, additive:function(node) {
        if(node.op === Model.PM) {
          return true
        }
        var vars = variables(node);
        var coeffs, vals;
        var t1 = terms(normalize(node));
        var t;
        var t2 = [];
        forEach(t1, function(n) {
          t = factors(n);
          var ff = [];
          forEach(t, function(n) {
            ff.push(ast.intern(n))
          });
          t2.push(ff)
        });
        var intersect = t2.shift();
        forEach(t2, function(a) {
          intersect = filter(intersect, function(n) {
            return indexOf(a, n) != -1
          })
        });
        if(intersect.length > 0) {
          return false
        }
        if((coeffs = isPolynomial(node)) && coeffs.length < 3) {
          return true
        }else {
          if(coeffs !== null && variables(node).length === 1) {
            if(coeffs.length === 3) {
              return!solveQuadratic(coeffs[2], coeffs[1], coeffs[0])
            }
            return!hasRoot(node, coeffs)
          }else {
            if(some(t1, function(n) {
              var d = degree(n, true);
              if(d === Number.POSITIVE_INFINITY) {
                assert(false, message(2003));
                return undefined
              }
            })) {
              return true
            }else {
              if(some(t1, function(n) {
                var d = degree(n, true);
                if(d >= 0 && d < 2) {
                  return true
                }
              })) {
                return true
              }
            }
          }
        }
        assert(vars.length < 2, message(2001));
        return true
      }, multiplicative:function(node) {
        switch(node.op) {
          case Model.MUL:
            var result = every(node.args, function(n) {
              return isFactorised(n)
            });
            return result ? !hasLikeFactors(node) : false;
          default:
            assert(false, "2000: isFactorised(): node not normalized");
            break
        }
        return false
      }, unary:function(node) {
        return true
      }, exponential:function(node) {
        return true
      }, variable:function(node) {
        return true
      }, comma:function(node) {
        var result = every(node.args, function(n) {
          return isFactorised(n)
        });
        return result
      }, equals:function(node) {
        var result = every(node.args, function(n) {
          return isFactorised(n)
        });
        return result
      }})
    }
    var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    var primesCache = {};
    forEach(primes, function(v) {
      primesCache[v] = true
    });
    function findPossibleRoots(coeffs) {
      var c0 = coeffs[0];
      var c1 = coeffs[coeffs.length - 1];
      var f0 = primeFactors(c0);
      var f1 = primeFactors(c1);
      f0.push(1);
      f0.push(c0);
      f1.push(1);
      f1.push(c1);
      var possibleRoots = [];
      forEach(f0, function(n) {
        var n0 = numberNode(n);
        var n1 = negate(numberNode(n));
        forEach(f1, function(d) {
          var d = numberNode(d);
          possibleRoots.push(fractionNode(n0, d));
          possibleRoots.push(fractionNode(n1, d))
        })
      });
      return possibleRoots
    }
    function hasRoot(node, coeffs) {
      var rr = findPossibleRoots(coeffs);
      var field = option("field");
      return some(rr, function(r) {
        r = toNumber(mathValue(r, true));
        var nn = variables(node);
        assert(nn.length === 1, "2000: Internal error.");
        var env = {};
        env[nn[0]] = {type:"const", value:r};
        var x = toNumber(mathValue(node, env, true));
        return x === 0 && (field === "integer" && r === (r | 0) || field === "real")
      })
    }
    function solveQuadratic(a, b, c) {
      a = toNumber(a);
      b = toNumber(b);
      c = toNumber(c);
      var x0 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      var x1 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      var opt = option("field");
      var hasSolution = opt === "integer" && (x0 === (x0 | 0) && x1 === (x1 | 0)) || (opt === "real" && b * b - 4 * a * c >= 0 || opt === "complex");
      if(hasSolution) {
        return[x0, x1]
      }
      return null
    }
    function primeFactors(n) {
      var absN = Math.abs(n);
      if(absN <= 1 || (isNaN(n) || (isInfinity(n) || isImaginary(n)))) {
        return[]
      }else {
        if(isPrime(absN)) {
          return[absN]
        }
      }
      var maxf = Math.sqrt(absN);
      for(var f = 2;f <= maxf;f++) {
        if(n % f === 0) {
          return primeFactors(f).concat(primeFactors(absN / f))
        }
      }
    }
    function isPrime(n) {
      if(primesCache[n] !== void 0) {
        return primesCache[n]
      }
      if(n <= 1) {
        primesCache[n] = false;
        return false
      }else {
        if(n <= 1 || n > 2 && n % 2 === 0) {
          return primesCache[n] = false
        }else {
          for(var i = 3, sqrt = Math.sqrt(n);i <= sqrt;i += 2) {
            if(n % i === 0) {
              return primesCache[n] = false
            }
          }
        }
        return primesCache[n] = true
      }
    }
    function gcd(a, b) {
      if(arguments.length > 2) {
        var rest = [].slice.call(arguments, 1);
        return gcd(a, gcd.apply(rest))
      }else {
        var mod;
        a = Math.abs(a);
        b = Math.abs(b);
        while(b) {
          mod = a % b;
          a = b;
          b = mod
        }
        return a
      }
    }
    function lcm(a, b) {
      if(arguments.length > 2) {
        var rest = [].slice.call(arguments, 1);
        return lcm(a, lcm.apply(rest))
      }else {
        return Math.abs(a * b) / gcd(a, b)
      }
    }
    this.normalize = normalize;
    this.normalizeExpanded = normalizeExpanded;
    this.normalizeLiteral = normalizeLiteral;
    this.normalizeSyntax = normalizeSyntax;
    this.normalizeCalculate = normalizeCalculate;
    this.degree = degree;
    this.constantPart = constantPart;
    this.variables = variables;
    this.variablePart = variablePart;
    this.sort = sort;
    this.sortLiteral = sortLiteral;
    this.simplify = simplify;
    this.formatMath = formatMath;
    this.expand = expand;
    this.terms = terms;
    this.factors = factors;
    this.isFactorised = isFactorised;
    this.mathValue = mathValue;
    this.units = units;
    this.scale = scale;
    this.hasLikeFactors = hasLikeFactors;
    this.factorGroupingKey = factorGroupingKey;
    this.hint = hint;
    this.eraseCommonExpressions = eraseCommonExpressions
  }
  function degree(node, notAbsolute) {
    return visitor.degree(node, notAbsolute)
  }
  function constantPart(node) {
    return visitor.constantPart(node)
  }
  function variables(node) {
    return visitor.variables(node)
  }
  function hint(node) {
    return visitor.hint(node)
  }
  function variablePart(node) {
    return visitor.variablePart(node)
  }
  function sort(node) {
    var visitor = new Visitor(ast);
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.sort(node);
    Assert.setLocation(prevLocation);
    return result
  }
  function sortLiteral(node) {
    var visitor = new Visitor(ast);
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.sortLiteral(node);
    Assert.setLocation(prevLocation);
    return result
  }
  function normalize(node) {
    var visitor = new Visitor(ast);
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.normalize(node);
    Assert.setLocation(prevLocation);
    return result
  }
  function normalizeLiteral(node) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.normalizeLiteral(node);
    Assert.setLocation(prevLocation);
    return result
  }
  function normalizeSyntax(node, ref) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.normalizeSyntax(node, ref);
    Assert.setLocation(prevLocation);
    return result
  }
  function normalizeExpanded(node) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.normalizeExpanded(node);
    Assert.setLocation(prevLocation);
    return result
  }
  function normalizeCalculate(node) {
    var result = visitor.normalizeCalculate(node);
    return result
  }
  function mathValue(node, env, allowDecimal, normalizeUnits) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.mathValue(node, env, allowDecimal, normalizeUnits);
    Assert.setLocation(prevLocation);
    return result
  }
  function units(node, env) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.units(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function formatMath(n1, n2, env) {
    var visitor = new Visitor(ast);
    var prevLocation = Assert.location;
    if(n2.location) {
      Assert.setLocation(n2.location)
    }
    var result = visitor.formatMath(n1, n2, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function simplify(node, env) {
    var visitor = new Visitor(ast);
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.simplify(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function hasLikeFactors(node, env) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.hasLikeFactors(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function expand(node, env) {
    var visitor = new Visitor(ast);
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.expand(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function terms(node, env) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.terms(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function factorGroupingKey(node, env) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.factorGroupingKey(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function factors(node, env) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.factors(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function isFactorised(node, env) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.isFactorised(node, env);
    Assert.setLocation(prevLocation);
    return result
  }
  function scale(node) {
    var prevLocation = Assert.location;
    if(node.location) {
      Assert.setLocation(node.location)
    }
    var result = visitor.scale(node);
    Assert.setLocation(prevLocation);
    return result
  }
  function eraseCommonExpressions(n1, n2) {
    return visitor.eraseCommonExpressions(n1, n2)
  }
  var env = Model.env;
  function precision(bd) {
    var scale = bd.scale();
    var prec = bd.mant.length;
    for(var i = 0;i < scale;i++) {
      if(bd.mant[prec - 1 - i] !== 0) {
        break
      }
    }
    return prec
  }
  function stripTrailingZeros(n) {
    if(n.op !== Model.NUM) {
      var mv = mathValue(n, true);
      if(!mv) {
        return n
      }
      n = newNode(Model.NUM, [String(mv)])
    }
    var decimalPoint;
    var s = n.args[0];
    for(var i = 0;i < s.length;i++) {
      var c = s.charCodeAt(i);
      if(c === 46) {
        decimalPoint = i
      }else {
        if((c < 48 || c > 57) && c !== 45) {
          return n
        }
      }
    }
    if(decimalPoint !== undefined) {
      for(var i = s.length - 1;i > decimalPoint;i--) {
        if(s.charCodeAt(i) === 48) {
          s = s.substring(0, i)
        }else {
          break
        }
      }
      if(s.charCodeAt(s.length - 1) === 46) {
        s = s.substring(0, s.length - 1)
      }
    }
    return s
  }
  function distributeUnits(n1, n2) {
    var n1units = units(n1);
    var n2units = units(n2);
    assert(n1units.length < 2, message(2004));
    assert(n2units.length < 2, message(2004));
    var n1unit = n1units[0];
    var n2unit = n2units[0];
    var n1new, n2new;
    if(n1unit === undefined && n2unit !== undefined) {
      n1new = multiplyNode([n1, variableNode(n2unit.args[0])]);
      n2new = n2
    }else {
      if(n2unit === undefined && n1unit !== undefined) {
        n1new = n1;
        n2new = multiplyNode([n2, variableNode(n1unit.args[0])])
      }else {
        n1new = n1;
        n2new = n2
      }
    }
    return[n1new, n2new]
  }
  Model.fn.equivValue = function equivValue(n1, n2, op) {
    var options = Model.options = Model.options ? Model.options : {};
    var env = Model.env;
    var inverseResult = option("inverseResult");
    var result;
    var v1t = bigZero;
    var v2t = bigZero;
    var args = [];
    if(isComparison(n1.op) && isComparison(n2.op)) {
      var n1l = n1.args[0];
      var n1r = n1.args[1];
      var n2l = n2.args[0];
      var n2r = n2.args[1];
      if(option("compareSides")) {
        if(n1.op !== n2.op) {
          return false
        }
        var v1 = equivValue(n1l, n2l);
        var v2 = equivValue(n1r, n2r);
        var result = v1 && v2
      }else {
        var v1 = Model.create(n1l).equivValue(n1r, n1.op);
        var v2 = Model.create(n2l).equivValue(n2r, n2.op);
        var result = v1 === v2
      }
      return inverseResult ? !result : result
    }
    if(n1.op === Model.PM && n1.args.length > 1) {
      var args = distributeUnits(n1.args[0], n1.args[1]);
      n1 = binaryNode(Model.PM, args)
    }
    if(n2.op === Model.PM && n2.args.length > 1) {
      var args = distributeUnits(n2.args[0], n2.args[1]);
      n2 = binaryNode(Model.PM, args)
    }
    var n1b, n2b, n1t, n2t;
    var v1, v2;
    if(n1.op === Model.PM && n1.args.length > 1) {
      n1b = simplify(expand(normalize(n1.args[0])));
      n1t = simplify(expand(normalize(n1.args[1])));
      var v1 = mathValue(n1b, env, true, true);
      var v1t = mathValue(n1t, env, true, true)
    }else {
      n1 = normalize(n1);
      if(v1 = mathValue(n1, true)) {
        n1b = scale(n1)
      }else {
        n1b = simplify(expand(n1));
        v1 = mathValue(n1b, true, true)
      }
    }
    if(n2.op === Model.PM && n2.args.length > 1) {
      n2b = simplify(expand(normalize(n2.args[0])));
      n2t = simplify(expand(normalize(n2.args[1])));
      var v2 = mathValue(n2b, env, true, true);
      var v2t = mathValue(n2t, env, true, true)
    }else {
      n2 = normalize(n2);
      if(v2 = mathValue(n2, true)) {
        n2b = scale(n2)
      }else {
        n2b = simplify(expand(n2));
        v2 = mathValue(n2b, true, true)
      }
    }
    if(isUndefined(n1b) || isUndefined(n2b)) {
      result = false;
      return inverseResult ? !result : result
    }
    if(n1b.op === Model.COMMA && n2b.op === Model.COMMA || n1b.op === Model.LIST && n2b.op === Model.LIST) {
      assert(n1t === undefined && n2t === undefined, message(2007));
      var result = every(n1b.args, function(a, i) {
        return equivValue(n1b.args[i], n2b.args[i])
      });
      if(result && n1b.lbrk === n2b.lbrk || n1b.rbrk === n2b.rbrk) {
        result = true
      }else {
        result = false
      }
      return inverseResult ? !result : result
    }
    var vp1 = variablePart(n1b);
    var vp2 = variablePart(n2b);
    if(!n1t && (!n2t && (vp1 && (vp2 && ast.intern(vp1) === ast.intern(vp2))))) {
      n1b = constantPart(n1b);
      n2b = constantPart(n2b);
      if(n1b === undefined && n2b === undefined) {
        result = true;
        return inverseResult ? !result : result
      }
    }
    var nid1 = ast.intern(n1b);
    var nid2 = ast.intern(n2b);
    if(nid1 === nid2 && (n1t === undefined && (n2t === undefined && (op === undefined || isEqualsComparison(op))))) {
      result = true;
      return inverseResult ? !result : result
    }
    if(n1b.op === Model.LIST && n2b.op === Model.LIST) {
      assert(n1t === undefined && n2t === undefined, message(2007));
      if(n1b.lbrk !== n2b.lbrk || n1b.rbrk !== n2b.rbrk) {
        return false
      }
      var l1 = n1b.args;
      var l2 = n2b.args;
      return every(l1, function(a, i) {
        var result = equivValue(a, l2[i]);
        return inverseResult ? !result : result
      })
    }
    var v1 = mathValue(n1b, env, true, true);
    var v2 = mathValue(n2b, env, true, true);
    assert(v1 !== null || isComparison(n1b.op), message(2005), "spec");
    assert(n1b.op !== Model.PM || v1t !== null, message(2005), "spec");
    assert(v2 !== null || isComparison(n2b.op), message(2005), "user");
    assert(n2b.op !== Model.PM || v2t !== null, message(2005), "user");
    Assert.clearLocation();
    if(v1 !== null && (v2 !== null && checkUnits(n1b, n2b))) {
      v2 = baseUnitConversion(n1b, n2b)(v2);
      if(!isZero(v2t)) {
        v2t = baseUnitConversion(n1b, n2b)(v2t)
      }
      var s = options.decimalPlaces != undefined ? +options.decimalPlaces : 10;
      v1 = v1.setScale(s, BigDecimal.ROUND_HALF_UP);
      v2 = v2.setScale(s, BigDecimal.ROUND_HALF_UP);
      Model.options = options;
      if(isZero(v1t) && isZero(v2t)) {
        var cmp = v1.compareTo(v2);
        switch(op) {
          case Model.LT:
            result = cmp < 0 ? true : false;
            break;
          case Model.LE:
            result = cmp <= 0 ? true : false;
            break;
          case Model.GT:
            result = cmp > 0 ? true : false;
            break;
          case Model.GE:
            result = cmp >= 0 ? true : false;
            break;
          default:
            result = cmp === 0;
            break
        }
        return inverseResult ? !result : result
      }else {
        v1t = v1t.setScale(s, BigDecimal.ROUND_HALF_UP);
        v2t = v2t.setScale(s, BigDecimal.ROUND_HALF_UP);
        var v1min = v1.subtract(v1t);
        var v2min = v2.subtract(v2t);
        var v1max = v1.add(v1t);
        var v2max = v2.add(v2t);
        if(v1min.compareTo(v2min) >= 0 && v1max.compareTo(v2min) <= 0 || (v1min.compareTo(v2max) >= 0 && v1max.compareTo(v2max) <= 0 || (v2min.compareTo(v1min) >= 0 && v2max.compareTo(v1max) <= 0 || v2min.compareTo(v1max) >= 0 && v2max.compareTo(v1max) <= 0))) {
          result = true;
          return inverseResult ? !result : result
        }
      }
    }
    var result = false;
    return inverseResult ? !result : result;
    function checkUnits(n1, n2) {
      var u1 = units(n1);
      var u2 = units(n2);
      if(u1.length === 0 || u2.length === 0) {
        if(u1.length === u2.length) {
          return true
        }else {
          return false
        }
      }
      var d1 = degree(u1[0]);
      var d2 = degree(u2[0]);
      return d1 === d2 ? true : false
    }
    function baseUnit(node) {
      var env = Model.env;
      var prevLocation = Assert.location;
      if(node.location) {
        Assert.setLocation(node.location)
      }
      var uu = units(node, env);
      var baseUnits = [];
      forEach(uu, function(u) {
        var unit;
        if(u.op === Model.POW) {
          assert(u.args[0].op === Model.VAR, "2000: Internal error.");
          unit = env[u.args[0].args[0]]
        }else {
          assert(u.op === Model.VAR, "2000: Internal error.");
          unit = env[u.args[0]]
        }
        assert(unit && unit.type === "unit", "2000: Internal error.");
        if(indexOf(baseUnits, unit.base) < 0) {
          baseUnits.push(unit.base)
        }
      });
      Assert.setLocation(prevLocation);
      assert(baseUnits.length < 2, message(2017, [baseUnits]));
      return baseUnits[0]
    }
    function baseUnitConversion(u1, u2) {
      var NaN = Math.NaN;
      var baseUnitConversions = {"g/lb":function(v) {
        return v.multiply(toDecimal("453.592"))
      }, "lb/g":function(v) {
        return v.multiply(toDecimal("0.00220462"))
      }, "m/ft":function(v) {
        return v.multiply(toDecimal("0.3048"))
      }, "ft/m":function(v) {
        return v.multiply(toDecimal("3.28084"))
      }, "L/fl":function(v) {
        return v.multiply(toDecimal("0.02957353"))
      }, "fl/L":function(v) {
        return v.multiply(toDecimal("33.814022702"))
      }, "\\degree K/\\degree C":function(v) {
        return v.add(toDecimal("273.15"))
      }, "\\degree C/\\degree K":function(v) {
        return v.subtract(toDecimal("273.15"))
      }, "\\degree C/\\degree F":function(v) {
        return v.subtract(toDecimal("32")).multiply(toDecimal("5")).divide(toDecimal("9"))
      }, "\\degree F/\\degree C":function(v) {
        return v.multiply(toDecimal("9")).divide(toDecimal("5")).add(toDecimal("32"))
      }, "\\degree K/\\degree F":function(v) {
        return v.add(toDecimal("459.67")).multiply(toDecimal("5")).divide(toDecimal("9"))
      }, "\\degree F/\\degree K":function(v) {
        return v.multiply(toDecimal("9")).divide(toDecimal("5")).subtract(toDecimal("459.67"))
      }};
      var bu1 = baseUnit(u1);
      var bu2 = baseUnit(u2);
      var fn = bu1 === bu2 ? function(v) {
        return v
      } : baseUnitConversions[bu1 + "/" + bu2];
      return fn
    }
  };
  function compareTrees(actual, expected) {
  }
  Model.fn.equivSyntax = function(n1, n2) {
    reset();
    var ignoreOrder = option("ignoreOrder");
    var inverseResult = option("inverseResult");
    var options = Model.options ? Model.options : {};
    var result = false;
    if(!(n1 instanceof Array)) {
      n1 = [n1]
    }
    result = some(n1, function(n) {
      try {
        options.is_normal = true;
        var n1n = normalizeSyntax(n, n);
        delete options.is_normal
      }catch(e) {
        throw e;
      }
      var n2n = normalizeSyntax(n2, n);
      return ast.intern(n1n) === ast.intern(n2n)
    });
    var input = "";
    delete options.is_normal;
    var not = options.not;
    if(not) {
      input += "NOT ";
      delete options.not
    }
    return inverseResult ? !result : result
  };
  Model.fn.equivLiteral = function equivLiteral(n1, n2) {
    var inverseResult = option("inverseResult");
    if(terms(n1).length !== terms(n2).length) {
      return inverseResult ? true : false
    }
    var ignoreOrder = option("ignoreOrder");
    n1 = normalizeLiteral(n1);
    n2 = normalizeLiteral(n2);
    if(ignoreOrder) {
      n1 = sortLiteral(n1);
      n2 = sortLiteral(n2)
    }
    var nid1 = ast.intern(n1);
    var nid2 = ast.intern(n2);
    var result = nid1 === nid2;
    return inverseResult ? !result : result
  };
  function formulaKind(node) {
    var kind;
    switch(node.op) {
      case Model.EQL:
        kind = Model.EQL;
        break;
      case Model.GE:
      ;
      case Model.LE:
      ;
      case Model.GT:
      ;
      case Model.LT:
      ;
      case Model.NGTR:
      ;
      case Model.NLESS:
        kind = Model.GE;
        break;
      default:
        kind = 0;
        break
    }
    return kind
  }
  Model.fn.equivSymbolic = function equivSymbolic(n1, n2, resume) {
    var n1o = n1;
    var n2o = n2;
    var result;
    var inverseResult = option("inverseResult");
    var strict = option("strict");
    if(!inverseResult && !strict) {
      var n1o = JSON.parse(JSON.stringify(n1));
      var n2o = JSON.parse(JSON.stringify(n2));
      var ignoreOrder = option("ignoreOrder", false);
      try {
        var result = Model.fn.equivLiteral(n1, n2);
        option("ignoreOrder", ignoreOrder)
      }catch(e) {
        option("ignoreOrder", ignoreOrder);
        throw e;
      }
      if(result) {
        if(resume) {
          resume(null, true)
        }
        return true
      }
      n1 = n1o;
      n2 = n2o
    }
    if(isComparison(n1.op) && n1.op === n2.op) {
      var n1a0 = n1.args[0];
      var n1a1 = n1.args[1];
      var n2a0 = n2.args[0];
      var n2a1 = n2.args[1];
      var n1a0id = ast.intern(n1a0);
      var n1a1id = ast.intern(n1a1);
      var n2a0id = ast.intern(n2a0);
      var n2a1id = ast.intern(n2a1);
      var mv;
      if(n1a0.op === Model.VAR && (n2a0.op === Model.VAR && n1a0id === n2a0id)) {
        if(n1a1.op !== Model.NUM && (mv = mathValue(normalize(n1a1), true))) {
          n1 = newNode(n1.op, [n1a0, numberNode(mv, true)])
        }
        if(n2a1.op !== Model.NUM && (mv = mathValue(normalize(n2a1), true))) {
          n2 = newNode(n2.op, [n2a0, numberNode(mv, true)])
        }
      }else {
        if(n1a0.op === Model.VAR && (n2a1.op === Model.VAR && n1a0id === n2a1id)) {
          if(n1a1.op !== Model.NUM && (mv = mathValue(normalize(n1a1), true))) {
            n1 = newNode(n1.op, [n1a0, numberNode(mv, true)])
          }
          if(n2a0.op !== Model.NUM && (mv = mathValue(normalize(n2a0), true))) {
            n2 = newNode(n2.op, [numberNode(mv, true), n2a1])
          }
        }else {
          if(n1a1.op === Model.VAR && (n2a0.op === Model.VAR && n1a1id === n2a0id)) {
            if(n1a0.op !== Model.NUM && (mv = mathValue(normalize(n1a0), true))) {
              n1 = newNode(n1.op, [numberNode(mv, true), n1a1])
            }
            if(n2a1.op !== Model.NUM && (mv = mathValue(normalize(n2a1), true))) {
              n2 = newNode(n2.op, [n2a0, numberNode(mv, true)])
            }
          }else {
            if(n1a1.op === Model.VAR && (n2a1.op === Model.VAR && n1a1id === n2a1id)) {
              if(n1a0.op !== Model.NUM && (mv = mathValue(normalize(n1a0), true))) {
                n1 = newNode(n1.op, [numberNode(mv, true), n1a1])
              }
              if(n2a0.op !== Model.NUM && (mv = mathValue(normalize(n2a0), true))) {
                n2 = newNode(n2.op, [numberNode(mv, true), n2a1])
              }
            }
          }
        }
      }
    }
    var ignoreUnits = option("ignoreUnits", true);
    if(formulaKind(n1) !== formulaKind(n2)) {
      var result = false
    }else {
      if(option("compareSides") && (isComparison(n1.op) && n1.op === n2.op)) {
        var n1l = n1.args[0];
        var n1r = n1.args[1];
        var n2l = n2.args[0];
        var n2r = n2.args[1];
        var nn = eraseCommonExpressions(normalize(n1l), normalize(n2l));
        n1l = nn[0];
        n2l = nn[1];
        var nn = eraseCommonExpressions(normalize(n1r), normalize(n2r));
        n1r = nn[0];
        n2r = nn[1];
        option("inverseResult", false);
        option("strict", true);
        equivSymbolic(Model.create(n1l), Model.create(n2l), function(err, result1) {
          equivSymbolic(Model.create(n1r), Model.create(n2r), function(err, result2) {
            option("strict", strict);
            option("inverseResult", inverseResult);
            option("ignoreUnits", ignoreUnits);
            resume(null, result1 && result2)
          })
        })
      }else {
        if(false && !option("SymPy")) {
          var nn = eraseCommonExpressions(normalize(n1), normalize(n2));
          n1 = nn[0];
          n2 = nn[1];
          var n1o = stripMetadata(n1o);
          var n2o = stripMetadata(n2o);
          var mv1, mv2;
          if((mv1 = mathValue(n1, true)) && (mv2 = mathValue(n2, true))) {
            n1 = scale(n1);
            n2 = scale(n2)
          }else {
            n1 = scale(expand(normalize(simplify(expand(normalize(n1))))));
            n2 = scale(expand(normalize(simplify(expand(normalize(n2))))))
          }
          var nid1 = ast.intern(n1);
          var nid2 = ast.intern(n2);
          var result = nid1 === nid2
        }
        if(!result) {
          if(true || option("SymPy")) {
            option("SymPy", undefined);
            var node = newNode(Model.PAREN, [newNode(Model.COMMA, [stripMetadata(n1o), stripMetadata(n2o), newNode(Model.ADD, [stripMetadata(n1o), negate(stripMetadata(n2o))])])]);
            node.lbrk = 40;
            node.rbrk = 41;
            var options = {};
            evalSympy("simplify", node, options, function(err, val) {
              var n = Model.create(val);
              if(n.op === Model.PAREN && n.args[0].op === Model.LIST) {
                n = n.args[0];
                var result;
                if(isZero(mathValue(n.args[2]))) {
                  result = true
                }else {
                  n1 = scale(expand(normalize(simplify(expand(normalize(n.args[0]))))));
                  n2 = scale(expand(normalize(simplify(expand(normalize(n.args[1]))))));
                  var nid1 = ast.intern(n1);
                  var nid2 = ast.intern(n2);
                  result = nid1 === nid2
                }
                result = inverseResult && !result || result;
                option("ignoreUnits", ignoreUnits);
                resume(null, result)
              }else {
                resume(["Error in SymPy code"])
              }
            })
          }else {
            if(isComparison(n1.op)) {
              n1 = scale(normalize(simplify(expand(normalize(n1)))));
              n2 = scale(normalize(simplify(expand(normalize(n2)))));
              nid1 = ast.intern(n1);
              nid2 = ast.intern(n2);
              result = nid1 === nid2;
              result = inverseResult && !result || result;
              option("ignoreUnits", ignoreUnits);
              resume(null, result)
            }else {
              if(!isComparison(n2.op) && (!isAggregate(n1) && !isAggregate(n2))) {
                n1 = addNode([n1o, negate(n2o)]);
                n2 = nodeZero;
                n1 = scale(normalize(simplify(expand(normalize(n1)))));
                n2 = scale(normalize(simplify(expand(normalize(n2)))));
                nid1 = ast.intern(n1);
                nid2 = ast.intern(n2);
                result = nid1 === nid2;
                result = inverseResult && !result || result;
                option("ignoreUnits", ignoreUnits);
                resume(null, result)
              }
            }
          }
        }else {
          result = inverseResult && !result || result;
          option("ignoreUnits", ignoreUnits);
          resume(null, result)
        }
      }
    }
    if(result) {
      return inverseResult ? false : true
    }
    return inverseResult ? true : false
  };
  function getSympy(path, data, resume) {
    path = path.trim().replace(/ /g, "+");
    var encodedData = JSON.stringify(data);
    var options = {method:"GET", host:LOCAL && "localhost" || "sympy-artcompiler.herokuapp.com", port:LOCAL && "8000" || "80", path:path, headers:{"Content-Type":"application/json", "Content-Length":encodedData.length}};
    var protocol = http;
    var req = protocol.request(options, function(res) {
      var data = "";
      res.on("data", function(chunk) {
        data += chunk
      }).on("end", function() {
        try {
          resume([], JSON.parse(data))
        }catch(e) {
          resume(["ERROR Sympy: " + encodedData], {})
        }
      }).on("error", function() {
        console.log("error() status=" + res.statusCode + " data=" + data);
        resume([], {})
      })
    });
    req.write(encodedData);
    req.end();
    req.on("error", function(e) {
      console.log("ERROR: " + e);
      resume([].concat(e), [])
    })
  }
  function evalSympy(fn, expr, options, resume) {
    var errs = [];
    var result;
    var syms = variables(expr);
    var index;
    var excludes = ["\\pi", "\\infty", "e"];
    excludes.forEach(function(sym) {
      if((index = syms.indexOf(sym)) >= 0) {
        syms = function(syms) {
          var rest = syms.slice(index + 1);
          syms.length = index;
          return syms.concat(rest)
        }(syms)
      }
    });
    var symbols = "";
    var params = "";
    if(syms && syms.length) {
      syms.forEach(function(s) {
        if(symbols) {
          symbols += " ";
          params += ","
        }
        symbols += s;
        params += s
      });
      symbols = "symbols('" + symbols + "')";
      params = "(" + params + ")"
    }
    var opts = "";
    Object.keys(options).forEach(function(k) {
      switch(k) {
        case "variable":
        ;
        case "precision":
          opts += "," + options[k];
          break;
        case "domain":
          opts += "," + k + "=" + options[k];
          break;
        default:
          break
      }
    });
    texToSympy(expr, function(err, v) {
      if(err && err.length) {
        errs = errs.concat(err);
        resume(errs, [])
      }else {
        var args = v + opts;
        var obj = {func:"eval", expr:"(lambda" + params + ":" + fn + "(" + args + "))(" + symbols + ")"};
        console.log("evalSympy() obj=" + JSON.stringify(obj, null, 2));
        getSympy("/api/v1/eval", obj, function(err, data) {
          console.log("evalSympy() data=" + JSON.stringify(data, null, 2));
          if(err && err.length) {
            errs = errs.concat(err)
          }
          resume(errs, data)
        })
      }
    })
  }
  function isEqualsComparison(op) {
    return op === Model.LE || (op === Model.GE || op === Model.EQL)
  }
  function isAggregate(node) {
    if(node.op === Model.COMMA || (node.op === Model.LIST || (node.op === Model.MATRIX || node.op === Model.INTERVAL))) {
      return true
    }else {
      if(node.op === Model.NUM || node.op === Model.VAR) {
        return false
      }
    }
    return some(node.args, function(n) {
      return isAggregate(n)
    })
  }
  function isComparison(op) {
    return op === Model.LT || (op === Model.LE || (op === Model.GT || (op === Model.GE || (op === Model.NE || (op === Model.NGTR || (op === Model.NLESS || (op === Model.APPROX || op === Model.EQL)))))))
  }
  function isInequality(op) {
    return op === Model.LT || (op === Model.LE || (op === Model.GT || (op === Model.GE || (op === Model.NE || (op === Model.NGTR || op === Model.NLESS)))))
  }
  Model.fn.isTrue = function(n1) {
    var prevLocation = Assert.location;
    if(n1.location) {
      Assert.setLocation(n1.location)
    }
    var result;
    if(isComparison(n1.op)) {
      try {
        result = Model.create(n1.args[0]).equivValue(n1.args[1], n1.op)
      }catch(e) {
        result = false
      }
      Assert.setLocation(prevLocation);
      return result
    }else {
      var mv = mathValue(n1);
      if(mv && !isZero(mv)) {
        result = true
      }else {
        result = false
      }
      Assert.setLocation(prevLocation)
    }
    var inverseResult = option("inverseResult");
    return inverseResult ? !result : result
  };
  Model.fn.format = function(n1, n2) {
    var prevLocation = Assert.location;
    var node = formatMath(n2, n1);
    return ast.toLaTeX(node)
  };
  Model.fn.calculate = function(n1) {
    var prevLocation = Assert.location;
    if(n1.location) {
      Assert.setLocation(n1.location)
    }
    n1 = normalize(n1);
    var mv, node;
    if(mv = mathValue(n1, true, true)) {
      node = scale(n1)
    }else {
      var decimalPlaces = Model.option("decimalPlaces", 20);
      node = normalizeCalculate(scale(expand(normalize(simplify(expand(n1))))));
      Model.option("decimalPlaces", decimalPlaces);
      node = scale(node)
    }
    var result = stripTrailingZeros(scale(numberNode(mathValue(node, Model.env, true, true))));
    Assert.setLocation(prevLocation);
    return result
  };
  Model.fn.simplify = function(n1) {
    var prevLocation = Assert.location;
    if(n1.location) {
      Assert.setLocation(n1.location)
    }
    var result = ast.toLaTeX(simplify(expand(normalize(n1))));
    result = typeof result === "string" ? result : "ERROR";
    Assert.setLocation(prevLocation);
    return result
  };
  Model.fn.expand = function(n1) {
    var prevLocation = Assert.location;
    if(n1.location) {
      Assert.setLocation(n1.location)
    }
    var result = ast.toLaTeX(normalizeExpanded(normalize(expand(normalize(n1)))));
    result = typeof result === "string" ? result : "ERROR";
    Assert.setLocation(prevLocation);
    return result
  };
  Model.fn.isExpanded = function isExpanded(node) {
    var n1, n2, nid1, nid2, result;
    if(node.op === Model.COMMA) {
      result = every(node.args, function(n) {
        return isExpanded(n)
      })
    }else {
      if(isComparison(node.op)) {
        var inverseResult = option("inverseResult", false);
        result = isExpanded(node.args[0]) && isExpanded(node.args[1]);
        option("inverseResult", inverseResult)
      }else {
        var dontExpandPowers = option("dontExpandPowers", true);
        var dontFactorDenominators = option("dontFactorDenominators", true);
        var dontFactorTerms = option("dontFactorTerms", true);
        var dontConvertDecimalToFraction = option("dontConvertDecimalToFraction", true);
        var dontSimplifyImaginary = option("dontSimplifyImaginary", true);
        n1 = normalize(node);
        n2 = normalizeExpanded(normalize(expand(normalize(node))));
        nid1 = ast.intern(n1);
        nid2 = ast.intern(n2);
        option("dontExpandPowers", dontExpandPowers);
        option("dontFactorDenominators", dontFactorDenominators);
        option("dontFactorTerms", dontFactorTerms);
        option("dontConvertDecimalToFraction", dontConvertDecimalToFraction);
        option("dontSimplifyImaginary", dontSimplifyImaginary);
        if(nid1 === nid2 && !hasLikeFactors(n1)) {
          result = true
        }else {
          result = false
        }
      }
    }
    var inverseResult = option("inverseResult");
    return inverseResult ? !result : result
  };
  function hasDenominator(node) {
    var tt = terms(node);
    var result = some(tt, function(t) {
      if(variablePart(t)) {
        var ff = factors(t);
        return some(ff, function(f) {
          return f.op === Model.POW && isNeg(f.args[1])
        })
      }else {
        return false
      }
    });
    return result
  }
  Model.fn.isSimplified = function isSimplified(node, resume) {
    var n1, n2, nid1, nid2, result;
    var dontFactorDenominators = option("dontFactorDenominators", true);
    var dontFactorTerms = option("dontFactorTerms", true);
    var dontConvertDecimalToFraction = option("dontConvertDecimalToFraction", true);
    var dontSimplifyImaginary = option("dontSimplifyImaginary", true);
    var inverseResult = option("inverseResult");
    if(node.op === Model.COMMA) {
      result = every(node.args, function(n) {
        return isSimplified(n)
      })
    }else {
      if(isComparison(node.op) && (!isZero(node.args[0]) && !isZero(node.args[1]))) {
        n1 = normalize(addNode([node.args[0], node.args[1]]));
        result = true;
        var inverseResult = option("inverseResult", false);
        if(!isSimplified(n1)) {
          result = false
        }
        option("inverseResult", inverseResult);
        if(result && hasDenominator(n1)) {
          result = false
        }
        if(result && !isFactorised(n1)) {
          result = false
        }
      }else {
        node = normalize(node);
        var vp;
        if(isNeg(node) && (!(vp = variablePart(node)) || vp.op !== Model.ADD)) {
          node = negate(node)
        }
        n1 = normalize(node);
        n2 = normalize(simplify(expand(normalize(node))));
        nid1 = ast.intern(n1);
        nid2 = ast.intern(n2);
        result = nid1 === nid2
      }
    }
    option("dontFactorDenominators", dontFactorDenominators);
    option("dontFactorTerms", dontFactorTerms);
    option("dontConvertDecimalToFraction", dontConvertDecimalToFraction);
    option("dontSimplifyImaginary", dontSimplifyImaginary);
    if(result && (!n1 || !hasLikeFactors(n1))) {
      return inverseResult ? false : true
    }
    return inverseResult ? true : false
  };
  Model.fn.isFactorised = function(n1) {
    var inverseResult = option("inverseResult");
    var dontConvertDecimalToFraction = option("dontConvertDecimalToFraction", true);
    var result = isFactorised(normalize(n1));
    option("dontConvertDecimalToFraction", dontConvertDecimalToFraction);
    return inverseResult ? !result : result
  };
  Model.fn.isUnit = function(n1, n2) {
    var inverseResult = option("inverseResult");
    var u1 = units(normalize(n1), env);
    var u2 = units(normalize(n2), env);
    if(!(u2 instanceof Array)) {
      u2 = [u2]
    }
    var result = false;
    if(u1.length === 0 && (u2.length === 0 && n2.op !== Model.NONE)) {
      result = true
    }else {
      if(u2.length) {
        result = every(u2, function(v1) {
          return some(u1, function(v2) {
            return ast.intern(v1) === ast.intern(v2)
          })
        })
      }
    }
    return inverseResult ? !result : result
  };
  function getRE(re) {
    if(typeof re === "string") {
      if(re === "latex") {
        re = /^[\\]/
      }else {
        if(re === "not latex") {
          re = /^[^\\]/
        }else {
          assert(false, "2000: Expecting 'latex' or 'not latex'")
        }
      }
    }
    return re
  }
  Model.fn.variables = function(n1, pattern) {
    var names = variables(n1);
    var filtered = [];
    var re = getRE(pattern);
    forEach(names, function(n) {
      if(!re || re.test(n)) {
        filtered.push(n)
      }
    });
    return filtered
  };
  Model.fn.known = function(n1, pattern) {
    var env = n1.env ? n1.env : [];
    var names = variables(n1);
    var re = getRE(pattern);
    var filtered = [];
    forEach(names, function(n) {
      if(env[n] && (!re || re.test(n))) {
        filtered.push(n)
      }
    });
    return filtered
  };
  Model.fn.unknown = function(n1, pattern) {
    var env = n1.env ? n1.env : [];
    var names = variables(n1);
    var re = getRE(pattern);
    var filtered = [];
    forEach(names, function(n) {
      if(!env[n] && (!re || re.test(n))) {
        filtered.push(n)
      }
    });
    return filtered
  };
  Model.fn.hint = function(n1) {
    return hint(n1)
  };
  var option = Model.option = function option(p, v) {
    var options = Model.options;
    var opt = options && options[p];
    if(arguments.length > 1) {
      Model.options = options = options || {};
      if(v === undefined) {
        delete options[p]
      }else {
        options[p] = v
      }
    }
    if(opt === undefined) {
      switch(p) {
        case "field":
          opt = "integer";
          break;
        case "decimalPlaces":
          opt = 10;
          break;
        case "setThousandsSeparator":
        ;
        case "setDecimalSeparator":
        ;
        case "dontExpandPowers":
        ;
        case "dontFactorDenominators":
        ;
        case "dontFactorTerms":
        ;
        case "dontConvertDecimalToFraction":
        ;
        case "strict":
        ;
        case "compatibility":
        ;
        case "allowEulersNumber":
        ;
        case "ignoreUnits":
          opt = undefined;
          break;
        default:
          opt = false;
          break
      }
    }
    return opt
  }
})(Model.prototype);
var MathCore = function() {
  Assert.reserveCodeRange(3E3, 3999, "mathcore");
  var messages = Assert.messages;
  var message = Assert.message;
  var assert = Assert.assert;
  messages[3001] = "No Math Core spec provided.";
  messages[3002] = "No Math Core solution provided.";
  messages[3003] = "No Math Core spec value provided.";
  messages[3004] = "Invalid Math Core spec method '%1'.";
  messages[3005] = "Operation taking more than %1 milliseconds.";
  messages[3006] = "Invalid option name '%1'.";
  messages[3007] = "Invalid option value '%2' for option '%1'.";
  messages[3008] = "Internal error: %1";
  var u = 1;
  var k = 1E3;
  var c = new BigDecimal("1E-2");
  var m = new BigDecimal("1E-3");
  var mu = new BigDecimal("1E-6");
  var n = new BigDecimal("1E-9");
  var env = {"g":{type:"unit", value:u, base:"g"}, "s":{type:"unit", value:u, base:"s"}, "m":{type:"unit", value:u, base:"m"}, "L":{type:"unit", value:u, base:"L"}, "kg":{type:"unit", value:k, base:"g"}, "km":{type:"unit", value:k, base:"m"}, "ks":{type:"unit", value:k, base:"s"}, "kL":{type:"unit", value:k, base:"L"}, "cg":{type:"unit", value:c, base:"g"}, "cm":{type:"unit", value:c, base:"m"}, "cs":{type:"unit", value:c, base:"s"}, "cL":{type:"unit", value:c, base:"L"}, "mg":{type:"unit", value:m, 
  base:"g"}, "mm":{type:"unit", value:m, base:"m"}, "ms":{type:"unit", value:m, base:"s"}, "mL":{type:"unit", value:m, base:"L"}, "\\mug":{type:"unit", value:mu, base:"g"}, "\\mus":{type:"unit", value:mu, base:"s"}, "\\mum":{type:"unit", value:mu, base:"m"}, "\\muL":{type:"unit", value:mu, base:"L"}, "ng":{type:"unit", value:n, base:"g"}, "nm":{type:"unit", value:n, base:"m"}, "ns":{type:"unit", value:n, base:"s"}, "nL":{type:"unit", value:n, base:"L"}, "in":{type:"unit", value:1 / 12, base:"ft"}, 
  "ft":{type:"unit", value:u, base:"ft"}, "yd":{type:"unit", value:3, base:"ft"}, "mi":{type:"unit", value:5280, base:"ft"}, "fl":{type:"unit", value:1, base:"fl"}, "cup":{type:"unit", value:8, base:"fl"}, "pt":{type:"unit", value:16, base:"fl"}, "qt":{type:"unit", value:32, base:"fl"}, "gal":{type:"unit", value:128, base:"fl"}, "oz":{type:"unit", value:1 / 16, base:"lb"}, "lb":{type:"unit", value:1, base:"lb"}, "st":{type:"unit", value:1 / 1614, base:"lb"}, "qtr":{type:"unit", value:28, base:"lb"}, 
  "cwt":{type:"unit", value:112, base:"lb"}, "$":{type:"unit", value:u, base:"$"}, "min":{type:"unit", value:60, base:"s"}, "hr":{type:"unit", value:3600, base:"s"}, "day":{type:"unit", value:24 * 3600, base:"s"}, "\\radian":{type:"unit", value:u, base:"\\radian"}, "\\degree":{type:"unit", value:Math.PI / 180, base:"\\radian"}, "\\degree K":{type:"unit", value:u, base:"\\degree K"}, "\\degree C":{type:"unit", value:u, base:"\\degree C"}, "\\degree F":{type:"unit", value:u, base:"\\degree F"}, "R":{name:"reals"}, 
  "matrix":{}, "pmatrix":{}, "bmatrix":{}, "Bmatrix":{}, "vmatrix":{}, "Vmatrix":{}, "array":{}, "\\alpha":{type:"var"}, "\\beta":{type:"var"}, "\\gamma":{type:"var"}, "\\delta":{type:"var"}, "\\epsilon":{type:"var"}, "\\zeta":{type:"var"}, "\\eta":{type:"var"}, "\\theta":{type:"var"}, "\\iota":{type:"var"}, "\\kappa":{type:"var"}, "\\lambda":{type:"var"}, "\\mu":{type:"const", value:mu}, "\\nu":{type:"var"}, "\\xi":{type:"var"}, "\\pi":{type:"const", value:Math.PI}, "e":{type:"const", value:Math.E}, 
  "\\rho":{type:"var"}, "\\sigma":{type:"var"}, "\\tau":{type:"var"}, "\\upsilon":{type:"var"}, "\\phi":{type:"var"}, "\\chi":{type:"var"}, "\\psi":{type:"var"}, "\\omega":{type:"var"}};
  function evaluate(spec, solution, resume) {
    try {
      assert(spec, message(3001, [spec]));
      assert(solution != undefined, message(3002, [solution]));
      Assert.setTimeout(timeoutDuration, message(3005, [timeoutDuration]));
      var evaluator = makeEvaluator(spec);
      evaluator.evaluate(solution, function(err, val) {
        resume(null, val)
      })
    }catch(e) {
      trace(e + "\n" + e.stack);
      resume(e.stack, undefined)
    }
  }
  function evaluateVerbose(spec, solution, resume) {
    var model, result;
    try {
      assert(spec, message(3001, [spec]));
      Assert.setTimeout(timeoutDuration, message(3005, [timeoutDuration]));
      var evaluator = makeEvaluator(spec);
      var errorCode = 0, msg = "Normal completion", stack, location;
      evaluator.evaluate(solution, function(err, val) {
        model = evaluator.model;
        resume([], {result:val, errorCode:errorCode, message:msg, stack:stack, location:location, toString:function() {
          return this.errorCode + ": (" + location + ") " + msg + "\n" + this.stack
        }})
      })
    }catch(e) {
      if(!e.message) {
        try {
          assert(false, message(3008, [e]))
        }catch(x) {
          e = x
        }
      }
      var errorCode = parseErrorCode(e.message);
      var msg = parseMessage(e.message);
      var stack = e.stack;
      var location = e.location;
      console.log("ERROR evaluateVerbose stack=" + stack);
      resume([e.message], {errorCode:errorCode, msg:msg})
    }
    function parseErrorCode(e) {
      var code = +e.slice(0, indexOf(e, ":"));
      if(!isNaN(code)) {
        return code
      }
      return 0
    }
    function parseMessage(e) {
      var code = parseErrorCode(e);
      if(code) {
        return e.slice(indexOf(e, ":") + 2)
      }
      return e
    }
  }
  var timeoutDuration = 3E4;
  function setTimeoutDuration(duration) {
    timeoutDuration = duration
  }
  function validateOption(p, v) {
    switch(p) {
      case "field":
        switch(v) {
          case void 0:
          ;
          case "integer":
          ;
          case "real":
          ;
          case "complex":
            break;
          default:
            assert(false, message(3007, [p, v]));
            break
        }
        break;
      case "decimalPlaces":
        if(v === void 0 || +v >= 0 && +v <= 20) {
          break
        }
        assert(false, message(3007, [p, v]));
        break;
      case "allowDecimal":
      ;
      case "allowInterval":
      ;
      case "dontExpandPowers":
      ;
      case "dontFactorDenominators":
      ;
      case "dontFactorTerms":
      ;
      case "dontConvertDecimalToFraction":
      ;
      case "dontSimplifyImaginary":
      ;
      case "ignoreOrder":
      ;
      case "inverseResult":
      ;
      case "requireThousandsSeparator":
      ;
      case "ignoreText":
      ;
      case "ignoreTrailingZeros":
      ;
      case "allowThousandsSeparator":
      ;
      case "compareSides":
      ;
      case "ignoreCoefficientOne":
      ;
      case "keepTextWhitespace":
      ;
      case "strict":
      ;
      case "allowEulersNumber":
      ;
      case "ignoreUnits":
        if(typeof v === "undefined" || typeof v === "boolean") {
          break
        }
        assert(false, message(3007, [p, v]));
        break;
      case "setThousandsSeparator":
        if(typeof v === "undefined" || (typeof v === "string" || v instanceof Array)) {
          break
        }
        assert(false, message(3007, [p, v]));
        break;
      case "setDecimalSeparator":
        if(typeof v === "undefined" || (typeof v === "string" && v.length === 1 || v instanceof Array && (v.length > 0 && v[0].length === 1))) {
          break
        }
        assert(false, message(3007, [p, JSON.stringify(v)]));
        break;
      case "compatibility":
        if(typeof v === "undefined" || (typeof v === "string" || v instanceof Array)) {
          break
        }
        assert(false, message(3007, [p, v]));
        break;
      case "env":
        if(typeof v === "undefined" || typeof v === "object") {
          break
        }
        assert(false, message(3007, [p, JSON.stringify(v)]));
        break;
      default:
        assert(false, message(3006, [p]));
        break
    }
    return
  }
  function validateOptions(options) {
    if(options) {
      forEach(keys(options), function(option) {
        validateOption(option, options[option])
      })
    }
  }
  function makeEvaluator(spec) {
    var method = spec.method;
    var value = spec.value;
    var options = Model.options = spec.options;
    Assert.setLocation("spec");
    validateOptions(options);
    Model.pushEnv(env);
    if(options.env) {
      Model.pushEnv(options.env)
    }
    var valueNode = value != undefined ? Model.create(value, "spec") : undefined;
    if(valueNode) {
      valueNode.env = env
    }
    if(options.env) {
      Model.popEnv(options.env)
    }
    Model.popEnv();
    var evaluate = function evaluate(solution, resume) {
      Assert.setLocation("user");
      assert(solution != undefined, message(3002));
      Model.pushEnv(env);
      if(options.env) {
        Model.pushEnv(options.env)
      }
      var solutionNode = Model.create(solution, "user");
      if(!outerResult.model) {
        solutionNode.env = env;
        outerResult.model = solutionNode
      }
      Assert.setLocation("spec");
      var result;
      switch(method) {
        case "equivValue":
          assert(value != undefined, message(3003));
          result = valueNode.equivValue(solutionNode);
          break;
        case "equivLiteral":
          assert(value != undefined, message(3003));
          result = valueNode.equivLiteral(solutionNode);
          break;
        case "equivSyntax":
          assert(value != undefined, message(3003));
          if(!(valueNode instanceof Array)) {
            valueNode = [valueNode]
          }
          result = some(valueNode, function(n) {
            return n.equivSyntax(solutionNode)
          });
          break;
        case "equivSymbolic":
          assert(value != undefined, message(3003));
          result = valueNode.equivSymbolic(solutionNode, function(err, val) {
            resume(err, val)
          });
          return;
          break;
        case "isFactorised":
          result = solutionNode.isFactorised();
          break;
        case "isSimplified":
          result = solutionNode.isSimplified();
          break;
        case "isExpanded":
          result = solutionNode.isExpanded();
          break;
        case "isUnit":
          result = valueNode.isUnit(solutionNode);
          break;
        case "isTrue":
          result = solutionNode.isTrue();
          break;
        case "calculate":
          result = solutionNode.calculate();
          break;
        case "simplify":
          result = solutionNode.simplify();
          break;
        case "expand":
          result = solutionNode.expand();
          break;
        case "variables":
          result = solutionNode.variables();
          break;
        case "format":
          result = valueNode.format(solutionNode);
          break;
        case "validSyntax":
          result = true;
          break;
        default:
          assert(false, message(3004, [method]));
          break
      }
      if(options.env) {
        Model.popEnv(options.env)
      }
      Model.popEnv();
      resume(null, result)
    };
    var outerResult = {evaluate:evaluate, model:valueNode};
    return outerResult
  }
  return{evaluate:evaluate, evaluateVerbose:evaluateVerbose, makeEvaluator:makeEvaluator, setTimeoutDuration:setTimeoutDuration, Model:Model, Ast:Ast}
}();

  return MathCore;
})();
export default MathCore;

