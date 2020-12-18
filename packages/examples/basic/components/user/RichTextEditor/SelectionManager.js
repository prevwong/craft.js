import React, { useEffect } from 'react';
import { useSlateNode } from '@craftjs/slate';
import { useSlate } from 'slate-react';

import { useFocus } from '../../Focus';
import { getFocusFromSlateRange, getSlateRange } from './utils/selection';

export const SelectionManager = () => {
  const slateEditor = useSlate();
  const selection = slateEditor.selection;
  const { actions } = useSlateNode();
  const { focus, setFocus } = useFocus();

  useEffect(() => {
    const newSelection = getFocusFromSlateRange(slateEditor, selection);
    if (!newSelection) {
      return;
    }

    setFocus({
      ...newSelection,
      source: 'RTE',
    });
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
  }, [focus]);

  return null;
};
