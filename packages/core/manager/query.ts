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
import { QueryCallbacksFor } from "./useManagerCollector";

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
      let node = produce({}, (node: Node) => {
        node.id = id;
        node.data = {
          ...data,
          name: null,
          props: {
            ...data.props
          }
        };
        if ( !node.data.closestParent ) node.data.closestParent = node.data.parent;
        node.ref = {
          event: {
            active: false,
            selected: false,
            dragging: false,
            hover: false
          },
          dom: null,
          canDrag: () => true,
          incoming: () => true,
          outgoing: () => true
        }

        if (isCanvas(node)) {
          node.data.subtype = data.subtype ? data.subtype : node.data.props.is ? node.data.props.is : 'div';
          delete node.data.props['is'];
        }

        // check type
        const name = resolveComponent(options.resolver, node.data.subtype ? node.data.subtype : node.data.type);
        invariant(name, "The node you're trying to create does not exist in the resolver.");

        node.data.name = name;
      }) as Node;

      return node;
    },
    getDeepNodes(id: NodeId, deep: boolean = true) {
      function recursive(id: NodeId, result: NodeId[] = [], depth: number = 0) {
        const node = manager.nodes[id];
        if (deep || (!deep && depth == 0)) {
          if (node.data._childCanvas) {
            Object.keys(node.data._childCanvas).map(canvasName => {
              const virtualId = node.data._childCanvas[canvasName];
              result.push(virtualId);
              recursive(virtualId, result, depth + 1);
            })
          } else if (node.data.nodes) {
            const childNodes = node.data.nodes;
            childNodes.forEach(nodeId => {
              result.push(nodeId);
              recursive(nodeId, result, depth + 1);
            });
          }
        }
        return result;
      }
      
      return recursive(id)
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
    getAllCanvas(parent: NodeId = "rootNode") {
      const bound = _('getDeepNodes')(parent);

      return (parent === "rootNode" ? ["rootNode", ...bound] : bound).filter(id => {
        if (isCanvas(manager.nodes[id])) return true;
        return false;
      })
    },
    getAcceptingCanvases(id: NodeId): NodeId[] {
      const targetNode = manager.nodes[id];
      const { parent } = targetNode.data;

      const bound = (parent && !manager.nodes[parent].ref.outgoing(targetNode)) ? parent : "rootNode";
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
      targetParent = (isTargetCanvas && (isWithinBorders) || targetNode.id == "rootNode") ? targetNode : manager.nodes[targetNode.data.closestParent];

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
