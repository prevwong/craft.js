import React from "react";
import { mapChildrenToNodes } from "./helpers";
import { NodeId } from "~types";
import NodeToElement from "../Nodes/NodeToElement";
import NodeContext from "../Nodes/NodeContext";

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
      const nodes = mapChildrenToNodes(children, id);
      pushChildCanvas(canvasId, nodes);
    }
  }
  render() {
    return (
      <NodeContext.Consumer>
        {({ unvisitedChildCanvas, incrementIndex, builder }) => {
          const canvasId = unvisitedChildCanvas.shift() || this.id;

          this.id = canvasId;

          const { canvases } = builder;
          const nodes = canvases[canvasId];
          incrementIndex();

          return (
            <React.Fragment>
              <p>{canvasId}</p>
              {
                nodes && nodes.map((nodeId: NodeId) => {
                  return (
                    <NodeToElement nodeId={nodeId} key={nodeId} />
                  )
                })
              }
            </React.Fragment>
          )
        }}
      </NodeContext.Consumer>
    )
  }
}

Canvas.contextType = NodeContext;
