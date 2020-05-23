import { EditorState, Node, NodeId } from "@craftjs/core";
import invariant from "tiny-invariant";
import {
  deprecationWarning,
  ERROR_CANNOT_DRAG,
  ERROR_DUPLICATE_NODEID,
  ERROR_INVALID_NODE_ID,
  ERROR_MOVE_INCOMING_PARENT,
  ERROR_MOVE_NONCANVAS_CHILD,
  ERROR_MOVE_OUTGOING_PARENT,
  ERROR_MOVE_TO_DESCENDANT,
  ERROR_MOVE_TO_NONCANVAS_PARENT,
  ERROR_MOVE_TOP_LEVEL_NODE,
  ROOT_NODE,
} from "@craftjs/utils";
import { serializeNode } from "../utils/serializeNode";
import { mergeTrees } from "../utils/mergeTrees";

export function NodeHelpers(state: EditorState, id: NodeId) {
  invariant(typeof id == "string", ERROR_INVALID_NODE_ID);

  const node = state.nodes[id];

  const getNodeFromIdOrNode = (node: NodeId | Node) =>
    typeof node === "string" ? state.nodes[node] : node;

  return {
    isCanvas() {
      return !!node.data.isCanvas;
    },
    isRoot() {
      return node.id === ROOT_NODE;
    },
    isTopLevelNode() {
      return !node.data.parent;
    },
    isDeletable() {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: () => !!node.data.linkedNodes,
    isParentOfTopLevelCanvas() {
      deprecationWarning("query.node(id).isParentOfTopLevelCanvas", {
        suggest: "query.node(id).isParentOfTopLevelNodes",
      });
      return this.isParentOfTopLevelNodes();
    },
    get() {
      return node;
    },
    ancestors(deep = false) {
      function recursive(id: NodeId, result: NodeId[] = [], depth: number = 0) {
        result.push(id);
        const node = state.nodes[id];
        if (deep || (!deep && depth === 0)) {
          if (node.data.nodes && node.data.parent) {
            result = recursive(node.data.parent, result, depth + 1);
          }
        }
        return result;
      }
      return recursive(node.data.parent);
    },
    descendants(deep = false) {
      function recursive(id: NodeId, result: NodeId[] = [], depth: number = 0) {
        const node = state.nodes[id];
        if (deep || (!deep && depth === 0)) {
          if (node.data.nodes) {
            const childNodes = node.data.nodes; // ['t1c1', 't1c2']
            childNodes.forEach((nodeId) => {
              result.push(nodeId);
              result = recursive(nodeId, result, depth + 1);
            });
          }
        }
        return result;
      }
      return recursive(id);
    },
    isDraggable(onError?: (err: string) => void) {
      try {
        const targetNode = node;
        invariant(!this.isTopLevelNode(), ERROR_MOVE_TOP_LEVEL_NODE);
        invariant(
          NodeHelpers(state, targetNode.data.parent).isCanvas(),
          ERROR_MOVE_NONCANVAS_CHILD
        );
        invariant(
          targetNode.rules.canDrag(targetNode, this),
          ERROR_CANNOT_DRAG
        );
        return true;
      } catch (err) {
        if (onError) onError(err);
        return false;
      }
    },
    isDroppable(target: NodeId | Node, onError?: (err: string) => void) {
      const isNewNode = !state.nodes[target];
      const targetNode = getNodeFromIdOrNode(target),
        newParentNode = node;
      try {
        invariant(this.isCanvas(), ERROR_MOVE_TO_NONCANVAS_PARENT);
        invariant(
          newParentNode.rules.canMoveIn(targetNode, newParentNode, this),
          ERROR_MOVE_INCOMING_PARENT
        );

        if (isNewNode) {
          return true;
        }

        const currentParentNode =
          targetNode.data.parent && state.nodes[targetNode.data.parent];

        invariant(!!currentParentNode, ERROR_MOVE_TOP_LEVEL_NODE);

        invariant(currentParentNode.data.isCanvas, ERROR_MOVE_NONCANVAS_CHILD);

        invariant(
          currentParentNode ||
            (!currentParentNode && !state.nodes[targetNode.id]),
          ERROR_DUPLICATE_NODEID
        );

        const targetDeepNodes = NodeHelpers(state, targetNode.id).descendants();

        invariant(
          !targetDeepNodes.includes(newParentNode.id),
          ERROR_MOVE_TO_DESCENDANT
        );
        invariant(
          currentParentNode.rules.canMoveOut(
            targetNode,
            currentParentNode,
            this
          ),
          ERROR_MOVE_OUTGOING_PARENT
        );

        return true;
      } catch (err) {
        if (onError) onError(err);
        return false;
      }
    },
    toSerializedNode() {
      return serializeNode(node.data, state.options.resolver);
    },
    toNodeTree() {
      const childNodes = (node.data.nodes || []).map((childNodeId) => {
        return NodeHelpers(state, childNodeId).toNodeTree();
      });

      return mergeTrees(node, childNodes);
    },

    /**
            Deprecated NodeHelpers
        **/

    decendants(deep = false) {
      deprecationWarning("query.node(id).decendants", {
        suggest: "query.node(id).descendants 🙈",
      });
      return this.descendants(deep);
    },
    isTopLevelCanvas() {
      return !this.isRoot() && !node.data.parent;
    },
  };
}
