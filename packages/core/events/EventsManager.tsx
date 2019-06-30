import { connectManager } from "../manager";
import React, { useState, useRef, useCallback } from "react";
import { CanvasNode } from "../interfaces";
import { NodeId } from "~types";
import { getDOMInfo, getDeepChildrenNodes } from "../utils";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import { useEventListener } from "../utils/hooks";
import RenderPlaceholder from "../render/RenderPlaceholder";


export const EventsManager = connectManager(({ children, manager: [state, methods] }) => {
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

    const deepChildren = getDeepChildrenNodes(nodes, events.active.id);
    const nodesWithinBounds = Object.keys(dom).filter(nodeId => {
      return nodeId !== "rootNode" && !deepChildren.includes(nodeId)
    });

    return nodesWithinBounds.filter((nodeId: NodeId) => {
      const { top, left, width, height } = getDOMInfo(dom[nodeId]);
      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });
  };

  const onDrag = useCallback((e: MouseEvent) => {
    if (state.events.active) {
      const { left, right, top, bottom } = getDOMInfo(state.dom[state.events.active.id]);
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
          methods.setNodeEvent("dragging", state.events.active);
        } else {
          
          placeBestPosition(e);
        }

      }
    }
  }, [state.events.active, state.events.dragging]);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (state.events.dragging) {
      const { id: dragId, parent: dragParentId } = state.events.dragging;
      const { placement } = placeholderRef.current;
      const { parent, index, where } = placement;
      const { id: parentId, nodes } = parent;

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