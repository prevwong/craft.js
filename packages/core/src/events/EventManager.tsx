import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Node, NodeId, EditorEvents} from "../interfaces";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo, useConnectorHooks, RenderIndicator } from "craftjs-utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { debounce } from "lodash"
import {useHandlerGuard} from "craftjs-utils";

export type EventContext = any;
export const EventContext = React.createContext<EventContext>(null);
export const EventManager: React.FC = ({ children }) => {
    const { enabled, events, query, indicator, actions: { add, setNodeEvent, setIndicator, move } } = useInternalEditor((state) => ({
        events: state.events,
        enabled: state.options.enabled,
        indicator: state.options.indicator
    }));

    const mutable = useRef<EditorEvents>(null);
    mutable.current = events;
    const draggedNode = useRef<Node | NodeId>(null);


    const handlers = useHandlerGuard({
        selectNode: [
            "mousedown", 
            debounce((e: MouseEvent, id: NodeId) => {
                setNodeEvent('active', id);
            }, 1), 
            true
        ],
        hoverNode: [
            "mouseover",
            debounce((e: MouseEvent, id: NodeId) => {
                setNodeEvent('hover', id);
            }, 1),
            true
        ],
        dragNode: [
            "dragstart",
            (e: MouseEvent, node: Node | NodeId) => {
                e.stopPropagation();
                if (typeof node === 'string') setNodeEvent('dragging', node);
                draggedNode.current = node;
            }
        ],
        dragNodeOver: [
            "dragover",
            (e: MouseEvent, id: NodeId) => {
                e.preventDefault();
                e.stopPropagation();
            }
        ],
        dragNodeEnter: [
            "dragenter",
            (e: MouseEvent, id: NodeId) => {
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
                    setIndicator(getPlaceholder)
                }
            }
        ],
        dragNodeEnd: [
            "dragend",
            (e: MouseEvent) => {
                e.stopPropagation();
                const events = mutable.current;
                if (events.indicator && !events.indicator.error) {
                    const { placement } = events.indicator;
                    const { parent, index, where } = placement;
                    const { id: parentId } = parent;

                    move(draggedNode.current as NodeId, parentId, index + (where === "after" ? 1 : 0));
                }

                draggedNode.current = null;
                setIndicator(null);
                setNodeEvent('dragging', null);
            }
        ]
    }, enabled);

    const connectors = useConnectorHooks({ 
        active: [
            handlers.selectNode,
            () => setNodeEvent('active', null)
        ],
        drag: [
            (node, id) => {
                node.setAttribute("draggable", "true");
                handlers.dragNode(node, id);
                handlers.dragNodeEnd(node, id);
            },
            (node, id) => {
                setNodeEvent("dragging", null);
                node.removeAttribute("draggable");
            }
        ],
        hover: [
            handlers.hoverNode,
            () => setNodeEvent("hover", null)
        ],
        create: (node, render) => {
            connectors.drag(node, query.createNode(React.createElement(render.type, render.props)));
        },
        drop: (node, id) => {
            handlers.dragNodeOver(node, id);
            handlers.dragNodeEnter(node, id);
        }
    }, enabled);

    console.log(events.indicator)
    return (
        <EventContext.Provider value={connectors}>
            {
                events.indicator ? (
                    React.createElement(RenderIndicator, {
                        style : {
                            ...movePlaceholder(
                                events.indicator.placement,
                                getDOMInfo(events.indicator.placement.parent.dom),
                                events.indicator.placement.currentNode ? getDOMInfo(events.indicator.placement.currentNode.dom) : null
                            ),
                            backgroundColor: events.indicator.error ? indicator.error : indicator.success,
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
