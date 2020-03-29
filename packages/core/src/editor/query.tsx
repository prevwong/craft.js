import React from "react";
import {
  NodeId,
  EditorState,
  Indicator,
  Node,
  Options,
  NodeInfo,
} from "../interfaces";
import { serializeNode } from "../utils/serializeNode";
import { resolveComponent } from "../utils/resolveComponent";
import invariant from "tiny-invariant";
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
  getDOMInfo,
  ERROR_CANNOT_DRAG,
  ERROR_MOVE_TOP_LEVEL_CANVAS,
  ERROR_MOVE_ROOT_NODE,
  ERROR_INVALID_NODE_ID,
} from "@craftjs/utils";
import findPosition from "../events/findPosition";
import { getDeepNodes } from "../utils/getDeepNodes";
import { transformJSXToNode } from "../utils/transformJSX";

export function QueryMethods(Editor: EditorState) {
  const options = Editor && Editor.options;

  const _: () => QueryCallbacksFor<typeof QueryMethods> = () =>
    QueryMethods(Editor);

  const getNodeFromIdOrNode = (node: NodeId | Node) =>
    typeof node === "string" ? Editor.nodes[node] : node;

  return {
    /**
     * Get the current Editor options
     */
    getOptions(): Options {
      return options;
    },
    /**
     * Get a Node representing the specified React Element
     * @param child
     * @param extras
     */
    createNode(child: React.ReactElement | string, extras?: any) {
      const node = transformJSXToNode(child, extras);
      const name = resolveComponent(options.resolver, node.data.type);
      invariant(name !== null, ERRROR_NOT_IN_RESOLVER);
      node.data.displayName = node.data.displayName
        ? node.data.displayName
        : name;

      node.data.name = name;
      return node;
    },
    /**
     * Retrieve the JSON representation of the editor's Nodes
     */
    serialize(): string {
      const simplifiedNodes = Object.keys(Editor.nodes).reduce(
        (result: any, id: NodeId) => {
          const {
            data: { ...data },
          } = Editor.nodes[id];
          result[id] = serializeNode({ ...data }, options.resolver);
          return result;
        },
        {}
      );

      const json = JSON.stringify(simplifiedNodes);

      return json;
    },
    /**
     * Determine the best possible location to drop the source Node relative to the target Node
     */
    getDropPlaceholder: (
      source: NodeId | Node,
      target: NodeId,
      pos: { x: number; y: number },
      nodesToDOM: (node: Node) => HTMLElement = (node) =>
        Editor.nodes[node.id].dom
    ) => {
      if (source === target) return;
      const sourceNodeFromId =
          typeof source == "string" && Editor.nodes[source],
        targetNode = Editor.nodes[target],
        isTargetCanvas = _().node(targetNode.id).isCanvas();

      const targetParent = isTargetCanvas
        ? targetNode
        : Editor.nodes[targetNode.data.parent];

      const targetParentNodes = targetParent.data._childCanvas
        ? Object.values(targetParent.data._childCanvas)
        : targetParent.data.nodes || [];

      const dimensionsInContainer = targetParentNodes
        ? targetParentNodes.reduce((result, id: NodeId) => {
            const dom = nodesToDOM(Editor.nodes[id]);
            if (dom) {
              const info: NodeInfo = {
                id,
                ...getDOMInfo(dom),
              };

              result.push(info);
            }
            return result;
          }, [] as NodeInfo[])
        : [];

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
        error: false,
      };

      // If source Node is already in the editor, check if it's draggable
      if (sourceNodeFromId) {
        _()
          .node(sourceNodeFromId.id)
          .isDraggable((err) => (output.error = err));
      }

      // Check if source Node is droppable in target
      _()
        .node(targetParent.id)
        .isDroppable(source, (err) => (output.error = err));

      return output;
    },
    /**
     * Helper methods to describe the specified Node
     * @param id
     */
    node(id: NodeId) {
      invariant(typeof id == "string", ERROR_INVALID_NODE_ID);

      const node = Editor.nodes[id];
      const nodeQuery = _().node;

      return {
        isCanvas: () => node.data.isCanvas,
        isRoot: () => node.id === ROOT_NODE,
        isTopLevelCanvas: () =>
          !nodeQuery(node.id).isRoot() &&
          !node.data.parent.startsWith("canvas-"),
        isDeletable: () =>
          !nodeQuery(id).isRoot() &&
          (nodeQuery(id).isCanvas() ? !nodeQuery(id).isTopLevelCanvas() : true),
        isParentOfTopLevelCanvas: () => !!node.data._childCanvas,
        get: () => node,
        ancestors: (result = []) => {
          const parent = node.data.parent;
          if (parent) {
            result.push(parent);
            nodeQuery(parent).ancestors(result);
          }
          return result;
        },
        decendants: (deep = false) => {
          return getDeepNodes(Editor.nodes, id, deep);
        },
        isDraggable: (onError?: (err: string) => void) => {
          try {
            const targetNode = node;
            invariant(!nodeQuery(targetNode.id).isRoot(), ERROR_MOVE_ROOT_NODE);
            if (!nodeQuery(targetNode.id).isRoot()) {
              invariant(
                nodeQuery(targetNode.data.parent).isCanvas() === true,
                ERROR_MOVE_TOP_LEVEL_CANVAS
              );
              invariant(
                targetNode.rules.canDrag(targetNode, _().node),
                ERROR_CANNOT_DRAG
              );
            }
            return true;
          } catch (err) {
            if (onError) onError(err);
            return false;
          }
        },
        isDroppable: (
          target: NodeId | Node,
          onError?: (err: string) => void
        ) => {
          try {
            const targetNode = getNodeFromIdOrNode(target);

            const currentParentNode =
                targetNode.data.parent && Editor.nodes[targetNode.data.parent],
              newParentNode = node;

            invariant(
              currentParentNode ||
                (!currentParentNode && !Editor.nodes[targetNode.id]),
              ERROR_DUPLICATE_NODEID
            );

            invariant(
              nodeQuery(newParentNode.id).isCanvas(),
              ERROR_MOVE_TO_NONCANVAS_PARENT
            );
            invariant(
              newParentNode.rules.canMoveIn(
                targetNode,
                newParentNode,
                _().node
              ),
              ERROR_MOVE_INCOMING_PARENT
            );

            if (currentParentNode) {
              const targetDeepNodes = nodeQuery(targetNode.id).decendants();
              invariant(targetNode.data.parent, ERROR_MOVE_NONCANVAS_CHILD);
              invariant(
                !targetDeepNodes.includes(newParentNode.id),
                ERROR_MOVE_TO_DESCENDANT
              );
              invariant(
                currentParentNode.rules.canMoveOut(
                  targetNode,
                  currentParentNode,
                  _().node
                ),
                ERROR_MOVE_OUTGOING_PARENT
              );
            }
            return true;
          } catch (err) {
            if (onError) onError(err);
            return false;
          }
        },
      };
    },
  };
}
