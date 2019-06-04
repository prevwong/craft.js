import { Node, NodeId, Nodes } from "~types";
import { BuilderContext } from "../Builder";
import React from "react";
import NodeContext from "./NodeContext";

interface NodeElementProps {
  node: Node
}
interface NodeElementState {
  unvisitedChildCanvas: NodeId[]
}

export default class NodeElement extends React.Component<NodeElementProps> {
  loopInfo = {
    index: 0
  }
  state: NodeElementState = {
    unvisitedChildCanvas: [],
  }
  componentDidUpdate() {
    this.loopInfo.index = 0;
  }
  render() {
    const { node } = this.props;
    const { unvisitedChildCanvas } = this.state;
    return (
      <BuilderContext.Consumer>
        {(builder) => {
          return (
            <NodeContext.Provider value={{
              node,
              unvisitedChildCanvas,
              pushChildCanvas: (id: NodeId, nodes: Nodes) => {
                builder.setCanvasNodes(id, nodes, node.id);
                this.state.unvisitedChildCanvas.push(id);
                this.setState({
                  ...this.state,
                });
              },
              incrementIndex: () => {
                this.loopInfo.index = this.loopInfo.index + 1;
              },
              builder
            }}>
              {
                this.props.children
              }
            </NodeContext.Provider>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}

