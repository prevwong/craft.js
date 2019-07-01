import { NodeId, Node, CanvasNode } from "../interfaces";
import { CallbacksFor, MethodRecordBase, ActionUnion } from "use-methods";
import { ManagerState } from "../interfaces";
import { isCanvas } from "../utils";

export const PublicManagerMethods = (state: ManagerState) => {
  return {
    add(parentId: NodeId, nodes: Node[] | Node) {
      if (parentId && !(state.nodes[parentId] as CanvasNode).data.nodes) (state.nodes[parentId] as CanvasNode).data.nodes = []

      if (Array.isArray(nodes)) {
        (nodes as Node[]).forEach(node => {
          state.nodes[node.id] = node;
          if (parentId) (state.nodes[parentId] as CanvasNode).data.nodes.push(node.id);
        });
      } else {
        const node = nodes as Node;
        state.nodes[node.id] = node;
        if (parentId) (state.nodes[parentId] as CanvasNode).data.nodes.push(node.id);
      }
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
    }
  }
};

const ManagerMethods = (state: ManagerState) => ({
  setRef: (id: NodeId, ref: "dom" | "outgoing" | "incoming" | "canDrag", value: any) => {
    if (!["dom", "outgoing", "incoming", "canDrag"].includes(ref)) { throw new Error(); }
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
    if (current) {
      state.nodes[current.id].data.event[eventType] = false;
    }
    
    if (id) {
      state.nodes[id].data.event[eventType] = true
      state.events[eventType] = state.nodes[id];
    } else {
      state.events[eventType] = null;
    }
  },
  ...PublicManagerMethods(state)
});

export type PublicManagerMethods = CallbacksFor<typeof PublicManagerMethods>

// type FactoryManagerMethods<S = any, O = any, R extends MethodRecordBase<S> = any> = (state: S, options: O) => R;
// type GetFactoryManagerMethods<M extends FactoryManagerMethods> = M extends FactoryManagerMethods<any, any, infer R>
//   ? {
//       [T in ActionUnion<R>['type']]: (...args: ActionUnion<R>['payload']) => void
//     }
//   : never;

export type ManagerMethods = CallbacksFor<typeof ManagerMethods>
export default ManagerMethods;