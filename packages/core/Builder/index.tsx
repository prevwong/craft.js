import React from "react";
import NodeElement from "../Nodes/NodeElement";
import { Nodes, CanvasNodes } from "~types";


interface BuilderContext {
  nodes: Nodes,
  canvases: CanvasNodes,
  setCanvasNodes: Function
}

export const BuilderContext = React.createContext<BuilderContext>({
  canvases: null,
  nodes: null,
  setCanvasNodes: () => { }
});

export default class Builder extends React.Component {
  state: BuilderContext = {
    nodes: {},
    canvases: {},
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