import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, Node, BuilderContextState, NodeElementState, NodeContextState } from "~types";
import RenderNode from "./RenderNode";
import BuilderContext from "../Builder/BuilderContext";
import NodeContext from "./NodeContext";

export default class RenderNodeWithContext extends React.Component<any> {

  render() {
    const { nodeId, style, onReady } = this.props;
    
    return (
      <NodeContext.Consumer>
        {({ node }: NodeContextState ) => {
          const { id, props, type } = node as Node;
          return (
            <RenderNode
              {...props}
              style={
                {...props.style,
                ...style}
              }
              is={type}
              node={node}
              onReady={(dom: HTMLElement, info: NodeInfo) => {
                if ( onReady ) onReady(dom, info, node);
              }}
            />
          )
        }}
      </NodeContext.Consumer>
    )
  }
}


