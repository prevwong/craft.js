import { EditorState } from '@craftjs/core';

import mergeElements from './mergeElements';
import { removeInvalidNodes } from './removeInvalidNodes';
import { splitSlate } from './splitSlate';
import { wrapRogueElement } from './wrapRogueElement';

export const normalizeSlate = (
  slateType: React.ElementType,
  elementResolver: Record<string, React.ElementType>,
  leafElementType: React.ElementType
) => (state: EditorState) => {
  const elementTypes = Object.values(elementResolver);
  const acceptableChildrenTypes = [...elementTypes, leafElementType];

  // Break the Slate node if there's non-Slate elements in it
  splitSlate(state, slateType, acceptableChildrenTypes);

  // Wrap Rogue Slate elements inside a <Slate /> node
  wrapRogueElement(state, slateType, acceptableChildrenTypes);

  // Last step, combine adjacent Slate nodes together
  mergeElements(slateType, state);

  // Sanity check: remove any unnecessary Slate nodes (ie: a <Slate /> without any descendant Text node)
  removeInvalidNodes(state, slateType, elementTypes, leafElementType);

  return state;
};
