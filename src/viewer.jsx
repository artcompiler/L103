/* Copyright (c) 2020, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";
import p5 from 'p5';

window.gcexports.viewer = (function () {
  const onSetup = window.onSetup = function onSetup(p, body) {
    p.setup = () => {
      new Function('p', body)(p)
    };
  }
  const onDraw = window.onDraw = function onDraw(p, body) {
    p.draw = () => {
      new Function('p', body)(p)
    };
  }
  var Viewer = React.createClass({
    componentDidMount: function() {
      this.componentDidUpdate();
    },
    componentDidUpdate: function() {
      d3.select('#sketch').html(''); // Erase any existing ink.
      const body = this.props.obj.join(';');
      const fn = p => {
        p.setup = () => { new Function('p', body)(p) };
      }
      new p5(fn, 'sketch');
    },
    render: function () {
      var props = this.props;
      var obj = props.obj || {};
      return (
        <div>
          <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
          <div className="L103 viewer">
          {elts}
          </div>
        </div>
      );
    },
  });
  return {
    Viewer: Viewer
  };
})();

