import { EditorState } from '@craftjs/core';

import mergeElements from './mergeElements';
import { splitSlate } from './splitSlate';
import { wrapRogueElement } from './wrapRogueElement';

export const normalizeSlate = (
  slateType: React.ElementType,
  resolvers: Record<string, React.ElementType>
) => (state: EditorState) => {
  // Break <SlateEditor /> if there's non-Slate elements in it
  splitSlate(state, slateType, Object.values(resolvers));

  // Wrap Rogue Slate elements inside a <SlateEditor /> node
  wrapRogueElement(state, slateType, Object.values(resolvers));

  // // Last step, combine adjacent nodes together
  mergeElements('Slate', state);

  return state;
};
