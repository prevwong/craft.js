import { useEditor, useNode, ROOT_NODE } from '@craftjs/core';
import { useCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import { Editor, Transforms } from 'slate';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { getFocusFromSlateRange } from '../utils/createSelectionOnNode';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';
import { useSlateNode } from '../contexts/SlateNodeContext';
import { getSlateRange } from '../utils/getSlateRange';
import { ReactEditor } from 'slate-react';

const getSlateStateFromCraft = (rteNodeId: string, query) => {
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) => craftNodeToSlateNode(query, id));
};

export const CraftStateSync = ({ editor: slateEditor, onChange }: any) => {
  const { id } = useNode();
  const { setEnabled } = useSlateNode();

  const currentSlateStateRef = useRef<any>(null);

  const { store, slateState, query } = useEditor((_, query) => ({
    slateState: getSlateStateFromCraft(id, query),
  }));

  const setSlateState = (slateState) => {
    slateEditor.selection = null;

    currentSlateStateRef.current = slateState;

    // Normalize using Slate
    slateEditor.children = slateState;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    onChange(slateEditor.children);

    // TODO: try to move this to useSelectionSync
    Promise.resolve().then(() => {
      const caret = query.node(ROOT_NODE).get().data.custom.caret;
      if (!caret) {
        return;
      }

      // TODO Prev: this should return ?Range
      // but TS is not checking if its safe to access for some reason
      const newSelection = getSlateRange(slateEditor, caret.selection);

      if (!newSelection || !newSelection.anchor || !newSelection.focus) {
        return;
      }

      try {
        const domRange = ReactEditor.toDOMRange(slateEditor, newSelection);
        if (domRange) {
          setEnabled(true);
          ReactEditor.focus(slateEditor);
          Transforms.select(slateEditor, newSelection);
        }
      } catch (err) {}
    });
  };

  useEffect(() => {
    if (isEqual(currentSlateStateRef.current, slateState)) {
      return;
    }

    setSlateState(slateState);
  }, [slateState]);

  const saveToCraft = useCallback((slateState) => {
    const childNodeIds = slateState.map((node) => node['id']) as string[];

    store.actions.history.throttle(500).setState((state) => {
      slateNodesToCraft(state, slateState, id);

      state.nodes[id].data.nodes = childNodeIds;

      currentSlateStateRef.current = slateState;

      const selection = getFocusFromSlateRange(
        slateEditor,
        slateEditor.selection as any
      );

      state.nodes[ROOT_NODE].data.custom.caret = {
        data: {
          source: id,
        },
        selection,
      };
    });
  }, []);

  const extendSlateEditor = useCallback(() => {
    const { apply, onChange } = slateEditor;

    slateEditor.onChange = () => {
      onChange();

      if (slateEditor.operations.every((op) => op.type === 'set_selection')) {
        return;
      }

      saveToCraft(slateEditor.children);
    };

    slateEditor.apply = (op) => {
      if (op.type === 'set_selection') {
        apply(op);

        if (!op.newProperties) {
          setEnabled(false);
        }

        return;
      }

      op = applyIdOnOperation(op);
      apply(op);
    };
  }, []);

  useEffect(() => {
    extendSlateEditor();
  }, []);

  return null;
};
