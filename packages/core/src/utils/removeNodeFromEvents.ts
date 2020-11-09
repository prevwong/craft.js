import { EditorState, NodeId } from '../interfaces';

export const removeNodeFromEvents = (state: EditorState, nodeId: NodeId) =>
  Object.keys(state.events).forEach((key) => {
    const eventSet = state.events[key];
    if (eventSet && eventSet.has && eventSet.has(nodeId)) {
      state.events[key] = new Set(
        Array.from(eventSet).filter((id) => nodeId !== id)
      );
    }
  });
