import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, Node, BuilderContextState } from "~types";
import RenderNode from "./RenderNode";
import BuilderContext from "../Builder/BuilderContext";

export default class RenderNodeWithContext extends React.Component<any> {

  render() {
    const { nodeId, style, onReady } = this.props;
    return (
      <BuilderContext.Consumer>
        {({ nodes }: BuilderContextState) => {
          const node = nodes[nodeId];
          const { id, props, type } = node as Node;
          return (
            <NodeElement node={node}>
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
            </NodeElement>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}


RenderNodeWithContext.contextType = BuilderContext;