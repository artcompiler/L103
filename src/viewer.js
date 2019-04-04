/* Copyright (c) 2016, Art Compiler LLC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";

window.gcexports.viewer = (function () {
  const CLEAR = "#FEFEFE";
  const YELLOW = "#E7B416";
  const RED = "#CC3232";
  const GREEN = "#2DC937";
  function capture(el) {
    var mySVG = $(el).html();
    return mySVG;
  }

  function color(score) {
    let rgb;
    if (score === true || score === 1) {
      rgb = GREEN;
    } else if (score === false || score === -1) {
      rgb = RED;
    } else {
      rgb = YELLOW;
    }
    return rgb;
  }

  let textStyle = {fontSize: "14", fontFamily: "monospace"};
  function render(obj) {
    let elts = [];
    let i = 0;
    let data = obj.rating || obj.score;
    data.forEach(function (d) {
      // Each datum has a score, input and rubric
      let rgb, actual, expected = "";
      let input = <tspan>{d.input}</tspan>;
      let keys = Object.keys(d);
      let count = keys.length - 2;
      let size = 15;
      let spacing = 6;
      let x = spacing;
      let y = (2 * spacing + size) * i / 2;
      rgb = color(d.score / count);
      elts.push(<div className="mq" style={{
        margin: "20 5 0 0",
        //border: "2px solid",
        //borderColor: rgb,
        //padding: 5,
      }} key={i+1}>{d.input}</div>);
      i += 2;
      // let offset = 0;
      elts.push(renderValidation(d.validation, i));
      // validation.forEach(v => {
      //   let val = renderValidation(v, i);
      //   elts.push(val);
      //   i += 2;
      // });
    });
    return elts;
  }
  function renderValidation(val, i) {
    if (val.type === "method") {
      let v = val.value;
      let r = val.result;
      let m = val.method;
      let value = (m === "symbolic" || m === "literal") &&
        <span key="2" className="mq">{v}</span> || <div key="2">{JSON.stringify(v)}</div>;
      let method = <div key="1"><span key="1">{m}</span> {value}</div>;
      let rgb = color(r);
      return <div key={i} style={{
        borderLeft: "2px solid",
        borderColor: rgb,
        padding: "0 5 0 5",
        margin: 5,
      }}>{method}</div>;
    } else if (val.type === "and" || val.type === "or") {
      let validations = [];
      val.validations.forEach((v, i) => {
        let validation = renderValidation(v, i);
        validations.push(validation);
      });
      let method = <div key="1"><span key="1"> {val.type} </span> {validations}</div>;
      let rgb = color(val.result);
      return <div key={i} style={{
        borderLeft: "2px solid",
        borderColor: rgb,
        padding: "0 5 0 5",
        margin: 5,
      }}>{method}</div>;
    }
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
  var Viewer = React.createClass({
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
      } else if (window.MathJax) {
        MathJax.Hub.Config({
          tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
          jax: ["input/TeX","output/SVG"],
          extensions: ["tex2jax.js","MathMenu.js","MathZoom.js", "fast-preview.js", "AssistiveMML.js", "a11y/accessibility-menu.js"],
          TeX: {
            extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js"]
          }
        });
      }
    },
    componentDidMount: function() {
      // loadScript("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js", () => {
      // });
      loadScript("/mathquill.js", () => {
        loadStyle("/mathquill.css", () => {
          this.componentDidUpdate();
        });
      });
    },
    componentDidUpdate: function() {
      // var bbox = $("svg g")[0].getBBox();
      // $("svg").attr("height", (bbox.height + 14) + "px");
      // $("svg").attr("width", (bbox.width + 14) + "px");
      this.renderMath();
    },
    render: function () {
      var props = this.props;
      var obj = props.obj || {};
      var elts = render(obj);
      return (
        <div>
        <div className="L107">
        <div className="section">
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

