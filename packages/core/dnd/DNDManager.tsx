import React, { useState, useCallback, useEffect } from "react";
import { Nodes, Node, NodeId } from "../interfaces";
import { PlaceholderInfo } from "./interfaces";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import { RenderPlaceholder } from "../render/RenderPlaceholder";
import { getDOMInfo } from "./getDOMInfo";
import { useCollector } from "../shared/useCollector";
import { useManager } from "../connectors";

export const DNDManager: React.FC = ({ children }) => {
  const { nodes, events, query, actions: {setNodeEvent, move} } = useManager((state) => state);
  const [placeholder, setPlaceholder] = useState<PlaceholderInfo>(null);
  const [isMousePressed, setMousePressed] = useState(false);

  const placeBestPosition = (e: MouseEvent) => {
    const [nearestTargetId, possibleNodes] = getNearestTarget(e);
    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent = targetNode.data.nodes ? targetNode : nodes[targetNode.data.parent];

      const dimensionsInContainer = targetParent.data.nodes.map((id: NodeId) => {
        return {
          id,
          ...getDOMInfo(nodes[id].ref.dom)
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = targetParent.data.nodes.length ? nodes[targetParent.data.nodes[bestTarget.index]] : targetParent;

      if (!possibleNodes.includes(bestTargetNode.id)) return;

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

      setPlaceholder(output);
    }
  }

  const getNodesInAcceptedCanvas = (draggedNode: Node): NodeId[] => {
    const acceptingCanvases = query.getAcceptingCanvases(draggedNode.id);
    return acceptingCanvases.reduce((res, id) => {
      res.push(...[id,...nodes[id].data.nodes]);
      return res;
    }, []);
  }

  const getNearestTarget = (e: MouseEvent): [NodeId, NodeId[]] => {
    const pos = { x: e.clientX, y: e.clientY };

    const possibleNodeIds = getNodesInAcceptedCanvas(events.active);
    const nodesWithinBounds = possibleNodeIds.filter(nodeId => {
      return nodes[nodeId].ref.dom 
    });

    const nearestTargets = nodesWithinBounds.filter((nodeId: NodeId) => {
      const { top, left, width, height } = getDOMInfo(nodes[nodeId].ref.dom);

      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });

    return [nearestTargets.length ? nearestTargets.pop() : null, possibleNodeIds]
  };

  const onDrag = useCallback((e: MouseEvent) => {
    const { left, right, top, bottom } = getDOMInfo(events.active.ref.dom);
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

      setNodeEvent("dragging", events.active.id);
      placeBestPosition(e);
    }
  }, [events.active]);

  const onMouseUp = useCallback((e: MouseEvent) => {
    setMousePressed(false);
    setNodeEvent("dragging", null);

    if (events.dragging) {
      const { id: dragId } = events.dragging;
      const { placement } = placeholder;
      const { parent, index, where } = placement;
      const { id: parentId, data: { nodes } } = parent;

      move(dragId, parentId, index + (where === "after" ? 1 : 0));
    }
    setPlaceholder(null);
  }, [events.dragging, placeholder]);

  useEffect(() => {
    if (isMousePressed) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return (() => {
      window.removeEventListener("mousedown", onDrag);
      window.removeEventListener('mouseup', onMouseUp);
    })
  }, [isMousePressed, onDrag, onMouseUp, placeholder]);


  useEffect(() => {
    if (events.active && events.active.data.parent) setMousePressed(true);
  }, [events.active]);

  return (
    <React.Fragment>
      {
        placeholder ? <RenderPlaceholder placeholder={placeholder} /> : null
      }
      {children}
    </React.Fragment>
  )
}