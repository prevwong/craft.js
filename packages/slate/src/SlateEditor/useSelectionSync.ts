import { ROOT_NODE, useEditor, useNode } from '@craftjs/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Transforms } from 'slate';
import {
  useEditor as useSlateEditor,
  ReactEditor,
  useSlate,
} from 'slate-react';
import debounce from 'lodash/debounce';

import { useCaret } from '../caret';
import { getSlateRange } from '../utils/getSlateRange';
import { getClosestSelectableNodeId } from '../utils/getClosestSelectableNodeId';
import { getFocusFromSlateRange } from '../utils/createFocusOnNode';

export const useSelectionSync = () => {
  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const { query, actions } = useEditor();
  const [enabled, setEnabled] = useState(false);
  const { selection } = useSlate() as any;
  const { setCaret } = useCaret();

  const enabledRef = useRef<boolean>(enabled);

  // Store caret prop on root node
  // TODO: find a better place to store this (maybe as a custom property)
  // Also, think of a better way of setting this initial value
  useEffect(() => {
    const rootNode = query.node(ROOT_NODE).get();
    if (!rootNode) {
      return;
    }

    if (!!rootNode.data.custom['caret']) {
      return;
    }

    actions.history.ignore().setCustom(ROOT_NODE, (custom) => {
      custom.caret = {
        id: null,
        selection: null,
      };
    });
  }, []);

  const setter = useCallback(() => {
    const closestNodeId = getClosestSelectableNodeId(slateEditor);

    if (
      closestNodeId &&
      query.node(closestNodeId).get() &&
      !query.getEvent('selected').contains(closestNodeId)
    ) {
      actions.selectNode(closestNodeId);
    }

    const selection = getFocusFromSlateRange(
      slateEditor,
      slateEditor.selection as any
    );

    setCaret(id, selection);
  }, []);

  useEffect(() => {
    setter();
  }, [selection]);

  useCaret(id, (value) => {
    Promise.resolve().then(() => {
      if (!value) {
        if (enabledRef.current) {
          ReactEditor.deselect(slateEditor);
          enabledRef.current = false;
          setEnabled(false);
        }
        return;
      }

      enabledRef.current = true;

      const newSelection = getSlateRange(slateEditor, value);

      if (!newSelection) {
        return;
      }

      if (!newSelection.anchor || !newSelection.focus) {
        return;
      }

      setEnabled(true);
      ReactEditor.focus(slateEditor);
      Transforms.select(slateEditor, newSelection);
    });
  });

  return { enabled };
};
