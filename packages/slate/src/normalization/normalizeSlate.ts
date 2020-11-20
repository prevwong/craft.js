import { EditorState } from '@craftjs/core';
import wrapElement from './wrapElement';
import mergeElements from './mergeElements';
import { resolvers } from '../SlateEditor/Nodes';
import removeInvalidNodes from './removeInvalidNodes';

export function normalizeSlate(
  state: EditorState,
  query: any,
  previousState: EditorState
) {
  wrapElement(state, query, previousState, 'SlateEditor', [
    'Typography',
    'List',
  ]);

  /**
   * Last step, combine adjacent nodes together
   * We're doing this here instead of the previous loop
   * because there might have been adjacent RTE after they were expelled
   */
  mergeElements('SlateEditor', state);

  // removeInvalidNodes(state);
  // return state;
}
