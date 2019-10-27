import React, { useState, useCallback, useEffect, useRef } from "react";
import { ManagerState, NodeToAdd } from "../interfaces";
import { useManager } from "../connectors";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo } from "craftjs-utils";

export const DNDManager: React.FC = ({ children }) => {
  const { nodes, events, query, actions: {add, setNodeEvent, setPlaceholder, move}} = useManager((state) => state);
  const {renderPlaceholder} = query.getOptions();
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

  // let i = 0;
  const onDrag = useCallback((e: MouseEvent) => {
    const {events} = mutable.current;
    blockSelection();
    if ((events.active || events.pending).ref.canDrag() === false || !events.hover) return false;
    const getPlaceholder = query.getDropPlaceholder((events.active || events.pending).id, events.hover.id, { x: e.clientX, y: e.clientY });
    if (getPlaceholder) {
      if ( events.pending ) {
        console.log("adding")
        const newNode: NodeToAdd = {
          ...events.pending,
          index: getPlaceholder.placement.index + (getPlaceholder.placement.where == 'after' ? 1 : 0)
        } 

        add(newNode, getPlaceholder.placement.parent.id);
        setNodeEvent('active', events.pending.id);
        setNodeEvent('pending', null);
      }
      setNodeEvent("dragging", (events.active || events.pending).id);
      setPlaceholder(getPlaceholder)
    }
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    const {events} = mutable.current;
    setMousePressed(false);
    setNodeEvent("dragging", null);

    if (events.placeholder && !events.placeholder.error) {
      const { id: dragId } = events.active || events.pending;
      const { placement } = events.placeholder;
      const { parent, index, where } = placement;
      const { id: parentId, data: { nodes } } = parent;

      move(dragId, parentId, index + (where === "after" ? 1 : 0));
    }
    setPlaceholder(null);

    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener('mouseup', onMouseUp);
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
    if (events.active && events.active.data.parent && !isMousePressed ) {
      setMousePressed(true);
    }
  }, [events.active]);

  useEffect(() => {
    if (events.pending && !isMousePressed) {
      setMousePressed(true);
    }
  }, [events.pending]);

  // console.log(events.hover)
 
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