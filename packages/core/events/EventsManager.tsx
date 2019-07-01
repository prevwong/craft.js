import { connectManager, ConnectedManager } from "../manager";
import React, { useState, useRef, useCallback } from "react";
import { CanvasNode, PlaceholderInfo } from "../interfaces";
import { NodeId, DropAction } from "~types";
import { getDOMInfo, getDeepChildrenNodes } from "../utils";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import { useEventListener } from "../utils/hooks";
import RenderPlaceholder from "../render/RenderPlaceholder";

export type EventsManager = { 
  children: React.ReactChildren
} & ConnectedManager

export const EventsManager = connectManager(({ children, manager: [state, methods] }: EventsManager) => {
  const [placeholder, setPlaceholder] = useState(null);
  const placeholderRef = useRef<PlaceholderInfo>(null);
  const placeBestPosition = (e: MouseEvent) => {
    const { nodes } = state;
    const nearestTargets = getNearestTarget(e),
      nearestTargetId = nearestTargets.pop();
    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent = (targetNode as CanvasNode).data.nodes ? targetNode as CanvasNode : nodes[targetNode.data.parent] as CanvasNode;

      const dimensionsInContainer = targetParent.data.nodes.map((id: NodeId) => {
        return {
          id,
          ...getDOMInfo(nodes[id].ref.dom)
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = targetParent.data.nodes.length ? nodes[targetParent.data.nodes[bestTarget.index]] : targetParent;

      const output: PlaceholderInfo = {
        position: movePlaceholder(
          bestTarget,
          getDOMInfo(targetParent.ref.dom),
          targetParent.data.nodes.length
            ? getDOMInfo(bestTargetNode.ref.dom)
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
    const { nodes, events } = state;
    const pos = { x: e.clientX, y: e.clientY };

    const deepChildren = getDeepChildrenNodes(nodes, events.active.id);
    const nodesWithinBounds = Object.keys(nodes).filter(nodeId => {
      return nodeId !== "rootNode" && nodes[nodeId].ref.dom && !deepChildren.includes(nodeId)
    });


    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const { top, left, width, height } = getDOMInfo(nodes[nodeId].ref.dom);

      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  const onDrag = useCallback((e: MouseEvent) => {
    if (state.events.active) {
      const { left, right, top, bottom } = getDOMInfo(state.events.active.ref.dom);
      if (
        !(
          e.clientX >= left &&
          e.clientX <= right &&
          e.clientY >= top &&
          e.clientY <= bottom
        )
      ) {
        // Element being dragged
        const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
        if (!!selection) {
          selection.empty ? selection.empty() : selection.removeAllRanges();
        }
        if (!state.events.dragging) {
          methods.setNodeEvent("dragging", state.events.active.id);
        } else {
          
          placeBestPosition(e);
        }

      }
    }
  }, [state.events.active, state.events.dragging]);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (state.events.dragging) {
      const { id: dragId } = state.events.dragging;
      const { placement } = placeholderRef.current;
      const { parent, index, where } = placement;
      const { id: parentId, data:{nodes} } = parent;

      methods.move(dragId, parentId, index + (where === "after" ? 1 : 0));
      methods.setNodeEvent("active", null);
      methods.setNodeEvent("dragging", null);

    }
  }, [state.events.dragging]);


  const onMouseDown = useCallback(() => {
    methods.setNodeEvent("active", null)
  }, []);

  useEventListener("mousemove", onDrag);
  useEventListener("mouseup", onMouseUp);
  useEventListener("mousedown", onMouseDown);

return (
  <React.Fragment>
    {
      placeholder ? <RenderPlaceholder isActive={!!state.events.dragging} placeholder={placeholder} /> : null
    }
    {children}
  </React.Fragment>
)
})