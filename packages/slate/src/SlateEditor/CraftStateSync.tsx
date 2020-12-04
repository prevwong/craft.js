import { useEditor, ROOT_NODE, useNode } from '@craftjs/core';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { Editor, Transforms } from 'slate';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { craftNodeToSlateNode, slateNodesToCraft } from '../utils/formats';
import { SlateNodeContextProvider } from '../contexts/SlateNodeContext';
import { getClosestSelectableNodeId } from '../utils/getClosestSelectableNodeId';
import { ReactEditor, useSlate } from 'slate-react';
import { getSlateRange } from '../utils/getSlateRange';
import { getFocusFromSlateRange } from '../utils/createSelectionOnNode';
import { useCaret } from '../caret';
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

  const { actions, query, slateState } = useEditor((_, query) => ({
    slateState: getSlateStateFromCraft(id, query),
  }));

  const { caret, setCaret } = useCaret((caret) => ({
    caret: caret && caret.data.source === id ? caret.selection : null,
  }));

  const selectionRef = useRef({
    caret: null,
    slate: null,
  });

  const updateCaretWithSavedSelection = useCallback(
    debounce(() => {
      const lastSavedSelection = query.node(ROOT_NODE).get().data.custom
        .lastSavedSelection;
      if (!lastSavedSelection) {
        return;
      }

      if (lastSavedSelection.data.source !== id) {
        return;
      }

      setCaret(lastSavedSelection.selection, lastSavedSelection.data);
    }, 100),
    []
  );

  const setSlateState = () => {
    // Reset selection (otherwise Slate goes boom!)
    selectionRef.current.caret = null;
    slateEditor.selection = null;

    // Normalize using Slate
    slateEditor.children = slateState;
    Editor.normalize(slateEditor, { force: true });

    // Then trigger onChange
    currentSlateStateRef.current = slateEditor.children;
    onChange(slateState);

    updateCaretWithSavedSelection();
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

      state.nodes[ROOT_NODE].data.custom.lastSavedSelection = {
        data: {
          source: id,
        },
        selection: getFocusFromSlateRange(
          slateEditor,
          slateEditor.selection as any
        ),
      };
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

    const closestNodeId = getClosestSelectableNodeId(slateEditor);

    if (
      closestNodeId &&
      query.node(closestNodeId).get() &&
      !query.getEvent('selected').contains(closestNodeId)
    ) {
      actions.selectNode(closestNodeId);
    }

    if (compareCaret(toCaretRange, selectionRef.current.caret)) {
      return;
    }

    setCaret(toCaretRange, {
      source: id,
    });
  }, [slateEditor.selection]);

  useEffect(() => {
    selectionRef.current.caret = caret;

    if (compareCaret(caret, selectionRef.current.slate)) {
      return;
    }

    // We need to do this because Slate occasioanlly retains DOM selection from elsewhere
    window.getSelection().removeAllRanges();

    if (!caret) {
      ReactEditor.deselect(slateEditor);
      setEnabled(false);
      return;
    }

    const newSelection = caret ? getSlateRange(slateEditor, caret) : null;

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
    } catch (err) {
      console.warn(err);
    }
  }, [caret]);

  return (
    <SlateNodeContextProvider enabled={enabled}>
      {children}
    </SlateNodeContextProvider>
  );
};
