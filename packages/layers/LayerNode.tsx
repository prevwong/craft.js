import React, { useState } from "react";
import { NodeId } from "~packages/core";
import styled from "styled-components";
import { useManager } from "~packages/core/connectors";
import { useLayer } from "./useLayer";


export const LayerNode: React.FC<{id: NodeId, depth?:number}> = React.memo(({id, depth=0}) => {
  const { data, query } = useManager(state => {
    return {
      data: state.nodes[id] ? state.nodes[id].data : null
    }
  });
  const children = data ? query.getDeepNodes(id, false) : false;
  const {actions} = useLayer();

  const [visible, setVisible] = useState(false);

  return (
    data ? ( 
      <LayerNodeDiv 
        depth={depth}
        className={`craft-layer-node ${id}`}
        ref={(ref) => {
          if ( ref ) {
            actions.setRef(id, 'dom', ref)
            actions.setRef(id, 'headingDom', ref.querySelector('.craft-layer-node-heading'));
          }
        }}
        onMouseDown={(e: React.MouseEvent) => {
          e.stopPropagation();
          actions.setLayerEvent('active', id);
        }}
        onMouseOver={(e: React.MouseEvent) => {
          e.stopPropagation();
          actions.setLayerEvent('hover', id);
        }}
      >
        <span className='craft-layer-node-heading'>
          {data.name}
          {(children && children.length) ? <a onClick={() => setVisible(!visible)}>Toggle</a> : null}
        </span>
        {
          (children && visible) ? children.map(id =>
            <LayerNode key={id} id={id} depth={depth+1} />
          ) : null
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