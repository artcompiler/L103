/* Copyright (c) 2016, Art Compiler LLC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";

window.gcexports.viewer = (function () {
  function capture(el) {
    var mySVG = $(el).html();
    return mySVG;
  }

  function color(score) {
    let rgb;
    if (score === 1) {
      rgb = "rgb(100, 255, 100)";
    } else if (score === 0) {
      rgb = "rgb(255, 100, 100)";
    } else {
      rgb = "rgb(254, 243, 128)";
//      rgb = "rgb(" + (255 * (1 - score)) + ", " + (255 * score) + "," + (100 * score) + ")";
    }
    return rgb;
  }

  let textStyle = {fontSize: "14", fontFamily: "monospace"};
  function render(data) {
    let elts = [];
    let i = 0;
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
      elts.push(<rect key={i} x={x} y={y} width={size} height={size} fill={rgb} fillOpacity="1" strokeOpacity="0"/>);
      elts.push(<text key={i+1} style={textStyle} x={x + size + spacing} y={y + size}>{input}</text>);
      i += 2;
      let offset = 0;
      Object.keys(d).forEach(k => {
        if (k === "input" || k === "score") {
          return;
        }
        let v = d[k].value;
        let r = typeof d[k] === "boolean" && d[k] || d[k].result;
        offset++
        let value = typeof d.symbolic.value === "string" && v || JSON.stringify(v);
        let method = <tspan key="1">{ k + " " + (value || "")}</tspan>;
        rgb = color(r && 1 || 0);
        elts.push(<rect key={i} x={x + size + spacing }      y={y + offset * (size + spacing)} width={size} height={size} fill={rgb} fillOpacity="1" strokeOpacity="0"/>);
        elts.push(<text key={i+1} style={textStyle} x={x + 2*size + 2*spacing} y={y + offset * (size + spacing) + spacing + spacing}>{method}</text>);
        i += 2;
      });
    });
    return elts;
  }

  var Viewer = React.createClass({
    componentDidMount: function() {
    },
    componentDidUpdate: function() {
      var bbox = $("svg g")[0].getBBox();
      $("svg").attr("height", (bbox.height + 14) + "px");
      $("svg").attr("width", (bbox.width + 14) + "px");
    },
    render: function () {
      var props = this.props;
      var data = props.obj.rating || [];
      var elts = render(data);
      return (
        <div>
        <div className="L115">
        <div className="section">
          <svg><g>{elts}</g></svg>
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

