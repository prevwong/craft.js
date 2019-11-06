import {Node, ManagerState, NodeId, NodeEvents} from '../interfaces'
export const updateEventsNode = (state: ManagerState, id: NodeId, toDelete?: boolean) =>  {
  Object.keys(state.events).forEach((key: NodeEvents) => {
    if ( state.events[key] && state.events[key] == id ) {
      state.events[key] = toDelete ? null : id;
    }
  })
}