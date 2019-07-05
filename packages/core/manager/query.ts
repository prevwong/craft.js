import { Nodes, NodeId, Node, NodeData, SerializedNodeData, Resolver } from "../interfaces";
import { Methods, ActionUnion, ActionByType } from "use-methods";
import { isCanvas, Canvas } from "../nodes";
import { serializeNode } from "../shared/serializeNode";
import { createNode } from "../shared/createNode";
import { deserializeNode } from "../shared/deserializeNode";

/**
 * Manager methods used to query nodes 
 * @param nodes 
 */

export function QueryMethods(nodes: Nodes) {
  const _self = <T extends keyof QueryMethods>(name: T) => (QueryMethods(nodes)[name]);

  return {
    getTree(cur = "rootNode", canvasName?: string) {
      let tree: any = {};
      const node = nodes[cur];
      if (!node) return null;
      const { id } = node;
      tree[id] = {
        ...node
      }
      if (canvasName) tree[id].canvasName = canvasName;

      if (node.data._childCanvas || node.data.nodes) tree[id].children = {};
      if (node.data._childCanvas) {
        Object.keys(node.data._childCanvas).forEach(canvasName => {
          const virtualId = node.data._childCanvas[canvasName]
          tree[id].children[virtualId] = this(nodes, virtualId, canvasName);
        });
      } else if (node.data.nodes) {
        const childNodes = node.data.nodes;
        tree[id].nodes = childNodes;
        childNodes.forEach((nodeId: NodeId) => {
          tree[id].children[nodeId] = this(nodes, nodeId);
        });
      }

      return tree[id];
    },
    getDeepNodes(id: NodeId, result: NodeId[] = []) {
      result.push(id);
      const node = nodes[id];
      if (node.data._childCanvas) {
        Object.keys(node.data._childCanvas).map(canvasName => {
          const virtualId = node.data._childCanvas[canvasName];
          _self('getDeepNodes')(virtualId, result);
        })
      } else if (node.data.nodes) {
        const childNodes = node.data.nodes;
        childNodes.forEach(nodeId => {
          _self('getDeepNodes')(nodeId, result);
        });
      }
      return result;
    },
    getAllParents(nodeId: NodeId, result: NodeId[] = []) {
      const node = nodes[nodeId];
      const parent = node.data.closestParent;
      if (parent) {
        result.push(parent);
        _self('getAllParents')(parent, result);
      }
      return result;
    },
    getAllCanvas() {
      return Object.keys(nodes).filter(id => {
        if (isCanvas(nodes[id])) return true;
        return false;
      })
    },
    serialize(): string {
      return (Object.keys(nodes).reduce((result: any, id: NodeId) => {
        const { data: { event, ...data } } = nodes[id];
        result[id] = serializeNode({ ...data })
        return result;
      }, {}));
    },
    deserialize(json: string, resolver: Resolver): Nodes {
      const reducedNodes: Record<NodeId, SerializedNodeData> = JSON.parse(json);
      return Object.keys(reducedNodes).reduce((accum: Nodes, id) => {
        const { type, subtype, props, parent, closestParent, nodes, _childCanvas } = deserializeNode(reducedNodes[id], resolver);
        accum[id] = createNode({
          type,
          props,
          parent,
          closestParent,
          ...(type === Canvas && {subtype, nodes}),
          ...(_childCanvas && {_childCanvas})
        }, id);
        return accum;
      }, {});
    }
  }
};

export type CallbacksFor<M extends Methods> = M extends Methods<any, infer R>
  ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => ReturnType<R[T]>
  }
  : never;

export type QueryMethods = CallbacksFor<typeof QueryMethods>;