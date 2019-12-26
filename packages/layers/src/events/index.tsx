import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useEditor, isCanvas, NodeId, Indicator, isTopLevelCanvas, Node } from "@craftjs/core";
import { useLayerManager } from "../manager/useLayerManager";
import { useHandlerGuard, ROOT_NODE, RenderIndicator } from "@craftjs/utils";
import { LayerState } from "../interfaces";
// import { debounce } from "lodash";

export const EventContext = React.createContext(null);

export const EventManager: React.FC<any> = ({ children }) => {
    const { layers, events, actions } = useLayerManager((state) => state);
    const { query, actions: { move }, enabled } = useEditor((state) => ({enabled: state.options.enabled}));
    const { indicator: indicatorStyles } = query.getOptions();
    const [indicator, setInnerIndicator] = useState<Indicator & {
        onCanvas: boolean
    }>(null);

    const dom = useRef<HTMLElement>();
    const mutable = useRef<Omit<LayerState, 'options'> & { indicator: Indicator, currentCanvasHovered?: Node }>({
        layers: null,
        events: null,
        indicator,
        currentCanvasHovered: null
    });

    mutable.current = {
        layers,
        events,
        indicator,
        currentCanvasHovered: mutable.current.currentCanvasHovered
    }

    const indicatorPosition = useMemo(() => {
        if (indicator) {
            const { placement: { where, parent, currentNode }, error } = indicator;
            const layerId = currentNode ? currentNode.id : parent.id;
            
            let top;
            const color = error ? indicatorStyles.error : indicatorStyles.success;

            if (indicator.onCanvas ) {
                const parentPos = layers[parent.id].dom.getBoundingClientRect();
                const parentHeadingPos = layers[parent.id].headingDom.getBoundingClientRect();
                return  {
                    top: parentHeadingPos.top,
                    left: parentPos.left,
                    width: parentPos.width,
                    height: parentHeadingPos.height,
                    background: 'transparent',
                    borderWidth: '1px',
                    borderColor: color
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
                    height: 2,
                    borderWidth:0,
                    background: color
                }

            }
            
        }
    }, [indicator]);
    
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
                actions.setLayerEvent("hovered", id);
            }
        ],
        onDragOver: [
            "dragover",
            (e, id) => {
                e.preventDefault();
                e.stopPropagation();

                const { indicator, layers, currentCanvasHovered } = mutable.current;
            
                if (currentCanvasHovered && indicator ) {
                    
                    const heading = layers[currentCanvasHovered.id].headingDom.getBoundingClientRect();
                    if ( e.clientY > heading.top + 10 && e.clientY < heading.bottom - 10) {
                        indicator.placement.currentNode = query.getNode(currentCanvasHovered.data.nodes[currentCanvasHovered.data.nodes.length - 1]);
                        indicator.placement.index = currentCanvasHovered.data.nodes.length
                        indicator.placement.where = "after";
                        indicator.placement.parent = currentCanvasHovered;

                        setInnerIndicator({
                           ...indicator,
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

                const indicatorInfo = query.getDropPlaceholder(
                    dragId,
                    target,
                    { x: e.clientX, y: e.clientY },
                    (node) => layers[node.id] && layers[node.id].dom
                );


                
                let onCanvas;
                if (indicatorInfo) {
                    const { placement: { parent } } = indicatorInfo;
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
                                    indicatorInfo.placement.parent = grandparent;
                                    indicatorInfo.placement.currentNode = parent;
                                    indicatorInfo.placement.index = grandparent.data.nodes.indexOf(parent.id);
                                    if (e.clientY > parentHeadingInfo.bottom - 10 && !layers[parent.id].expanded) {
                                        indicatorInfo.placement.where = "after";
                                    } else if (e.clientY < parentHeadingInfo.top + 10) {
                                        indicatorInfo.placement.where = "before";

                                    }
                                }
                            }
                        }
                    }
                    setInnerIndicator({
                        ...indicatorInfo,
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
                if (events.indicator && !events.indicator.error) {
                    const { placement } = events.indicator;
                    const { parent, index, where } = placement;
                    const { id: parentId } = parent;

                    move(draggedNode.current as NodeId, parentId, index + (where === "after" ? 1 : 0));
                }

                draggedNode.current = null;
                setInnerIndicator(null);
            }
        ]
        
    }, enabled)

    const onOver = useCallback((e: MouseEvent) => {
        const { layers } = mutable.current;
        if ( layers && layers[ROOT_NODE]) { 
            if (!layers[ROOT_NODE].dom.contains(e.target as HTMLElement)) {
                actions.setLayerEvent('hovered', null);
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
                    indicator ? React.createElement(RenderIndicator, {
                        style: indicatorPosition
                    }) : null
                }
                {children}
            </div>
        </EventContext.Provider >
    )
}