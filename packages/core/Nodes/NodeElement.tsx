import { Node, NodeId, Nodes, RegisteredNode, CanvasMapping } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import { BuilderContext } from "../Builder/context";
import Canvas from "../Canvas";

interface NodeElementProps {
  node: RegisteredNode
}
interface NodeElementState {
  childCanvas: CanvasMapping
}

export default class NodeElement extends React.Component<NodeElementProps> {
  loopInfo = {
    index: 0
  }
  state: NodeElementState = {
    childCanvas: {},
  }
  componentDidUpdate() {
    this.loopInfo.index = 0;
  }
  componentWillMount() {
    // this.setState({
    //   unvisitedChildCanvas: this.props.node.childCanvas
    // })
    if (this.props.node && this.props.node.childCanvas) this.state.childCanvas = this.props.node.childCanvas;
  }
  render() {
    const { node } = this.props;
    const { childCanvas } = this.state;
    return (
      <BuilderContext.Consumer>
        {(builder) => {
          return (
            <NodeContext.Provider value={{
              node,
              childCanvas,
              pushChildCanvas: (canvasId: string, canvasNode: RegisteredNode, nodes: Nodes) => {
                if (!node.childCanvas) node.childCanvas = {};
                builder.setCanvasNodes(canvasNode.id, {
                  [canvasNode.id]: canvasNode,
                  ...nodes
                });
                this.state.childCanvas[canvasId] = node.childCanvas[canvasId] = canvasNode.id;
                this.setState({
                  ...this.state,
                });

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

