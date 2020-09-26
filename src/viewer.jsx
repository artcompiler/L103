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
      this.p5x = new p5();
      this.componentDidUpdate();
    },
    componentDidUpdate: function() {
      const p5x = this.p5x;
      const steps = this.props.obj || [];
      steps.forEach((v, i) => {
        const name = Object.keys(v)[0];
        const args = v[name] instanceof Array && v[name] || [v[name]];
        switch(name) {
        case 'background':
          p5x.background(...args);
          break;
        case 'size':
          const canvas = p5x.createCanvas(...args);
          canvas.parent('sketch');
          break;
        }
      });
    },
    render: function () {
      var props = this.props;
      var obj = props.obj || {};
      var elts = render(obj);
      return (
        <div>
        <div className="L102">
        <div id="sketch" className="section">
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

