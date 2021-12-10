import { EditorState, NodeId, EditorEvents } from '../interfaces';

export const removeNodeFromEvents = (state: EditorState, nodeId: NodeId) => {
  return Object.keys(state.events).forEach((key: keyof EditorEvents) => {
    if (!state.events[key].has(nodeId)) {
      return;
    }

    state.events[key].delete(nodeId);
  });
};
