import { useEditor } from '@craftjs/core';
import React, { useLayoutEffect } from 'react';

import { useSlateNode } from '../slate/SlateNode';

const DefaultRenderEditable = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>;
};

export const RenderEditable = ({ as, children, attributes }) => {
  const { id: slateNodeId } = useSlateNode();
  const { connectors } = useEditor();

  useLayoutEffect(() => {
    const dom = attributes.ref.current;
    if (!dom) {
      return;
    }

    connectors.connect(dom, slateNodeId);
    connectors.drag(dom, slateNodeId);
  });

  return React.createElement(as || DefaultRenderEditable, {
    attributes,
    children,
  });
};