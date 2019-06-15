import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "~src/utils";
import BuilderContext from "../BuilderContext";

export default class RenderNode extends React.PureComponent<any> {
  doneRender() {
    const { nodesInfo } = this.context;
    const { node, onReady } = this.props;
    const dom = ReactDOM.findDOMNode(this) as HTMLElement;
    if(!dom) return;
    const info = getDOMInfo(dom)

    if (nodesInfo) nodesInfo[node.id] = info;

    if (onReady) {
      onReady(dom, info);
    }
  }
  
  render() {
    const { is, node, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <Comp
        {...props}
        ref={() => {
          this.doneRender();
        }}
      />
    )
  }
}

RenderNode.contextType = BuilderContext;