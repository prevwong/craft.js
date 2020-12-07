import { NodeElement } from '@craftjs/core';
import { useEditor } from '@craftjs/core';
import React, { useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useEditor as useSlateEditor } from 'slate-react';

// Given a Slate element, render the element with the corresponding resolver type from craft
const RenderSlateElement = ({
  element,
  attributes,
  children,
  renderElement,
}) => {
  const { type } = useEditor((state) => ({
    type: state.options.resolver[element.type],
  }));

  const props = {
    element,
    children,
    attributes,
  };

  // TODO: improve API
  if (renderElement) {
    return React.createElement(renderElement, {
      type,
      ...props,
    });
  }

  return React.createElement(type, props);
};

export const Element = ({ attributes, children, element, renderElement }) => {
  const elementRef = useRef(element);
  elementRef.current = element;

  const id = element.id;

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
    drag(dom, id);
  }, [exists]);

  return (
    <NodeElement
      id={id}
      render={
        <RenderSlateElement
          renderElement={renderElement}
          element={element}
          attributes={attributes}
          children={children}
        />
      }
    />
  );
};
