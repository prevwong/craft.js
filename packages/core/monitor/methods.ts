import { NodeId, NodeRef, Node } from "../interfaces";

export const MonitorMethods = (state) => ({
  setRef(id: NodeId, ref: keyof NodeRef, value: any) {
    if (!state.nodes[id]) state.nodes[id] = {
      event: {},
      outgoing: () => true,
      incoming: () => true
    };
    state.nodes[id][ref] = value;
  },
  setNodeEvent(eventType: "active" | "hover" | "dragging", node: Node) {
    const current = state.events[eventType];

    if (node) {
      if (current) {
        if (current.id === node.id) return;
        else state.nodes[current.id].event[eventType] = false;
      }
      state.nodes[node.id].event[eventType] = true
      state.events[eventType] = {
        id: node.id,
        data: node.data,
        ref: state.nodes[node.id]
      }
    } else {
      state.events[eventType] = null;
    }
  },
})