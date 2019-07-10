import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Nodes, Node, NodeId } from "../interfaces";
import { PlaceholderInfo } from "./interfaces";
import findPosition from "./findPosition";
import movePlaceholder from "./movePlaceholder";
import {RenderPlaceholder} from "../render/RenderPlaceholder";
import {useManager} from "../manager";
import { getDOMInfo } from "./getDOMInfo";
import { MonitorContext } from "../monitor/context";

export const EventsManager: React.FC = ({ children }) => {
  const { nodes, events, move, query } = useManager((state) => state)
  const [subscribeMonitor, getMonitor, { setNodeEvent }] = useContext(MonitorContext);
  const [placeholder, setPlaceholder] = useState<PlaceholderInfo>(null);
  const [isMousePressed, setMousePressed] = useState(false);
  
  const nodesRef = useRef(null);
  const [active, setActive] = useState(null);
  const [dragging, setDragging] = useState(null);

  const placeBestPosition = (e: MouseEvent) => {
    const [nearestTargetId, possibleNodes] = getNearestTarget(e);
    if (nearestTargetId) {
      const targetNode = nodes[nearestTargetId],
        targetParent = targetNode.data.nodes ? targetNode : nodes[targetNode.data.parent];

      const dimensionsInContainer = targetParent.data.nodes.map((id: NodeId) => {
        return {
          id,
          ...getDOMInfo(nodesRef.current[id].dom)
        }
      })

      const bestTarget = findPosition(targetParent, dimensionsInContainer, e.clientX, e.clientY);
      const bestTargetNode = targetParent.data.nodes.length ? nodes[targetParent.data.nodes[bestTarget.index]] : targetParent;
      
      if ( !possibleNodes.includes(bestTargetNode.id) ) return;

      const output: PlaceholderInfo = {
        position: movePlaceholder(
          bestTarget,
          getDOMInfo(nodesRef.current[targetParent.id].dom),
          targetParent.data.nodes.length
            ? getDOMInfo(nodesRef.current[bestTargetNode.id].dom)
            : null
        ),
        node: bestTargetNode,
        placement: bestTarget
      };

      setPlaceholder(output);
    }
  }

  const getNodesInAcceptedCanvas = (draggedNode: Node): NodeId[] => {
    
    // first check if the parent canvas allows the dragged node from going out
    const { parent } = draggedNode.data;

    if ( !nodesRef.current[parent].outgoing(draggedNode) ) {
      // if the parent node does not allow the dragged node from going out then, limit potential nodes to those within the parent;
      return query.getDeepNodes(parent);
    }

    const canvases = query.getAllCanvas();
    const nodesToConsider = canvases.reduce((res: NodeId[], id) => {
      const canvas = nodesRef.current[id];

      if ( canvas.incoming(draggedNode) ) {
        if ( !res.includes(canvas.id) ) res = [...res, id];
        res = [...res, ...nodes[id].data.nodes];
        // console.log("Accept", res)
      }
      return res;
    }, []);

    return nodesToConsider;
  }

  const getNearestTarget = (e: MouseEvent): [NodeId, NodeId[]]=> {
    const pos = { x: e.clientX, y: e.clientY };

    const deepChildren = query.getDeepNodes(active.id);
    const possibleNodeIds = getNodesInAcceptedCanvas(active);
    const nodesWithinBounds = possibleNodeIds.filter(nodeId => {

      return nodesRef.current[nodeId].dom && 
      !deepChildren.includes(nodeId) 
    });

    const nearestTargets = nodesWithinBounds.filter((nodeId: NodeId) => {
      const { top, left, width, height } = getDOMInfo(nodesRef.current[nodeId].dom);

      return (
        (pos.x >= left && pos.x <= left + width) &&
        (pos.y >= top && pos.y <= top + height)
      );
    });

    return [nearestTargets.length ? nearestTargets.pop() : null, possibleNodeIds]
  };

  const onDrag = useCallback((e: MouseEvent) => {
      const { left, right, top, bottom } = getDOMInfo(active.ref.dom);
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

        setNodeEvent("dragging", active);
        placeBestPosition(e);
      }
  }, [active]);

  const onMouseUp = useCallback((e: MouseEvent) => {
  
    if (dragging) {
      const { id: dragId } = dragging;
      const { placement } = placeholder;
      const { parent, index, where } = placement;
      const { id: parentId, data:{nodes} } = parent;

      move(dragId, parentId, index + (where === "after" ? 1 : 0));
    }
    setPlaceholder(null);
    setNodeEvent("dragging", null);
  }, [dragging, placeholder]);

  useEffect(() => { 
    if ( active ) {
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
  }, [active, onDrag, onMouseUp, placeholder]);


  // useEffect(() => {
  //   if ( events.active && events.active.data.parent ) setMousePressed(true);
  // }, [events.active]);

  useEffect(() => {
    subscribeMonitor(() => {
      const { prev, current } = getMonitor();
      if ( prev.events.active !== current.events.active ) {
        nodesRef.current = current.nodes;
        setActive(current.events.active);
      }
    })
  }, [])
return (
  <React.Fragment>
    {
      placeholder? <RenderPlaceholder placeholder = { placeholder } /> : null
    }
    {children}
  </React.Fragment>
)
}