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
      var props = this.props;
      var data = props.data ? props.data : [];
      var elts = [];
      var y = 0;
      data.forEach(function (d, i) {
        var style = {};
        if (d.style) {
          Object.keys(d.style).forEach(function (k) {
            style[k] = d.style[k];
          });
        }
        if (d.value === "$$timer$$") {
          elts.push(<span key={i} style={style}><Timer {...props}/></span>);
        } else {
          let val = d.value ? d.value : d;
          if (val instanceof Array) {
            val = val.join(" ");
          }
          let src = "data:image/svg+xml;charset=UTF-8," + unescapeXML(val);
          let {width, height} = getSize(val);
          elts.push(<div key={i} x="0" y={y} style={style}><img width={width} height={height} src={src}/></div>);
          y += height + 10;
        }
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

