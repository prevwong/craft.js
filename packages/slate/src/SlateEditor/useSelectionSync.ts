import { useEditor } from '@craftjs/core';
import { useSlateNode } from '../contexts/SlateNodeContext';
import { useState, useEffect, useRef } from 'react';
import { useEditor as useSlateEditor, ReactEditor } from 'slate-react';
import { useCaret } from '../caret';
import isShallowEqual from 'shallowequal';
import { Transforms } from 'slate';

export const useSelectionSync = () => {
  const [enabled, setEnabled] = useState(false);
  const { query } = useEditor();

  const { id } = useSlateNode();
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const lastCraftSelectionRef = useRef<any>(null);

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

  const { caret } = useCaret((caret) => ({
    caret: caret && caret.data.source === id ? caret : null,
  }));

  useEffect(() => {
    Promise.resolve().then(() => {
      console.log('caret', caret);
      if (!isShallowEqual(lastCraftSelectionRef.current, caret)) {
        if (caret) {
          try {
            const slateRnage = caret.selection as any;

            const domRange = ReactEditor.toDOMRange(slateEditor, slateRnage);
            if (domRange) {
              setEnabled(true);
              ReactEditor.focus(slateEditor);
              Transforms.select(slateEditor, slateRnage);
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          ReactEditor.deselect(slateEditor);
          setEnabled(true);
        }

        lastCraftSelectionRef.current = caret;
      }
    });
  }, [caret]);

  //   if (!enabledRef.current) {
  //     return;
  //   }

  //   if (isSlateDescendantSelected) {
  //     return;
  //   }

  //   const slateEditor = slateEditorRef.current;
  //   ReactEditor.deselect(slateEditor);
  //   setEnabled(false);
  // }, [isSlateDescendantSelected]);

  return { enabled };
};
