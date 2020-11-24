import { NodeElement } from '@craftjs/core';
import { useEditor } from '@craftjs/core';
import React, { useEffect, useMemo } from 'react';

import { SlateNodeHandlers } from './SlateNodeHandlers';

import { SlateNodeContext, useSlateNode } from '../contexts/SlateNodeContext';
import { useSlateRoot } from '../contexts/SlateRootContext';
import { useCaret } from '../caret';
import { createFocusOnNode } from '../utils/createFocusOnNode';

const RenderSlateNode = () => {
  const { element, children } = useSlateNode();
  const { type } = useEditor((state) => ({
    type: state.options.resolver[element.type],
  }));

  return React.createElement(type, {
    children,
    ...element.props,
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
    store,
    exists,
    query,
    connectors: { connect },
  } = useEditor((state) => ({
    exists: !!state.nodes[id],
  }));

  const connectors = useMemo(() => {
    const slateNodeHandlers = new SlateNodeHandlers(store, {
      elementNodeId: id,
      onDomReady: (dom) => {
        attributes.ref.current = dom;
      },
      onFocus: () => {
        const focus = createFocusOnNode(id, query, textProp);

        setCaret(slateNodeId, focus);
      },
    });

    return slateNodeHandlers.connectors();
  }, []);

  // TOOD: There is an issue with Craft's Handlers class which does not work well when a Node is initialised later
  // Requires further investigation. For the time being, we will handle this manually here
  useEffect(() => {
    if (!exists) {
      return;
    }

    if (!attributes.ref.current) {
      return;
    }

    connect(attributes.ref.current, id);
  }, [exists]);

  return (
    <SlateNodeContext.Provider
      value={{
        element,
        children,
        connectors,
      }}
    >
      <NodeElement id={id} render={<RenderSlateNode />} />
    </SlateNodeContext.Provider>
  );
};
