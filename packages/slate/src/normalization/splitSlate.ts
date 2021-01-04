import { EditorState, QueryMethods, ROOT_NODE } from '@craftjs/core';
import forIn from 'lodash/forIn';
import pickBy from 'lodash/pickBy';
import shortid from 'shortid';

import { getSplitOperations } from './getSplitOperations';

export const splitSlate = (
  state: EditorState,
  rootType: any,
  acceptableChildrenType: any[]
) => {
  const slateNodes = pickBy(
    state.nodes,
    (node) => node.data.type === rootType && node.data.parent === ROOT_NODE
  );

  forIn(slateNodes, (slateNode) => {
    const splitOperations = getSplitOperations(
      state,
      slateNode.id,
      acceptableChildrenType
    );

    const slateParentId = slateNode.data.parent;
    const slateParentNode = state.nodes[slateParentId];
    const slateIndexInParent = slateParentNode.data.nodes.indexOf(slateNode.id);

    let expelledIds = new Set();

    // If we are moving something, ensure the selection of the Slate node is set to null
    if (splitOperations.length > 0) {
      state.nodes[slateNode.id].data.custom.selection = null;
    }

    splitOperations.forEach((splitOperation, i) => {
      const { type } = splitOperation;

      if (type === 'expel') {
        const nodeIdToMove = splitOperation.id;
        const currentParentId = state.nodes[nodeIdToMove].data.parent;
        const currentParentNode = state.nodes[currentParentId];

        if (currentParentNode.data.nodes.indexOf(nodeIdToMove) > -1) {
          state.nodes[currentParentId].data.nodes.splice(
            currentParentNode.data.nodes.indexOf(nodeIdToMove),
            1
          );
        }

        state.nodes[nodeIdToMove].data.parent = slateParentId;
        state.nodes[slateParentId].data.nodes.splice(
          slateIndexInParent + i + 1,
          0,
          nodeIdToMove
        );

        return;
      }

      if (type === 'insert_tree') {
        const tree = splitOperation.tree;
        const insertTree = ({ id, nodes, expelled }, newParentId) => {
          const {
            props,
            custom: { selection, ...custom },
            type,
            parent: currentParentId,
          } = state.nodes[id].data;
          let idToUse = shortid();

          // If the current node we're adding is a Slate node type
          // Then append the new node Id after the original Slate ndoe
          if (id === slateNode.id) {
            state.nodes[slateParentId].data.nodes.splice(
              slateIndexInParent + i + 1,
              0,
              idToUse
            );
          } else if (expelled && expelledIds.has(id) === false) {
            idToUse = id;
            expelledIds.add(id);
            const currentParentNode = state.nodes[currentParentId];

            if (currentParentNode.data.nodes.indexOf(id) > -1) {
              state.nodes[currentParentId].data.nodes.splice(
                currentParentNode.data.nodes.indexOf(id),
                1
              );
            }
          }

          state.nodes[idToUse] = QueryMethods(state)
            .parseFreshNode({
              id: idToUse,
              data: {
                type,
                props,
                custom,
                parent: newParentId,
                nodes: nodes.map((childNodeId) =>
                  insertTree(tree[childNodeId], idToUse)
                ),
              },
            })
            .toNode();
          return idToUse;
        };

        const rootSlateNode = tree[slateNode.id];
        insertTree(rootSlateNode, slateParentId);
      }
    });
  });

  return state;
};
