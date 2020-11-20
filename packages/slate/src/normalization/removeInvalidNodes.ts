/* eslint-disable no-param-reassign */
import { EditorState } from '@craftjs/core';
import forIn from 'lodash/forIn';

import deleteNodes from './deleteNodes';

export default function removeInvalidNodes(state: EditorState) {
  const nodesToDelete: string[][] = [];
  forIn(state.nodes, (node) => {
    // if (node.data.name !== BuiltInComponents.Link) {
    //   return;
    // }
    // if (node.data.nodes.length === 0) {
    //   nodesToDelete.push([node.id]);
    //   return;
    // }
    // const childNode = state.nodes[node.data.nodes[0]];
    //
    // if (
    //   childNode &&
    //   childNode.data.name === 'Text' &&
    //   !childNode.data.props.text
    // ) {
    //   nodesToDelete.push([childNode.id]);
    //   nodesToDelete.push([node.id]);
    // }
  });

  deleteNodes(state, nodesToDelete);
}
