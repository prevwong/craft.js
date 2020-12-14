import React, { useEffect } from 'react';
import {
  getFocusFromSlateRange,
  getSlateRange,
  useSlateNode,
} from '@craftjs/slate';
import { useSlate, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';

import { useFocus } from '../../Focus';

export const SelectionManager = () => {
  const slateEditor = useSlate();
  const selection = slateEditor.selection;
  const { actions } = useSlateNode();
  const { focus, setFocus } = useFocus();

  useEffect(() => {
    const newSelection = getFocusFromSlateRange(slateEditor, selection);
    setFocus(
      newSelection
        ? {
            ...newSelection,
            source: 'RTE',
          }
        : null
    );
  }, [selection]);

  useEffect(() => {
    if (!focus) {
      actions.disableEditing();
      return;
    }

    if (focus.source === 'RTE') {
      return;
    }

    const craftRange = getSlateRange(slateEditor, focus);

    if (!craftRange.anchor || !craftRange.focus) {
      return;
    }

    actions.setSelection(craftRange);
    // setEnabled(true);
    // ReactEditor.focus(slateEditor);
    // Transforms.select(slateEditor, craftRange);
    // console.log(100, craftRange)
  }, [focus]);

  return null;
};
