import { useEditor } from '@craftjs/core';
import { useCallback, useEffect, useRef } from 'react';

export const useCaret = (callback?: any, id?: string) => {
  const { caret, actions } = useEditor((state) => ({
    caret: state.nodes['ROOT'] && state.nodes['ROOT'].data.custom.caret,
  }));

  const value = useRef(null);

  useEffect(() => {
    if (!id || !callback) {
      return;
    }

    if (!caret || (caret && caret.id !== id)) {
      value.current = null;
    } else {
      value.current = caret.selection;
    }

    callback(value.current);
  }, [caret]);

  const setCaret = useCallback((selection, id) => {
    actions.history.ignore().setCustom('ROOT', (custom) => {
      custom.caret.id = id;
      custom.caret.selection = selection;
    });
  }, []);

  const clearCaret = useCallback(() => {
    actions.history.ignore().setCustom('ROOT', (custom) => {
      custom.caret.id = null;
      custom.caret.selection = null;
    });
  }, []);

  return {
    caret,
    setCaret,
    clearCaret,
  };
};
