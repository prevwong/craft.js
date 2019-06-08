import React from "react";
import NodeElement from "../Nodes/NodeElement";
import { Nodes, CanvasNode, NodeId } from "~types";
import DragDropManager from "./DragDropManager";
import { BuilderContextState, BuilderContext } from "./context";
import { createNode, mapChildrenToNodes } from "../Canvas/helpers";
import RenderDraggableNode from "../Nodes/RenderDraggableNode";

export default class Builder extends React.Component {
  state: BuilderContextState = {
    nodes: {},
    active: null,
    dragging: null,
    setCanvasNodes: (canvasId: string, nodes: Node[]) => {
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
  componentWillMount() {
    (window as any).tree = this.state;
    const rootNode = mapChildrenToNodes(<div id="root-node">{this.props.children}</div>, null, "rootNode");
    this.state.setCanvasNodes(false, rootNode);
  }

  render() {
    const { nodes } = this.state;
    return (
      <BuilderContext.Provider value={this.state}>
        <DragDropManager>
          <RenderDraggableNode nodeId="rootNode" />
        </DragDropManager>
      </BuilderContext.Provider>
    )
  }
}