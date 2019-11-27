import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { NodeId } from "craftjs";
import styled from "styled-components";
import { useManager } from "craftjs";
import { useLayer } from "./useLayer";
import { LayersDNDContext } from "./LayersDND";
import { wrapConnectorHooks } from "craftjs-utils"

export const LayerNode: React.FC<{id: NodeId, depth?:number}> = React.memo(({id, depth=0}) => {
  const { data, query, shouldBeExpanded } = useManager((state, query) => ({
    data: state.nodes[id] && state.nodes[id].data,
    shouldBeExpanded: state.events.active && query.getAllParents(state.events.active).includes(id)
  }));

  const children = data ? query.getDeepNodes(id, false) : false;
  const { actions, expanded, renderLayerNode } = useLayer((state) => ({
    expanded: state.layers[id] && state.layers[id].expanded,
    renderLayerNode: state.options.renderLayerNode
  }));

  const expandedRef = useRef<boolean>(expanded);
  expandedRef.current = expanded;

  useEffect(() => {
    if (!expandedRef.current && shouldBeExpanded ) {
      actions.toggleLayer(id);
    }
  }, [shouldBeExpanded])
    
  const handlers = useContext(LayersDNDContext);
  const currentNode = useRef<HTMLElement>();
  const dragNode = useRef<HTMLElement>();
  const toggleNode = useRef<HTMLElement>();

  const event = useMemo(() => ({
    onMouseDown : (e) => handlers.onMouseDown(e, id),
    onMouseOver: (e) => handlers.onMouseOver(e, id),
    onDragStart: (e) => handlers.onDragStart(e, id),
    onDragOver: (e) => handlers.onDragOver(e, id),
    onDragEnd: (e: MouseEvent) => handlers.onDragEnd(e),
    onToggle: (e) => {
      e.stopPropagation();
      actions.toggleLayer(id);
    }
  }), []);

  const connectors = wrapConnectorHooks({
    connectDrag: (node) => {
      if (node && dragNode.current !== node) {
        if (dragNode.current) {
          dragNode.current.removeEventListener('dragstart', event.onDragStart);
        }
        node.addEventListener('dragstart', event.onDragStart);
        dragNode.current = node;
      }
    },
    connectToggle: (!children || !children.length) ? null : (node, t) => {
      if (node && toggleNode.current !== node) {     
        if (toggleNode.current) {
          toggleNode.current.removeEventListener('dragstart', event.onDragStart);
        }
        node.addEventListener('mousedown', event.onToggle);
        toggleNode.current = node;
      }
    }
  }) as any;


  return (
    data ? ( 
      <LayerNodeDiv 
        depth={depth}
        className={`craft-layer-node ${id}`}
        draggable={true}
        ref={(node) => {
          if (node) {
            actions.setRef(id, 'dom', node)
            actions.setRef(id, 'headingDom', node.querySelector('.craft-layer-node-heading'));
            if (currentNode.current) {
              currentNode.current.removeEventListener('mousedown', event.onMouseDown);
              currentNode.current.removeEventListener('mouseover', event.onMouseOver);
              currentNode.current.removeEventListener('dragover', event.onMouseOver);
              currentNode.current.removeEventListener('dragend', event.onMouseOver);
              currentNode.current.removeEventListener('dragstart', event.onDragStart);
            }
            node.addEventListener('mousedown', event.onMouseDown);
            node.addEventListener('mouseover', event.onMouseOver);
            node.addEventListener('dragover', event.onDragOver);
            node.addEventListener('dragend', event.onDragEnd);
            node.addEventListener('dragstart', event.onDragStart);
            currentNode.current = node;
          }
        }}
      >
        <span 
          className='craft-layer-node-heading'
        >
          {React.createElement(renderLayerNode, {
            id,
            ...connectors
          })}
        </span>
        {
          (children && expanded) ? (
            <div className="craft-layer-node-children">
             {
                children.map(id =>
                  <LayerNode key={id} id={id} depth={depth + 1} />
                )
             }
            </div>
          ): null
        }
      </LayerNodeDiv>
    ): null
  );
})

const LayerNodeDiv = styled.div<{depth: number}>`
  border-top: 1px solid #ddd;
  display:block;
  > .craft-layer-node-heading {
    margin-left: ${props => props.depth * 10}px;
    padding: 10px 0;
    display:block;
  }
  
  > .craft-layer-node:last-child {
    border-bottom: 1px solid #ddd;
    margin-bottom:-1px;
  }
`