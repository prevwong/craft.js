import React from "react";
import { NodeInfo, Node, NodeContextState } from "~types";
import RenderNode from "./RenderNode";
import NodeContext from "../Nodes/NodeContext";
import cx from "classnames";

export default class RenderNodeWithContext extends React.PureComponent<any> {

  render() {
    const {style, className} = this.props;
    return (
      <NodeContext.Consumer>
        {({ node }: NodeContextState ) => {
          const { id, props, type } = node as Node;
          return (
            <RenderNode 
              {...props}
              style={{
                ...props.style,
                ...style
              }}
              className={cx([props.className, className && className])}
              is={type}
              node={node}
              onReady={(dom: HTMLElement, info: NodeInfo) => {
                // if ( onReady ) onReady(dom, info, node);
              }}
            />
          )
        }}
      </NodeContext.Consumer>
    )
  }
}


