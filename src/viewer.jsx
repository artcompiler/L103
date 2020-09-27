/* Copyright (c) 2016, Art Compiler LLC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";
import p5 from 'p5';

window.gcexports.viewer = (function () {
  const CLEAR = "#FEFEFE";
  const YELLOW = "#E7B416";
  const RED = "#CC3232";
  const GREEN = "#2DC937";
  function capture(el) {
    var mySVG = $(el).html();
    return mySVG;
  }
  function render(obj) {
    let elts = [];
    return elts;
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
    componentDidMount: function() {
      this.componentDidUpdate();
    },
    componentDidUpdate: function() {
      d3.select('#sketch').html('');  // Clear any previous ink.
      const setupBody = this.props.obj.join(';');
      const drawBody = undefined;
      const fn = p => {
        p.setup = () => { new Function('p', setupBody)(p) };
        p.draw = () => new Function('p', '');
      }
      new p5(fn, 'sketch');
    },
    render: function () {
      var props = this.props;
      var obj = props.obj || {};
      return (
        <div>
        <div className="L102">
        <div id="sketch" className="section">
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

