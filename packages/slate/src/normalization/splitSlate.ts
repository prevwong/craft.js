import { EditorState, NodeId, QueryMethods } from '@craftjs/core';
import forIn from 'lodash/forIn';
import pickBy from 'lodash/pickBy';
import shortid from 'shortid';

export const splitSlate = (
  state: EditorState,
  rootType: any,
  acceptableChildrenType: any[]
) => {
  const slateNodes = pickBy(state.nodes, (node) => node.data.type === rootType);

  forIn(slateNodes, (slateNode) => {
    let newTree = {};

    const transfers = [];
    let hasSplitted = false;
    const iterateNode = (nodeId: string, tree: any) => {
      const node = state.nodes[nodeId];
      if (
        [rootType, ...acceptableChildrenType].includes(node.data.type) === false
      ) {
        transfers.push({
          type: 'move',
          id: node.id,
        });
        newTree = null;
        hasSplitted = true;
      } else {
        if (!newTree) {
          newTree = { ...tree };
          transfers.push({
            type: 'insert_tree',
            tree: newTree,
          });
        }

        const nodeInfo = {
          id: node.id,
          nodes: [],
          expelled: hasSplitted,
        };

        if (newTree[node.data.parent]) {
          newTree[node.data.parent] = {
            ...newTree[node.data.parent],
            nodes: [...newTree[node.data.parent].nodes, node.id],
          };
        }

        newTree[node.id] = { ...nodeInfo };
        tree[node.id] = { ...nodeInfo };
      }

      node.data.nodes.forEach((id) => {
        const newTree = { ...tree };
        if (newTree[node.data.parent]) {
          newTree[node.data.parent] = {
            ...newTree[node.data.parent],
            nodes: [node.id],
          };
        }

        iterateNode(id, { ...newTree });
      });
    };

    iterateNode(slateNode.id, {});

    const slateParentId = slateNode.data.parent;
    const slateParentNode = state.nodes[slateParentId];
    const slateIndexInParent = slateParentNode.data.nodes.indexOf(slateNode.id);

    let expelledIds = [];

    transfers.forEach((transfer, i) => {
      const { type } = transfer;

      if (type === 'move') {
        const nodeIdToMove = transfer.id;
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
        const tree = transfer.tree;
        const insertTree = ({ id, nodes, expelled }, parent) => {
          const { props, custom, type, parent: currentParentId } = state.nodes[
            id
          ].data;

          const currentParentNode = state.nodes[currentParentId];

          let idToUse = shortid();
          if (expelled && expelledIds.includes(id) === false) {
            expelledIds.push(id);

            if (
              parent !== currentParentId &&
              currentParentNode.data.nodes.indexOf(id) > -1
            ) {
              state.nodes[currentParentId].data.nodes.splice(
                currentParentNode.data.nodes.indexOf(id),
                1
              );
            }

            state.nodes[id].data.parent = parent;
            idToUse = id;
          }

          if (type === rootType) {
            state.nodes[slateParentId].data.nodes.splice(
              slateIndexInParent + i + 1,
              0,
              idToUse
            );
          }

          state.nodes[idToUse] = QueryMethods(state)
            .parseFreshNode({
              id: idToUse,
              data: {
                type,
                props,
                custom,
                parent,
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
