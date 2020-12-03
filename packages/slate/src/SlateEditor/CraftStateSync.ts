import { useEditor, ROOT_NODE } from '@craftjs/core';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import { Editor, Transforms } from 'slate';
import isShallowEqual from 'shallowequal';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';
import { useSlateNode } from '../contexts/SlateNodeContext';
import { getClosestSelectableNodeId } from '../utils/getClosestSelectableNodeId';
import { useCaret } from '../caret';
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
  const { id } = useSlateNode();

  const currentSlateStateRef = useRef<any>(null);
  const lastCraftSelectionRef = useRef<any>(null);

  const { actions, query, slateState, craftSelection } = useEditor(
    (state, query) => ({
      slateState: getSlateStateFromCraft(id, query),
      craftSelection:
        state.nodes[ROOT_NODE].data.custom.caret &&
        state.nodes[ROOT_NODE].data.custom.caret.data.source === id
          ? state.nodes[ROOT_NODE].data.custom.caret
          : null,
    })
  );

  const setSlateState = () => {
    slateEditor.selection = null;

    // Normalize using Slate
    slateEditor.children = slateState;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    currentSlateStateRef.current = slateEditor.children;
    onChange(currentSlateStateRef.current);

    Promise.resolve().then(() => {
      if (!isShallowEqual(lastCraftSelectionRef.current, craftSelection)) {
        if (craftSelection) {
          try {
            const slateRnage = craftSelection.selection;

            const domRange = ReactEditor.toDOMRange(slateEditor, slateRnage);
            if (domRange) {
              // setEnabled(true);
              ReactEditor.focus(slateEditor);
              Transforms.select(slateEditor, slateRnage);
            }
          } catch (err) {
            console.log(err);
          }
        }

        lastCraftSelectionRef.current = craftSelection;
      }
    });
  };

  useLayoutEffect(() => {
    if (isEqual(currentSlateStateRef.current, slateState)) {
      return;
    }

    setSlateState();
  });

  const saveToCraft = (slateState) => {
    const childNodeIds = slateState.map((node) => node['id']) as string[];

    actions.history.throttle(500).setState((state) => {
      slateNodesToCraft(state, slateState, id);

      state.nodes[id].data.nodes = childNodeIds;

      currentSlateStateRef.current = slateState;

      lastCraftSelectionRef.current = {
        data: {
          source: id,
        },
        selection: slateEditor.selection,
      };

      state.nodes[ROOT_NODE].data.custom.caret = lastCraftSelectionRef.current;
    });
  };

  const extendSlateEditor = () => {
    const { apply, onChange } = slateEditor;

    slateEditor.onChange = () => {
      onChange();

      if (slateEditor.operations.every((op) => op.type === 'set_selection')) {
        const closestNodeId = getClosestSelectableNodeId(slateEditor);

        if (
          closestNodeId &&
          query.node(closestNodeId).get() &&
          !query.getEvent('selected').contains(closestNodeId)
        ) {
          actions.selectNode(closestNodeId);
        }
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
  };

  useEffect(() => {
    extendSlateEditor();
  }, []);

  return null;
};
