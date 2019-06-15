import React, { Component } from "react";
import { DropAction, BuilderContextState, Nodes, NodeId, CanvasNode } from "~types";
import BuilderContext from "../BuilderContext";
import { isCanvas } from "../utils";
import Canvas from "../Nodes/Canvas";
import Placeholder from "./Placeholder";
import { movePlaceholder, findPosition } from "./helper";

class DragDropManager extends Component {
  lastPos: DropAction;
  onDrag: EventListenerOrEventListenerObject;
  nodes: Nodes;
  constructor(props: any, context: BuilderContextState) {
    super(props);
    this.nodes = context.nodes;
    this.onDrag = this.drag.bind(this);
  }

  drag(e: MouseEvent) {
    e.stopPropagation();
    const { dragging, nodes }: BuilderContextState = this.context;

    if (dragging) {
      this.placeBestPosition(e);
    }
  }


  placeBestPosition(e: MouseEvent) {
    const { nodes, nodesInfo, setPlaceholder }: BuilderContextState = this.context;
    const nearestTargets = this.getNearestTarget(e),
      nearestTargetId = nearestTargets.pop();

    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent: CanvasNode = (targetNode as Canvas).nodes ? targetNode : nodes[targetNode.parent];

      const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
        return {
          id,
          ...nodesInfo[id]
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = targetParent.nodes.length ? nodes[targetParent.nodes[bestTarget.index]] : targetParent;

      const output = {
        position: movePlaceholder(
          bestTarget,
          nodesInfo[targetParent.id],
          targetParent.nodes.length
            ? nodesInfo[bestTargetNode.id]
            : null
        ),
        node: bestTargetNode,
        placement: bestTarget
      };

      setPlaceholder(output);
    }
  }

  getNearestTarget(e: MouseEvent) {
    const { nodesInfo, dragging, nodes }: BuilderContextState = this.context;
    const pos = { x: e.clientX, y: e.clientY };
    const nodesWithinBounds = isCanvas(dragging) ? Object.keys(nodes).filter(id => {
      return !(dragging as CanvasNode).nodes.includes(id) && id !== "rootNode";
    }) : Object.keys(nodes).filter(id => id !== "rootNode");

    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const {top, left, width, height } = nodesInfo[nodeId];
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  render() {
    return (
      <BuilderContext.Consumer>
        {({ dragging, placeholder }: BuilderContextState) => {
          if (dragging) window.addEventListener("mousemove", this.onDrag);
          else window.removeEventListener("mousemove", this.onDrag);
          return (
            <React.Fragment>
              {placeholder && (
                <Placeholder isActive={!!dragging} placeholder={placeholder} />
              )}
              {this.props.children}
            </React.Fragment>
          );
        }}
      </BuilderContext.Consumer>
    );
  }
}

DragDropManager.contextType = BuilderContext;

export default DragDropManager;
