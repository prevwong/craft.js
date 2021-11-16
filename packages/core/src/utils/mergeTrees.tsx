import { isLegacyNode } from './types';

import {
  Node,
  NodeTree,
  LegacyNode,
  LegacyNodeTree,
  BackwardsCompatibleNodeTree,
} from '../interfaces';

const mergeNodes = (
  rootNode: Node | LegacyNode,
  childrenTree: BackwardsCompatibleNodeTree[]
) => {
  if (childrenTree.length < 1) {
    return { [rootNode.id]: rootNode };
  }

  const childrenNodeIds = childrenTree.map(({ rootNodeId }) => rootNodeId);
  const rootNodeWithNewChildren = {
    [rootNode.id]: isLegacyNode(rootNode)
      ? {
          ...rootNode,
          data: {
            ...rootNode.data,
            nodes: childrenNodeIds,
          },
        }
      : { ...rootNode, nodes: childrenNodeIds },
  };

  return childrenTree.reduce((accum, tree) => {
    const currentNode = tree.nodes[tree.rootNodeId];
    return {
      ...accum,
      ...tree.nodes,
      // set the parent id for the current node
      [currentNode.id]: isLegacyNode(currentNode)
        ? {
            ...currentNode,
            data: {
              ...currentNode.data,
              parent: rootNode.id,
            },
          }
        : {
            ...currentNode,
            parent: rootNode.id,
          },
    };
  }, rootNodeWithNewChildren);
};

export function mergeTrees(
  rootNode: LegacyNode,
  childrenTree: LegacyNodeTree[]
): LegacyNodeTree;
export function mergeTrees(rootNode: Node, childrenTree: NodeTree[]): NodeTree;
export function mergeTrees(
  rootNode: Node | LegacyNode,
  childrenTree: BackwardsCompatibleNodeTree[]
): BackwardsCompatibleNodeTree {
  return {
    rootNodeId: rootNode.id,
    nodes: mergeNodes(rootNode, childrenTree),
  };
}
