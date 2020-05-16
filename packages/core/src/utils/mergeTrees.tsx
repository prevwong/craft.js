import { Node, Tree } from "../interfaces";

const mergeNodes = (rootNode: Node, childrenNodes: Tree[]) => {
  if (childrenNodes.length < 1) {
    return { [rootNode.id]: rootNode };
  }
  const nodes = childrenNodes.map(({ rootNodeId }) => rootNodeId);
  const nodeWithChildren = { ...rootNode, data: { ...rootNode.data, nodes } };
  const rootNodes = { [rootNode.id]: nodeWithChildren };
  return childrenNodes.reduce((accum, tree) => {
    const currentNode = tree.nodes[tree.rootNodeId];
    return {
      ...accum,
      ...tree.nodes,
      // set the parent id for the current node
      [currentNode.id]: {
        ...currentNode,
        data: {
          ...currentNode.data,
          parent: rootNode.id,
        },
      },
    };
  }, rootNodes);
};

export const mergeTrees = (rootNode: Node, childrenNodes: Tree[]): Tree => ({
  rootNodeId: rootNode.id,
  nodes: mergeNodes(rootNode, childrenNodes),
});
