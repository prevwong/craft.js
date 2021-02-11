import { mapValues, fromPairs, mapKeys } from 'lodash';

import { getRandomNodeId } from './getRandomNodeId';

import { NodeId, NodeTree, SerializedNode } from '../interfaces';

interface SerializedNodeTree {
  rootNodeId: NodeId;
  nodes: Record<NodeId, SerializedNode>;
}

// generate fresh tree with new ids
export const parseFreshTree = (oldTree: SerializedNodeTree, query) => {
  const nodeId = oldTree.rootNodeId;
  const oldIds = Object.keys(oldTree.nodes);
  const newIdMaps = fromPairs(
    oldIds.map((oldId: string) => [oldId, getRandomNodeId()])
  );
  const getNewId = (oldId: string) => newIdMaps[oldId];
  const newNodes = mapValues(
    mapKeys(oldTree.nodes, (value, key) => getNewId(key)),
    (value) => {
      return query
        .parseSerializedNode({
          ...value,
          nodes: (value.nodes || []).map(getNewId),
        })
        .toNode();
    }
  );
  const newTree: NodeTree = {
    rootNodeId: getNewId(nodeId) as NodeId,
    nodes: newNodes,
  };

  return newTree;
};
