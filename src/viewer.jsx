/* Copyright (c) 2020, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./assert";
import * as React from "react";
import * as d3 from "d3";

function renderAttr(attr) {
  Object.keys(attr).forEach(key => {
    if (key.indexOf('on') === 0) {
      attr[key] = new Function('e', attr[key]);
    }
  });
  return attr;
}

window.gcexports.viewer = (function () {
  function renderElts(data) {
    data = [].concat(data);
    const elts = [];
    let key = 1;
    data.forEach(d => {
      switch(d.type) {
      case 'input':
        elts.push(<input key={key++} {...renderAttr(d.attr)} />);
        break;
      case 'button':
        elts.push(<button key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</button>);
        break;
      case 'svg':
        elts.push(<svg key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</svg>);
        break;
      case 'img':
        elts.push(<img key={key++} {...renderAttr(d.attr)}/>);
        break;
      case 'path':
        elts.push(<path key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</path>);
        break;
      case 'code':
        elts.push(<code key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</code>);
        break;
      case 'a':
        elts.push(<a key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</a>);
        break;
      case 'ol':
        elts.push(<ol key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</ol>);
        break;
      case 'ul':
        elts.push(<ul key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</ul>);
        break;
      case 'li':
        elts.push(<li key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</li>);
        break;
      case 'title':
        document.title = renderElts(d.elts);
        break;
      case 'div':
        elts.push(<div key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</div>);
        break;
      case 'span':
        elts.push(<span key={key++} {...renderAttr(d.attr)} >{renderElts(d.elts)}</span>);
        break;
      case 'h3':
        elts.push(<h3 key={key++}>{renderElts(d.elts)}</h3>);
        break;
      case 'p':
        elts.push(<p key={key++} {...renderAttr(d.attr)}>{renderElts(d.elts)}</p>);
        break;
      default:
        elts.push(d);
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

