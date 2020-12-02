import { useSlateNode } from '../contexts/SlateNodeContext';
import React, { createContext, useContext, useCallback } from 'react';
import { useEditor } from '@craftjs/core';

export const EditableContext = createContext<any>(null);

export const DefaultRenderEditable = ({ attributes, children }) => {
  return <div {...attributes}>{children}</div>;
};

export const RenderEditable = React.forwardRef(
  ({ children, ...props }, ref: any) => {
    const { id: slateNodeId } = useSlateNode();
    const { connectors } = useEditor();

    const { as } = useContext(EditableContext);

    // Important: ref must be memoized otherwise Slate goes insane
    const refCallback = useCallback((dom) => {
      ref.current = dom;
      connectors.connect(dom, slateNodeId);
      connectors.drag(dom, slateNodeId);
    }, []);

    return React.createElement(as, {
      attributes: {
        ...props,
        ref: refCallback,
      },
      children,
    });
  }
);
