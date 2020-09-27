/* Copyright (c) 2020, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";
import p5 from 'p5';

window.gcexports.viewer = (function () {
  var Viewer = React.createClass({
    componentDidMount: function() {
      this.componentDidUpdate();
    },
    componentDidUpdate: function() {
      d3.select('#sketch').html(''); // Erase any existing ink.
      const setupBody = this.props.obj.join(';');
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
        <div id="sketch" className="section" />
        </div>
        </div>
      );
    },
  });
  return {
    Viewer: Viewer
  };
})();

