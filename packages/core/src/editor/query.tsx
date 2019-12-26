import React from "react";
import {
  Nodes,
  NodeId,
  SerializedNodeData,
  EditorState,
  Indicator,
  Node,
  Options,
} from "../interfaces";
import { isCanvas, isRoot } from "../nodes";
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
  ERROR_CANNOT_DRAG,
  ERROR_MOVE_ROOT_CANVAS,
} from "@craftjs/utils";
import findPosition from "../events/findPosition";
import { getDeepNodes } from "../utils/getDeepNodes";
import { transformJSXToNode } from "../utils/transformJSX";

/**
 * Editor methods used to query nodes
 * @param nodes
 */

const getNodeFromIdOrNode = (node: NodeId | Node, cb: (id: NodeId) => Node) => typeof node === "string" ? cb(node) : node;

export function QueryMethods(Editor: EditorState) {
  const _ = <T extends keyof QueryCallbacksFor<typeof QueryMethods>>(name: T) =>
    QueryMethods(Editor)[name];
  const options = Editor  && Editor.options;
  return {
    getOptions(): Options {
      return options;
    },
    getNode(id: NodeId) {
      return Editor.nodes[id];
    },
    createNode(child: React.ReactElement | string, extras?: any) {
      const node = transformJSXToNode(child, extras);
      const name = resolveComponent(
        options.resolver,
        node.data.type
      );
      invariant(name, ERRROR_NOT_IN_RESOLVER);
      node.data.displayName = node.data.displayName || name;
      node.data.name = name;
      return node;
    },
    getDeepNodes(id: NodeId, deep: boolean = true) {
      return getDeepNodes(Editor.nodes, id, deep);
    },
    getAllParents(nodeId: NodeId, result: NodeId[] = []) {
      const node = Editor.nodes[nodeId];
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
          if (isCanvas(Editor.nodes[id])) return true;
          return false;
        }
      );
    },
    serialize(): string {
      const simplifiedNodes = Object.keys(Editor.nodes).reduce((result: any, id: NodeId) => {
        const {
          data: { ...data },
        } = Editor.nodes[id];
        result[id] = serializeNode({ ...data }, options.resolver);
        return result;
      }, {});

      return JSON.stringify(simplifiedNodes);
    },
    deserialize(json: string): Nodes {
      const reducedNodes: Record<NodeId, SerializedNodeData> = JSON.parse(json);
      return Object.keys(reducedNodes).reduce((accum: Nodes, id) => {
        const {
          type: Comp,
          props,
          parent,
          nodes,
          _childCanvas,
          isCanvas,
          name,
        } = deserializeNode(reducedNodes[id], options.resolver);
        if (!Comp) return accum;

        accum[id] = _("createNode")(<Comp {...props} />, {
          id,
          data: {
            ...(isCanvas && { isCanvas }),
            parent,
            ...(isCanvas && { nodes }),
            ...(_childCanvas && { _childCanvas }),
          },
        });
        return accum;
      }, {});
    },
    canDragNode: (node: Node | NodeId) => {
      const targetNode = getNodeFromIdOrNode(node, (id) => Editor.nodes[id]);
      if ( !isRoot(targetNode) ) {
        invariant(isCanvas(targetNode.data.parent) == true, ERROR_MOVE_ROOT_CANVAS);
        invariant(targetNode.rules.canDrag(targetNode), ERROR_CANNOT_DRAG);
      }

      return true;
    },
    canDropInParent: (node: Node | NodeId, newParent: NodeId) => {
      const targetNode = getNodeFromIdOrNode(node, (id) => Editor.nodes[id]);

      const currentParentNode =
          targetNode.data.parent &&
          Editor.nodes[targetNode.data.parent],
        newParentNode = Editor.nodes[newParent];

      invariant(
        currentParentNode ||
          (!currentParentNode && !Editor.nodes[targetNode.id]),
        ERROR_DUPLICATE_NODEID
      );

      invariant(
        (targetNode.id !== ROOT_NODE && newParent) ||
          (targetNode.id === ROOT_NODE && !newParent),
        ERROR_NOPARENT
      );

      if (newParent) {
        invariant(isCanvas(newParentNode), ERROR_MOVE_TO_NONCANVAS_PARENT);
        invariant(
          newParentNode.rules.canMoveIn(targetNode, newParentNode),
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
          currentParentNode.rules.canMoveOut(targetNode, currentParentNode),
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
        Editor.nodes[node.id].dom
    ) => {
      if (source === target) return;
      const targetNode = Editor.nodes[target],
        isTargetCanvas = isCanvas(targetNode);

      

      const targetParent =
          (isTargetCanvas) ? targetNode
            : Editor.nodes[targetNode.data.parent];

      const targetParentNodes = targetParent.data._childCanvas
        ? Object.values(targetParent.data._childCanvas)
        : targetParent.data.nodes || [];

      const dimensionsInContainer = targetParentNodes ? targetParentNodes.reduce(
        (result, id: NodeId) => {
          const dom = nodesToDOM(Editor.nodes[id]);
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
        ? Editor.nodes[targetParentNodes[dropAction.index]]
        : null;

      const output: Indicator = {
        placement: {
          ...dropAction,
          currentNode,
        },
        error: null,
      };

      try {
        _("canDragNode")(source);
        _("canDropInParent")(source, targetParent.id);
      } catch (error) {
        output.error = error;
      }

      return output;
    },
  };
}
