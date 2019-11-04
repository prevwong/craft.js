import React, {  useRef, useMemo } from "react";
import { Node, ManagerState, NodeId } from "../interfaces";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo } from "craftjs-utils";
import { useInternalManager } from "../manager/useInternalManager";
import {debounce} from "lodash"

export type EventContext = {
  internal: Record<'onMouseDown' | 'onMouseOver', (e: MouseEvent, id: NodeId) => void>;;
  dnd: Record<'onDragStart' | 'onDragOver' | 'onDragEnd', Function> ;
}
export const EventContext = React.createContext<EventContext>(null);

export const EventManager: React.FC = ({ children }) => {
  const { nodes, events, query, actions: {add, setNodeEvent, setPlaceholder, move} } = useInternalManager((state) => state);
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
      internal: {
        onMouseDown: debounce((e: MouseEvent, id: NodeId) => {
          setNodeEvent('active', id);
        }, 1),
        onMouseOver: debounce((e: MouseEvent, id: NodeId) => {
          setNodeEvent('hover', id);
        })
      },
      dnd: {
        onDragStart: (e: React.MouseEvent, node: Node | NodeId) => {
          e.stopPropagation();
          if (typeof node === 'string') setNodeEvent('dragging', node);
          draggedNode.current = node;
        },
        onDragOver: (e: React.MouseEvent, id: NodeId) => {
          e.preventDefault();
          e.stopPropagation();
          const { current: start } = draggedNode;
          if (!start) return;
          const dragId = typeof start == 'object' ? start.id : start;

          const getPlaceholder = query.getDropPlaceholder(dragId, id, { x: e.clientX, y: e.clientY });
          if (getPlaceholder) {
            if (typeof start == 'object' && start.id) {
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
    }
  }, []);
 
  return (
    <EventContext.Provider value={handlers}>
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
      {
        children
      }
    </EventContext.Provider>
  )
}