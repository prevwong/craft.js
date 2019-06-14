import React from "react";
import ReactDOM from "react-dom";
import { getDOMInfo } from "~src/utils";
import BuilderContext from "../Builder/BuilderContext";
import cx from "classnames";

export default class RenderNode extends React.Component<any> {
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
    const { is, node, onReady, proxy, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <Comp
        {...props}
        style={{
          ...props.style,
          ...proxy && proxy.style
        }}
        className={cx([props.className, proxy && proxy.className])}
        ref={() => {
          this.doneRender();
        }}
      />
    )
  }
}

RenderNode.contextType = BuilderContext;