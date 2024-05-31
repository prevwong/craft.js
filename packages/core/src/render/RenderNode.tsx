import React from 'react';

import { DefaultRender } from './DefaultRender';

import { useInternalEditor } from '../editor/useInternalEditor';

type RenderNodeToElementType = {
  id: string;
  render?: React.ReactElement;
};

export const RenderNodeToElement: React.FC<React.PropsWithChildren<
  RenderNodeToElementType
>> = ({ id, render }) => {
  const { onRender, exists, isNodeHidden } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
    exists: !!state.nodes[id],
    isNodeHidden: state.nodes[id]?.data.hidden ?? false,
  }));

  // don't display the node since it's hidden
  if (!exists || isNodeHidden) {
    return null;
  }

  return React.createElement(onRender, { render: render || <DefaultRender /> });
};
