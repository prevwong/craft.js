import { EditorState, QueryMethods } from '@craftjs/core';
import forIn from 'lodash/forIn';
import pickBy from 'lodash/pickBy';

export const wrapRogueElement = (
  state: EditorState,
  rootType: any,
  acceptableElements: any[]
) => {
  const rogueNodes = pickBy(
    state.nodes,
    (node) =>
      acceptableElements.includes(node.data.type) &&
      [rootType, ...acceptableElements].includes(
        state.nodes[node.data.parent].data.type
      ) === false
  );

  forIn(rogueNodes, (node) => {
    const newSlateNode = QueryMethods(state)
      .parseFreshNode({
        data: {
          type: rootType,
          nodes: [node.id],
        },
      })
      .toNode();

    const currentParentNode = state.nodes[node.data.parent];
    const indexInParentNode = currentParentNode.data.nodes.indexOf(node.id);

    if (indexInParentNode > -1) {
      currentParentNode.data.nodes.splice(
        indexInParentNode,
        1,
        newSlateNode.id
      );
    }

    node.data.parent = newSlateNode.id;
    state.nodes[newSlateNode.id] = newSlateNode;
  });

  return state;
};
