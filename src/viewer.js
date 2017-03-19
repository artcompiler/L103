/* Copyright (c) 2016, Art Compiler LLC */
/* @flow */
/* Copyright (c) 2017, Art Compiler LLC */
/* @flow */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";

window.gcexports.viewer = (function () {
  function capture(el) {
    var mySVG = $(el).html();
    return mySVG;
  }
  // Graffiticode looks for this React class named Viewer. The compiled code is
  // passed via props in the renderer.
  var ProblemViewer = React.createClass({
    componentDidUpdate: function() {
      let props = this.props;
    },
    render: function () {
      // If you have nested components, make sure you send the props down to the
      // owned components.
      let props = this.props;
      let data = props.obj.data ? props.obj.data : [];
      var elts = [];
      let y = 0;
      let len = data.length;
      if (!(data instanceof Array)) {
        // Not ready yet.
        return <div/>;
      }
      data.forEach((data, i) => {
        let innerElts = [];
        let name;
        data.val.forEach((d, i) => {
          var style = {};
          name = d.name;
          if (d.style) {
            Object.keys(d.style).forEach(function (k) {
              style[k] = d.style[k];
            });
          }
          let val = d.value ? d.value : d.svg ? d.svg : d;
          if (val instanceof Array) {
            val = val.join(" ");
          }
          let src = "data:image/svg+xml;charset=UTF-8," + unescapeXML(val);
          let {width, height} = getSize(val);
          let n = 2*i;
          innerElts.push(<div key={n} style={{
            fontSize: "12px",
            color: "rgba(8, 149, 194, 0.5)",
          }}>{name.toUpperCase()}</div>);
          innerElts.push(<div key={n+1} x="0" y={y} style={style}><img width={width} height={height} src={src}/></div>);
          y += height + 10;
        });
        elts.push(<div key={i}>{innerElts}<br/></div>);
      });
      return (
        elts.length > 0 ? <div>{elts}</div> : <div/>
      );
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
    },
  });

  function valuesOfTable(table) {
    let vals = [];
    table.select("tbody").selectAll("tr").each((d, j, tr) => {
      vals.push([]);
      d3.select(tr[j])
        .selectAll("td")
        .each((d, i, td) => {
          d3.select(td[i])
            .selectAll("textarea")
            .each(function(d, k, ta) {
              vals[j].push(this.value ? this.value : this.placeholder);
            });
        });
    });
    return vals;
  }

  function encode(str) {
    return encodeURIComponent(str);
  }

  function handleTextChange() {
    var vals = valuesOfTable(d3.select("table"));
    update(vals);
  }
  let codeID;
  function update(vals) {
    dispatcher.dispatch({
      data: vals,
      recompileCode: true,
    });
  }
  function render(nodes, props) {
    let elts = [];
    if (!(nodes instanceof Array)) {
      // HACK not all arguments are arrays. Not sure they should be.
      nodes = [nodes];
    }
    nodes.forEach(function (n, i) {
      let args = [];
      if (n.args) {
        args = render(n.args, props);
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
        if (n.attrs.id === "title") {
          elts.push(
              <h4 key={i} style={n.style} {...n.attrs}>
              {props.obj.title}
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
        elts.push(
          <h6 key={i} style={n.style} {...n.attrs}>
            {args}
          </h6>
        );
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
        elts.push(
          <textarea className="u-full-width" key={i} rows="1" onChange={handleTextChange} style={n.style} {...n.attrs}>
          </textarea>
        );
        break;
      case "button":
        elts.push(
          <a className="button" key={i} style={n.style} {...n.attrs}>
            {args}
          </a>
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
        elts.push(
          <img key={i} style={n.style} {...n.attrs}/>
        );
        break;
      case "a":
        elts.push(
          <a key={i} style={n.style} {...n.attrs}>
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
    let table = grid.args[0].args[0].args[1];
    let thead = table.args[0];
    let tbody = table.args[1];
    thead.args[0].args = [];
    tbody.args[0].args = [];
    Object.keys(params).forEach((n, i) => {
      thead.args[0].args.push({
        type: "th",
        args: [{
          type: "str",
          value: n,
        }]
      });
      tbody.args[0].args.push({
        type: "td",
        args: {
          type: "textarea",
          attrs: {
            "placeholder": params[n]
          },
          style: {
            width: "100"
          },
          args: [params[n]],
        },
      });
    });
  }

  // Graffiticode looks for this React class named Viewer. The compiled code is
  // passed via props in the renderer.
  var Viewer = React.createClass({
    ui: [
      {
        "type": "grid",
        "args": [
          {
            "type": "row",
            "args": [
              {
                "type": "twelveColumns",
                "args": [
                  {
                    "type": "h4",
                    "args": {
                      "type": "str",
                      "value": "(x+a)(x+b)",
                    },
                    "attrs": {
                      id: "title",
                    },
                  },
                  {
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
                      },
                      {
                        "type": "tbody",
                        "args": [
                          {
                            "type": "tr",
                            "args": [],
                          }
                        ],
                      }
                    ],
                  }
                ],
              }
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
    componentDidMount: function() {
      let params = this.props.obj.params;
      let keys = Object.keys(params);
      let vals = [];
      keys.forEach((k) => {
        vals.push(params[k]);
      });
//      update(vals);
    },
    render: function () {
      // If you have nested components, make sure you send the props down to the
      // owned components.
      let props = this.props;
      codeID = props.obj.gen;
      injectParamsIntoUI(this.ui, props.obj.params);
      var data = props.obj ? [].concat(props.obj) : [];
      var elts = render.call(this, this.ui, props, this.dirty);
      return (
        <div className="section">
          <div className="container">
            {elts}
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
