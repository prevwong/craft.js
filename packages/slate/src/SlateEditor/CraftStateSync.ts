import { useEditor, useNode, ROOT_NODE } from '@craftjs/core';
import throttle from 'lodash/throttle';
import { useCallback, useEffect, useRef } from 'react';
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

  const currentStateId = useRef<number>(null);

  const { store, query, slateState } = useEditor((state, query) => ({
    slateState: state.nodes[id].data.custom.slateState,
  }));

  const setSlateState = useCallback((slateState) => {
    slateEditor.selection = null;

    let newState;

    if (!slateState) {
      newState = getSlateStateFromCraft(id, query);
    } else {
      newState = slateState;
    }

    // Normalize using Slate
    slateEditor.children = newState;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    onChange(newState);
  }, []);

  useEffect(() => {
    if (slateState && currentStateId.current === slateState.stateId) {
      return;
    }

    setSlateState(slateState && slateState.state);
  }, [slateState]);

  const saveToCraft = useCallback(
    throttle((slateState) => {
      console.log('saving to craft');
      const childNodeIds = slateState.map((node) => node['id']) as string[];

      store.actions.setState((state) => {
        slateNodesToCraft(state, slateState, id);

        state.nodes[id].data.nodes = childNodeIds;

        const newStateId = Math.random();
        currentStateId.current = newStateId;

        state.nodes[id].data.custom.slateState = {
          stateId: newStateId,
          state: slateState,
        };

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
    }, 500),
    []
  );

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
