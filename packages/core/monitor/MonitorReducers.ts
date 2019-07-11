import { NodeId, Node } from "../interfaces";
import { CallbacksFor } from "use-methods";
import { MonitorState, NodeRef } from "../interfaces/monitor";
import produce from "immer";

export type MonitorReducers = CallbacksFor<typeof MonitorReducers>
export const MonitorReducers = (state: MonitorState) => ({
  setRef(id: NodeId, ref: keyof NodeRef, value: any) {
    if (!state.nodes[id]) state.nodes[id] = produce({}, draft => ({
      dom: null,
      event: {
        active: false,
        dragging: false,
        hover: false
      },
      canDrag: () => true,
      outgoing: () => true,
      incoming: () => true
    }));
    state.nodes[id][ref] = value;
    console.log("done set ref", id)
  },
  setNodeEvent(eventType: "active" | "hover" | "dragging", node: Node) {
    const current = state.events[eventType];

    if (node) {
      if (current) {
        if (current === node.id) return;
        else state.nodes[current].event[eventType] = false;
      }
      state.nodes[node.id].event[eventType] = true
      state.events[eventType] = node.id
    } else {
      state.events[eventType] = null;
    }
  },
})