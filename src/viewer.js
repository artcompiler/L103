/* Copyright (c) 2017, Art Compiler LLC */
/* @flow */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";
const MATHJAX = false;
window.gcexports.viewer = (function () {
  function capture(el) {
    var mySVG = $(el).html();
    return mySVG;
  }
  function loadScript(src, resume) {
    var script = document.createElement("script");
    script.onload = resume;
    script.src = src;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  function loadStyle(src, resume) {
    var link = document.createElement("link");
    link.onload = resume;
    link.href = src;
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  function splitValue(str, allMath) {
    // \\(x\\)abc\\(y\\) => ["", "x\\)abc", "y\\)"]
    let startMath = str.split("\\(");
    let elts = [];
    let offset = 0;
    startMath.forEach((v, i) => {
      // Odd indexes are text, evens have LaTeX prefixes.
      if (i === 0 && !allMath) {
        elts.push(<span key={i+offset}>{v}</span>);
      } else {
        let parts = v.split("\\)");
        elts.push(<span key={i+offset} className="mq">{parts[0]}</span>);
        elts.push(<span key={i+offset+1}>{parts[1]}</span>);
        offset++;
      }
    });
    return elts;
  }
  var TextArea = React.createClass({
    displayName: 'TextArea',
    propTypes: {
      name: React.PropTypes.string.isRequired
    },
    componentWillReceiveProps(nextProps) {
      if(nextProps.initValue !== this.props.initValue) {
        this.setState({
          value: nextProps.initValue
        });
      }
      // Otherwise the value has been set by handleChange or initial rendering.
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render: function() {
      let props = this.props;
      return (
          <textarea id={this.props.name}
                    value={this.state && this.state.value !== undefined
                           ? this.state.value
                           : props.initValue}
                    onChange={this.handleChange}
                    onBlur={onUpdate}
                    className="u-full-width"
                    style={this.props.style}
                    rows={this.props.rows} />
      );
    }
  });
  let checks;
  var ProblemViewer = React.createClass({
    render: function () {
      // If you have nested components, make sure you send the props down to the
      // owned components.
      let props = this.props;
      let data = props.obj.data ? props.obj.data : [];
      checks = isDirty ? checks : props.checks ? props.checks : [];
      checks.forEach((v, i) => {
        // normalize.
        checks[i] = +v;
      });
      var elts = [];
      let y = 0;
      let len = data.length;
      if (!(data instanceof Array)) {
        // Not ready yet.
        return <div/>;
      }
      let key = 0
      data.forEach((data, i) => {
        let checked = checks.indexOf(i) > -1;
        let isTemplate = i === 0;
        let name;
        let x = 0;
        let bodyElts = [
        ];
        data.val.forEach((d, j) => {
          if (isTemplate && j > 0 || d.name === "seed") {
            // Skip some stuff.
            return;
          }
          var style = {};
          name = d.name;
          if (d.style) {
            Object.keys(d.style).forEach(function (k) {
              style[k] = d.style[k];
            });
          }
          style.padding = "10 0 10 10";
          let bottomStyle = Object.assign({}, style, {borderTop: "0.5px solid #ddd"});
          let val, src, width, height, n;
          if (MATHJAX) {
            val = d.value ? d.value : d.svg !== undefined ? d.svg : d;
            if (val instanceof Array) {
              val = val.join(" ");
            }
            src = "data:image/svg+xml;charset=UTF-8," + unescapeXML(val);
            ({width, height} = getSize(val));
          } else {
            val = d.val;
            if (val instanceof Array) {
              val = val.join(" ");
            }
          }
          n = 2 * i;
          let leftCol;
          if (j === 0) {
            leftCol = <td key="0" width="20" style={style}><input type="checkbox"
                      checked={checked} id="selectAll"
                      className={"check" + (isTemplate ? " selectAll" : "")}
                      onChange={onUpdate}
                      style={{borderBottom: 0}}/></td>
          } else {
            leftCol = <td key="0" width="20" style={style}/>;
          }
          if (isTemplate) {
            bodyElts.push(
                <tr key={j}>
                {leftCol}
                <td key="1" x={x} y={y} style={{padding: "12.5 0 11.5 10"}}>
                <span style={{fontSize: "11px",
                              fontWeight:"600",
                              color: "#555",
                              letterSpacing: ".1rem",
                             }}>SELECT ALL</span></td>
                </tr>);
          } else {
            if (MATHJAX) {
              bodyElts.push(
                  <tr key={j}>
                  {leftCol}
                  <td key="1" x={x} y={y} style={j === 0 ? style : bottomStyle}>
                     <img width={width} height={height} src={src}/>
                  </td>
                  </tr>);
            } else {
              bodyElts.push(
                  <tr key={j}>
                  {leftCol}
                    <td key="1" x={x} y={y} style={j === 0 ? style : bottomStyle}>
                      {splitValue(val, name === "solution")}
                    </td>
                  </tr>);
            }
          }
        });
        key++;
        elts.push(<table key={key} style={{marginBottom: "0", marginTop: "20", background: "#f3f3f3"}} width="100%">
                  <tbody>{bodyElts}</tbody>
                  </table>);
      });
      return (
        elts.length > 0 ? <div>{elts}</div> : <div/>
      );
    },
  });

  function unescapeXML(str) {
    return String(str)
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "'");
  }

  function getSize(svg) {
    svg = svg.slice(svg.indexOf("width=") + 7 + 5);
    var width = svg.slice(0, svg.indexOf("ex")) * 8;  // ex=8px
    svg = svg.slice(svg.indexOf("height=") + 8 + 5);
    var height = svg.slice(0, svg.indexOf("ex")) * 8 + 5;
    if (isNaN(width) || isNaN(height)) {
      width = 640;
      height = 30;
    }
    return {
      width: width,
      height: height
    }
  }
  function getParams(table) {
    let keys = [];
    let vals = [];
    let paramsList = [];
    table.select("thead").selectAll("tr").each((d, i, tr) => {
      d3.select(tr[i])
        .selectAll("th")
        .each((d, j, th) => {
          d3.select(th[j])
            .selectAll("span")
            .each(function(d, k, ta) {
              keys[j - 1] = this.textContent;
            });
        });
    });
    paramsList.push(keys);
    table.select("tbody").selectAll("tr").each((d, i, tr) => {
      vals[i] = [];
      d3.select(tr[i])
        .selectAll("td")
        .each((d, j, td) => {
          d3.select(td[j])
            .selectAll("textarea")
            .each(function(d, k, ta) {
              vals[i][j - 1] = this.value;
            });
        });
    });
    paramsList = paramsList.concat(vals);
    return paramsList;
  }

  function encode(str) {
    return encodeURIComponent(str);
  }

  function getContext() {
    let context = "";
    d3.select("#context")
      .each(function(d, k, ta) {
         context += this.value ? this.value : this.placeholder;
      });
    return context;
  }

  function getTemplate() {
    let template = "";
    d3.select("#template")
      .each(function(d, k, ta) {
        template += this.value || "";
      });
    return template;
  }
  // State Machine
  // start
  //   |--[text]---> dirty
  //   |--[check]--> dirty
  let isDirty = false;
  let isSaved = false;
  function onUpdate(e) {
    // Update the state of the view. If the update target is a checkbox, then
    // we don't get the checks from the code.
    let params = getParams(d3.select("table"));
    checks = [];
    let recompileCode;
    if (e && e.target && e.target.className.indexOf("check") >= 0) {
      if (e.target.className.indexOf("selectAll") >= 0) {
        let state = e.target.checked;
        d3.selectAll(".check").property("checked", state);
      } else {
        // If not select all, then turn it off.
        d3.select("#selectAll").property("checked", false);
      }
      // If target is a checkbox, then save the state of the checks.
      d3.selectAll(".check").nodes().forEach((d, i) => {
        if (d.checked) {
          checks.push(i);
        }
      });
      isDirty = true;
    } else {
      if (e && e.target && e.target.id === "plus") {
        params = params.concat([params[params.length - 1]]);
      } else if (e && e.target && e.target.id === "minus" && params.length > 2) {
        let index = +e.target.attributes["data-index"].value + 1; // +1 to skip header.
        // [1,2,3,4], index=3 => [1,2,3]
        params = params.slice(0, index).concat(params.slice(index + 1));
      }
      // Clear the dirty flag and the checks and recompile with new params.
      isDirty = false;
      checks = [];
      recompileCode = true;
    }
    let context = getContext();
    let template = getTemplate();
    update(context, template, params, checks, recompileCode);
    isSaved = false;
  }
  let codeID;
  function update(context, template, params, checks, recompileCode) {
    let state = {}
    state[window.gcexports.id] = {
      data: {
        params: params,
        checks: checks,
        context: context,
        template: template,
        saveID: undefined,
      },
      recompileCode: recompileCode,
    };
    window.gcexports.dispatcher.dispatch(state);
  }
  function render(nodes, props) {
    let elts = [];
    if (!(nodes instanceof Array)) {
      // HACK not all arguments are arrays. Not sure they should be.
      nodes = [nodes];
    }
    nodes.forEach((n, i) => {
      let args = [];
      if (n.args) {
        args = render.call(this, n.args, props);
      }
      if (typeof n === "object") {
        n.style = n.style ? n.style : {};
      }
      switch (n.type) {
      case "grid":
        elts.push(
          <div className="container" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "table":
        elts.push(
          <table key={i} style={n.style} {...n.attrs}>
            {args}
          </table>
        );
        break;
      case "thead":
        elts.push(
          <thead key={i} style={n.style} {...n.attrs}>
            {args}
          </thead>
        );
        break;
      case "tbody":
        elts.push(
          <tbody className="container" key={i} style={n.style} {...n.attrs}>
            {args}
          </tbody>
        );
        break;
      case "tr":
        elts.push(
          <tr key={i} style={n.style} {...n.attrs}>
            {args}
          </tr>
        );
        break;
      case "th":
        elts.push(
          <th key={i} style={n.style} {...n.attrs}>
            {args}
          </th>
        );
        break;
      case "td":
        elts.push(
          <td key={i} style={n.style} {...n.attrs}>
            {args}
          </td>
        );
        break;
      case "row":
        elts.push(
          <div className="row" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "oneColumn":
        elts.push(
          <div className="one column" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "twoColumns":
        elts.push(
          <div className="two columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "threeColumns":
        elts.push(
          <div className="three columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "fourColumns":
        elts.push(
          <div className="four columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "fiveColumns":
        elts.push(
          <div className="five columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "sixColumns":
        elts.push(
          <div className="six columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "sevenColumns":
        elts.push(
          <div className="seven columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "eightColumns":
        elts.push(
          <div className="eight columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "nineColumns":
        elts.push(
          <div className="nine columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "tenColumns":
        elts.push(
          <div className="ten columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "elevenColumns":
        elts.push(
          <div className="eleven columns" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "twelveColumns":
        if (n.id === "math") {
          elts.push(
            <div className="twelve columns" key={i} style={n.style} {...n.attrs}>
              <ProblemViewer {...props} />
            </div>
          );
        } else {
          elts.push(
            <div className="twelve columns" key={i} style={n.style} {...n.attrs}>
              {args}
            </div>
          );
        }
        break;
      case "oneThirdColumn":
        elts.push(
          <div className="one-third column" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "twoThirdsColumn":
        elts.push(
          <div className="two-thirds column" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "oneHalfColumn":
        elts.push(
          <div className="one-half column" key={i} style={n.style} {...n.attrs}>
            {args}
          </div>
        );
        break;
      case "h1":
        elts.push(
          <h1 key={i} style={n.style} {...n.attrs}>
            {args}
          </h1>
        );
        break;
      case "h2":
        elts.push(
          <h2 key={i} style={n.style} {...n.attrs}>
            {args}
          </h2>
        );
        break;
      case "h3":
        elts.push(
          <h3 key={i} style={n.style} {...n.attrs}>
            {args}
          </h3>
        );
        break;
      case "h4":
        if (n.attrs.id === "title" && props.obj.title) {
          elts.push(
              <h4 key={i} style={n.style} {...n.attrs}>
              {splitValue(props.obj.title)}
            </h4>
          );
        } else {
          elts.push(
              <h4 key={i} style={n.style} {...n.attrs}>
              {args}
            </h4>
          );
        }
        break;
      case "h5":
        elts.push(
          <h5 key={i} style={n.style} {...n.attrs}>
            {args}
          </h5>
        );
        break;
      case "h6":
        if (n.attrs.id === "notes" && props.obj.notes) {
          elts.push(
              <h6 key={i} style={n.style} {...n.attrs}>
              {splitValue(props.obj.notes)}
            </h6>
          );
        } else {
          elts.push(
              <h6 key={i} style={n.style} {...n.attrs}>
              {args}
            </h6>
          );
        }
        break;
      case "br":
        elts.push(
          <br />
        );
        break;
      case "code":
        n.style.fontSize = n.style && n.style.fontSize ? n.style.fontSize : "90%";
        elts.push(
          <pre key={i} style={n.style} {...n.attrs}><code>
            {args}
          </code></pre>
        );
        break;
      case "cspan":
        elts.push(
          <code key={i} style={n.style} {...n.attrs}>
            {args}
          </code>
        );
        break;
      case "textarea":
        if (n.attrs.id === "context") {
          let context = props.data && props.data.context || props.obj.context;
          let e = <TextArea key={i} name="context" style={n.style} {...this.props}
                          initValue={context} rows="2"/>
          elts.push(e);
        } else if (n.attrs.id === "template") {
          let template = props.data && props.data.template || props.obj.template;
          elts.push(
              <TextArea key={i} name="template" style={n.style} {...this.props}
                      initValue={template} rows="2"/>
          );
        } else {
          elts.push(
            <TextArea key={i} name="param" style={n.style} {...this.props}
                    initValue={n.args[0]} rows="1" />
          );
        }
        break;
      case "button":
        n.style.background = n.attrs.id === "save" && isSaved ? "#ddd" : "rgba(8, 149, 194, 0.10)";
        elts.push(
          <button
            key={i}
            onClick={this.clickHandler}
            style={n.style}
            {...n.attrs}>
            {n.value}
          </button>
        );
        break;
      case "ul":
        elts.push(
          <ul key={i} style={n.style} {...n.attrs}>
            {args}
          </ul>
        );
        break;
      case "ol":
        elts.push(
          <ol key={i} style={n.style} {...n.attrs}>
            {args}
          </ol>
        );
        break;
      case "li":
        elts.push(
          <li key={i} style={n.style} {...n.attrs}>
            {args}
          </li>
        );
        break;
      case "img":
        if (n.attrs.id === "seed") {
          let val = props.obj.data[0].val;
          if (MATHJAX) {
            let svg = val[val.length - 1].svg;
            let src = "data:image/svg+xml;charset=UTF-8," + unescapeXML(svg);
            let {width, height} = getSize(svg);
            elts.push(
              <div key={i} style={{
                margin:"20 0 10 0",
              }}>
              <img key="0" style={n.style} {...n.attrs} width={width} height={height} src={src}/>
              </div>
            );
          } else {
            elts.push(
              <div key={i} style={{
                fontSize: "20",
                margin: "20 auto 10 auto",
                textAlign: "center",
              }}>
              {splitValue(val[val.length - 1].val, true)}
              </div>
            );
          }
        } else {
          elts.push(
            <img key={i} style={n.style} {...n.attrs}/>
          );
        }
        break;
      case "a":
        let clickHandler;
        if (n.attrs.id === "plus" || n.attrs.id === "minus") {
          clickHandler = (e) => {onUpdate(e)};
        }
        elts.push(
          <a key={i} style={n.style} {...n.attrs} onClick={clickHandler}>
            {args}
          </a>
        );
        break;
      case "title":
        document.title = n.value;
        break;
      case "graffito":
        // elts.push(
        //   <div key={i} style={{"position": "relative"}}>
        //     <iframe style={n.style} {...n.attrs}/>
        //     <a href={n.attrs.src} target="L116-CHILD" style={{
        //       "position": "absolute",
        //       "top": 0,
        //       "left": 0,
        //       "display": "inline-block",
        //       "width": "100%",
        //       "height": "100%",
        //       "zIndex": 5}}></a>
        //   </div>
        // );
        elts.push(
          <div key={i} style={{"position": "relative"}}>
            <iframe style={n.style} {...n.attrs}/>
          </div>
        );
        break;
      case "str":
        elts.push(<span className="u-full-width" key={i} style={n.style}>{""+n.value}</span>);
        break;
      default:
        // Not a node, so push the value.
        elts.push(n);
        break;
      }
    });
    return elts;
  }
  function injectParamsIntoUI(ui, params) {
    let grid = ui[0];
    let table = grid.args[1].args[0].args[1];  // This is extremely brittle!
    let thead = table.args[0];
    let tbody = table.args[1];
    thead.args[0].args = [];
    tbody.args = [];
    let keys, valsList;
    if (params instanceof Array) {
      keys = params[0];
      valsList = params.slice(1);
    } else {
      // Record form of params (deprecated).
      keys = Object.keys(params);
      valsList = [Object.values(params)];
      params = [keys].concat(valsList);  // Make new form for params.
    }
    thead.args[0].args.push({
      type: "th",
      args: [],
    });
    keys.forEach((n, i) => {
      thead.args[0].args.push({
        type: "th",
        args: [{
          type: "str",
          value: n,
        }]
      });
    });
    valsList.forEach((vals, i) => {
      let row = {
        type: "tr",
        args: [{
          type: "td",
          args: valsList.length === 1 ? [{
            // If only one row, then don't allow delete.
            "type": "img",
            "attrs": {
              "id": "blank",
              "width": "15",
              "src": "blank.png",
            },
            "style": {
              "margin": "5 5 5 0",
              "borderRadius": "4",
            },
          }] : [{
            "type": "a",
            "attrs": {
              "id": "minus",
            },
            "args": [{
              "type": "img",
              "attrs": {
                "id": "minus",
                "width": "15",
                "src": "minus-256.png",
                "title": "Delete row",
                "data-index": i,
              },
              "style": {
                "background": "#aaa",
                "margin": "5 5 5 0",
                "borderRadius": "4",
              },
            }],
          }],
        }],
      };
      tbody.args.push(row);
      vals.forEach((val, j) => {
        row.args.push({
          type: "td",
          args: {
            type: "textarea",
            attrs: {},
            style: {
              width: "100"
            },
            args: [val],
          },
        });
      });
    });
  }

  // Graffiticode looks for this React class named Viewer. The compiled code is
  // passed via props in the renderer.
  var Viewer = React.createClass({
    ui: [
      {
        "type": "grid",
        "args": [{
          "type": "row",
          "style": {
            "borderBottom": "1px solid #ddd",
          },
          "args": [
            {
              "type": "twelveColumns",
              "args": [
                {
                  "type": "h4",
                  "attrs": {
                    id: "title",
                  },
                  args: [],
                },
                {
                  "type": "h6",
                  "attrs": {
                    id: "notes",
                  },
                  args: [],
                },
                {
                  "type": "textarea",
                  "attrs": {
                    id: "context",
                  },
                  args: [],
                },
                {
                  "type": "textarea",
                  "attrs": {
                    id: "template",
                  },
                  "style": {
                    "margin": "10 0 20 0",
                  },
                  args: [],
                },
              ],
            },
          ],
        }, {
          "type": "row",
          "style": {
            "borderBottom": "1px solid #ddd",
          },
          "args": [{
            "type": "twelveColumns",
            "args": [{
              "type": "img",
              "attrs": {
                id: "seed",
              },
              "style": {
                "display": "block",
                "margin": "10 auto 5 30",
              },
              "args": [],
            }, {
              "type": "table",
              "args": [
                {
                  "type": "thead",
                  "args": [
                    {
                      "type": "tr",
                      "args": [],
                    }
                  ],
                }, {
                  "type": "tbody",
                  "args": [
                  ],
                }
              ],
            }, {
              "type": "a",
              "attrs": {
                "id": "plus",
              },
              "args": [{
                "type": "img",
                "attrs": {
                  "id": "plus",
                  "width": "15",
                  "src": "plus-256.png",
                  "title": "Add row",
                },
                "style": {
                  "background": "#aaa",
                  "margin": "5 5 20 30",
                  "borderRadius": "4",
                },
              }],
            }],
          }]
        }, {
          "type": "row",
          "args": [
            {
              "id": "previewButton",
              "type": "sixColumns",
              "args": [
                {
                  "type": "button",
                  "attrs": {
                    "id": "preview",
                  },
                  "value": "PREVIEW",
                  "style": {
                    "width": "100%",
                    "background": "rgba(8, 149, 194, 0.10)",  // #0895c2
                    "borderRadius": "4",
                    "borderWidth": "1",
                    "margin": "20 0 10 0",
                  },
                },
              ],
            },
            {
              "id": "saveButton",
              "type": "sixColumns",
              "args": [
                {
                  "type": "button",
                  "attrs": {
                    "id": "save",
                  },
                  "value": "SAVE ITEMS",
                  "style": {
                    "width": "100%",
                    "background": "rgba(8, 149, 194, 0.10)",  // #0895c2
                    "borderRadius": "4",
                    "borderWidth": "1",
                    "margin": "20 0 10 0",
                  },
                },
              ],
            },
          ],
        }, {
          "type": "row",
          "args": [
            {
              "id": "math",
              "type": "twelveColumns",
              "args": [
              ],
            }
          ],
        }]
      }
    ],
    postData(data, resume) {
      // Save the data and get updated itemID.
      let gcexports = window.gcexports;
      let user = $("#username").data("user");
      let lang = gcexports.language;
      let label = "";
      let parentID = 0;
      // Append host language to label.
      label = label ? lang + " " + label : lang;
      if (Object.keys(data).length > 0) {
        $.ajax({
          type: "PUT",
          url: "/code",
          data: {
            src: JSON.stringify(data) + "..",  // Some JSON is valid source.
            ast: "",
            obj: JSON.stringify(data),
            img: "",
            user: user ? user.id : 1,
            parent_id: parentID,
            language: "L113",
            label: label + " data",
          },
          dataType: "json",
          success: function(data) {
            resume(data.id);
          },
          error: function(xhr, msg, err) {
            console.log("ERROR unable to submit code.");
          }
        });
      }
    },
    clickHandler(e) {
      if (e.target.id === "preview") {
        if (checks && checks.length > 0) {
          let data = this.props.data;
          data.checks = checks;
          this.postData(data, (dataID)=> {
            let generatorIDs = window.gcexports.decodeID(this.getItemID());
            let checksIDs = window.gcexports.decodeID(dataID);
            let ids = [124, 558705].concat(generatorIDs.slice(0,2)).concat(checksIDs);
            let id = window.gcexports.encodeID(ids);
            window.open("/form?id=" + id, "L124");
          });
        } else {
          alert("Please select one or more questions to preview.");
        }
      } else if (e.target.id === "save") {
        // 124+557801+0
        if (checks && checks.length > 0) {
          let data = this.props.data;
          data.checks = checks;
          this.postData(data, (dataID)=> {
            let generatorIDs = window.gcexports.decodeID(this.getItemID());
            let checksIDs = window.gcexports.decodeID(dataID);
            let ids = [124, 557801].concat(generatorIDs.slice(0,2)).concat(checksIDs);
            let id = window.gcexports.encodeID(ids);
            window.open("/data/?id=" + id, "122 SRC");
          });
        } else {
          alert("Please select one or more questions to preview.");
        }
      }
    },
    renderMath () {
      if (window.MathQuill) {
        d3.selectAll(".mq").each((v, i, e) => {
          try {
            let MQ = MathQuill.getInterface(2);
            let mathQuill = MQ.StaticMath(e[i]);
          } catch (x) {
            console.log("ERROR rendering MathQuill: " + x);
          }
        });
      }
    },
    getItemID() {
      let href = window.location.href;
      return href.substring(href.indexOf("id=") + 3);
    },
    componentDidUpdate () {
      if (!MATHJAX) {
        d3.select("#context")
          .each((d, k, elts) => {
            elts[k].placeholder = this.props.obj.context;
          });
        this.renderMath();
      }
    },
    componentDidMount () {
      let params = this.props.obj.params;
      let keys = Object.keys(params);
      let vals = [];
      keys.forEach((k) => {
        vals.push(params[k]);
      });
      if (!MATHJAX) {
        loadScript("/mathquill.js", () => {
          loadStyle("/mathquill.css", () => {
            this.componentDidUpdate();
          });
        });
      }
    },
    render: function () {
      // If you have nested components, make sure you send the props down to the
      // owned components.
      let props = this.props;
      codeID = props.obj.gen;
      let params = props.data && props.data.params || props.obj.params;
      if (params) {
        injectParamsIntoUI(this.ui, params);
      }
      var elts = render.call(this, this.ui, props, this.dirty);
      return (
        <div>
          <link rel="stylesheet" href="https://l122.artcompiler.com/style.css" />
          <div className="L122 section">
          <div className="container">
            {elts}
          </div>
          </div>
        </div>
      );
    },
  });
  return {
    capture: capture,
    Viewer: Viewer
  };
})();
