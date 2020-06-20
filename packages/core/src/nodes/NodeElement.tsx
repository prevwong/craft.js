import React from 'react';
import { NodeProvider } from './NodeContext';
import { RenderNodeToElement } from '../render/RenderNode';
import { NodeId } from '../interfaces';

export type NodeElement = {
  id: NodeId;
};

export const NodeElement: React.FC<NodeElement> = React.memo(({ id }) => {
  return (
    <NodeProvider id={id}>
      <RenderNodeToElement />
    </NodeProvider>
  );
});
