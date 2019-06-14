import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, Node, BuilderContextState, NodeElementState, NodeContextState } from "~types";
import RenderNode from "./RenderNode";
import BuilderContext from "../Builder/BuilderContext";
import NodeContext from "./NodeContext";
import cx from "classnames";

export default class RenderNodeWithContext extends React.Component<any> {

  render() {
    const { proxy } = this.props;
    return (
      <NodeContext.Consumer>
        {({ node }: NodeContextState ) => {
          const { id, props, type } = node as Node;
          return (
            <RenderNode 
              {...props}
              {...proxy}
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


