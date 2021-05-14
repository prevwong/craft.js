/* eslint-disable react-hooks/exhaustive-deps */
import { useEditor } from '@craftjs/core';
import isEqual from 'lodash/isEqual';
import { useEffect, useRef } from 'react';
import { Editor, Node } from 'slate';
import { useSlate } from 'slate-react';

import { SlateElement } from '../../interfaces';
import { applyIdOnOperation } from '../../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../../utils/formats';
import { useSlateNode } from '../slate';

const getSlateStateFromCraft = (rteNodeId: string, query) => {
  const node = query.node(rteNodeId).get();
  if (!node) {
    return;
  }

  const childNodes = node.data.nodes;
  return childNodes.map((id) => craftNodeToSlateNode(query, id));
};

export const useCraftStateSync = () => {
  const { id, actions: slateActions, config } = useSlateNode();
  const slateEditor = useSlate();
  const slateSelection = slateEditor.selection;

  const slateStateRef = useRef<any>(null);
  const craftSelectionRef = useRef(null);
  const slateSelectionRef = useRef(null);
  const isCraftOverriding = useRef(false);

  const { query, actions, craftSlateState } = useEditor((state, query) => ({
    craftSlateState: getSlateStateFromCraft(id, query),
  }));

  const { craftSelection } = useEditor((state) => ({
    craftSelection:
      (state.nodes[id] && state.nodes[id].data.custom.selection) || null,
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

    isCraftOverriding.current = true;

    // Otherwise, force update the slate state
    // This only occurs in 3 scenarios: (on page load, undo and redo)
    slateEditor.selection = null;
    slateEditor.children = craftSlateState;
    Editor.normalize(slateEditor, { force: true });
    // We set the internal value so that the rendering can take over from here
    slateActions.setEditorValue(slateEditor.children);
    slateStateRef.current = slateEditor.children;

    Promise.resolve().then(() => {
      isCraftOverriding.current = false;
    });
  }, [craftSlateState]);

  // If craftSelection changes, update the slate selection
  // This typically only occurs on undo/redo
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
    const { apply } = slateEditor;

    slateEditor.onChange = () => {
      let actionCreator = actions.history.throttle(500);

      if (isCraftOverriding.current) {
        actionCreator = actions.history.merge();
      }

      const slateNodeIds = Array.from(Node.descendants(slateEditor)).map(
        ([nodeId]) => nodeId.id
      );
      const currentSlateNodeIds = query.node(id).descendants(true);

      // Get deleted slate node ids
      const deletedNodeIds = currentSlateNodeIds.filter(
        (id) => slateNodeIds.includes(id) === false
      );

      actionCreator.setState((state) => {
        const slateState = slateEditor.children;

        const childNodeIds = slateState.map((node) => node['id']) as string[];

        slateNodesToCraft(
          config.resolvers,
          state,
          slateState as SlateElement[],
          id
        );

        state.nodes[id].data.nodes = childNodeIds;

        slateStateRef.current = slateState;

        const slateSelection = slateEditor.selection;

        // Save the current selection
        state.nodes[id].data.custom.selection = slateSelection;

        // Remove any deleted Slate nodes from the Craft state
        deletedNodeIds.forEach(
          (deletedNodeId) => delete state.nodes[deletedNodeId]
        );
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
