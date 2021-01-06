import { EditorState, NodeHelpers, NodeId } from '@craftjs/core';
import forIn from 'lodash/forIn';
import pickBy from 'lodash/pickBy';

import deleteNodes from './deleteNodes';

// Remove any invalid Slate nodes (ie: Slate nodes without any Text nodes)
export const removeInvalidNodes = (
  state: EditorState,
  rootType: any,
  elementTypes: any[],
  leafElementType: any
) => {
  const nodesToDelete = new Set<NodeId>();

  const slateNodes = pickBy(state.nodes, (node) =>
    [rootType, ...elementTypes].includes(node.data.type)
  );
  const textNodes = pickBy(
    state.nodes,
    (node) => node.data.type === leafElementType
  );

  let matched = new Set();
  forIn(textNodes, (node) => {
    const ancestors = NodeHelpers(state, node.id).ancestors(true);
    matched = new Set([...Array.from(matched), ...ancestors]);
  });

  forIn(slateNodes, (node) => {
    if (matched.has(node.id)) {
      return;
    }

    nodesToDelete.add(node.id);
  });

  deleteNodes(state, Array.from(nodesToDelete).map((id) => [id]) as any);

  return state;
};
