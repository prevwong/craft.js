import React from "react";
import { NodeInfo, Node, NodeContextState } from "~types";
import RenderNode from "./RenderNode";
import NodeContext from "../nodes/NodeContext";
import cx from "classnames";
import { Canvas } from "../nodes";

export default class RenderNodeWithContext extends React.PureComponent<any> {

  render() {
    return (
      <NodeContext.Consumer>
        {({ node }: NodeContextState ) => {
          const { id, props, type } = node as Node;
          return (
            <RenderNode 
              {...props}
              is={type}
            />
          )
        }}
      </NodeContext.Consumer>
    )
  }
}


