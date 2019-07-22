import React, { useEffect, useState, useCallback, useRef, useLayoutEffect, useMemo } from "react";
import { useManager } from "~packages/core/connectors";
import { RenderPlaceholder } from "~packages/core/render/RenderPlaceholder";
import { isCanvas } from "~packages/core";
import { useLayer } from "./useLayer";

export const LayersDND: React.FC<any> = ({ children }) => {
    const {layers, events} = useLayer((state) => state);

    const { query, actions: { move, setNodeEvent, setPlaceholder }, placeholder, options: { renderPlaceholder } } = useManager((state) => ({ placeholder: state.events.placeholder }));
    const [isMousePressed, setMousePressed] = useState(false);
    const mutable = useRef({
        layers: null,
        events: { hover: null, active: null, dragging: null },
        placeholder: null,
        onCanvas: false
    });

    mutable.current = {
        layers,
        events,
        placeholder,
        onCanvas: mutable.current.onCanvas
    }

    const blockSelection = useCallback(() => {
        // Element being dragged
        const selection = window.getSelection ? window.getSelection() : (document as any).selection ? (document as any).selection : null;
        if (!!selection) {
            selection.empty ? selection.empty() : selection.removeAllRanges();
        }
    }, []);

    const onDrag = useCallback((e: MouseEvent) => {
        const { events, layers } = mutable.current;
        setNodeEvent('hover', events.hover.id);

        let target = events.hover.id;
        const hoverInfo = events.hover.dom.getBoundingClientRect();
        if (e.clientY > hoverInfo.bottom - 5 && events.hover.data.parent ) {
            const targetParent = query.getNode(events.hover.data.parent);
            if ( targetParent.data.nodes.indexOf(target) === targetParent.data.nodes.length - 1 ) {
                target = targetParent.data.parent ? targetParent.id : targetParent.data.closestParent;
            }
        } 

        const placeholderInfo = query.getDropPlaceholder(
            events.active.id,
            target,
            { x: e.clientX, y: e.clientY },
            (node) => layers[node.id] && layers[node.id].dom
        );
        if (placeholderInfo) {
            blockSelection();
            setNodeEvent('dragging', events.active.id);
            const { placement: {parent}, node } = placeholderInfo;
            const parentInfo = layers[parent.id].headingDom.getBoundingClientRect();
            if (
                (isCanvas(parent) && (e.clientY < (parentInfo.bottom - 5)))

            ) {
                mutable.current.onCanvas = true;
                placeholderInfo.node = query.getNode(parent.data.nodes[parent.data.nodes.length - 1]);
                placeholderInfo.placement.index = parent.data.nodes.length
                placeholderInfo.placement.where = "after"
            } else {
                mutable.current.onCanvas = false;
            }
 
            setPlaceholder(placeholderInfo)
        }
    }, []);

    const onMouseUp = useCallback((e: MouseEvent) => {
        const { events, placeholder } = mutable.current;
        setMousePressed(false);
        setNodeEvent("dragging", null);

        if (placeholder && !placeholder.error) {
            const { id: dragId } = events.active;
            const { placement } = placeholder;
            const { parent, index, where } = placement;
            const { id: parentId, nodes } = parent;

            move(dragId, parentId, index + (where === "after" ? 1 : 0));
        }
        setPlaceholder(null);
    }, []);

    useLayoutEffect(() => {
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
        if (events.active) setNodeEvent('selected', events.active.id)
        // if (events.active) console.log(events.active,query.getNode(events.active.id))
        if (events.active && query.getNode(events.active.id).data.parent) setMousePressed(true);
    }, [events.active]);

    const placeholderPosition = useMemo(() => {
        if (placeholder) {
            const { node: closestNode, placement: { where, parent } } = placeholder;
            const layerId = closestNode ? closestNode.id : parent.id;
            let top;
            if ( mutable.current.onCanvas ) {
                const parentPos = layers[parent.id].dom.getBoundingClientRect();
                const parentHeadingPos = layers[parent.id].headingDom.getBoundingClientRect();
                return {
                    top: parentHeadingPos.top,
                    left: parentPos.left,
                    width: parentPos.width,
                    height: parentHeadingPos.height,
                    background: 'transparent',
                    borderWidth: '1px',
                }     
            } else {
                const headingPos = layers[layerId].headingDom.getBoundingClientRect();
                const pos = layers[layerId].dom.getBoundingClientRect();

                if (where === "after" || !closestNode) {
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

    return (
        <React.Fragment>
            {
                placeholder ? React.createElement(renderPlaceholder, {
                    placeholder,
                    suggestedStyles: placeholderPosition
                }) : null
            }
            
        </React.Fragment>
    )
}