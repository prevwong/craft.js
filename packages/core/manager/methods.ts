import { NodeId, Node, Nodes, NodeRef } from "../interfaces";
import { CallbacksFor } from "use-methods";
import { ManagerState } from "../interfaces";
import { isCanvas } from "../nodes";
import produce from "immer";
const invariant = require('invariant');

const ManagerMethods = (state: ManagerState) => ({
  pushChildCanvas(id: NodeId, canvasName: string, newNode: Node) {
    if (!state.nodes[id].data._childCanvas) state.nodes[id].data._childCanvas = {};
    newNode.data.closestParent = id;
    state.nodes[id].data._childCanvas[canvasName] = newNode.id;
    state.nodes[newNode.id] = newNode;
  },
  setNodeEvent(eventType: "active" | "hover" | "dragging", id: NodeId) {
    const current = state.events[eventType];
    if (current ) {
      state.nodes[current.id].ref.event[eventType] = false;
    }

    if (id) {
      state.nodes[id].ref.event[eventType] = true
      state.events[eventType] = state.nodes[id];
    } else {
      // if ( eventType === 'dragging') return;
      state.events[eventType] = null;
    }
  },
  replaceNodes(nodes: Nodes) {
    state.nodes = nodes;
  },
  add(parentId: NodeId, nodes: Node[] | Node) {
    if (parentId && !state.nodes[parentId].data.nodes) state.nodes[parentId].data.nodes = []
    if (!Array.isArray(nodes)) nodes = [nodes];
    (nodes as Node[]).forEach(node => {
      state.nodes[node.id] = node;
      if (parentId) state.nodes[parentId].data.nodes.push(node.id);
    });
  },
  move(targetId: NodeId, newParentId: NodeId, index: number) {
    const targetNode = state.nodes[targetId],
      currentParentNodes = state.nodes[targetNode.data.parent].data.nodes,
      newParentNodes = state.nodes[newParentId].data.nodes;

    currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    newParentNodes.splice(index, 0, targetId);
    state.nodes[targetId].data.parent = newParentId;
    // state.nodes[targetId].data.closestParent = newParentId;
    currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);

  },
  setProp(id: NodeId, cb: <T>(props: T) => void) {
    cb(state.nodes[id].data.props);
  },
  setRef(id: NodeId, ref: keyof NodeRef, value: any) {
    state.nodes[id].ref[ref] = value;
  }
});


// type FactoryManagerMethods<S = any, O = any, R extends MethodRecordBase<S> = any> = (state: S, options: O) => R;
// type GetFactoryManagerMethods<M extends FactoryManagerMethods> = M extends FactoryManagerMethods<any, any, infer R>
//   ? {
//       [T in ActionUnion<R>['type']]: (...args: ActionUnion<R>['payload']) => void
//     }
//   : never;

export type ManagerMethods = CallbacksFor<typeof ManagerMethods>
export default ManagerMethods;