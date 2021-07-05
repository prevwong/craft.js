/* eslint-disable no-param-reassign */
import { EditorState, NodeEventTypes } from '@craftjs/core';

export default function deleteNodes(
  state: EditorState,
  nodesToDelete: string[][]
) {
  // Cleanup deleted Nodes
  nodesToDelete.reverse().forEach(([deletedNodeId, replacedNodeId]) => {
    const deletedNode = state.nodes[deletedNodeId];

    // Node may have already been deleted
    if (!deletedNode) {
      return;
    }

    Object.keys(state.events).forEach((key: NodeEventTypes) => {
      if (state.events[key] && state.events[key].has(deletedNodeId)) {
        state.events[key] = new Set();

        if (replacedNodeId && state.nodes[replacedNodeId]) {
          state.events[key].add(replacedNodeId);
          state.nodes[replacedNodeId].events[key] = true;
        } else {
          const parentId = state.nodes[deletedNodeId].data.parent;

          if (state.nodes[parentId]) {
            state.events[key].add(parentId);
          }
        }
      }
    });

    const parent = state.nodes[deletedNode.data.parent];
    // Remove deletedNode id from parent.data.nodes
    if (parent && parent.data.nodes) {
      const deletedNodeIndex = parent.data.nodes.indexOf(deletedNodeId);
      if (deletedNodeIndex > -1) {
        parent.data.nodes.splice(deletedNodeIndex, 1);
      }
    }

    delete state.nodes[deletedNodeId];
  });
}
