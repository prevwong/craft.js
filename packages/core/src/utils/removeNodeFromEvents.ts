import { EditorState, NodeId } from '../interfaces';

export const removeNodeFromEvents = (state: EditorState, nodeId: NodeId) =>
  Object.keys(state.events).forEach((key) => {
    if (state.events[key] && state.events[key] === nodeId) {
      state.events[key] = null;
    }
  });
