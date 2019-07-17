import { Nodes, NodeId, SerializedNodeData, ManagerState, Resolver } from "../interfaces";
import { isCanvas, Canvas } from "../nodes";
import { serializeNode } from "../shared/serializeNode";
import { createNode } from "../shared/createNode";
import { deserializeNode } from "../shared/deserializeNode";
import { QueryCallbacksFor } from "../shared/createReduxMethods";

/**
 * Manager methods used to query nodes 
 * @param nodes 
 */

export function QueryMethods(manager: ManagerState, options: any) {
  const _self = <T extends keyof QueryCallbacksFor<typeof QueryMethods>>(name: T) => (QueryMethods(manager, options)[name]);
  return {
    getTree(cur = "rootNode", canvasName?: string) {
      let tree: any = {};
      const node = manager.nodes[cur];
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
          tree[id].children[virtualId] = this(manager.nodes, virtualId, canvasName);
        });
      } else if (node.data.nodes) {
        const childNodes = node.data.nodes;
        tree[id].nodes = childNodes;
        childNodes.forEach((nodeId: NodeId) => {
          tree[id].children[nodeId] = this(manager.nodes, nodeId);
        });
      }

      return tree[id];
    },
    getDeepNodes(id: NodeId, result: NodeId[] = []) {
      // console.log(id, manager)
      result.push(id);
      const node = manager.nodes[id];
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
      const node = manager.nodes[nodeId];
      const parent = node.data.closestParent;
      if (parent) {
        result.push(parent);
        _self('getAllParents')(parent, result);
      }
      return result;
    },
    getAllCanvas() {
      return Object.keys(manager.nodes).filter(id => {
        if (isCanvas(manager.nodes[id])) return true;
        return false;
      })
    },
    serialize(): string {
      return (Object.keys(manager.nodes).reduce((result: any, id: NodeId) => {
        const { data: { ...data } } = manager.nodes[id];
        result[id] = serializeNode({ ...data }, options.resolver)
        return result;
      }, {}));
    },
    deserialize(json: string, resolver: Resolver): Nodes {
      const reducedNodes: Record<NodeId, SerializedNodeData> = JSON.parse(json);
      return Object.keys(reducedNodes).reduce((accum: Nodes, id) => {
        const { type, subtype, props, parent, closestParent, nodes, _childCanvas } = deserializeNode(reducedNodes[id], resolver);
        if ( !type ) return accum;
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
