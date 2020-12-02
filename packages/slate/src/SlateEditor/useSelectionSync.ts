import { useEditor, useNode } from '@craftjs/core';
import { useEffect, useRef, useState } from 'react';
import { Transforms } from 'slate';
import { useEditor as useSlateEditor, ReactEditor } from 'slate-react';

import { useCaret } from '../caret';
import { getSlateRange } from '../utils/getSlateRange';

export const useSelectionSync = () => {
  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const [enabled, setEnabled] = useState(false);

  const enabledRef = useRef<boolean>(enabled);
  const slateEditorRef = useRef(slateEditor);
  slateEditorRef.current = slateEditor;

  const { caret, clearCaret } = useCaret((caret) => ({
    caret: caret && caret.data.source === id ? caret : null,
  }));

  const { isSlateDescendantSelected } = useEditor((_, query) => {
    const descendants = query.node(id).descendants(true) as string[];
    return {
      isSlateDescendantSelected: descendants.some((id) =>
        query.getEvent('selected').contains(id)
      ),
    };
  });

  useEffect(() => {
    Promise.resolve().then(() => {
      const slateEditor = slateEditorRef.current;
      const value = caret;

      if (!value) {
        if (enabledRef.current) {
          ReactEditor.deselect(slateEditor);
          enabledRef.current = false;
          setEnabled(false);
        }
        return;
      }

      enabledRef.current = true;
      const newSelection = getSlateRange(slateEditor, value.selection);

      if (!newSelection) {
        return;
      }

      if (!newSelection.anchor || !newSelection.focus) {
        return;
      }

      setEnabled(true);
      slateEditor.selection = null;
      ReactEditor.focus(slateEditor);
      Transforms.select(slateEditor, newSelection);
    });
  }, [caret]);

  useEffect(() => {
    if (isSlateDescendantSelected) {
      return;
    }

    const slateEditor = slateEditorRef.current;
    ReactEditor.deselect(slateEditor);
    clearCaret();
    setEnabled(false);
  }, [isSlateDescendantSelected]);

  return { enabled };
};
