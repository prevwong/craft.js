import { useEditor, useNode } from '@craftjs/core';
import { useEffect, useRef, useState } from 'react';
import { Transforms } from 'slate';
import { useEditor as useSlateEditor, ReactEditor } from 'slate-react';
import { getClosestSelectableNodeId } from '../utils/getClosestSelectableNodeId';

import { useCaret } from '../caret';
import { getSlateRange } from '../utils/getSlateRange';

export const useSelectionSync = () => {
  const { actions, query } = useEditor();
  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const [enabled, setEnabled] = useState(false);

  const enabledRef = useRef<boolean>(enabled);

  const { caret } = useCaret((caret) => ({
    selection: caret && caret.data.source === id ? caret.selection : null,
  }));

  useEffect(() => {
    const value = caret && caret.selection;
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

      const closestNodeId = getClosestSelectableNodeId(slateEditor);

      if (
        closestNodeId &&
        query.node(closestNodeId).get() &&
        !query.getEvent('selected').contains(closestNodeId)
      ) {
        actions.selectNode(closestNodeId);
      }
    });
  }, [caret]);

  return { enabled };
};
