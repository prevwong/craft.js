import React, {  useRef } from "react";
import { Node, ManagerState, NodeId } from "../interfaces";
import { useManager } from "../connectors";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo } from "craftjs-utils";
import { useMemo } from "react";

export type DNDContext = {
  onDragStart: (e: React.MouseEvent, id: Node | NodeId) => void,
  onDragOver: (e: React.MouseEvent, id: NodeId) => void,
  onDragEnd: (e:React.MouseEvent) => void
}

export const DNDContext = React.createContext<DNDContext>(null);

export const DNDManager: React.FC = ({ children }) => {
  const { nodes, events, query, actions: {add, setNodeEvent, setPlaceholder, move}} = useManager((state) => state);
  const {renderPlaceholder} = query.getOptions();
  const mutable = useRef<ManagerState>({
    nodes,
    events
  });

  mutable.current = {
    nodes,
    events
  }

  const draggedNode = useRef<Node | NodeId>(null);

  const handlers = useMemo(() => {
    return {
      onDragStart: (e: React.MouseEvent, node: Node | NodeId) => {
        e.stopPropagation();
        if ( typeof node === 'string' ) setNodeEvent('dragging', node);
        draggedNode.current = node;
      },
      onDragOver: (e: React.MouseEvent, id: NodeId) => {
        e.stopPropagation();
        const { current: start } = draggedNode;
        if (!start) return;
        const dragId = typeof start == 'object' ? start.id : start;

        const getPlaceholder = query.getDropPlaceholder(dragId, id, { x: e.clientX, y: e.clientY });
        if ( getPlaceholder ) {
          if ( typeof start == 'object' && start.id ) {
            start.data.index = getPlaceholder.placement.index + (getPlaceholder.placement.where == 'after' ? 1 : 0);
            add(start, getPlaceholder.placement.parent.id);
            draggedNode.current = start.id;
          }
          setPlaceholder(getPlaceholder)
        }
      },
      onDragEnd: (e: React.MouseEvent) => {
        e.stopPropagation();
       
        if (mutable.current.events.placeholder && !mutable.current.events.placeholder.error) {
          const { placement } = mutable.current.events.placeholder;
          const { parent, index, where } = placement;
          const { id: parentId } = parent;

          move(draggedNode.current as NodeId, parentId, index + (where === "after" ? 1 : 0));
        }

        draggedNode.current = null;
        setPlaceholder(null);
        setNodeEvent('dragging', null);
      }
    }
  }, []);
 
  return (
    <DNDContext.Provider value={handlers}>
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
    </DNDContext.Provider>
  )
}