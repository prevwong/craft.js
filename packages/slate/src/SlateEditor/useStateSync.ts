import { useEditor, useNode, ROOT_NODE } from '@craftjs/core';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useEditor as useSlateEditor } from 'slate-react';
import { getClosestSelectableNodeId } from '../utils/getClosestSelectableNodeId';

import { useCaret } from '../caret/useCaret';
import { useSlateRoot } from '../contexts/SlateRootContext';
import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { getFocusFromSlateRange } from '../utils/createFocusOnNode';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';

const getSlateStateFromCraft = (rteNodeId: string, query, textProp: string) => {
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) => craftNodeToSlateNode(query, id, textProp));
};

export const useStateSync = ({ onChange }: any) => {
  const {
    leaf: { textProp },
  } = useSlateRoot();

  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const { setCaret } = useCaret();

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

      const closestNodeId = getClosestSelectableNodeId(slateEditor);

      if (
        closestNodeId &&
        query.node(closestNodeId).get() &&
        !query.getEvent('selected').contains(closestNodeId)
      ) {
        store.actions.selectNode(closestNodeId);
      }

      if (slateEditor.operations.every((op) => op.type === 'set_selection')) {
        const selection = getFocusFromSlateRange(
          slateEditor,
          slateEditor.selection as any
        );

        setCaret(selection, id);
        return;
      }

      currentSlateStateRef.current = slateEditor.children;

      const childNodeIds = slateEditor.children.map(
        (node) => node['id']
      ) as string[];

      store.actions.history.throttle(500).setState((state) => {
        slateNodesToCraft(state, slateEditor.children, id, textProp);

        state.nodes[id].data.nodes = childNodeIds;

        const selection = getFocusFromSlateRange(
          slateEditor,
          slateEditor.selection as any
        );

        state.nodes[ROOT_NODE].data.custom.caret = {
          id,
          selection,
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
