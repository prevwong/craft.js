import { EditorState, NodeHelpers, NodeId } from '@craftjs/core';
import pickBy from 'lodash/pickBy';
import forIn from 'lodash/forIn';

import deleteNodes from './deleteNodes';
import { Text } from '../render/Text';

export const removeInvalidNodes = (state: EditorState, elementTypes: any[]) => {
  const nodesToDelete = new Set<NodeId>();

  const slateNodes = pickBy(state.nodes, (node) =>
    elementTypes.includes(node.data.type)
  );
  const textNodes = pickBy(state.nodes, (node) => node.data.type === Text);

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
};
