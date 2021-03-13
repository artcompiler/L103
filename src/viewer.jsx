/* Copyright (c) 2020, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";

window.gcexports.viewer = (function () {
  function renderElts(data) {
    data = [].concat(data);
    const elts = [];
    let key = 1;
    data.forEach(d => {
      switch(d.type) {
      case 'div':
        elts.push(<div key={key++} className={d.clss}>{renderElts(d.elts)}</div>);
        break;
      case 'span':
        elts.push(<span key={key++} className={d.clss}>{renderElts(d.elts)}</span>);
        break;
      case 'h3':
        elts.push(<h3 key={key++}>{renderElts(d.elts)}</h3>);
        break;
      case 'p':
        elts.push(<p key={key++} className={d.clss}>{renderElts(d.elts)}</p>);
        break;
      default:
        elts.push(data);
        break;
      }
    });
    return elts;
  }
  const Viewer = React.createClass({
    render() {
      const props = this.props;
      const data = this.props.obj || [];
      const elts = renderElts(data);
      return (
        <div>
          <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
          <div key='1' className="L103 viewer">
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

