import React from "react";
import { Node, NodeId } from "~types";
import { BuilderContext } from "../Builder";
import NodeElement from "./NodeElement";

export default class NodeToElement extends React.PureComponent<any, any> {
  render() {
    const { nodeId } = this.props;

    return (
      <BuilderContext.Consumer>
        {({ nodes }) => {
          const node = nodes[nodeId];
          const { id, props, component: Comp } = node as Node;
          return (
            <NodeElement node={node}>
              <Comp {...props} />
            </NodeElement>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}

