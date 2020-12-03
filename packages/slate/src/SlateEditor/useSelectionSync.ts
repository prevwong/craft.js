import { useEditor } from '@craftjs/core';
import { useSlateNode } from '../contexts/SlateNodeContext';
import { useEffect, useRef } from 'react';
import { useEditor as useSlateEditor, ReactEditor } from 'slate-react';

export const useSelectionSync = () => {
  const { id, enabled, setEnabled } = useSlateNode();
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const { isSlateDescendantSelected } = useEditor((_, query) => {
    const descendants = query.node(id).descendants(true) as string[];
    return {
      isSlateDescendantSelected: descendants.some((id) =>
        query.getEvent('selected').contains(id)
      ),
    };
  });

  const slateEditor = useSlateEditor();
  const slateEditorRef = useRef(slateEditor);
  slateEditorRef.current = slateEditor;

  useEffect(() => {
    if (!enabledRef.current) {
      return;
    }

    if (isSlateDescendantSelected) {
      return;
    }

    const slateEditor = slateEditorRef.current;
    ReactEditor.deselect(slateEditor);
    setEnabled(false);
  }, [isSlateDescendantSelected]);
};
