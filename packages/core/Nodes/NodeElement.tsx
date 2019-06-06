import { Node, NodeId, Nodes } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import { BuilderContext } from "../Builder/context";
import Canvas from "../Canvas";

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
              pushChildCanvas: (canvasNode: Node, nodes: Nodes) => {
                if (node.component !== Canvas) {
                  if (!node.childCanvas) node.childCanvas = [];
                  node.childCanvas.splice(this.loopInfo.index, 0, canvasNode.id);
                }
                builder.setCanvasNodes(canvasNode.id, {
                  [canvasNode.id]: canvasNode,
                  ...nodes
                });
                this.state.unvisitedChildCanvas.push(canvasNode.id);
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

