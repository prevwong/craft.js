import { useEditor, ROOT_NODE, useNode } from '@craftjs/core';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { Editor, Transforms } from 'slate';
import isShallowEqual from 'shallowequal';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';
import { SlateNodeContextProvider } from '../contexts/SlateNodeContext';
import { getClosestSelectableNodeId } from '../utils/getClosestSelectableNodeId';
import { ReactEditor, useSlate } from 'slate-react';
import { getSlateRange } from '../utils/getSlateRange';
import { getFocusFromSlateRange } from '../utils/createSelectionOnNode';

const getSlateStateFromCraft = (rteNodeId: string, query) => {
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) => craftNodeToSlateNode(query, id));
};

export const CraftStateSync = ({ onChange, children }: any) => {
  const { id } = useNode();
  const [enabled, setEnabled] = useState(false);
  const slateEditor = useSlate();

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
        selection: getFocusFromSlateRange(
          slateEditor,
          slateEditor.selection as any
        ),
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

  // Sync selection
  useEffect(() => {
    Promise.resolve().then(() => {
      if (!isShallowEqual(lastCraftSelectionRef.current, craftSelection)) {
        if (craftSelection) {
          try {
            const craftRange = craftSelection.selection;

            // TODO Prev: this should return ?Range
            // but TS is not checking if its safe to access for some reason
            const newSelection = getSlateRange(slateEditor, craftRange);

            if (!newSelection || !newSelection.anchor || !newSelection.focus) {
              return;
            }

            const domRange = ReactEditor.toDOMRange(slateEditor, newSelection);
            if (domRange) {
              setEnabled(true);
              ReactEditor.focus(slateEditor);
              Transforms.select(slateEditor, newSelection);
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          ReactEditor.deselect(slateEditor);
          setEnabled(false);
        }
      }
    });
  }, [craftSelection]);

  return (
    <SlateNodeContextProvider enabled={enabled}>
      {children}
    </SlateNodeContextProvider>
  );
};
