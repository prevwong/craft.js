import { useEditor } from '@craftjs/core';
import { useCallback, useEffect, useRef } from 'react';

export const useCaret = (id?: string, callback?: any) => {
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
      value.current = caret.focus;
    }

    callback(value.current);
  }, [caret]);

  const setCaret = useCallback((id, focus) => {
    actions.setCustom('ROOT', (custom) => {
      custom.caret.id = id;
      custom.caret.focus = focus;
    });
  }, []);

  const clearCaret = useCallback(() => {
    actions.setCustom('ROOT', (custom) => {
      custom.caret.id = null;
      custom.caret.focus = null;
    });
  }, []);

  return {
    caret,
    setCaret,
    clearCaret,
  };
};
