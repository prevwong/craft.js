import { EditorState, QueryMethods } from '@craftjs/core';
import forIn from 'lodash/forIn';
import pickBy from 'lodash/pickBy';
import shortid from 'shortid';

import deleteNodes from './deleteNodes';
import { getSplitOperations } from './getSplitOperations';

// Split a Slate node into multiple Slate nodes
// This happens when a non-Slate node (ie: a Button) is dropped into a Slate node
export const splitSlate = (
  state: EditorState,
  rootType: any,
  acceptableChildrenType: any[]
) => {
  const slateNodes = pickBy(state.nodes, (node) => {
    if (node.data.type !== rootType) {
      return false;
    }

    const parentId = node.data.parent;
    const parentNode = state.nodes[parentId];
    if (!parentNode) {
      return true;
    }

    const isParentSlateNode = [rootType, ...acceptableChildrenType].includes(
      parentNode.data.type
    );

    if (isParentSlateNode) {
      return false;
    }

    return true;
  });

  forIn(slateNodes, (slateNode) => {
    const splitOperations = getSplitOperations(
      state,
      slateNode.id,
      rootType,
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

    // Stores the latest generated Slate node id from a insert_tree op
    let lastGeneratedSlateNodeId = null;

    splitOperations.forEach((splitOperation, i) => {
      const { type } = splitOperation;

      /**
       * Expel a non-Slate node
       *
       * Example:
       * Given the following state:
       * - Root
       *   - Slate
       *    - Typography
       *    - Button
       *
       * Transform it into:
       *
       * - Root
       *   - Slate
       *    - Typography
       *   - Button <-- expel moves a non-Slate child node out of the Slate node
       */
      if (type === 'expel') {
        lastGeneratedSlateNodeId = null;
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

      /**
       * Expel a non-Slate node
       *
       * Example:
       * Given the following state:
       * - Root
       *   - Slate
       *    - Typography
       *    - Button
       *    - Typography
       *
       * Transform it into:
       *
       * - Root
       *   - Slate
       *    - Typography
       *   - Button <-- expel moves a non-Slate child node out of the Slate node
       *   - Slate <-- insert_tree creates a new Slate node to wrap the remaining children nodes in a new Slate node
       *    - Typography
       */
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
            lastGeneratedSlateNodeId = idToUse;
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
        return;
      }

      /**
       * Expand a nested Slate node into a parent Slate node
       *
       * Example:
       * Given the following state:
       * - Root
       *   - Slate
       *    - Typography
       *    - Slate
       *       - List
       *    - Typography
       *
       * Transform it into:
       *
       * - Root
       *   - Slate
       *    - Typography
       *    - List
       *    - Typography
       */
      if (type === 'expand') {
        const nodeToExpand = state.nodes[splitOperation.id];

        // If we just inserted a new Slate node via insert_tree, use that as a parent
        // Otherwise, use the original Slate node parent
        const parentToExpandIn =
          state.nodes[lastGeneratedSlateNodeId || nodeToExpand.data.parent];

        const nodeToExpandIndexInParent = parentToExpandIn.data.nodes.indexOf(
          nodeToExpand.id
        );

        nodeToExpand.data.nodes.forEach((nodeToExpandChildId, i) => {
          const index =
            nodeToExpandIndexInParent > -1
              ? nodeToExpandIndexInParent
              : parentToExpandIn.data.nodes.length - 1;

          state.nodes[parentToExpandIn.id].data.nodes.splice(
            index + i + 1,
            0,
            nodeToExpandChildId
          );

          state.nodes[nodeToExpandChildId].data.parent = parentToExpandIn.id;
        });

        deleteNodes(state, [[nodeToExpand.id]]);
      }
    });
  });

  return state;
};
