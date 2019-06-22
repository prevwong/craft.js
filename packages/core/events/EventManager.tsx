import React from "react";
import  { EventContext, EventProperties, RootEventContext } from "./EventContext";
import { NodeId, CanvasNode } from "~types";
import { findPosition, movePlaceholder } from "./DragDropHelper";
import { getDeepChildrenNodes } from "../utils";
import { PlaceholderInfo } from "~types/events";
import Placeholder from "./Placeholder";
import { NodeManagerContext, RootManagerContext } from "../nodes/NodeManagerContext";
import Canvas from "../nodes/Canvas";

interface EventManagerState extends EventProperties {
  placeholder: PlaceholderInfo
}

export default class EventManager extends React.PureComponent {
  nodesInfo: any = {}
  dragging: NodeId = null;
  onDrag: EventListenerOrEventListenerObject = this.drag.bind(this);
  onMouseup: EventListenerOrEventListenerObject = this.mouseup.bind(this);
  blockSelectionWrapper: EventListenerOrEventListenerObject = this.blockSelection.bind(this);
  blockSelection(e: MouseEvent) {
    const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
    if (!!selection) selection.empty ? selection.empty() : selection.removeAllRanges();
    e.preventDefault();
  }

  drag(e: MouseEvent) {
    e.stopImmediatePropagation();
    const { left, right, top, bottom } = this.nodesInfo[this.dragging]
    if (
      !(
        e.clientX >= right &&
        e.clientY >= top &&
        e.clientY <= bottom
      ) &&
      this.dragging
    ) {
      // Element being dragged
      this.placeBestPosition(e);
    }
  }


  placeBestPosition(e: MouseEvent) {
    const { nodesInfo } = this;
    const { nodes }: NodeManagerContext<RootManagerContext> = this.context;
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
    const { nodes }: NodeManagerContext<RootManagerContext> = this.context;
    const pos = { x: e.clientX, y: e.clientY };

    const deepChildren = getDeepChildrenNodes(nodes, this.dragging);
    const nodesWithinBounds = Object.keys(nodes).filter(nodeId => {
      return nodeId !== "rootNode" && !deepChildren.includes(nodeId)
    });

    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const { top, left, width, height } = this.nodesInfo[nodeId];
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  mouseup() {
    window.removeEventListener("mousemove", this.onDrag);
    window.removeEventListener("mouseup", this.onMouseup);
    window.removeEventListener("selectstart", this.blockSelectionWrapper);

    const { methods: {move}, nodes }: NodeManagerContext<RootManagerContext> = this.context;
    const { placeholder } = this.state;
    if (!this.dragging) return;

    const { placement } = placeholder;
    const { parent, index, where } = placement;
    const { id: parentId } = parent;

    move(this.dragging, parentId, index + (where === "after" ? 1 : 0));
    this.dragging = null;
    this.setPlaceholder(null);
    this.state.methods.setNodeEvent("dragging", null);
  }

  initDragging = (nodeId: NodeId) => {
    if (!this.dragging) {
      this.dragging = nodeId;
      window.addEventListener("selectstart", this.blockSelectionWrapper);
      window.addEventListener("mousemove", this.onDrag);
      window.addEventListener("mouseup", this.onMouseup);
    }
  }

  setPlaceholder = (placeholder: PlaceholderInfo) => {
    this.setState({
      placeholder
    });
  }

  state: EventContext<RootEventContext> = {
    nodesInfo: this.nodesInfo,
    active: null,
    dragging: null,
    hover: null,
    placeholder: null,
    methods: {
      setNodeEvent: (eventType: string, nodeId: NodeId) => {
        if (!["active", "hover", "dragging"].includes(eventType)) throw new Error(`Undefined event "${eventType}, expected either "active", "hover" or "dragging".`);
        if (nodeId) { 
          const { nodes } = this.context;
          if (eventType === "dragging" ) this.initDragging(nodeId);
    
          this.setState({
            [eventType]: {
              node: nodes[nodeId],
              info: this.nodesInfo[nodeId]
            }
          })
        } else {
          this.setState({
            [eventType]: null
          })
        }
    
      },
      setActive: (nodeId: NodeId) => this.state.methods.setNodeEvent("active", nodeId)
    }
  }

  render() {
    const { active, dragging, hover, placeholder } = this.state;
    console.log("re-render")
    return (
      <EventContext.Provider value={this.state}>
        <React.Fragment>
          {placeholder && (
            <Placeholder placeholder={placeholder} />
          )}
          {this.props.children}
        </React.Fragment>
      </EventContext.Provider>
    )
  }
}

EventManager.contextType = NodeManagerContext;