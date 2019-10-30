import {Node, ManagerState, NodeId} from '../interfaces'
export const updateEventsNode = (state: ManagerState, id: NodeId) =>  {
  const node = state.nodes[id];
  Object.keys(state.events).forEach(key => {
    if ( state.events[key] && state.events[key].id == node.id ) {
      state.events[key] = node;
    }
  })
}