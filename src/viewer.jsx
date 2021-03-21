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

window.getPasscode = () => {
  const value = d3.select('#mobile-number').property('value');
  signIn(value);
}
window.sendPasscode = () => {
  const value = d3.select('#passcode').property('value');
  finishSignIn(value);
}
function signIn(number) {
  d3.request('/signIn')
    .header("X-Requested-With", "XMLHttpRequest")
    .header("Content-type", "application/json; charset=UTF-8")
    .mimeType("application/json")
    .post(JSON.stringify({
      name: "jeff",
      number: number,
    }))
    .response(xhr => {
      const data = JSON.parse(xhr.responseText);
      localStorage.setItem("accessToken", data.jwt);
    });
}
function finishSignIn(passcode) {
  const jwt = localStorage.getItem("accessToken");
  d3.request('/finishSignIn')
    .header("X-Requested-With", "XMLHttpRequest")
    .header("Content-type", "application/json; charset=UTF-8")
    .mimeType("application/json")
    .post(JSON.stringify({
      jwt: jwt,
      passcode: passcode,
    }))
    .response(xhr => {
      const data = JSON.parse(xhr.responseText);
      console.log("finishSignIn() data=" + JSON.stringify(data));
      localStorage.setItem("accessToken", data.jwt);
      localStorage.setItem("userID", data.userID);
    });
}
function signOut() {
  // Restore sign-in state.
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userID");
  d3.select("input#name-txt").classed("is-valid", false);
  d3.select("input#number-txt").classed("is-valid", false);
  d3.select("div#name-feedback").classed("valid-feedback", false).text("");
  d3.select("button#signin").html("SIGN IN");
  d3.select("button#signin").classed("is-signup", false);
  d3.select("input#passcode-txt").node().value = "";
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

