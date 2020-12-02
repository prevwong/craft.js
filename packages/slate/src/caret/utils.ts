import { EditorState, ROOT_NODE } from '@craftjs/core';
import { CaretSelection, CaretData } from './types';

export const getCaretFromState = (state: EditorState) => {
  return state.nodes[ROOT_NODE].data.custom.caret;
};

export const setCaret = (state: EditorState) => (
  selection: CaretSelection,
  data?: CaretData
) => {
  state.nodes[ROOT_NODE].data.custom.caret = {
    selection,
    data: data || {},
  };
};

export const clearCaret = (state: EditorState) => () => {
  state.nodes[ROOT_NODE].data.custom.caret = null;
};
