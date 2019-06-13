import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, Node, BuilderContextState, Nodes, CanvasNode } from "~types";
import RenderNode from "./RenderNode";
import BuilderContext from "../Builder/BuilderContext";
import RenderNodeWithContext from "./RenderNodeWithContext";
import console = require("console");

export default class RenderDraggableNode extends RenderNodeWithContext {
  dom: HTMLElement = null;
  node: Node = null;
  info: NodeInfo = {};
  dragStartWrapper: EventListenerOrEventListenerObject = this.dragStart.bind(this);
  dragWatchWrapper: EventListenerOrEventListenerObject = this.dragWatch.bind(this);
  dragEndWrapper: EventListenerOrEventListenerObject = this.dragEnd.bind(this);
  dragStart(e: MouseEvent) {
    e.stopPropagation();
    if (e.which !== 1) return;
    const { id } = this.node;
    const { setActive } = this.context;
    // Active element, now we'll be able to edit its' props
    setActive(id);
    window.addEventListener("mousemove", this.dragWatchWrapper);
    window.addEventListener("mouseup", this.dragEndWrapper);
  }

  dragWatch(e: MouseEvent) {
    const { active, dragging, setDragging } = this.context;
    const { dom } = this.info;
    if (
      !(
        e.clientX >= dom.left &&
        e.clientX <= dom.right &&
        e.clientY >= dom.top &&
        e.clientY <= dom.bottom
      ) &&
      !dragging
    ) {
      // Element being dragged
      setDragging(active.id);
    }
  }

  dragEnd(e: MouseEvent) {
    window.removeEventListener("mouseup", this.dragEndWrapper);
    window.removeEventListener("mousemove", this.dragWatchWrapper);

    const { active, dragging, placeholder, setDragging, setNodes }: BuilderContextState = this.context;
    if (!dragging) return;

    const { id: dragId, parent: dragParentId } = dragging;
    const { placement } = placeholder;
    const { parent, index, where } = placement;
    const { id: parentId, nodes } = parent;

    setNodes((stateNodes: Nodes) => {
      const currentParentNodes = (stateNodes[dragParentId] as CanvasNode).nodes,
        newParentNodes = (stateNodes[parentId] as CanvasNode).nodes;

      currentParentNodes.splice(currentParentNodes.indexOf(dragId), 1);
      newParentNodes.splice(index + (where === "after" ? 1 : 0), 0, dragId);
      stateNodes[dragId].parent = parentId;
      return stateNodes;
    });

    setDragging(null);
  }

  componentDidMount() {
    if(this.dom) this.dom.addEventListener("mousedown", this.dragStartWrapper);
  }
}


RenderDraggableNode.contextType = BuilderContext;