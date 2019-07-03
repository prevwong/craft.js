import { NodeId, Node, CanvasNode } from "../interfaces";
import { CallbacksFor, MethodRecordBase, ActionUnion } from "use-methods";
import { ManagerState } from "../interfaces";
import { isCanvas } from "../utils";
import produce from "immer";

const ManagerMethods = (state: ManagerState) => ({
  setRef: (id: NodeId, ref: "dom" | "outgoing" | "incoming" | "canDrag" | "props", value: any) => {
    if (!["dom", "outgoing", "incoming", "canDrag", "props"].includes(ref)) { throw new Error(); }
    let node = state.nodes[id];
    if (isCanvas(node)) (node as CanvasNode).ref[ref] = value;
    else node.ref[ref as "dom" | "canDrag"] = value;
  },
  pushChildCanvas(id: NodeId, canvasName: string, newNode: Node) {
    if (!state.nodes[id].data._childCanvas) state.nodes[id].data._childCanvas = {};
    newNode.data.closestParent = id;
    state.nodes[id].data._childCanvas[canvasName] = newNode.id;
    state.nodes[newNode.id] = newNode;
  },
  setNodeEvent(eventType: "active" | "hover" | "dragging", id: NodeId) {
    if (!["active", "hover", "dragging"].includes(eventType)) throw new Error(`Undefined event "${eventType}, expected either "active", "hover" or "dragging".`);
    const current = state.events[eventType];
    if (current && current.id !== id) {
      state.nodes[current.id].data.event[eventType] = false;
    }

    if (id) {
      state.nodes[id].data.event[eventType] = true
      state.events[eventType] = state.nodes[id];
    } else {
      state.events[eventType] = null;
    }
  },
  add(parentId: NodeId, nodes: Node[] | Node) {
    if (parentId && !(state.nodes[parentId] as CanvasNode).data.nodes) (state.nodes[parentId] as CanvasNode).data.nodes = []
    if ( !Array.isArray(nodes) ) nodes = [nodes];
    (nodes as Node[]).forEach(node => {
      state.nodes[node.id] = node;
      if (parentId) (state.nodes[parentId] as CanvasNode).data.nodes.push(node.id);
    });
  },
  move(targetId: NodeId, newParentId: NodeId, index: number) {
    const targetNode = state.nodes[targetId],
      currentParentNodes = (state.nodes[targetNode.data.parent] as CanvasNode).data.nodes,
      newParentNodes = (state.nodes[newParentId] as CanvasNode).data.nodes;

    currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";
    newParentNodes.splice(index, 0, targetId);
    state.nodes[targetId].data.parent = newParentId;
    state.nodes[targetId].data.closestParent = newParentId;
    currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
  },
  setProp(id: NodeId, cb: <T>(props: T) => void) {
    state.nodes[id].data.props = produce(state.nodes[id].data.props, draft => cb(draft));
  },
});


// type FactoryManagerMethods<S = any, O = any, R extends MethodRecordBase<S> = any> = (state: S, options: O) => R;
// type GetFactoryManagerMethods<M extends FactoryManagerMethods> = M extends FactoryManagerMethods<any, any, infer R>
//   ? {
//       [T in ActionUnion<R>['type']]: (...args: ActionUnion<R>['payload']) => void
//     }
//   : never;

export type ManagerMethods = CallbacksFor<typeof ManagerMethods>
export default ManagerMethods;