import { useEditor } from '@craftjs/core';
import { useCallback } from 'react';
import { Caret, CaretData, CaretSelection } from './types';

export function useCaret<C>(collectCaret?: (caret: Caret) => C) {
  const {
    actions,
    query: _,
    connectors: __,
    store: ___,
    ...collected
  } = useEditor((state) =>
    state.nodes['ROOT'] && collectCaret
      ? collectCaret(state.nodes['ROOT'].data.custom.caret)
      : null
  );

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
    ...collected,
    setCaret,
    clearCaret,
  };
}
