import React from "react";
import { mapChildrenToNodes, createNode, nodesToArray } from "./helpers";
import { NodeId, CanvasNode } from "~types";
import NodeContext from "../Nodes/NodeContext";
import RenderDraggableNode from "../Nodes/RenderDraggableNode";
import RenderRegisteredNode from "../Nodes/RenderRegisteredNode";
import console = require("console");

const shortid = require("shortid");

export default class Canvas extends React.PureComponent<CanvasNode> {
  id: NodeId = null;
  nodes: Nodes = null;
  constructor(props) {
    super(props);
    if (!props.id) {
      throw new Error("Canvas must have an id")
    }
  }
  componentDidMount() {
    const { node, pushChildCanvas, unvisitedChildCanvas } = this.context;
    const { id } = this.props;
    // If no unvisited canvas left, meaning this Canvas is a new child; so insert it first
    if (!unvisitedChildCanvas[id]) {
      let canvasId = `canvas-${shortid.generate()}`;
      if (node.component === Canvas) {
        canvasId = node.id;
      }

      const { children } = this.props;
      const nodes = mapChildrenToNodes(children, canvasId);
      const rootNode = createNode(this.constructor as React.ElementType, this.props, canvasId) as CanvasNode;
      if (node.component === Canvas) {
        rootNode.parent = node.parent;
      }
      rootNode.nodes = Object.keys(nodes);

      pushChildCanvas(id, rootNode, nodes);
    }
  }
  componentDidUpdate(props) {
  }
  render() {
    const { incoming, outgoing, ...props } = this.props;
    
    return (
      <NodeContext.Consumer>
        {({ node, unvisitedChildCanvas, incrementIndex, builder }) => {

          const canvasId = unvisitedChildCanvas[this.props.id];
          if (!canvasId) return false;

          this.id = canvasId;
          const { nodes } = builder;
          const canvas = nodes[canvasId];

          incrementIndex();

          return (
            <RenderRegisteredNode
              {...props}
              node={canvas}
            >
              <p>{canvasId}</p>
              {
                canvas.nodes && canvas.nodes.map((nodeId: NodeId) => {
                  return (
                    <RenderDraggableNode nodeId={nodeId} key={nodeId} />
                  )
                })
              }
            </RenderRegisteredNode>
          )
        }}
      </NodeContext.Consumer>
    )
  }
}

Canvas.contextType = NodeContext;
