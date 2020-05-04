import React, { Fragment } from "react";
import {
  NodeId,
  EditorState,
  Indicator,
  Node,
  Options,
  NodeInfo,
  SerializedNodeData,
  Tree,
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
import { mergeTrees } from "../utils/mergeTrees";
import { getDeepNodes } from "../utils/getDeepNodes";
import { transformJSXToNode } from "../utils/transformJSX";

export function QueryMethods(state: EditorState) {
  const options = state && state.options;

  const _: () => QueryCallbacksFor<typeof QueryMethods> = () =>
    QueryMethods(state);

  const getNodeFromIdOrNode = (node: NodeId | Node) =>
    typeof node === "string" ? state.nodes[node] : node;

  return {
    /**
     * Get a Node representing the specified React Element
     * @param reactElement
     * @param extras
     */
    createNode(
      jsx: React.ReactElement,
      normalise?: (jsx: React.ReactElement, node: Node) => void
    ) {
      const node = transformJSXToNode(jsx, normalise);

      const name = resolveComponent(options.resolver, node.data.type);
      invariant(name !== null, ERRROR_NOT_IN_RESOLVER);
      node.data.displayName = node.data.displayName || name;
      node.data.name = name;

      return node;
    },

    parseTreeFromReactNode(
      reactNode: React.ReactElement,
      normalise?: (jsx: React.ReactElement, node: Node) => void
    ): Tree | undefined {
      let node = this.createNode(reactNode, normalise);

      let childrenNodes = [];

      if (reactNode.props && reactNode.props.children) {
        childrenNodes = React.Children.toArray(reactNode.props.children).reduce(
          (accum, child) => {
            if (React.isValidElement(child)) {
              accum.push(this.parseTreeFromReactNode(child));
            }
            return accum;
          },
          []
        );
      }

      return mergeTrees(node, childrenNodes);
    },

    /**
     * Determine the best possible location to drop the source Node relative to the target Node
     */
    getDropPlaceholder: (
      source: NodeId | Node,
      target: NodeId,
      pos: { x: number; y: number },
      nodesToDOM: (node: Node) => HTMLElement = (node) =>
        state.nodes[node.id].dom
    ) => {
      if (source === target) return;
      const sourceNodeFromId = typeof source == "string" && state.nodes[source],
        targetNode = state.nodes[target],
        isTargetCanvas = _().node(targetNode.id).isCanvas();

      const targetParent = isTargetCanvas
        ? targetNode
        : state.nodes[targetNode.data.parent];

      const targetParentNodes = targetParent.data.linkedNodes
        ? Object.values(targetParent.data.linkedNodes)
        : targetParent.data.nodes || [];

      const dimensionsInContainer = targetParentNodes
        ? targetParentNodes.reduce((result, id: NodeId) => {
            const dom = nodesToDOM(state.nodes[id]);
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
      const currentNode =
        targetParentNodes.length &&
        state.nodes[targetParentNodes[dropAction.index]];

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
     * Get the current Editor options
     */
    getOptions(): Options {
      return options;
    },

    getState(): Record<NodeId, SerializedNodeData> {
      return Object.keys(state.nodes).reduce((result: any, id: NodeId) => {
        const { data } = state.nodes[id];
        result[id] = serializeNode(data, options.resolver);
        return result;
      }, {});
    },

    /**
     * Helper methods to describe the specified Node
     * @param id
     */
    node(id: NodeId) {
      invariant(typeof id == "string", ERROR_INVALID_NODE_ID);

      const node = state.nodes[id];
      const nodeQuery = _().node;

      return {
        isCanvas: () => node.data.isCanvas,
        isRoot: () => node.id === ROOT_NODE,
        isTopLevelElement: () =>
          !nodeQuery(node.id).isRoot() && !node.data.parent,
        isTopLevelCanvas: () => {
          return !nodeQuery(node.id).isRoot() && !node.data.parent;
        },
        isDeletable: () =>
          !nodeQuery(id).isRoot() &&
          (nodeQuery(id).isCanvas()
            ? !nodeQuery(id).isTopLevelElement()
            : true),
        isParentOfTopLevelCanvas: () => !!node.data.linkedNodes,
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
          return getDeepNodes(state.nodes, id, deep);
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
                targetNode.data.parent && state.nodes[targetNode.data.parent],
              newParentNode = node;

            invariant(
              currentParentNode ||
                (!currentParentNode && !state.nodes[targetNode.id]),
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

    /**
     * Retrieve the JSON representation of the editor's Nodes
     */
    serialize(): string {
      return JSON.stringify(this.getState());
    },
  };
}
