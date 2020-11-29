import React, { useCallback } from 'react';
import { useNode, useEditor } from '@craftjs/core';

export const connectEditable = (as: React.ElementType) => {
  return React.forwardRef(({ children, ...props }: any, ref: any) => {
    const { id } = useNode();
    const { connectors } = useEditor();

    // Important: ref must be memoized otherwise Slate goes insane
    const refCallback = useCallback((dom) => {
      ref.current = dom;
      connectors.connect(dom, id);
      connectors.drag(dom, id);
    }, []);

    return React.createElement(as, {
      attributes: {
        ref: refCallback,
        ...props,
      },
      children,
    });
  });
};
