import { useEditor } from '@craftjs/core';
import { useCallback } from 'react';
import { Caret, CaretData, CaretSelection } from './types';

export function useCaret<C>(collectCaret?: (caret: Caret) => C) {
  const { caret, actions } = useEditor((state) => ({
    caret:
      state.nodes['ROOT'] &&
      state.nodes['ROOT'].data.custom.caret &&
      collectCaret
        ? collectCaret(state.nodes['ROOT'].data.custom.caret)
        : null,
  }));

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
}
