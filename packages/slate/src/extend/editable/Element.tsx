import { NodeElement, useEditor } from '@craftjs/core';
import React, { useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useEditor as useSlateEditor } from 'slate-react';

import { useSlateNode } from '../slate';

// Given a Slate element, render the element with the corresponding resolver type from craft
const RenderSlateElement = ({
  element,
  attributes,
  children,
  renderElement,
  drag,
}) => {
  const { type } = useEditor((state) => ({
    type: state.options.resolver[element.type],
  }));

  const render = React.createElement(type, {
    element,
    children,
    attributes,
    drag,
  });

  if (renderElement) {
    return React.createElement(renderElement, {
      render,
      element,
      attributes,
      drag,
    });
  }

  return render;
};

export const Element = ({ attributes, children, element, renderElement }) => {
  const elementRef = useRef(element);
  elementRef.current = element;

  const id = element.id;

  const { enabled } = useSlateNode();

  const {
    exists,
    connectors: { connect, drag },
  } = useEditor((state) => {
    return {
      exists: id && !!state.nodes[id],
    };
  });

  const slateEditor = useSlateEditor();

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

    if (!enabled) {
      dom.setAttribute('contenteditable', false);
    } else {
      dom.removeAttribute('contenteditable');
    }
  });

  return (
    <NodeElement
      id={id}
      render={
        <RenderSlateElement
          renderElement={renderElement}
          element={element}
          attributes={attributes}
          children={children}
          drag={(dom) => {
            if (!exists) {
              return;
            }

            drag(dom, id);
          }}
        />
      }
    />
  );
};
