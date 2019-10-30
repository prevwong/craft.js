import React from "react";
import {
  Nodes,
  NodeId,
  SerializedNodeData,
  ManagerState,
  Resolver,
  NodeData,
  Node,
  Options,
} from "../interfaces";
import { isCanvas, Canvas } from "../nodes";
import { serializeNode } from "../utils/serializeNode";
import { deserializeNode } from "../utils/deserializeNode";
import { resolveComponent } from "../utils/resolveComponent";
import invariant from "invariant";
import {
  QueryCallbacksFor,
  ROOT_NODE,
  ERRROR_NOT_IN_RESOLVER,
  ERROR_MOVE_TO_NONCANVAS_PARENT,
  ERROR_MOVE_OUTGOING_PARENT,
  ERROR_MOVE_INCOMING_PARENT,
  ERROR_MOVE_TO_DESCENDANT,
  ERROR_MOVE_NONCANVAS_CHILD,
  ERROR_DUPLICATE_NODEID,
  ERROR_NOPARENT,
  getDOMInfo,
} from "craftjs-utils";
import findPosition from "../dnd/findPosition";
import { PlaceholderInfo } from "../dnd/interfaces";
import { getDeepNodes } from "../utils/getDeepNodes";
import { transformJSXToNode } from "../utils/transformJSX";

/**
 * Manager methods used to query nodes
 * @param nodes
 */

export function QueryMethods(manager: ManagerState, options: Options) {
  const _ = <T extends keyof QueryCallbacksFor<typeof QueryMethods>>(name: T) =>
    QueryMethods(manager, options)[name];
  return {
    getOptions(): Options {
      return options;
    },
    getNode(id: NodeId) {
      return manager.nodes[id];
    },
    transformJSXToNode(child: React.ReactElement | string, extras?: any) {
      const node = transformJSXToNode(child, extras);
      const name = resolveComponent(
        options.resolver,
        node.data.subtype ? node.data.subtype : node.data.type
      );
      invariant(name, ERRROR_NOT_IN_RESOLVER);
      node.data.name = name;
      return node;
    },
    getDeepNodes(id: NodeId, deep: boolean = true) {
      return getDeepNodes(manager.nodes, id, deep);
    },
    getAllParents(nodeId: NodeId, result: NodeId[] = []) {
      const node = manager.nodes[nodeId];
      const parent = node.data.parent;
      if (parent) {
        result.push(parent);
        _("getAllParents")(parent, result);
      }
      return result;
    },
    getAllCanvas(parent: NodeId = ROOT_NODE) {
      const bound = _("getDeepNodes")(parent);

      return (parent === ROOT_NODE ? [ROOT_NODE, ...bound] : bound).filter(
        id => {
          if (isCanvas(manager.nodes[id])) return true;
          return false;
        }
      );
    },
    serialize(): string {
      return Object.keys(manager.nodes).reduce((result: any, id: NodeId) => {
        const {
          data: { ...data },
        } = manager.nodes[id];
        result[id] = serializeNode({ ...data }, options.resolver);
        return result;
      }, {});
    },
    deserialize(json: string): Nodes {
      const reducedNodes: Record<NodeId, SerializedNodeData> = JSON.parse(json);
      return Object.keys(reducedNodes).reduce((accum: Nodes, id) => {
        const {
          type: Comp,
          subtype,
          props,
          parent,
          nodes,
          _childCanvas,
          name,
        } = deserializeNode(reducedNodes[id], options.resolver);
        if (!Comp) return accum;

        accum[id] = _("transformJSXToNode")(<Comp {...props} />, {
          data: {
            parent,
            ...(Comp === Canvas && { subtype, nodes }),
            ...(_childCanvas && { _childCanvas }),
          },
        });
        return accum;
      }, {});
    },
    canDropInParent: (node: Node | NodeId, newParent: NodeId) => {
      const targetNode = typeof node === "string" ? manager.nodes[node] : node;
      const currentParentNode =
          targetNode.data.parent &&
          manager.nodes[targetNode.data.parent],
        newParentNode = manager.nodes[newParent];

        
      invariant(
        currentParentNode ||
          (!currentParentNode && !manager.nodes[targetNode.id]),
        ERROR_DUPLICATE_NODEID
      );

      // console.log(targetNode);
      invariant(
        (targetNode.id !== ROOT_NODE && newParent) ||
          (targetNode.id === ROOT_NODE && !newParent),
        ERROR_NOPARENT
      );

      if (newParent) {
        invariant(isCanvas(newParentNode), ERROR_MOVE_TO_NONCANVAS_PARENT);
        invariant(
          newParentNode.ref.incoming(targetNode),
          ERROR_MOVE_INCOMING_PARENT
        );
      }

      if (currentParentNode) {
        // moving
        const targetDeepNodes = _("getDeepNodes")(targetNode.id);
        invariant(targetNode.data.parent, ERROR_MOVE_NONCANVAS_CHILD);
        invariant(
          !targetDeepNodes.includes(newParent),
          ERROR_MOVE_TO_DESCENDANT
        );
        invariant(
          currentParentNode.ref.outgoing(targetNode),
          ERROR_MOVE_OUTGOING_PARENT
        );
      }

      return true;
    },
    getDropPlaceholder: (
      source: NodeId,
      target: NodeId,
      pos: { x: number; y: number },
      nodesToDOM: (node: Node) => HTMLElement = node =>
        manager.nodes[node.id].ref.dom
    ) => {
      // console.log(source, target);
      if (source === target) return;
      const targetNode = manager.nodes[target],
        isTargetCanvas = isCanvas(targetNode);

      const targetNodeInfo = getDOMInfo(nodesToDOM(targetNode));
      const targetParent =
          (isTargetCanvas) ? targetNode
            : manager.nodes[targetNode.data.parent];

      const targetParentNodes = targetParent.data._childCanvas
        ? Object.values(targetParent.data._childCanvas)
        : targetParent.data.nodes || [];

      // console.log("parent nodes", targetParentNodes);
      const dimensionsInContainer = targetParentNodes ? targetParentNodes.reduce(
        (result, id: NodeId) => {
          const dom = nodesToDOM(manager.nodes[id]);
          if (dom) {
            result.push({
              id,
              ...getDOMInfo(dom),
            });
          }
          return result;
        },
        []
      ): [];

      const dropAction = findPosition(
        targetParent,
        dimensionsInContainer,
        pos.x,
        pos.y
      );
      const currentNode = targetParentNodes.length
        ? manager.nodes[targetParentNodes[dropAction.index]]
        : null;

      // Prevent from dragging self into a descendant
      // if (
      //   ( _('getDeepNodes')(source).includes(targetNode.id))
      // ) return;
      const output: PlaceholderInfo = {
        placement: {
          ...dropAction,
          currentNode,
        },
        error: null,
      };

      try {
        _("canDropInParent")(source, targetParent.id);
      } catch (error) {
        output.error = error;
      }

      return output;
    },
  };
}
