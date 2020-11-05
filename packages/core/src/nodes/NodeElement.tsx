import React from 'react';

import { NodeProvider } from './NodeContext';

import { NodeId } from '../interfaces';
import { RenderNodeToElement } from '../render/RenderNode';

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
