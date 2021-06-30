import React from 'react';

import { DefaultRender } from './DefaultRender';

import { useInternalEditor } from '../editor/useInternalEditor';
import { useInternalNode } from '../nodes/useInternalNode';

type RenderNodeToElementType = {
  render?: React.ReactElement;
};
export const RenderNodeToElement: React.FC<RenderNodeToElementType> = ({
  render,
}) => {
  const { hidden } = useInternalNode((node) => ({
    hidden: node.data.hidden,
  }));

  const { store } = useInternalEditor();

  // don't display the node since it's hidden
  if (hidden) {
    return null;
  }

  return React.createElement(store.config.onRender, {
    render: render || <DefaultRender />,
  });
};
