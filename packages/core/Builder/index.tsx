import React from "react";
import NodeElement from "../Nodes/NodeElement";
import { Nodes, CanvasNode, NodeId } from "~types";
import DragDropManager from "./DragDropManager";
import { BuilderContextState, BuilderContext } from "./context";

export default class Builder extends React.Component {
  state: BuilderContextState = {
    nodes: {},
    canvases: {},
    active: null,
    dragging: null,
    setCanvasNodes: (canvasId: string, nodes: Node[], parentNodeId: string) => {
      if (!this.state.canvases[canvasId]) {
        this.state.canvases[canvasId] = {}
      }
      this.state.canvases[canvasId].nodes = Object.keys(nodes);
      this.state.nodes = {
        ...this.state.nodes,
        ...nodes
      } as Nodes
    },
    setActive: (id: NodeId) => {
      this.setState({
        active: this.state.nodes[id]
      });
    },
    setDragging: (id: NodeId) => {
      this.setState({
        dragging: id ? this.state.nodes[id] : null
      });
    }
  }
  componentDidMount() {
    (window as any).tree = this.state;
  }
  render() {
    return (
      <BuilderContext.Provider value={this.state}>
        <NodeElement node={{ id: 'root' }}>
          <DragDropManager>
            {this.props.children}
          </DragDropManager>
        </NodeElement>
      </BuilderContext.Provider>
    )
  }
}