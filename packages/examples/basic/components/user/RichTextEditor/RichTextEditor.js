import { useNode, useEditor } from '@craftjs/core';
import {
  Slate,
  Editable,
  useSlateElement,
  createSelectionOnNode,
} from '@craftjs/slate';
import React, { useMemo, useCallback, useEffect } from 'react';
import { compose } from 'redux';
import { createEditor } from 'slate';
import { SelectionManager } from './SelectionManager';

import plugins from './plugins';
import { useFocus } from '../../Focus';

const Element = ({ element, render }) => {
  const { setFocus } = useFocus();
  const { dom } = useNode((node) => ({
    dom: node.dom,
  }));

  const enable = useCallback((e) => {
    e.stopPropagation();
    const selection = createSelectionOnNode(element);
    setFocus(selection);
  }, []);

  useEffect(() => {
    if (!dom) {
      return;
    }

    dom.addEventListener('dblclick', enable);
    return () => dom.removeEventListener('dblclick', enable);
  }, [dom]);

  return render;
};

const CraftWrapper = ({ attributes: { ref, ...attributes }, children }) => {
  const refCallback = useCallback((dom) => {
    console.log(33, dom);
    ref(dom);
  }, []);

  return (
    <div
      {...attributes}
      ref={(dom) => {
        if (!dom) {
          return;
        }

        ref.current = dom;
        // ref.current = dom;
      }}
    >
      {children}
    </div>
  );
};

export const RichTextEditor = () => {
  const editor = useMemo(() => compose(...plugins)(createEditor()), []);
  const renderElement = useCallback((props) => <Element {...props} />);

  return (
    <Slate editor={editor}>
      <Editable renderElement={renderElement} as={CraftWrapper} />
      <SelectionManager />
    </Slate>
  );
};

RichTextEditor.craft = {
  isCanvas: true,
};
