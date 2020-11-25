import { useEditor, useNode, ROOT_NODE } from '@craftjs/core';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useEditor as useSlateEditor } from 'slate-react';

import { useSlateRoot } from '../contexts/SlateRootContext';
import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { getFocusFromSlateRange } from '../utils/createFocusOnNode';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';

const getSlateStateFromCraft = (rteNodeId: string, query, textProp: string) => {
  const nodes = query.getState().nodes;
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) =>
    craftNodeToSlateNode(query.node(id).get(), nodes, textProp)
  );
};

export const useStateSync = ({ onChange }: any) => {
  const {
    leaf: { textProp },
  } = useSlateRoot();

  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const currentSlateStateRef = useRef<any>(null);

  const { store, query, slateState } = useEditor((_, query) => ({
    slateState: getSlateStateFromCraft(id, query, textProp),
  }));

  const setSlateState = useCallback(() => {
    slateEditor.selection = null;

    const newState = getSlateStateFromCraft(id, query, textProp);

    currentSlateStateRef.current = newState;

    // Normalize using Slate
    slateEditor.children = newState;
    Editor.normalize(slateEditor, { force: true });
    
    // Then trigger onChange
    onChange(slateEditor.children);
  }, []);

  useEffect(() => {
    const { current: currentSlateState } = currentSlateStateRef;

    if (isEqual(currentSlateState, slateState)) {
      return;
    }

    setSlateState();
  }, [slateState]);

  const extendSlateEditor = useCallback(() => {
    const { apply, onChange } = slateEditor;

    slateEditor.onChange = () => {
      onChange();

      if (
        slateEditor.operations.length === 1 &&
        slateEditor.operations[0].type === 'set_selection'
      ) {
        return;
      }

      const flattened = slateNodesToCraft(
        slateEditor.children,
        id,
        query.getOptions().resolver,
        textProp
      );

      currentSlateStateRef.current = slateEditor.children;

      const childNodeIds = slateEditor.children.map(
        (node) => node['id']
      ) as string[];

      store.actions.history.throttle(500).setState((state) => {
        flattened.forEach((node) => {
          const newNode = store.query.parseFreshNode(node).toNode();

          if (!state.nodes[node.id]) {
            state.nodes[node.id] = newNode;
            return;
          }

          state.nodes[node.id].data = newNode.data;
        });

        state.nodes[id].data.nodes = childNodeIds;

        const focus = getFocusFromSlateRange(
          slateEditor,
          slateEditor.selection as any
        );

        state.nodes[ROOT_NODE].data.custom.caret = {
          id,
          focus,
        };
      });
    };

    slateEditor.apply = (op) => {
      if (op.type === 'set_selection') {
        apply(op);
        return;
      }

      op = applyIdOnOperation(op);
      apply(op);
    };
  }, []);

  useEffect(() => {
    extendSlateEditor();
  }, []);
};
