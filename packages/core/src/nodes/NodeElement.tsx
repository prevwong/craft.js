import React from 'react';

import { NodeProvider } from './NodeContext';

import { NodeId } from '../interfaces';
import { RenderNodeToElement } from '../render/RenderNode';

export type NodeElementProps = {
  id: NodeId;
  render?: React.ReactElement;
};

export const NodeElement: React.FC<NodeElementProps> = ({ id, render }) => {
  return (
    <NodeProvider id={id}>
      <RenderNodeToElement render={render} />
    </NodeProvider>
  );
};
