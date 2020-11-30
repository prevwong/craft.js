import { NodeElement } from '@craftjs/core';
import { useEditor } from '@craftjs/core';
import React, { useCallback, useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useEditor as useSlateEditor } from 'slate-react';

import { useSlateNode } from '../contexts/SlateNodeContext';
import { useCaret } from '../caret';
import { createSelectionOnNode } from '../utils/createSelectionOnNode';

const RenderSlateNode = (props: any) => {
  const { element, attributes, children } = props;

  const { type } = useEditor((state) => ({
    type: state.options.resolver[element.type],
  }));

  return React.createElement(type, {
    element,
    children,
    attributes: {
      ...attributes,
      tabIndex: 0,
    },
  });
};

export const Element = ({ attributes, children, element }) => {
  const elementRef = useRef(element);
  elementRef.current = element;

  const id = element.id;
  const { id: slateNodeId } = useSlateNode();
  const { setCaret } = useCaret();

  const {
    exists,
    query,
    connectors: { connect, drag },
  } = useEditor((state) => ({
    exists: !!state.nodes[id],
  }));

  const slateEditor = useSlateEditor();

  const enable = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const selection = createSelectionOnNode(elementRef.current);
    setCaret(selection, slateNodeId);
  }, []);

  useEffect(() => {
    // If the current element is an inline element (ie: a link)
    // Then we don't need to add craft connectors
    if (Editor.isInline(slateEditor, element)) {
      return;
    }

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
