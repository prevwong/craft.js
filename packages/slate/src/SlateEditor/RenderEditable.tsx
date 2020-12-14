import { useSlateNode } from './SlateNodeContext';
import React, { createContext, useContext, useEffect } from 'react';
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

    useEffect(() => {
      const dom = ref.current;
      if (!dom) {
        return;
      }

      connectors.connect(dom, slateNodeId);
      connectors.drag(dom, slateNodeId);
    }, []);

    return React.createElement(as, {
      attributes: {
        ...props,
        ref,
      },
      children,
    });
  }
);
