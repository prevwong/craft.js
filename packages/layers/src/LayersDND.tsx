import React, { useEffect, useState, useCallback, useRef, useLayoutEffect, useMemo, useContext } from "react";
import { useManager, isCanvas, NodeId } from "craftjs";
import { useLayer } from "./useLayer";
import { useHandlerGuard } from "craftjs-utils";

export const LayersDNDContext = React.createContext(null);


export const LayersDND: React.FC<any> = ({ children }) => {
    const {layers, events, actions } = useLayer((state) => state);
    const { state, query, actions: { move, setNodeEvent, setPlaceholder } } = useManager((state) => ({state}));
    const {renderPlaceholder} = query.getOptions();
    const [placeholder, setInnerPlaceholder] = useState(null);

    // if ( window ) (window as any).l = state;

    const mutable = useRef<any>({
        layers: null,
        events: {}
    });

    mutable.current = {
        layers,
        events
    }

    const placeholderPosition = useMemo(() => {
        if (placeholder) {
            // console.log(placeholder)
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

        onMouseDown: (e, id) => {
            // setNodeEvent("active", id);
            actions.setLayerEvent("active", id);
        },
        onDragStart: (e: React.MouseEvent, id: string) => {
            e.stopPropagation();
            draggedNode.current = id;
        },
        onMouseOver: (e: React.MouseEvent, id: NodeId) => {
            e.stopPropagation();
            actions.setLayerEvent("hover", id);
        },
        onDragOver: (e, id) => {
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
                const parentHeadingInfo = layers[parent.id].headingDom.getBoundingClientRect(),
                      parentInfo = layers[parent.id].dom.getBoundingClientRect();
                      
                if (!layers[parent.id].dom.querySelector(".craft-layer-node-children")) {
                    if (
                        (isCanvas(parent) && (e.clientY < (parentHeadingInfo.bottom - 5)))
                    ) {
                        if (e.clientY > parentInfo.top + 10 && e.clientY < parentHeadingInfo.bottom - 10) {
                            onCanvas = true;
                            placeholderInfo.placement.currentNode = query.getNode(parent.data.nodes[parent.data.nodes.length - 1]);
                            placeholderInfo.placement.index = parent.data.nodes.length
                            placeholderInfo.placement.where = "after"
                        } else {
                            if (parent.data.parent) {
                                const grandparent = query.getNode(parent.data.parent);
                                if (isCanvas(grandparent)) {
                                    placeholderInfo.placement.parent = grandparent;
                                    placeholderInfo.placement.currentNode = parent;
                                    placeholderInfo.placement.index = grandparent.data.nodes.indexOf(parent.id);
                                    if (e.clientY > parentInfo.bottom - 10) {
                                        placeholderInfo.placement.where = "after";
                                    } else {
                                        placeholderInfo.placement.where = "before";
                                    }
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
        },
        onDragEnd: (e: React.MouseEvent) => {
            e.stopPropagation();
            const events = mutable.current;
            // if (events.placeholder && !events.placeholder.error) {
            //     const { placement } = events.placeholder;
            //     const { parent, index, where } = placement;
            //     const { id: parentId } = parent;

            //     move(draggedNode.current as NodeId, parentId, index + (where === "after" ? 1 : 0));
            // }
            
            draggedNode.current = null;
            setPlaceholder(null);
            setNodeEvent('dragging', null);
        }
        
    })

    const onOver = useCallback((e: React.MouseEvent) => {
       
    }, []);

    useEffect(() => {
        // window.addEventListener("dragover", e => {
        //     e.preventDefault();
        //     const { layers, events } = mutable.current;
        //     const { current: dragId } = draggedNode;

        //     console.log(dragId)
        //     if (!dragId) return;

        //     let target = events.hover.id,
        //         targetNode = query.getNode(target);
        //     console.log(10, events.hover.id);

        // });
    }, []);

    return (
        <LayersDNDContext.Provider value={handlers}>
            {
                placeholder ? React.createElement(renderPlaceholder, {
                    placeholder,
                    suggestedStyles: placeholderPosition
                }) : null
            }
            {children}
        </LayersDNDContext.Provider >
    )
}