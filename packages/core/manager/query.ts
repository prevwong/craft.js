import { Nodes, NodeId, SerializedNodeData, ManagerState, Resolver, NodeData, Node, Options } from "../interfaces";
import { isCanvas, Canvas } from "../nodes";
import { serializeNode } from "../utils/serializeNode";
import { deserializeNode } from "../utils/deserializeNode";
import produce from "immer";
import { resolveComponent } from "../utils/resolveComponent";
import invariant from "invariant";
import { getDOMInfo } from "../../shared/getDOMInfo";
import findPosition from "../dnd/findPosition";
import { PlaceholderInfo } from "../dnd/interfaces";
import { QueryCallbacksFor } from "./useInternalManager";
import { createNode } from "../utils/createNode";
import { ROOT_NODE } from "../utils/constants";
import { getDeepNodes } from "../utils/getDeepNodes";

/**
 * Manager methods used to query nodes 
 * @param nodes 
 */

export function QueryMethods(manager: ManagerState, options: Options) {
  const _ = <T extends keyof QueryCallbacksFor<typeof QueryMethods>>(name: T) => (QueryMethods(manager, options)[name]);
  return {
    getNode(id: NodeId) {
      return manager.nodes[id];
    },
    createNode(data: Partial<NodeData> & Pick<NodeData, 'type' | 'props'>, id?: NodeId): Node {
      const node = createNode(data, id);
      // check type
      const name = resolveComponent(options.resolver, node.data.subtype ? node.data.subtype : node.data.type);
      invariant(name, "The node you're trying to create does not exist in the resolver.");

      return node;
    },
    getDeepNodes(id: NodeId, deep: boolean = true) {
      return getDeepNodes(manager.nodes, id, deep);
    },
    getAllParents(nodeId: NodeId, result: NodeId[] = []) {
      const node = manager.nodes[nodeId];
      const parent = node.data.closestParent;
      if (parent) {
        result.push(parent);
        _('getAllParents')(parent, result);
      }
      return result;
    },
    getAllCanvas(parent: NodeId = ROOT_NODE) {
      const bound = _('getDeepNodes')(parent);

      return (parent === ROOT_NODE ? [ROOT_NODE, ...bound] : bound).filter(id => {
        if (isCanvas(manager.nodes[id])) return true;
        return false;
      })
    },
    getAcceptingCanvases(id: NodeId): NodeId[] {
      const targetNode = manager.nodes[id];
      const { parent } = targetNode.data;

      const bound = (parent && !manager.nodes[parent].ref.outgoing(targetNode)) ? parent : ROOT_NODE;
      const targetDeepNodes = _('getDeepNodes')(id);
      const canvases = _('getAllCanvas')(bound);
      const acceptedCanvases = canvases.reduce((res: NodeId[], id) => {
        const canvas = manager.nodes[id];
        if (canvas.ref.incoming(targetNode) && !targetDeepNodes.includes(id)) {
          res.push(id);
        }
        return res;
      }, []);

      return acceptedCanvases;

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
        if (!type) return accum;

        accum[id] = _('createNode')({
          type,
          props,
          name,
          parent,
          closestParent,
          ...(type === Canvas && { subtype, nodes }),
          ...(_childCanvas && { _childCanvas })
        }, id);
        return accum;
      }, {});
    },
    canDropInParent: (id: NodeId, parent: NodeId) => {
      const targetNode = manager.nodes[id],
            currentParentNode = manager.nodes[targetNode.data.parent],
            parentNode = manager.nodes[parent];

      // Test if parent is a Canvas
      invariant(isCanvas(parentNode), 'Parent is not a valid Canvas node');

      // Test if parent can move out of its' own parent
      invariant(currentParentNode.ref.outgoing(targetNode), 'Target node cannot be dragged out of its current parent');
      // Test if parent accepts target
      invariant(parentNode.ref.incoming(targetNode), 'Parent rejects target node');

      return true;
    },
    getDropPlaceholder: (
      source: NodeId, 
      target: NodeId, 
      pos : {x: number, y: number}, 
      nodesToDOM: (node: Node) => HTMLElement = (node) => manager.nodes[node.id].ref.dom
    ) => {
      if ( source === target ) return;
      const targetNode = manager.nodes[target],
        isTargetCanvas = isCanvas(targetNode);

      const targetNodeInfo = getDOMInfo(nodesToDOM(targetNode));
      const isWithinBorders = (
        pos.x > (targetNodeInfo.left + 5) && pos.x < (targetNodeInfo.right - 5) &&
        pos.y > (targetNodeInfo.top + 5) && pos.y < (targetNodeInfo.bottom - 5)
      ),
        targetParent = (isTargetCanvas && (isWithinBorders) || targetNode.id == ROOT_NODE) ? targetNode : manager.nodes[targetNode.data.closestParent];

      const targetParentNodes = 
          (targetParent.data._childCanvas) ? 
            Object.values(targetParent.data._childCanvas)
          : targetParent.data.nodes;

      
      const dimensionsInContainer = targetParentNodes.reduce((result, id: NodeId) => {
        const dom = nodesToDOM(manager.nodes[id]);
        if (dom ){ 
          result.push({
            id,
            ...getDOMInfo(dom)
          });
        }
        return result;
      }, []);

      const dropAction = findPosition(targetParent, dimensionsInContainer, pos.x, pos.y);
      const currentNode = targetParentNodes.length ? manager.nodes[targetParentNodes[dropAction.index]] : null;

      // Prevent from dragging self into a descendant
      if (
        ( _('getDeepNodes')(source).includes(targetNode.id))
      ) return;
      const output: PlaceholderInfo = {
        placement: {
          ...dropAction,
          currentNode
        },
        error: null
      };

      try {
        _('canDropInParent')(source, targetParent.id);
      } catch (error) {
        output.error = error;
      }

      return output;
    }
  }
};
