import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "~src/utils";
import console = require("console");

export default class RenderNode extends React.Component<any> {
  componentDidMount() {
    const { node, onReady } = this.props;
    const dom = ReactDOM.findDOMNode(this) as HTMLElement;
    console.log(dom)
  }
  render() {
    const { is, node, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <Comp
        {...props}
      />
    )
  }
}