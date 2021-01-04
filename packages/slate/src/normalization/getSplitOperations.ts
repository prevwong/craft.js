import { EditorState } from '@craftjs/core';

// Get a list of potential operations to perform in a scenario where a non-Slate node is found
export const getSplitOperations = (
  state: EditorState,
  slateNodeId: string,
  acceptableChildrenType: any[]
) => {
  const slateNode = state.nodes[slateNodeId];

  let currentTree = {};
  let hasSplitted = false;

  const getOperations = (nodeId: string, parentTree: any = {}) => {
    const operations = [];

    const node = state.nodes[nodeId];
    if (nodeId === slateNodeId) {
      const nodeInfo = {
        id: nodeId,
        nodes: [],
        expelled: hasSplitted,
      };
      currentTree[nodeId] = { ...nodeInfo };
      parentTree[nodeId] = { ...nodeInfo };
    } else if (acceptableChildrenType.includes(node.data.type) === false) {
      operations.push({
        type: 'expel',
        id: node.id,
      });

      currentTree = null;
      hasSplitted = true;
    } else {
      if (!currentTree) {
        currentTree = { ...parentTree };
        operations.push({
          type: 'insert_tree',
          tree: currentTree,
        });
      }

      const nodeInfo = {
        id: nodeId,
        nodes: [],
        expelled: hasSplitted,
      };

      if (currentTree[node.data.parent]) {
        currentTree[node.data.parent] = {
          ...currentTree[node.data.parent],
          nodes: [...currentTree[node.data.parent].nodes, nodeId],
        };
      }

      if (parentTree[node.data.parent]) {
        parentTree[node.data.parent] = {
          ...parentTree[node.data.parent],
          nodes: [nodeId],
        };
      }

      currentTree[nodeId] = { ...nodeInfo };
      parentTree[nodeId] = { ...nodeInfo };
    }

    return [
      ...operations,
      ...node.data.nodes
        .map((childNodeId) => getOperations(childNodeId, { ...parentTree }))
        .flat(),
    ];
  };

  return getOperations(slateNode.id);
};
