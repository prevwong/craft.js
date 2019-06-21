import React from "react";
import { NodeInfo, Node, NodeContextState } from "~types";
import RenderNode from "./RenderNode";
import cx from "classnames";
import { NodeContext } from "../nodes/NodeContext";

export default class RenderNodeWithContext extends React.PureComponent<any> {

  render() {
    return (
      <NodeContext.Consumer>
        {({ node }: NodeContext ) => {
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


