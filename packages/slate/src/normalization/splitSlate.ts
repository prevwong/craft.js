import { EditorState } from '@craftjs/core';
import pickBy from 'lodash/pickBy';
import forIn from 'lodash/forIn';
import { NodeHelpers } from '@craftjs/core';

export const splitSlate = (
  state: EditorState,
  rootType: string,
  acceptableChildrenType: string[]
) => {
  const splits = [];

  const rootNodes = pickBy(state.nodes, (node) => node.data.name === rootType);

  forIn(rootNodes, (node) => {
    const descendants = NodeHelpers(state, node.id).descendants(true);
    console.log('descendants', descendants);
  });
};
