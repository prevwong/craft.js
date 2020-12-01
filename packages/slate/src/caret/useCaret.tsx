import { useEditor } from '@craftjs/core';
import { useCallback, useEffect, useRef } from 'react';
import { CaretData, CaretSelection } from './types';

export const useCaret = (callback?: any, id?: string) => {
  const { caret, actions } = useEditor((state) => ({
    caret: state.nodes['ROOT'] && state.nodes['ROOT'].data.custom.caret,
  }));

  const value = useRef(null);

  useEffect(() => {
    if (!id || !callback) {
      return;
    }

    if (!caret || (caret && caret.data.source !== id)) {
      value.current = null;
    } else {
      value.current = caret;
    }

    callback(value.current);
  }, [caret]);

  const setCaret = useCallback((selection: CaretSelection, data: CaretData) => {
    actions.history.ignore().setCustom('ROOT', (custom) => {
      custom.caret = {
        selection,
        data: data || {},
      };
    });
  }, []);

  const clearCaret = useCallback(() => {
    actions.history.ignore().setCustom('ROOT', (custom) => {
      custom.caret = null;
    });
  }, []);

  return {
    caret,
    setCaret,
    clearCaret,
  };
};
