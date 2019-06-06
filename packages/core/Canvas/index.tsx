import React from "react";
import { mapChildrenToNodes, createNode } from "./helpers";
import { NodeId, CanvasNode } from "~types";
import NodeToElement from "../Nodes/NodeToElement";
import NodeContext from "../Nodes/NodeContext";
import VagueComponent from "~src/components/VagueComponent";

const shortid = require("shortid");

export default class Canvas extends React.PureComponent<CanvasNode> {
  id: NodeId = null;
  componentWillMount() {
    const { node, pushChildCanvas, unvisitedChildCanvas } = this.context;
    const { id } = node;

    // If no unvisited canvas left, meaning this Canvas is a new child; so insert it first
    if (unvisitedChildCanvas && !unvisitedChildCanvas.length) {
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

      pushChildCanvas(rootNode, nodes);
    }
  }
  render() {
    const { incoming, outgoing, ...props } = this.props;
    return (
      <NodeContext.Consumer>
        {({ node, unvisitedChildCanvas, incrementIndex, builder }) => {

          const canvasId = unvisitedChildCanvas.shift() || this.id;
          this.id = canvasId;
          const { canvases, nodes } = builder;
          const canvas = nodes[canvasId];

          incrementIndex();

          return (
            <VagueComponent
              {...props}
              node={canvas}
            >
              <p>{canvasId}</p>
              {
                canvas.nodes && canvas.nodes.map((nodeId: NodeId) => {
                  return (
                    <NodeToElement nodeId={nodeId} key={nodeId} />
                  )
                })
              }
            </VagueComponent>
          )
        }}
      </NodeContext.Consumer>
    )
  }
}

Canvas.contextType = NodeContext;
