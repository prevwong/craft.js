import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { PlaceholderInfo, Nodes, Node, NodeId } from "../interfaces";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import RenderPlaceholder from "../render/RenderPlaceholder";
import {useManager} from "../manager";
import { getDOMInfo } from "../shared/dom";

export const EventsManager: React.FC = ({ children }) => {
  const { nodes, events, setNodeEvent, move, query } = useManager((state) => state)
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
      
      if ( !possibleNodes.includes(bestTargetNode.id) ) return;

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

  const getNodesInAcceptedCanvas = (nodes: Nodes, draggedNode: Node): NodeId[] => {
    
    // first check if the parent canvas allows the dragged node from going out
    const { parent } = draggedNode.data;
    if ( !nodes[parent].ref.outgoing(draggedNode) ) {
      // if the parent node does not allow the dragged node from going out then, limit potential nodes to those within the parent;
      return query.getDeepNodes(parent);
    }

    const canvases = query.getAllCanvas();
    const nodesToConsider = canvases.reduce((res: NodeId[], id) => {
      const canvas = nodes[id];
      if ( canvas.ref.incoming(draggedNode) ) {
        if ( !res.includes(canvas.id) ) res = [...res, canvas.id];
        res = [...res, ...canvas.data.nodes];
      }
      return res;
    }, []);

    return nodesToConsider;
  }

  const getNearestTarget = (e: MouseEvent): [NodeId, NodeId[]]=> {
    const pos = { x: e.clientX, y: e.clientY };

    const deepChildren = query.getDeepNodes(events.active.id);
    const possibleNodeIds = getNodesInAcceptedCanvas(nodes, events.active);
    const nodesWithinBounds = possibleNodeIds.filter(nodeId => {
      return nodes[nodeId].ref.dom && 
      !deepChildren.includes(nodeId) 
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
      const { id: parentId, data:{nodes} } = parent;

      move(dragId, parentId, index + (where === "after" ? 1 : 0));
    }
    setPlaceholder(null);
  }, [events.dragging, placeholder]);

  useEffect(() => { 
    if ( isMousePressed ) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return(() => {
      window.removeEventListener("mousedown", onDrag);
      window.removeEventListener('mouseup', onMouseUp);
    })
  }, [isMousePressed, onDrag, onMouseUp, placeholder]);


  useEffect(() => {
    if ( events.active ) setMousePressed(true);
  }, [events.active]);

return (
  <React.Fragment>
    {
      placeholder ? <RenderPlaceholder isActive={!!events.dragging} placeholder={placeholder} /> : null
    }
    {children}
  </React.Fragment>
)
}