import React, { Component } from "react";
import Canvas from "~packages/core/Canvas";

export default class Row extends Component {
  render() {
    const { children, style } = this.props;
    return (
      <div {...this.props}>
       {this.props.children}
      </div>
    )
  }
}