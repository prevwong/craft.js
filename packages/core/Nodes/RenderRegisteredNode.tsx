import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "~src/utils";
import RenderNode from "./RenderNode";

export default class RenderRegisteredNode extends React.Component<any> {
  render() {
    const { node, onReady, ...props } = this.props;
    return (
      <RenderNode
        {...props}
        ref={(ref: any) => {
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
      />
    )
  }
}