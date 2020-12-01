import { useEditor, useNode, ROOT_NODE } from '@craftjs/core';
import { useCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import { Editor } from 'slate';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { getFocusFromSlateRange } from '../utils/createSelectionOnNode';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';

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

  const currentSlateStateRef = useRef<any>(null);

  const { store, slateState } = useEditor((_, query) => ({
    slateState: getSlateStateFromCraft(id, query),
  }));

  const setSlateState = useCallback((slateState) => {
    slateEditor.selection = null;

    // if (!slateState) {
    //   newState = getSlateStateFromCraft(id, query);
    // } else {
    //   newState = slateState;
    // }

    currentSlateStateRef.current = slateState;

    // Normalize using Slate
    slateEditor.children = slateState;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    onChange(slateEditor.children);
  }, []);

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

      // (optimisation) Since we already have the Slate state
      // We will store the slate state in the Node
      // So we don't have to re-transform the Node back into a Slate format
      // state.nodes[id].data.custom.slateState = {
      //   stateId: newStateId,
      //   state: slateState,
      // };

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
