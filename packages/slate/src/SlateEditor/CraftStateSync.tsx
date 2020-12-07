import { useEditor, useNode } from '@craftjs/core';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import isEqual from 'lodash/isEqual';
import { Editor, Transforms } from 'slate';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';
import { SlateNodeContextProvider } from '../contexts/SlateNodeContext';
import { ReactEditor, useSlate } from 'slate-react';
import { getSlateRange } from '../utils/getSlateRange';
import { getFocusFromSlateRange } from '../utils/createSelectionOnNode';
import { CaretSelection } from 'caret/types';

const compareCaret = (a: CaretSelection, b: CaretSelection) => {
  if (!a && !b) {
    return true;
  }

  if (
    a &&
    b &&
    a.anchor.nodeId === b.anchor.nodeId &&
    a.focus.nodeId === b.focus.nodeId &&
    a.anchor.offset === b.anchor.offset
  ) {
    return true;
  }

  return false;
};

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

  const { actions, slateState } = useEditor((state, query) => ({
    slateState: {
      children: getSlateStateFromCraft(id, query),
      selection: state.nodes[id] && state.nodes[id].data.custom.selection,
    },
  }));

  const selectionRef = useRef({
    craft: null,
    slate: null,
  });

  const setSlateState = (children) => {
    // Reset selection (otherwise Slate goes boom!)
    selectionRef.current.craft = null;
    selectionRef.current.slate = null;
    ReactEditor.deselect(slateEditor);
    slateEditor.selection = null;

    // Normalize using Slate
    slateEditor.children = children;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    currentSlateStateRef.current = slateEditor.children;
    onChange(children);
  };

  // When slate children changes in Craft's state
  useLayoutEffect(() => {
    if (!slateState.children) {
      return;
    }

    // If the state is the same with the current slate state, do nothing
    // We could probably find a way to do this without deep-equal; but that's a problem for another time!
    if (isEqual(currentSlateStateRef.current, slateState.children)) {
      return;
    }

    // Otherwise, force update the slate state
    // This only occurs in 3 scenarios: (on page load, undo and redo)
    setSlateState(slateState.children);
  }, [slateState.children]);

  const saveToCraft = (slateState) => {
    const childNodeIds = slateState.map((node) => node['id']) as string[];

    actions.history.throttle(500).setState((state) => {
      slateNodesToCraft(state, slateState, id);

      state.nodes[id].data.nodes = childNodeIds;

      currentSlateStateRef.current = slateState;

      // Save the current selection
      const selection = getFocusFromSlateRange(
        slateEditor,
        slateEditor.selection as any
      );

      state.nodes[id].data.custom.selection = selection;
    });
  };

  const extendSlateEditor = () => {
    const { apply, onChange } = slateEditor;

    slateEditor.onChange = () => {
      onChange();

      // Don't update Craft state if only selection operations had been performed
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
  };

  useEffect(() => {
    extendSlateEditor();
  }, []);

  useEffect(() => {
    const toCaretRange = getFocusFromSlateRange(
      slateEditor,
      slateEditor.selection as any
    );

    selectionRef.current.slate = toCaretRange;

    if (compareCaret(toCaretRange, selectionRef.current.craft)) {
      return;
    }

    actions.history.ignore().setState((state) => {
      state.nodes[id].data.custom.selection = toCaretRange;
    });
  }, [slateEditor.selection]);

  const syncCraftSelectionToSlate = useCallback((selection) => {
    selectionRef.current.craft = selection;

    if (compareCaret(selection, selectionRef.current.slate)) {
      return;
    }

    window.getSelection().removeAllRanges();

    if (!selection) {
      ReactEditor.deselect(slateEditor);
      slateEditor.selection = null;
      setEnabled(false);
      return;
    }

    const newSelection = selection
      ? getSlateRange(slateEditor, selection)
      : null;

    if (!newSelection || !newSelection.anchor || !newSelection.focus) {
      return;
    }

    // We neeed to wrap this inside a try block because the leaf nodes may not have been rendered at the time we set the selection here
    try {
      const domRange = ReactEditor.toDOMRange(slateEditor, newSelection);
      if (domRange) {
        setEnabled(true);
        ReactEditor.focus(slateEditor);
        Transforms.select(slateEditor, newSelection);
        slateEditor.selection = newSelection;
      }
    } catch (err) {
      // console.warn(err);
    }
  }, []);

  useLayoutEffect(() => {
    syncCraftSelectionToSlate(slateState.selection);
  });

  return (
    <SlateNodeContextProvider enabled={enabled} setEnabled={setEnabled}>
      {children}
    </SlateNodeContextProvider>
  );
};
