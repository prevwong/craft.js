import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "~src/utils";

export default class VagueComponent extends React.Component<any> {
  render() {
    const { is, node, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <Comp
        ref={
          (ref: Element) => {
            if (ref) {
              const dom = ReactDOM.findDOMNode(ref) as HTMLElement;
              const info = node.info = {
                dom: getDOMInfo(dom)
              };

              if (onReady) {
                onReady(dom, info);
              }
            }
          }
        }
        {...props}
      />
    )
  }
}