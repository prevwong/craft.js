import { EditorState } from '@craftjs/core';
import mergeElements from './mergeElements';
import { splitSlate } from './splitSlate';
import { wrapRogueElement } from './wrapRogueElement';
import { resolvers } from '../SlateEditor/Nodes';
import { SlateEditor } from '../SlateEditor/SlateEditor';

export function normalizeSlate(state: EditorState) {
  // Break <SlateEditor /> if there's non-Slate elements in it
  splitSlate(state, SlateEditor, Object.values(resolvers));

  // Wrap Rogue Slate elements inside a <SlateEditor /> node
  wrapRogueElement(state, SlateEditor, Object.values(resolvers));

  // // Last step, combine adjacent nodes together
  mergeElements('SlateEditor', state);

  return state;
}
