import React, { Component } from "react";
import { DropAction, BuilderContextState, Nodes, NodeId, CanvasNode } from "~types";
import BuilderContext from "../BuilderContext";
import { isCanvas } from "~src/utils";
import Canvas from "~packages/core/Canvas";
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
    const { nodes, setPlaceholder }: BuilderContextState = this.context;
    const nearestTargets = this.getNearestTarget(e),
      nearestTargetId = nearestTargets.pop();

    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent: CanvasNode = (targetNode as Canvas).nodes ? targetNode : nodes[targetNode.parent];

      const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
        const { info } = nodes[id];
        return {
          id,
          ...info
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = nodes[targetParent.nodes[bestTarget.index]];

      const output = {
        position: movePlaceholder(
          bestTarget,
          targetParent.info.dom,
          targetParent.nodes.length
            ? bestTargetNode.info.dom
            : null
        ),
        node: bestTargetNode,
        placement: bestTarget
      };

      setPlaceholder(output);
    }
  }





  getNearestTarget(e: MouseEvent) {
    const { dragging, nodes }: BuilderContextState = this.context;
    const pos = { x: e.clientX, y: e.clientY };
    const nodesWithinBounds = isCanvas(dragging) ? Object.keys(nodes).filter(id => {
      return !(dragging as CanvasNode).nodes.includes(id) && id !== "rootNode";
    }) : Object.keys(nodes).filter(id => id !== "rootNode");

    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const { info } = nodes[nodeId];
      const { dom, id } = info;
      const { top, left, width, height } = dom;
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  render() {
    return (
      <BuilderContext.Consumer>
        {({ dragging, placeholder, active }: BuilderContextState) => {
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
