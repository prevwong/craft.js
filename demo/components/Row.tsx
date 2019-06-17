import React, { Component } from "react";
import Canvas from "~packages/core/Canvas";

export default class Row extends Component<any> {
  static defaultProps = {
    text: "Lol"
  }
  static editor = class extends React.Component<any> {
    render() {
      let {props} = this.props;
      return (
        <div>
          <input 
            type = "text" 
            value={props.text}
            onChange={(e) => props.text = e.target.value}
          />
        </div>
      )
    }
  }
  render() {
    const { text, children, style } = this.props;
    return (
      <div {...this.props}>
        <h2>{text}</h2>
       {this.props.children}
      </div>
    )
  }
}