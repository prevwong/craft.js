import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { connectManager } from "../manager";
import { getDOMInfo, getDeepChildrenNodes } from "../utils";
import { CanvasNode, NodeId } from "../nodes";
import { findPosition, movePlaceholder, CSSMarginPaddingObj } from "./helper";
import RenderPlaceholder from "../render/RenderPlaceholder";

export interface DropAction {
  parent: CanvasNode;
  index: number;
  where: string;
}

export interface PlaceholderInfo {
  node: Node
  placement: DropAction;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
    margin: CSSMarginPaddingObj;
  }
}

const blockSelection = (e: MouseEvent) => {
  console.log("block")
  const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
    if(!!selection) selection.empty ? selection.empty() : selection.removeAllRanges();
    e.preventDefault();
};

export const EventsManager = connectManager(({children, manager: [state, methods]}) => {
  const [placeholder, setPlaceholder] = useState(null);
  const placeholderRef = useRef(null);

  const placeBestPosition = (e: MouseEvent) => {
    const { nodes, dom } = state;
    const nearestTargets = getNearestTarget(e),
      nearestTargetId = nearestTargets.pop();

    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent: CanvasNode = (targetNode as CanvasNode).nodes ? targetNode : nodes[targetNode.parent];

      const dimensionsInContainer = targetParent.nodes.map((id: NodeId) => {
        return {
          id,
          ...getDOMInfo(dom[id])
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = targetParent.nodes.length ? nodes[targetParent.nodes[bestTarget.index]] : targetParent;

      const output = {
        position: movePlaceholder(
          bestTarget,
          getDOMInfo(dom[targetParent.id]),
          targetParent.nodes.length
            ? getDOMInfo(dom[bestTargetNode.id])
            : null
        ),
        node: bestTargetNode,
        placement: bestTarget
      };
      placeholderRef.current = output;
      setPlaceholder(output);
    }
  }

  const getNearestTarget = (e: MouseEvent) => {
    const { nodes, dom, events } = state;
    const pos = { x: e.clientX, y: e.clientY };
    
    const deepChildren =  getDeepChildrenNodes(nodes, events.active.id);
    const nodesWithinBounds = Object.keys(dom).filter(nodeId => {
      return nodeId !== "rootNode" && !deepChildren.includes(nodeId)
    });
    
    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const {top, left, width, height } = getDOMInfo(dom[nodeId]);
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  const onDrag = useCallback((e: MouseEvent) => {
    const { left, right, top, bottom } = getDOMInfo(state.dom[state.events.active.id]);
    if (
      !(
        e.clientX >= right &&
        e.clientY >= top &&
        e.clientY <= bottom && 
        !state.events.dragging
      )
    ) {
      // Element being dragged
     methods.setNodeEvent("dragging", state.events.active);
     placeBestPosition(e);
    }
  }, [state.events.active]);
  
  const onMouseUp = useCallback((e: MouseEvent) => {
    if ( placeholderRef.current ) { 
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("selectstart", blockSelection);
      methods.setNodeEvent("active", null);
      methods.setNodeEvent("dragging", null);


      const { id: dragId, parent: dragParentId } = state.events.active;
      const { placement } = placeholderRef.current;
      const { parent, index, where } = placement;
      const { id: parentId, nodes } = parent;

      methods.move(dragId, parentId, index + (where === "after" ? 1 : 0));
      
    }
  }, [state.events.active, placeholderRef.current]);


  useEffect(() => {
    if (state.events.active) {
      window.addEventListener("selectstart", blockSelection);
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onMouseUp);
    }
  }, [state.events.active]);

  useEffect(() => {
    window.addEventListener("mousedown", () => {
      methods.setNodeEvent("active", null);
    })
  }, []);

  return (
    <React.Fragment>
      {
        placeholder ? <RenderPlaceholder isActive={!!state.events.dragging} placeholder={placeholder} /> : null
      }
      {children}
    </React.Fragment>
  )
})