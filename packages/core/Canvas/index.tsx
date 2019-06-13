import React from "react";
import { mapChildrenToNodes, createNode, nodesToArray } from "./helpers";
import { NodeId, CanvasNode, Nodes, NodeContextState } from "~types";
import NodeContext from "../Nodes/NodeContext";
import RenderDraggableNode from "../Nodes/RenderDraggableNode";
import RenderNode from "../Nodes/RenderNode";
import console = require("console");
const shortid = require("shortid");

export default class Canvas extends React.PureComponent<CanvasNode> {
  id: NodeId = null;
  nodes: Nodes = null;
  constructor(props: CanvasNode, context: NodeContextState) {
    super(props);
    if (!props.id) {
      throw new Error("Canvas must have an id")
    }
    const { node, pushChildCanvas, childCanvas, builder } = context;
    const { id } = props;
    // If no unvisited canvas left, meaning this Canvas is a new child; so insert it first
    if (!childCanvas[id]) {
      let canvasId = `canvas-${shortid.generate()}`;
      if (node.type === Canvas) {
        canvasId = node.id;
      }

      if (!builder.nodes[canvasId] || (builder.nodes[canvasId] && !(builder.nodes[canvasId] as CanvasNode).nodes)) {
        const { children } = this.props;
        const childNodes = mapChildrenToNodes(children, canvasId);
        const rootNode = createNode(this.constructor as React.ElementType, this.props, canvasId) as CanvasNode;
        if (node.type === Canvas) {
          rootNode.parent = node.parent;
        }
        rootNode.nodes = Object.keys(childNodes);

        builder.setNodes((prevNodes: Nodes) => {
          return {
            ...prevNodes,
            [rootNode.id]: rootNode,
            ...childNodes
          }
        });
      }
      pushChildCanvas(id, canvasId);
    }
  }
  render() {
    const { incoming, outgoing, ...props } = this.props;

    return (
      <NodeContext.Consumer>
        {({ childCanvas, builder }) => {

          const canvasId = childCanvas[this.props.id];
          if (!canvasId) return false;

          this.id = canvasId;
          const { nodes } = builder;
          const canvas = nodes[canvasId] as CanvasNode;
          // console.log("canvas", canvas)
          return (
            canvas && <RenderNode
              {...props}
              node={canvas}
            >

              <React.Fragment>
                {
                  canvas && canvas.nodes && canvas.nodes.map((nodeId: NodeId) => {
                    return (
                      <RenderDraggableNode nodeId={nodeId} key={nodeId} />
                    )
                  })
                }
              </React.Fragment>
            </RenderNode>
          )
        }}
      </NodeContext.Consumer>
    )
  }
}

Canvas.contextType = NodeContext;
