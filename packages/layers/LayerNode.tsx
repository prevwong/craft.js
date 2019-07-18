import React from "react";
import { TreeNode } from "~packages/core";
import styled from "styled-components";


export const LayerNode: React.FC<{node: TreeNode, depth?:number}> = ({node, depth=0}) => {
  const {children, data} = node;
  console.log(node)
  return (
    <LayerNodeDiv depth={depth} className="craft-layer-node">
      <span className='craft-layer-node-heading'>{data.name}</span>
      {
        children && Object.keys(children).length ? Object.keys(children).map(id =>
          <LayerNode key={id} node={children[id]} depth={depth+1} />
        ) : null
      }
    </LayerNodeDiv>
  )
}

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