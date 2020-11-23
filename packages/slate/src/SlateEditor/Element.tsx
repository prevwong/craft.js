import React, { useRef, useCallback, useEffect } from 'react';
import { useEditor, useNode, NodeProvider } from '@craftjs/core';
import { createFocusOnNode } from '../utils/createFocusOnNode';
import { useFocus } from '../focus';

export const Element = ({
  attributes: { ref, ...attributes },
  children,
  element,
}) => {
  const { id } = useNode();
  const { exists, connectors, query } = useEditor((state) => ({
    exists: !!state.nodes[element.id],
  }));
  const domRef = useRef<HTMLElement>();
  const { setFocus } = useFocus();

  const connect = useCallback(() => {
    if (!exists) {
      return;
    }

    connectors.connect(domRef.current, element.id);
    connectors.drag(domRef.current, element.id);
  }, [exists]);

  const enable = useCallback((e) => {
    e.stopPropagation();
    const focus = createFocusOnNode(element.id, query);
    setFocus(id, focus);
  }, []);

  useEffect(() => {
    if (!exists) {
      return;
    }

    if (!domRef.current) {
      return;
    }

    connect();
    domRef.current.addEventListener('dblclick', enable);

    return () => domRef.current.removeEventListener('dblclick', enable);
  }, [exists]);

  const refCallback = useCallback((dom: any) => {
    // eslint-disable-next-line no-param-reassign
    ref.current = dom;
    domRef.current = dom;
    connect();
  }, []);

  switch (element.type) {
    case 'Typography': {
      return React.createElement(element.props.variant, {
        ...attributes,
        children,
        ref: refCallback,
      });
    }
    case 'List': {
      return React.createElement('ul', {
        ...attributes,
        children,
        ref: refCallback,
      });
    }
    case 'ListItem': {
      return React.createElement('li', {
        ...attributes,
        children,
        ref: refCallback,
      });
    }
    default:
      return null;
  }
};
