import React from 'react';

import { NodeProvider } from './NodeContext';

import { useEditor } from '../hooks';
import { NodeId } from '../interfaces';
import { RenderNodeToElement } from '../render/RenderNode';

export type NodeElementProps = {
  id: NodeId;
  render?: React.ReactElement;
};

export const NodeElement: React.FC<React.PropsWithChildren<
  NodeElementProps
>> = ({ id, render }) => {
  const { exists } = useEditor((state) => ({
    exists: !!state.node(id),
  }));

  if (!exists) {
    return null;
  }

  return (
    <NodeProvider id={id}>
      <RenderNodeToElement render={render} />
    </NodeProvider>
  );
};
