import React, { Component } from "react";
import { DropAction, BuilderContextState, Nodes, NodeId, CanvasNode, PlaceholderInfo } from "~types";
import BuilderContext from "../BuilderContext";
import { isCanvas, getDeepChildrenNodes } from "../utils";
import Canvas from "../nodes/Canvas";
import Placeholder from "./Placeholder";
import { movePlaceholder, findPosition } from "./helper";

class DragDropManager extends Component {
  lastPos: DropAction;
  onDrag: EventListenerOrEventListenerObject;
  nodes: Nodes;
  state = {
    placeholder: null
  }
  constructor(props: any, context: BuilderContextState) {
    super(props);
    this.nodes = context.nodes;
    this.onDrag = this.drag.bind(this);
  }

  setPlaceholder = (placeholder: PlaceholderInfo) => {
    this.setState({
      placeholder
    });
  }

  drag(e: MouseEvent) {
    e.stopPropagation();
    const { dragging, nodes }: BuilderContextState = this.context;

    if (dragging) {
      this.placeBestPosition(e);
    }
  }


  placeBestPosition(e: MouseEvent) {
    const { nodes, nodesInfo }: BuilderContextState = this.context;
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

      this.setPlaceholder(output);
    }
  }

  getNearestTarget(e: MouseEvent) {
    const { nodesInfo, dragging, nodes }: BuilderContextState = this.context;
    const pos = { x: e.clientX, y: e.clientY };
    
    const deepChildren =  getDeepChildrenNodes(nodes, dragging.id);
    const nodesWithinBounds = Object.keys(nodes).filter(nodeId => {
      return nodeId !== "rootNode" && !deepChildren.includes(nodeId)
    });
    
    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const {top, left, width, height } = nodesInfo[nodeId];
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  render() {
    const { placeholder } = this.state;
    return (
      <BuilderContext.Consumer>
        {({ dragging }: BuilderContextState) => {
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
