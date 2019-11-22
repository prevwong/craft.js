import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Node, ManagerState, NodeId } from "../interfaces";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo } from "craftjs-utils";
import { useInternalManager } from "../manager/useInternalManager";
import { debounce } from "lodash"
import { useHandlerGuard } from "./useHandlerGuard";
import { ManagerEvents } from "../../dist/interfaces";

export type EventContext = {
    internal: Record<'onMouseDown' | 'onMouseOver', (e: MouseEvent, id: NodeId) => void>;
    dnd: Record<'onDragStart' | 'onDragOver' | 'onDragEnd', Function>;
}
export const EventContext = React.createContext<EventContext>(null);

export const EventManager: React.FC = ({ children }) => {
    const { enabled, events, renderPlaceholder, query, actions: { add, setNodeEvent, setPlaceholder, move } } = useInternalManager((state) => ({
        renderPlaceholder: state.options.renderPlaceholder,
        events: state.events,
        enabled: state.options.enabled,
    }));

    const mutable = useRef<ManagerEvents>(null);

    mutable.current = events;
    const draggedNode = useRef<Node | NodeId>(null);


    useEffect(() => {
        if (!enabled) {
            setNodeEvent("active", null);
            setNodeEvent("hover", null);
            setNodeEvent("dragging", null);
        }
    }, [enabled]);

    
    const handlers = useHandlerGuard({
         
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
                    const events = mutable.current;
                    if (events.placeholder && !events.placeholder.error) {
                        const { placement } = events.placeholder;
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
    );



    return (
        <EventContext.Provider value={handlers}>
            {
                events.placeholder ? (
                    React.createElement(renderPlaceholder, {
                        placeholder: events.placeholder,
                        suggestedStyles: {
                            ...movePlaceholder(
                                events.placeholder.placement,
                                getDOMInfo(events.placeholder.placement.parent.dom),
                                events.placeholder.placement.currentNode ? getDOMInfo(events.placeholder.placement.currentNode.dom) : null
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
        
   );
}
