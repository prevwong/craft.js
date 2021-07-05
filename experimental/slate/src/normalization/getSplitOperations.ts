import { EditorState } from '@craftjs/core';

// Get a list of operations to perform in a scenario where a non-Slate element is found inside the Slate node
// For example: the user drags a Button and drops it inside between 2 Text nodes
export const getSplitOperations = (
  state: EditorState,
  slateNodeId: string,
  rootType: any,
  acceptableChildrenType: any[]
) => {
  const slateNode = state.nodes[slateNodeId];

  let currentTree = {};
  let hasSplitted = false;

  const getOperations = (
    nodeId: string,
    parentId: string,
    parentTree: any = {}
  ) => {
    let hasCurrentNodeBeenExpelled = false;
    const operations = [];
    const node = state.nodes[nodeId];

    let parentIdForChildren = nodeId;

    if (nodeId === slateNodeId) {
      const nodeInfo = {
        id: nodeId,
        nodes: [],
        expelled: hasSplitted,
      };
      currentTree[nodeId] = { ...nodeInfo };
      parentTree[nodeId] = { ...nodeInfo };
    } else if (rootType === node.data.type) {
      parentIdForChildren = parentId;
      currentTree = { ...parentTree };
      operations.push({
        type: 'expand',
        id: node.id,
      });
    } else if (acceptableChildrenType.includes(node.data.type) === false) {
      operations.push({
        type: 'expel',
        id: node.id,
      });

      currentTree = null;
      hasSplitted = true;
      hasCurrentNodeBeenExpelled = true;
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

      if (currentTree[parentId]) {
        currentTree[parentId] = {
          ...currentTree[parentId],
          nodes: [...currentTree[parentId].nodes, nodeId],
        };
      }

      if (parentTree[parentId]) {
        parentTree[parentId] = {
          ...parentTree[parentId],
          nodes: [nodeId],
        };
      }

      currentTree[nodeId] = { ...nodeInfo };
      parentTree[nodeId] = { ...nodeInfo };
    }

    // If the current node has been expelled, no need to iterate through its children
    if (hasCurrentNodeBeenExpelled) {
      return operations;
    }

    return [
      ...operations,
      ...node.data.nodes
        .map((childNodeId) =>
          getOperations(childNodeId, parentIdForChildren, { ...parentTree })
        )
        .flat(),
    ];
  };

  return getOperations(slateNode.id, slateNode.data.parent);
};
