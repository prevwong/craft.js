import React, { useCallback, useRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';

import { useSlateRoot } from '../contexts/SlateRootContext';

export const RenderEditable = React.forwardRef(
  ({ children, ...props }: any, ref: any) => {
    const { renderEditable } = useSlateRoot();
    const { id } = useNode();
    const { connectors } = useEditor();

    // Important: ref must be memoized otherwise Slate goes insane
    const refCallback = useCallback((dom) => {
      ref.current = dom;
      connectors.connect(dom, id);
      connectors.drag(dom, id);
    }, []);

    return renderEditable({
      attributes: {
        ref: refCallback,
        ...props,
      },
      children,
    });
  }
);
