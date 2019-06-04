import React from "react";
import NodeElement from "../Nodes/NodeElement";
import { Nodes, CanvasNodes, NodeId } from "~types";
import console = require("console");


interface BuilderContext {
  nodes: Nodes,
  canvases: CanvasNodes,
  active: Node,
  dragging: Node,
  setCanvasNodes: Function
  setActive: Function
  setDragging: Function
}

export const BuilderContext = React.createContext<BuilderContext>({
  canvases: null,
  nodes: null,
  active: null,
  dragging: null,
  setCanvasNodes: () => { },
  setActive: () => { },
  setDragging: () => { }
});

export default class Builder extends React.Component {
  state: BuilderContext = {
    nodes: {},
    canvases: {},
    active: null,
    dragging: null,
    setCanvasNodes: (canvasId: string, nodes: Node[], parentNodeId: string) => {
      if (!this.state.canvases[canvasId]) {
        this.state.canvases[canvasId] = [];
      }
      const canvases = {
        ...this.state.canvases,
        [canvasId]: Object.keys(nodes)
      }

      this.state.canvases = canvases;
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
          {this.props.children}
        </NodeElement>
      </BuilderContext.Provider>
    )
  }
}