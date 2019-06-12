import React from "react";
import { mapChildrenToNodes, createNode, nodesToArray } from "./helpers";
import { NodeId, CanvasNode, Nodes } from "~types";
import NodeContext from "../Nodes/NodeContext";
import RenderDraggableNode from "../Nodes/RenderDraggableNode";
import RenderNode from "../Nodes/RenderNode";
const shortid = require("shortid");

export default class Canvas extends React.PureComponent<CanvasNode> {
  id: NodeId = null;
  nodes: Nodes = null;
  constructor(props: CanvasNode, context) {
    super(props);
    if (!props.id) {
      throw new Error("Canvas must have an id")
    }
    const { node, pushChildCanvas, childCanvas } = context;
    const { id } = props;
    // If no unvisited canvas left, meaning this Canvas is a new child; so insert it first
    if (!childCanvas[id]) {
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
  render() {
    const { incoming, outgoing, ...props } = this.props;

    return (
      <NodeContext.Consumer>
        {({ node, childCanvas, builder }) => {

          const canvasId = childCanvas[this.props.id];
          if (!canvasId) return false;

          this.id = canvasId;
          const { nodes } = builder;
          const canvas = nodes[canvasId];


          return (
            <RenderNode
              {...props}
              node={canvas}
            >
              {
                canvas.nodes && canvas.nodes.map((nodeId: NodeId) => {
                  return (
                    <RenderDraggableNode nodeId={nodeId} key={nodeId} />
                  )
                })
              }
            </RenderNode>
          )
        }}
      </NodeContext.Consumer>
    )
  }
}

Canvas.contextType = NodeContext;
