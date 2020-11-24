import { useNode } from '@craftjs/core';
import { useRef, useState } from 'react';
import { Transforms } from 'slate';
import { useEditor as useSlateEditor, ReactEditor } from 'slate-react';

import { useFocus } from '../focus';
import { getSlateRange } from '../utils/getSlateRange';

export const useSelectionSync = () => {
  const slateEditor = useSlateEditor();
  const { id } = useNode();
  const [enabled, setEnabled] = useState(false);

  const enabledRef = useRef<boolean>(enabled);

  useFocus(id, (value) => {
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
