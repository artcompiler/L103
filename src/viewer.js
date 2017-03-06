/* Copyright (c) 2016, Art Compiler LLC */
/* @flow */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";

window.gcexports.viewer = (function () {
  function capture(el) {
    return null;
  }
  var Timer = React.createClass({
    interval: 0,
    tick: function() {
      let secondsElapsed = this.props.secondsElapsed;
      let state = {
        secondsElapsed: (secondsElapsed ? secondsElapsed : 0) + 5
      };
      // To save state, dispatch it as a property named 'data'. This will save
      // the state to the server, update the URL and the props used to render
      // the view.
      window.dispatcher.dispatch({
        updateHistory: true,
        data: state,
      });
    },
    componentDidMount: function() {
      this.interval = setInterval(this.tick, 5000);
    },
    componentWillUnmount: function() {
      clearInterval(this.interval);
    },
    render: function() {
      return (
        <div>{this.props.secondsElapsed?this.props.secondsElapsed:0}</div>
      );
    }
  });

  // Graffiticode looks for this React class named Viewer. The compiled code is
  // passed via props in the renderer.
  var Viewer = React.createClass({
    componentDidMount: function() {
    },
    render: function () {
      // If you have nested components, make sure you send the props down to the
      // owned components.
      let props = this.props;
      let data = props.obj ? props.obj : [];
      var elts = [];
      let y = 0;
      let len = data.length;
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
  return {
    capture: capture,
    Viewer: Viewer
  };
})();

