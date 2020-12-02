import { useNode } from '@craftjs/core';
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

  const { caret } = useCaret((caret) => ({
    caret: caret && caret.data.source === id ? caret : null,
  }));

  useEffect(() => {
    Promise.resolve().then(() => {
      const slateEditor = slateEditorRef.current;
      const value = caret;

      if (!value) {
        ReactEditor.deselect(slateEditor);
        enabledRef.current = false;
        setEnabled(false);
        return;
      }

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

  return { enabled };
};
