import { EditorState } from '@craftjs/core';

import mergeElements from './mergeElements';
import { splitSlate } from './splitSlate';
import { wrapRogueElement } from './wrapRogueElement';
import { removeInvalidNodes } from './removeInvalidNodes';

export const normalizeSlate = (
  slateType: React.ElementType,
  elementResolver: Record<string, React.ElementType>,
  leafElementType: React.ElementType
) => (state: EditorState) => {
  const elementTypes = Object.values(elementResolver);
  const acceptableChildrenTypes = [...elementTypes, leafElementType];

  // Break <SlateEditor /> if there's non-Slate elements in it
  splitSlate(state, slateType, acceptableChildrenTypes);

  // Wrap Rogue Slate elements inside a <SlateEditor /> node
  wrapRogueElement(state, slateType, acceptableChildrenTypes);

  // Last step, combine adjacent nodes together
  mergeElements(slateType, state);

  removeInvalidNodes(state, [slateType, ...elementTypes], leafElementType);

  return state;
};
