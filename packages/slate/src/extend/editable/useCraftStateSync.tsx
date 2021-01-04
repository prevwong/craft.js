/* eslint-disable react-hooks/exhaustive-deps */
import { useEditor } from '@craftjs/core';
import isEqual from 'lodash/isEqual';
import { useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

import { applyIdOnOperation } from '../../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../../utils/formats';
import { useSlateSetupContext } from '../SlateSetupProvider';
import { useSlateNode } from '../slate/SlateNode';

const getSlateStateFromCraft = (rteNodeId: string, query) => {
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) => craftNodeToSlateNode(query, id));
};

export const useCraftStateSync = () => {
  const rteResolvers = useSlateSetupContext();
  const { id, actions: slateActions } = useSlateNode();
  const slateEditor = useSlate();
  const slateSelection = slateEditor.selection;

  const slateStateRef = useRef<any>(null);
  const craftSelectionRef = useRef(null);
  const slateSelectionRef = useRef(null);

  const { actions, craftSlateState } = useEditor((state, query) => ({
    craftSlateState: getSlateStateFromCraft(id, query),
  }));

  const { craftSelection } = useEditor((state) => ({
    craftSelection: state.nodes[id].data.custom.selection || null,
  }));

  slateSelectionRef.current = slateSelection;

  // When slate children changes in Craft's state
  useEffect(() => {
    if (!craftSlateState) {
      return;
    }

    // If the state is the same with the current slate state, do nothing
    // We could probably find a way to do this without deep-equal; but that's a problem for another time!
    if (isEqual(slateStateRef.current, craftSlateState)) {
      return;
    }

    // Otherwise, force update the slate state
    // This only occurs in 3 scenarios: (on page load, undo and redo)
    slateEditor.selection = null;
    slateEditor.children = craftSlateState;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    slateStateRef.current = slateEditor.children;
    slateActions.setEditorValue(slateStateRef.current);
  }, [craftSlateState]);

  useEffect(() => {
    const { current: currentSlateSelection } = slateSelectionRef;
    craftSelectionRef.current = craftSelection;

    if (isEqual(craftSelection, currentSlateSelection)) {
      return;
    }

    slateActions.setSelection(craftSelection);
  }, [craftSelection]);

  // When slateSelection becomes null, make sure to reflect it in the Slate node
  useEffect(() => {
    if (!!slateSelection) {
      return;
    }

    if (!craftSelectionRef.current) {
      return;
    }

    actions.history.ignore().setState((state) => {
      state.nodes[id].data.custom.selection = null;
    });
  }, [slateSelection]);

  useEffect(() => {
    const { apply, onChange } = slateEditor;

    slateEditor.onChange = () => {
      onChange();

      // Don't update Craft state if only selection operations had been performed
      if (slateEditor.operations.every((op) => op.type === 'set_selection')) {
        return;
      }

      const slateState = slateEditor.children;

      const childNodeIds = slateState.map((node) => node['id']) as string[];

      actions.history.throttle(500).setState((state) => {
        slateNodesToCraft(rteResolvers, state, slateState, id);

        state.nodes[id].data.nodes = childNodeIds;

        slateStateRef.current = slateState;

        const slateSelection = slateEditor.selection;

        // Save the current selection
        state.nodes[id].data.custom.selection = slateSelection;
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
};
