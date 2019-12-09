import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useManager, isCanvas, NodeId, PlaceholderInfo, isTopLevelCanvas, Node } from "craftjs";
import { useLayerManager } from "../manager/useLayerManager";
import { useHandlerGuard, ROOT_NODE } from "craftjs-utils";
import { LayerState } from "interfaces";
// import { debounce } from "lodash";

export const EventContext = React.createContext(null);

export const EventManager: React.FC<any> = ({ children }) => {
    const { layers, events, actions } = useLayerManager((state) => state);
    const { query, actions: { move, setPlaceholder }, enabled } = useManager((state) => ({enabled: state.options.enabled}));
    const {renderPlaceholder} = query.getOptions();
    const [placeholder, setInnerPlaceholder] = useState<PlaceholderInfo & {
        onCanvas: boolean
    }>(null);

    const dom = useRef<HTMLElement>();
    const mutable = useRef<Omit<LayerState, 'options'> & { placeholder: PlaceholderInfo, currentCanvasHovered?: Node }>({
        layers: null,
        events: null,
        placeholder,
        currentCanvasHovered: null
    });

    mutable.current = {
        layers,
        events,
        placeholder,
        currentCanvasHovered: mutable.current.currentCanvasHovered
    }

    const placeholderPosition = useMemo(() => {
        if (placeholder) {
            const { placement: { where, parent, currentNode } } = placeholder;
            const layerId = currentNode ? currentNode.id : parent.id;
            
            let top;
           
            if (placeholder.onCanvas ) {
                const parentPos = layers[parent.id].dom.getBoundingClientRect();
                const parentHeadingPos = layers[parent.id].headingDom.getBoundingClientRect();
                return  {
                    top: parentHeadingPos.top,
                    left: parentPos.left,
                    width: parentPos.width,
                    height: parentHeadingPos.height,
                    background: 'transparent',
                    borderWidth: '1px',
                }     
            } else {
                if (!layers[layerId]) return;
                const headingPos = layers[layerId].headingDom.getBoundingClientRect();
                const pos = layers[layerId].dom.getBoundingClientRect();

                if (where === "after" || !currentNode) {
                    top = pos.top + pos.height
                } else {
                    top = pos.top;
                }


                return {
                    top,
                    left: headingPos.left,
                    width: pos.width,
                    height: 2
                }

            }
            
        }
    }, [placeholder]);
    
    const draggedNode = useRef<string>(null);
    const handlers = useHandlerGuard({
        onDragStart: [
            "dragstart",
            (e: MouseEvent, id: string) => {
                e.stopPropagation();
                draggedNode.current = id;
            }
        ],
        onMouseOver: [
            "mouseover",
            (e: MouseEvent, id: NodeId) => {
                e.stopPropagation();
                actions.setLayerEvent("hover", id);
            }
        ],
        onDragOver: [
            "dragover",
            (e, id) => {
                e.preventDefault();
                e.stopPropagation();

                const { placeholder, layers, currentCanvasHovered } = mutable.current;
            
                console.log("hovering...")
                if (currentCanvasHovered && placeholder ) {
                    
                    const heading = layers[currentCanvasHovered.id].headingDom.getBoundingClientRect();
                    if ( e.clientY > heading.top + 10 && e.clientY < heading.bottom - 10) {
                        placeholder.placement.currentNode = query.getNode(currentCanvasHovered.data.nodes[currentCanvasHovered.data.nodes.length - 1]);
                        placeholder.placement.index = currentCanvasHovered.data.nodes.length
                        placeholder.placement.where = "after";
                        placeholder.placement.parent = currentCanvasHovered;

                        setInnerPlaceholder({
                           ...placeholder,
                            onCanvas: true
                        })
                    }
                }
            }
        ],
        onDragEnter: [
            "dragenter",
            (e, id) => {
                e.preventDefault();
                e.stopPropagation();
                const { layers, events } = mutable.current;
                const { current: dragId } = draggedNode;

                if (!dragId) return;

                let target = id;

                const placeholderInfo = query.getDropPlaceholder(
                    dragId,
                    target,
                    { x: e.clientX, y: e.clientY },
                    (node) => layers[node.id] && layers[node.id].dom
                );


                
                let onCanvas;
                if (placeholderInfo) {
                    const { placement: { parent } } = placeholderInfo;
                    const parentHeadingInfo = layers[parent.id].headingDom.getBoundingClientRect();

                    mutable.current.currentCanvasHovered = null;
                    if ( isCanvas(parent) ) {
                        if (parent.data.parent) {
                            const grandparent = query.getNode(parent.data.parent);
                            if (isCanvas(grandparent)) {
                                mutable.current.currentCanvasHovered = parent;
                                if ( 
                                    (e.clientY > parentHeadingInfo.bottom - 10 && !layers[parent.id].expanded) || 
                                    (e.clientY < parentHeadingInfo.top + 10)
                                ) {
                                    placeholderInfo.placement.parent = grandparent;
                                    placeholderInfo.placement.currentNode = parent;
                                    placeholderInfo.placement.index = grandparent.data.nodes.indexOf(parent.id);
                                    if (e.clientY > parentHeadingInfo.bottom - 10 && !layers[parent.id].expanded) {
                                        placeholderInfo.placement.where = "after";
                                    } else if (e.clientY < parentHeadingInfo.top + 10) {
                                        placeholderInfo.placement.where = "before";

                                    }
                                }
                            }
                        }
                    }
                    setInnerPlaceholder({
                        ...placeholderInfo,
                        onCanvas
                    })
                }
            }
        ],
        onDragEnd: [
            "dragend",
            (e: MouseEvent) => {
                e.stopPropagation();
                const events = mutable.current;
                if (events.placeholder && !events.placeholder.error) {
                    const { placement } = events.placeholder;
                    const { parent, index, where } = placement;
                    const { id: parentId } = parent;

                    move(draggedNode.current as NodeId, parentId, index + (where === "after" ? 1 : 0));
                }

                draggedNode.current = null;
                setInnerPlaceholder(null);
            }
        ]
        
    }, enabled)

    const onOver = useCallback((e: MouseEvent) => {
        const { layers } = mutable.current;
        if ( layers && layers[ROOT_NODE]) { 
            if (!layers[ROOT_NODE].dom.contains(e.target as HTMLElement)) {
                actions.setLayerEvent('hover', null);
            }
        }
       
    }, []);


    useEffect(() => {
        // if ( mutable.current.layers[ROOT_NODE] )
        window.addEventListener("mouseover", onOver);

        return (() => {
            window.removeEventListener("mouseover", onOver)
        })
    }, []);


    return (
        <EventContext.Provider value={handlers}>
            <div ref={(node) => {
                if ( dom.current ) {

                }
                dom.current = node;
            }}>
                {
                    placeholder ? React.createElement(renderPlaceholder, {
                        placeholder,
                        suggestedStyles: placeholderPosition
                    }) : null
                }
                {children}
            </div>
        </EventContext.Provider >
    )
}