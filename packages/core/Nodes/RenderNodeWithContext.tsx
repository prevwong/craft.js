import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, Node, BuilderContextState } from "~types";
import RenderNode from "./RenderNode";
import BuilderContext from "../Builder/BuilderContext";

export default class RenderNodeWithContext extends React.Component<any> {
  dom: HTMLElement = null;
  node: Node = null;
  info: NodeInfo = {};

  render() {
    const { nodeId } = this.props;
    return (
      <BuilderContext.Consumer>
        {({ nodes }: BuilderContextState) => {
          const node = nodes[nodeId];
          const { id, props, type } = this.node = node as Node;
          return (
            <NodeElement node={node}>
              <RenderNode
                {...props}
                is={type}
                node={node}
                onReady={(dom: HTMLElement, info: NodeInfo) => {
                  this.dom = dom;
                  this.info = info;
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