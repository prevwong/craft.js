import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ManagerState } from "../interfaces";
import { PlaceholderInfo } from "./interfaces";
import { RenderPlaceholder } from "../render/RenderPlaceholder";
import { useManager } from "../connectors";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo } from "../../shared/getDOMInfo";

export const DNDManager: React.FC = ({ children }) => {
  const { nodes, events, query, actions: {setNodeEvent, setPlaceholder, move}, options: {renderPlaceholder}} = useManager((state) => state);
  // const [placeholder, setPlaceholder] = useState<PlaceholderInfo>(null);
  const [isMousePressed, setMousePressed] = useState(false);
  const mutable = useRef<ManagerState>({
    nodes: null,
    events: null
  });

  mutable.current = {
    nodes,
    events
  }
  
  const blockSelection = useCallback(() => {
    // Element being dragged
    const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
    if (!!selection) {
      selection.empty ? selection.empty() : selection.removeAllRanges();
    }
  }, []);

  const onDrag = useCallback((e: MouseEvent) => {
    const {events} = mutable.current;
    blockSelection();
    if (events.active.ref.canDrag() === false) return false;
    // console.log(events.hover)
    const getPlaceholder = query.getDropPlaceholder(events.active.id, events.hover.id, { x: e.clientX, y: e.clientY });
    if (getPlaceholder) {
      setNodeEvent("dragging", events.active.id);
      setPlaceholder(getPlaceholder)
    }
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    const {events} = mutable.current;
    setMousePressed(false);
    setNodeEvent("dragging", null);

    if (events.placeholder && !events.placeholder.error) {
      const { id: dragId } = events.active;
      const { placement } = events.placeholder;
      const { parent, index, where } = placement;
      const { id: parentId, data: { nodes } } = parent;

      move(dragId, parentId, index + (where === "after" ? 1 : 0));
    }
    setPlaceholder(null);
  }, []);

  useEffect(() => {
    if (isMousePressed) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', onMouseUp);
    }

    return (() => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener('mouseup', onMouseUp);
    })
  }, [isMousePressed]);


  useEffect(() => {
    if (events.active && events.active.data.parent) setMousePressed(true);
  }, [events.active]);

  return (
    <React.Fragment>
      {
        events.placeholder ? (
          React.createElement(renderPlaceholder, {
            placeholder: events.placeholder,
            suggestedStyles: {
              ...movePlaceholder(
                events.placeholder.placement,
                getDOMInfo(events.placeholder.placement.parent.ref.dom),
                events.placeholder.placement.currentNode ? getDOMInfo(events.placeholder.placement.currentNode.ref.dom) : null
              ),
              transition: '0.2s ease-in'
            }
            
          })
        ) : null
      }
      {children}
    </React.Fragment>
  )
}