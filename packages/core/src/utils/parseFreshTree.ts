import { mapValues, fromPairs, mapKeys } from 'lodash';
import shortid from 'shortid';

import { NodeId, NodeTree, Node, SerializedNode } from '../interfaces';

interface SerializedNodeTree {
  rootNodeId: NodeId;
  nodes: Record<NodeId, SerializedNode>;
}

export const getRandomId = shortid.generate;

export const normalizeClonedNode = (id: string) => (node: Node) => {
  node.id = id;

  if (node.data.custom && node.data.custom.states) {
    // Regenerate state ids to preserve its uniqueness
    node.data = {
      ...node.data,
      custom: {
        ...node.data.custom,
        states: mapKeys(node.data.custom.states, () => getRandomId()),
      },
    };
  }

  // TODO: move the following condition to CheckListGroup when have a way to do it
  if (
    node.data.custom &&
    node.data.custom.custom &&
    node.data.custom.custom.groupId
  ) {
    // Regenerate group id
    node.data = {
      ...node.data,
      custom: {
        ...node.data.custom,
        custom: {
          ...node.data.custom.custom,
          groupId: getRandomId(),
        },
      },
    };
  }
};

// TODO find better place for this
export const parseFreshTree = (oldTree: SerializedNodeTree, query) => {
  const nodeId = oldTree.rootNodeId;
  const oldIds = Object.keys(oldTree.nodes);
  const newIdMaps = fromPairs(
    oldIds.map((oldId: string) => [oldId, getRandomId()])
  );
  const getNewId = (oldId: string) => newIdMaps[oldId];
  const newNodes = mapValues(
    mapKeys(oldTree.nodes, (value, key) => getNewId(key)),
    (value, id) => {
      return query
        .parseSerializedNode({
          ...value,
          nodes: (value.nodes || []).map(getNewId),
        })
        .toNode(normalizeClonedNode(id));
    }
  );
  const newTree: NodeTree = {
    rootNodeId: getNewId(nodeId) as NodeId,
    nodes: newNodes,
  };

  return newTree;
};
