import React from "react";
import { mapChildrenToNodes } from "./helpers";
import { NodeId } from "~types";
import NodeToElement from "../Nodes/NodeToElement";
import NodeContext from "../Nodes/NodeContext";
import { getDOMInfo } from "~src/utils";
import VagueComponent from "~src/components/VagueComponent";
import console = require("console");

const shortid = require("shortid");

export default class Canvas extends React.PureComponent {
  id: NodeId = null;
  componentWillMount() {
    const { node, pushChildCanvas, unvisitedChildCanvas } = this.context;
    const { id } = node;

    // If no unvisited canvas left, meaning this Canvas is a new child; so insert it first
    if (unvisitedChildCanvas && !unvisitedChildCanvas.length) {
      let canvasId = `canvas-${shortid.generate()}`;
      const { children } = this.props;
      const nodes = mapChildrenToNodes(children, canvasId);
      pushChildCanvas(canvasId, nodes);
    }
  }
  render() {
    const { incoming, outgoing, ...props } = this.props;
    return (
      <NodeContext.Consumer>
        {({ node, unvisitedChildCanvas, incrementIndex, builder }) => {

          const canvasId = unvisitedChildCanvas.shift() || this.id;
          this.id = canvasId;
          const { canvases } = builder;
          const canvas = canvases[canvasId];
          if (node.component === Canvas) {
            // Parent node is a child of another canvas; and is actually the current canvas;
            node.canvas = canvas;
          }

          incrementIndex();

          return (
            <VagueComponent
              {...props}
              onReady={(dom: HTMLElement) => {
                canvas.info = {
                  dom: getDOMInfo(dom)
                };
              }}
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
