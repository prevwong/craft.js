import { connectManager, ConnectedManager } from "../manager";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { CanvasNode, PlaceholderInfo, Nodes, Node } from "../interfaces";
import { NodeId, DropAction } from "~types";
import { getDOMInfo, getDeepChildrenNodes, getAllCanvas } from "../utils";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import { useEventListener } from "../utils/hooks";
import RenderPlaceholder from "../render/RenderPlaceholder";
import { Canvas } from "../nodes";

export type EventsManager = { 
  children: React.ReactNode
} & ConnectedManager

export const EventsManager = connectManager(({ children, manager: [state, methods] }: EventsManager) => {
  const [placeholder, setPlaceholder] = useState(null);
  const placeholderRef = useRef<PlaceholderInfo>(null);
  const isMousePressed = useRef<boolean>(null);

  const placeBestPosition = (e: MouseEvent) => {
    const { nodes } = state;
    const [nearestTargetId, possibleNodes] = getNearestTarget(e);
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
      placeholderRef.current = output;
      setPlaceholder(output);
    }
  }

  const getNodesInAcceptedCanvas = (nodes: Nodes, draggedNode: Node): NodeId[] => {
    
    // first check if the parent canvas allows the dragged node from going out
    const { parent } = draggedNode.data;
    if ( !(nodes[parent] as CanvasNode).ref.outgoing(draggedNode) ) {
      // if the parent node does not allow the dragged node from going out then, limit potential nodes to those within the parent;
      return getDeepChildrenNodes(nodes, parent);
    }

    const canvases = getAllCanvas(nodes);
    const nodesToConsider = canvases.reduce((res: NodeId[], id) => {
      const canvas = nodes[id] as CanvasNode;
      if ( canvas.ref.incoming(draggedNode) ) {
        if ( !res.includes(canvas.id) ) res = [...res, canvas.id];
        res = [...res, ...canvas.data.nodes];
      }
      return res;
    }, []);

    return nodesToConsider;
  }

  const getNearestTarget = (e: MouseEvent): [NodeId, NodeId[]]=> {
    const { nodes, events } = state;
    const pos = { x: e.clientX, y: e.clientY };

    const deepChildren = getDeepChildrenNodes(nodes, events.active.id);
    const possibleNodeIds = getNodesInAcceptedCanvas(nodes, state.events.active);
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
    if (isMousePressed.current === true) {
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
    methods.setNodeEvent("dragging", null);
    isMousePressed.current = false;
    if (state.events.dragging) {
      const { id: dragId } = state.events.dragging;
      const { placement } = placeholderRef.current;
      const { parent, index, where } = placement;
      const { id: parentId, data:{nodes} } = parent;

      methods.move(dragId, parentId, index + (where === "after" ? 1 : 0));
    }
  }, [state.events.dragging]);


  const onMouseDown = useCallback(() => {
    methods.setNodeEvent("active", null)
  }, []);

  useEffect(() => {
    if ( state.events.active ) isMousePressed.current = true;
  }, [state.events.active]);

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