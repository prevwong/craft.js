import { Node, NodeId, Nodes, RegisteredNode, CanvasMapping } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import { BuilderContext } from "../Builder/context";
import Canvas from "../Canvas";
import console = require("console");

interface NodeElementProps {
  node: RegisteredNode
}
interface NodeElementState {
  unvisitedChildCanvas: CanvasMapping
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
  componentWillMount() {
    // this.setState({
    //   unvisitedChildCanvas: this.props.node.childCanvas
    // })
    if ( this.props.node && this.props.node.childCanvas) this.state.unvisitedChildCanvas = this.props.node.childCanvas;
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
              pushChildCanvas: (canvasId: string, canvasNode: RegisteredNode, nodes: Nodes) => {
                if (node.type !== Canvas) {
                  if (!node.childCanvas) node.childCanvas = [];
                  node.childCanvas.splice(this.loopInfo.index, 0, canvasNode.id);
                }
                builder.setCanvasNodes(canvasNode.id, {
                  [canvasNode.id]: canvasNode,
                  ...nodes
                });

                this.state.unvisitedChildCanvas[canvasId] = canvasNode.id

                // this.state.unvisitedChildCanvas.push(canvasNode.id);
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

