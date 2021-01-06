/* eslint-disable no-param-reassign */
import { EditorState, Node } from '@craftjs/core';
import forIn from 'lodash/forIn';

import deleteNodes from './deleteNodes';

// Merge any adjacent Slate nodes
export default function mergeElements(
  rootType: any,
  state: EditorState,
  onDeleteCallback?: Function
) {
  const nodesToDelete: string[][] = [];
  forIn(state.nodes, (node) => {
    if (!node.data.nodes) {
      return node;
    }

    let lastNode: Node | null = null;
    const childNodesIds = new Set<string>();

    node.data.nodes.forEach((id) => {
      const childNode = state.nodes[id];

      if (!childNode) {
        return;
      }

      childNodesIds.add(id);

      if (childNode.data.type !== rootType) {
        lastNode = null;
        return;
      }

      if (lastNode) {
        if (lastNode.data.nodes) {
          // reverse the nodes so we can add it in the correct order via unshift()
          lastNode.data.nodes.reverse().forEach((childNodeId) => {
            state.nodes[childNodeId].data.parent = childNode.id;
            childNode.data.nodes.unshift(childNodeId);
          });
        }

        childNodesIds.delete(lastNode.id);
        nodesToDelete.push([lastNode.id, childNode.id]);
      }

      lastNode = childNode;

      if (!childNode.data.nodes) {
        return;
      }

      // Remove the matched element if it has no child nodes (or contains child Nodes that are all marked for deletion)
      const deletedIds = nodesToDelete.map(([deletedId]) => deletedId);
      if (
        childNode.data.nodes.length === 0 ||
        childNode.data.nodes.every((childNodeId) =>
          deletedIds.includes(childNodeId)
        )
      ) {
        nodesToDelete.push([id]);
        if (onDeleteCallback) {
          onDeleteCallback(childNode, nodesToDelete);
        }
      }
    });

    node.data.nodes = Array.from(childNodesIds);

    return node;
  });

  // Cleanup deleted Nodes
  deleteNodes(state, nodesToDelete);
}
