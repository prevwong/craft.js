import { NodeElement } from '@craftjs/core';
import { useEditor } from '@craftjs/core';
import React, { useCallback, useEffect } from 'react';

import { useSlateRoot } from '../contexts/SlateRootContext';
import { useCaret } from '../caret';
import { createFocusOnNode } from '../utils/createFocusOnNode';

const RenderSlateNode = (props: any) => {
  const { element, attributes, children } = props;

  const { type } = useEditor((state) => ({
    type: state.options.resolver[element.type],
  }));

  return React.createElement(type, {
    element,
    children,
    attributes,
  });
};

export const Element = ({ attributes, children, element }) => {
  const id = element.id;
  const {
    id: slateNodeId,
    leaf: { textProp },
  } = useSlateRoot();
  const { setCaret } = useCaret();

  const {
    exists,
    query,
    connectors: { connect, drag },
  } = useEditor((state) => ({
    exists: !!state.nodes[id],
  }));

  const enable = useCallback(() => {
    const focus = createFocusOnNode(id, query, textProp);
    setCaret(focus, slateNodeId);
  }, []);

  useEffect(() => {
    if (!exists) {
      return;
    }

    const dom = attributes.ref.current;

    if (!dom) {
      return;
    }

    connect(dom, id);
    drag(dom, id);

    dom.addEventListener('dblclick', enable);
    return () => dom.removeEventListener('dblclick', enable);
  }, [exists]);

  return (
    <NodeElement
      id={id}
      render={
        <RenderSlateNode
          element={element}
          attributes={attributes}
          children={children}
        />
      }
    />
  );
};
