import React, { Component } from "react";

export default class Row extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={`row`}>{children}</div>
    )
  }
}