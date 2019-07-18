import { Nodes, NodeId, SerializedNodeData, ManagerState, Resolver, TreeNode, NodeData, Node, Options } from "../interfaces";
import { isCanvas, Canvas } from "../nodes";
import { serializeNode } from "../shared/serializeNode";
import { createNode } from "../shared/createNode";
import { deserializeNode } from "../shared/deserializeNode";
import { QueryCallbacksFor } from "../shared/createReduxMethods";
import produce from "immer";
import { resolveComponent } from "../shared/resolveComponent";
import invariant from "invariant";

/**
 * Manager methods used to query nodes 
 * @param nodes 
 */

export function QueryMethods(manager: ManagerState, options: Options) {
  const _self = <T extends keyof QueryCallbacksFor<typeof QueryMethods>>(name: T) => (QueryMethods(manager, options)[name]);
  return {
    createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId): Node {
      let node = produce({}, (node: Node) => {
        node.id = id;
        node.data = {
          ...data,
          props: {
            ...data.props
          }
        };
    
        node.ref = {
          event: {
            active:false,
            dragging: false,
            hover: false
          },
          dom: null,
          canDrag: () => {}
        }

        if ( isCanvas(node) ) {
          node.data.subtype = data.subtype ? data.subtype : node.data.props.is ? node.data.props.is : 'div';
          delete node.data.props['is'];
          node.ref.incoming = () => true;
          node.ref.outgoing = () => true;
        }

        // check type
        const name = resolveComponent(options.resolver, node.data.subtype ? node.data.subtype : node.data.type);
        invariant(name, "The node you're trying to create does not exist in the resolver.");

        node.data.name = name;
      }) as Node;
    
      return node;
    },
    getTree(cur = "rootNode", canvasName?: string) {
      let tree: Record<NodeId, TreeNode> = {};
      const node = manager.nodes[cur];
      if (!node) return null;
      const { id } = node;
      tree[id] = {
        ...node
      }
      // if (canvasName) tree[id].canvasName = canvasName;

      if (node.data._childCanvas || node.data.nodes) tree[id].children = {};
      if (node.data._childCanvas) {
        Object.keys(node.data._childCanvas).forEach(canvasName => {
          const virtualId = node.data._childCanvas[canvasName]
          tree[id].children[virtualId] = _self('getTree')(virtualId, canvasName);
        });
      } else if (node.data.nodes) {
        const childNodes = node.data.nodes;
        // tree[id].data.nodes = childNodes;
        childNodes.forEach((nodeId: NodeId) => {
          tree[id].children[nodeId] = _self('getTree')(nodeId);
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
        const { type, subtype, props, parent, closestParent, nodes, _childCanvas, name } = deserializeNode(reducedNodes[id], resolver);
        if ( !type ) return accum;
        
        accum[id] = createNode({
          type,
          props,
          name,
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
