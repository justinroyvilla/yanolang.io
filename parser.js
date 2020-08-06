module.exports = 
(function() {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { FuncDefinition: peg$parseFuncDefinition },
        peg$startRuleFunction  = peg$parseFuncDefinition,

        peg$c0 = function(functionName, configuration, definition, annotations) { return {
        	functionName:functionName,
            configuration: configuration,
            definition: definition,
            annotations: annotations
          } 
        },
        peg$c1 = "@",
        peg$c2 = peg$literalExpectation("@", false),
        peg$c3 = "=",
        peg$c4 = peg$literalExpectation("=", false),
        peg$c5 = ",",
        peg$c6 = peg$literalExpectation(",", false),
        peg$c7 = ";",
        peg$c8 = peg$literalExpectation(";", false),
        peg$c9 = function(annotations) {
          var _anno = {};
          _anno[annotations[2]] = annotations[6];
          var next = annotations[7];
          if (next != undefined && Array.isArray(next)){
          	next.reduce((acc,curr)=>{
            	_anno[curr[4]]= curr[8];
            },_anno);
          }
          return _anno;
        },
        peg$c10 = function(body) { 
          var t =  body[1].reduce((acc,curr)=> {return acc+curr},"");
          const regex = /\r?\n/gi;
          return t.replace(regex,"");
        },
        peg$c11 = function() { return text();},
        peg$c12 = peg$anyExpectation(),
        peg$c13 = "(",
        peg$c14 = peg$literalExpectation("(", false),
        peg$c15 = ")",
        peg$c16 = peg$literalExpectation(")", false),
        peg$c17 = function(object) {
          if (object[3] == ""){ return {};}
          var obj = {};
          obj[object[3][1][1]] = object[3][1][5];

          var next = object[3][2];
          if ( next !== undefined && Array.isArray(next) ){
             next.reduce((ac,cu)=>{
             	var pair = cu[3];
                var name = pair[1];
                var val = pair[5];
                obj[name] = val;
             },obj);
          }
          
          return obj;
        },
        peg$c18 = "[",
        peg$c19 = peg$literalExpectation("[", false),
        peg$c20 = "]",
        peg$c21 = peg$literalExpectation("]", false),
        peg$c22 = function(array) {

        	if ( array[3] === "") return [];
            var arr = [];
            arr.push(array[3][1]);
            //arr.push(array[3][2]);
            var next = array[3][2];
            if ( next !== undefined && Array.isArray(next)){
            
            	next.reduce((ac,cu)=>{
                	arr.push(cu[3]);
                },arr);
            }
            return arr;
            
        },
        peg$c23 = "\"",
        peg$c24 = peg$literalExpectation("\"", false),
        peg$c25 = function(string) { return string.reduce((ac,cu)=>{ return ac+cu},"");},
        peg$c26 = /^[ !#-Z\^-~]/,
        peg$c27 = peg$classExpectation([" ", "!", ["#", "Z"], ["^", "~"]], false, false),
        peg$c28 = "\\",
        peg$c29 = peg$literalExpectation("\\", false),
        peg$c30 = /^["\\\/bfnrt]/,
        peg$c31 = peg$classExpectation(["\"", "\\", "/", "b", "f", "n", "r", "t"], false, false),
        peg$c32 = "u",
        peg$c33 = peg$literalExpectation("u", false),
        peg$c34 = /^[0-9a-fA-F]/,
        peg$c35 = peg$classExpectation([["0", "9"], ["a", "f"], ["A", "F"]], false, false),
        peg$c36 = "0",
        peg$c37 = peg$literalExpectation("0", false),
        peg$c38 = /^[\-]/,
        peg$c39 = peg$classExpectation(["-"], false, false),
        peg$c40 = /^[1-9]/,
        peg$c41 = peg$classExpectation([["1", "9"]], false, false),
        peg$c42 = /^[0-9]/,
        peg$c43 = peg$classExpectation([["0", "9"]], false, false),
        peg$c44 = ".",
        peg$c45 = peg$literalExpectation(".", false),
        peg$c46 = function() { return parseFloat(text());},
        peg$c47 = /^[Tt]/,
        peg$c48 = peg$classExpectation(["T", "t"], false, false),
        peg$c49 = /^[Rr]/,
        peg$c50 = peg$classExpectation(["R", "r"], false, false),
        peg$c51 = /^[Uu]/,
        peg$c52 = peg$classExpectation(["U", "u"], false, false),
        peg$c53 = /^[Ee]/,
        peg$c54 = peg$classExpectation(["E", "e"], false, false),
        peg$c55 = function() { return true; },
        peg$c56 = /^[Ff]/,
        peg$c57 = peg$classExpectation(["F", "f"], false, false),
        peg$c58 = /^[Aa]/,
        peg$c59 = peg$classExpectation(["A", "a"], false, false),
        peg$c60 = /^[Ll]/,
        peg$c61 = peg$classExpectation(["L", "l"], false, false),
        peg$c62 = /^[Ss]/,
        peg$c63 = peg$classExpectation(["S", "s"], false, false),
        peg$c64 = function() { return false; },
        peg$c65 = /^[Nn]/,
        peg$c66 = peg$classExpectation(["N", "n"], false, false),
        peg$c67 = /^[Cc]/,
        peg$c68 = peg$classExpectation(["C", "c"], false, false),
        peg$c69 = function() { return  "Func"},
        peg$c70 = /^[a-zA-Z_]/,
        peg$c71 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false),
        peg$c72 = /^[a-zA-Z_0-9]/,
        peg$c73 = peg$classExpectation([["a", "z"], ["A", "Z"], "_", ["0", "9"]], false, false),
        peg$c74 = /^[Bb]/,
        peg$c75 = peg$classExpectation(["B", "b"], false, false),
        peg$c76 = /^[Gg]/,
        peg$c77 = peg$classExpectation(["G", "g"], false, false),
        peg$c78 = /^[Ii]/,
        peg$c79 = peg$classExpectation(["I", "i"], false, false),
        peg$c80 = /^[Dd]/,
        peg$c81 = peg$classExpectation(["D", "d"], false, false),
        peg$c82 = peg$otherExpectation("whitespace"),
        peg$c83 = /^[ \t\r\n]/,
        peg$c84 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false),
        peg$c85 = function() { return "";},

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseFuncDefinition() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFUNC();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseName();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseObject();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseFunctionBody();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseAnnotations();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c0(s4, s6, s8, s9);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAnnotations() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 64) {
          s3 = peg$c1;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseName();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s6 = peg$c3;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c4); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseString();
                  if (s8 !== peg$FAILED) {
                    s9 = [];
                    s10 = peg$currPos;
                    s11 = peg$parse_();
                    if (s11 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 44) {
                        s12 = peg$c5;
                        peg$currPos++;
                      } else {
                        s12 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c6); }
                      }
                      if (s12 !== peg$FAILED) {
                        s13 = peg$parse_();
                        if (s13 !== peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 64) {
                            s14 = peg$c1;
                            peg$currPos++;
                          } else {
                            s14 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c2); }
                          }
                          if (s14 !== peg$FAILED) {
                            s15 = peg$parseName();
                            if (s15 !== peg$FAILED) {
                              s16 = peg$parse_();
                              if (s16 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 61) {
                                  s17 = peg$c3;
                                  peg$currPos++;
                                } else {
                                  s17 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c4); }
                                }
                                if (s17 !== peg$FAILED) {
                                  s18 = peg$parse_();
                                  if (s18 !== peg$FAILED) {
                                    s19 = peg$parseString();
                                    if (s19 !== peg$FAILED) {
                                      s11 = [s11, s12, s13, s14, s15, s16, s17, s18, s19];
                                      s10 = s11;
                                    } else {
                                      peg$currPos = s10;
                                      s10 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s10;
                                    s10 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s10;
                                  s10 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s10;
                                s10 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s10;
                              s10 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s10;
                            s10 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s10;
                          s10 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s10;
                        s10 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s10;
                      s10 = peg$FAILED;
                    }
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      s10 = peg$currPos;
                      s11 = peg$parse_();
                      if (s11 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 44) {
                          s12 = peg$c5;
                          peg$currPos++;
                        } else {
                          s12 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c6); }
                        }
                        if (s12 !== peg$FAILED) {
                          s13 = peg$parse_();
                          if (s13 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 64) {
                              s14 = peg$c1;
                              peg$currPos++;
                            } else {
                              s14 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c2); }
                            }
                            if (s14 !== peg$FAILED) {
                              s15 = peg$parseName();
                              if (s15 !== peg$FAILED) {
                                s16 = peg$parse_();
                                if (s16 !== peg$FAILED) {
                                  if (input.charCodeAt(peg$currPos) === 61) {
                                    s17 = peg$c3;
                                    peg$currPos++;
                                  } else {
                                    s17 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c4); }
                                  }
                                  if (s17 !== peg$FAILED) {
                                    s18 = peg$parse_();
                                    if (s18 !== peg$FAILED) {
                                      s19 = peg$parseString();
                                      if (s19 !== peg$FAILED) {
                                        s11 = [s11, s12, s13, s14, s15, s16, s17, s18, s19];
                                        s10 = s11;
                                      } else {
                                        peg$currPos = s10;
                                        s10 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s10;
                                      s10 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s10;
                                    s10 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s10;
                                  s10 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s10;
                                s10 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s10;
                              s10 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s10;
                            s10 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s10;
                          s10 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s10;
                        s10 = peg$FAILED;
                      }
                    }
                    if (s9 !== peg$FAILED) {
                      s2 = [s2, s3, s4, s5, s6, s7, s8, s9];
                      s1 = s2;
                    } else {
                      peg$currPos = s1;
                      s1 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 59) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c9(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFunctionBody() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseBEGIN();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseN();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parseN();
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseEND();
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c10(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseN() {
      var s0, s1, s2, s3, s4;

      s0 = peg$parseFunctionBody();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseBEGIN();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parseEND();
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = void 0;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseZ();
            if (s4 !== peg$FAILED) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c11();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseZ() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c12); }
      }

      return s0;
    }

    function peg$parseObject() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c13;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c14); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$currPos;
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsePair();
              if (s7 !== peg$FAILED) {
                s8 = [];
                s9 = peg$currPos;
                s10 = peg$parse_();
                if (s10 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s11 = peg$c5;
                    peg$currPos++;
                  } else {
                    s11 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c6); }
                  }
                  if (s11 !== peg$FAILED) {
                    s12 = peg$parse_();
                    if (s12 !== peg$FAILED) {
                      s13 = peg$parsePair();
                      if (s13 !== peg$FAILED) {
                        s10 = [s10, s11, s12, s13];
                        s9 = s10;
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s9;
                  s9 = peg$FAILED;
                }
                while (s9 !== peg$FAILED) {
                  s8.push(s9);
                  s9 = peg$currPos;
                  s10 = peg$parse_();
                  if (s10 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s11 = peg$c5;
                      peg$currPos++;
                    } else {
                      s11 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s11 !== peg$FAILED) {
                      s12 = peg$parse_();
                      if (s12 !== peg$FAILED) {
                        s13 = peg$parsePair();
                        if (s13 !== peg$FAILED) {
                          s10 = [s10, s11, s12, s13];
                          s9 = s10;
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                }
                if (s8 !== peg$FAILED) {
                  s6 = [s6, s7, s8];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
            if (s5 === peg$FAILED) {
              s5 = peg$parse_();
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c15;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c16); }
                }
                if (s7 !== peg$FAILED) {
                  s2 = [s2, s3, s4, s5, s6, s7];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c17(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseArray() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s3 = peg$c18;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c19); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$currPos;
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseValue();
              if (s7 !== peg$FAILED) {
                s8 = [];
                s9 = peg$currPos;
                s10 = peg$parse_();
                if (s10 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s11 = peg$c5;
                    peg$currPos++;
                  } else {
                    s11 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c6); }
                  }
                  if (s11 !== peg$FAILED) {
                    s12 = peg$parse_();
                    if (s12 !== peg$FAILED) {
                      s13 = peg$parseValue();
                      if (s13 !== peg$FAILED) {
                        s10 = [s10, s11, s12, s13];
                        s9 = s10;
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s9;
                  s9 = peg$FAILED;
                }
                while (s9 !== peg$FAILED) {
                  s8.push(s9);
                  s9 = peg$currPos;
                  s10 = peg$parse_();
                  if (s10 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s11 = peg$c5;
                      peg$currPos++;
                    } else {
                      s11 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s11 !== peg$FAILED) {
                      s12 = peg$parse_();
                      if (s12 !== peg$FAILED) {
                        s13 = peg$parseValue();
                        if (s13 !== peg$FAILED) {
                          s10 = [s10, s11, s12, s13];
                          s9 = s10;
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                }
                if (s8 !== peg$FAILED) {
                  s6 = [s6, s7, s8];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
            if (s5 === peg$FAILED) {
              s5 = peg$parse_();
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s7 = peg$c20;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c21); }
                }
                if (s7 !== peg$FAILED) {
                  s2 = [s2, s3, s4, s5, s6, s7];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c22(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsePair() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseName();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseValue();
                if (s6 !== peg$FAILED) {
                  s1 = [s1, s2, s3, s4, s5, s6];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseValue() {
      var s0;

      s0 = peg$parseObject();
      if (s0 === peg$FAILED) {
        s0 = peg$parseArray();
        if (s0 === peg$FAILED) {
          s0 = peg$parseNumber();
          if (s0 === peg$FAILED) {
            s0 = peg$parseString();
            if (s0 === peg$FAILED) {
              s0 = peg$parseBoolean();
            }
          }
        }
      }

      return s0;
    }

    function peg$parseString() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c23;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseEsc();
          if (s4 === peg$FAILED) {
            s4 = peg$parsePrintables();
            if (s4 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 91) {
                s4 = peg$c18;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c19); }
              }
              if (s4 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s4 = peg$c20;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c21); }
                }
              }
            }
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseEsc();
            if (s4 === peg$FAILED) {
              s4 = peg$parsePrintables();
              if (s4 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 91) {
                  s4 = peg$c18;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c19); }
                }
                if (s4 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s4 = peg$c20;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c21); }
                  }
                }
              }
            }
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s4 = peg$c23;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c24); }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c25(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrintables() {
      var s0;

      if (peg$c26.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }

      return s0;
    }

    function peg$parseEsc() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c28;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c30.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c31); }
        }
        if (s2 === peg$FAILED) {
          s2 = peg$parseUnicode();
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUnicode() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 117) {
        s1 = peg$c32;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseHex();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseHex();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseHex();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseHex();
              if (s5 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4, s5];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHex() {
      var s0;

      if (peg$c34.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }

      return s0;
    }

    function peg$parseNumber() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c36;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        if (peg$c38.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c39); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          if (peg$c40.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            if (peg$c42.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c42.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c43); }
              }
            }
            if (s4 !== peg$FAILED) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c44;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c45); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          if (peg$c42.test(input.charAt(peg$currPos))) {
            s6 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              if (peg$c42.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c43); }
              }
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c44;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c45); }
          }
          if (s4 !== peg$FAILED) {
            s5 = [];
            if (peg$c42.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            if (s6 !== peg$FAILED) {
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                if (peg$c42.test(input.charAt(peg$currPos))) {
                  s6 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c43); }
                }
              }
            } else {
              s5 = peg$FAILED;
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c46();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBoolean() {
      var s0;

      s0 = peg$parseTRUE();
      if (s0 === peg$FAILED) {
        s0 = peg$parseFALSE();
      }

      return s0;
    }

    function peg$parseTRUE() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (peg$c47.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c48); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c49.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c50); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c51.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c52); }
          }
          if (s3 !== peg$FAILED) {
            if (peg$c53.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c54); }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c55();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFALSE() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (peg$c56.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c57); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c58.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c59); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c60.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c61); }
          }
          if (s3 !== peg$FAILED) {
            if (peg$c62.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s4 !== peg$FAILED) {
              if (peg$c53.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c54); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c64();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFUNC() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (peg$c56.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c57); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c51.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c52); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c65.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
          if (s3 !== peg$FAILED) {
            if (peg$c67.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c69();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseName() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c70.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c71); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c72.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c73); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c72.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c11();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBEGIN() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (peg$c74.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c75); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c53.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c76.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c77); }
          }
          if (s3 !== peg$FAILED) {
            if (peg$c78.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c79); }
            }
            if (s4 !== peg$FAILED) {
              if (peg$c65.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c66); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c11();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEND() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c53.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c65.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c80.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c81); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c11();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      if (peg$c83.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c84); }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c83.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c84); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c85();
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c82); }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
