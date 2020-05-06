import {
  NodeId,
  Node,
  Nodes,
  Options,
  NodeEvents,
  SerializedNodeData,
} from "../interfaces";
import { EditorState, Indicator } from "../interfaces";
import {
  ERROR_INVALID_NODEID,
  ERROR_ROOT_CANVAS_NO_ID,
  ROOT_NODE,
  CallbacksFor,
  QueryCallbacksFor,
  ERROR_NOPARENT,
} from "@craftjs/utils";
import { QueryMethods } from "./query";
import { updateEventsNode } from "../utils/updateEventsNode";
import invariant from "tiny-invariant";
import { deserializeNode } from "../utils/deserializeNode";
import { createElement } from "react";

export const Actions = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => {
  const _ = <T extends keyof CallbacksFor<typeof Actions>>(name: T) =>
    Actions(state, query)[name];
  return {
    setOptions(cb: (options: Partial<Options>) => void) {
      cb(state.options);
    },
    setNodeEvent(eventType: NodeEvents, id: NodeId | null) {
      const current = state.events[eventType];
      if (current && id !== current) {
        state.nodes[current].events[eventType] = false;
      }

      if (id) {
        state.nodes[id].events[eventType] = true;
        state.events[eventType] = id;
      } else {
        state.events[eventType] = null;
      }
    },
    replaceNodes(nodes: Nodes) {
      state.nodes = nodes;
    },
    reset() {
      state.nodes = {};
      state.events = {
        dragged: null,
        selected: null,
        hovered: null,
        indicator: null,
      };
    },
    setDOM(id: NodeId, dom: HTMLElement) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID);
      state.nodes[id].dom = dom;
    },
    setIndicator(indicator: Indicator | null) {
      if (
        indicator &&
        (!indicator.placement.parent.dom ||
          (indicator.placement.currentNode &&
            !indicator.placement.currentNode.dom))
      )
        return;
      state.events.indicator = indicator;
    },
    /**
     * Add a new Node(s) to the editor
     * @param nodes
     * @param parentId
     */
    add(nodes: Node[] | Node, parentId?: NodeId) {
      const isCanvas = (node: Node | NodeId) =>
        node &&
        (typeof node === "string"
          ? node.startsWith("canvas-")
          : node.data.isCanvas);

      if (!Array.isArray(nodes)) nodes = [nodes];
      if (parentId && !state.nodes[parentId].data.nodes && isCanvas(parentId))
        state.nodes[parentId].data.nodes = [];

      (nodes as Node[]).forEach((node) => {
        const parent = parentId ? parentId : node.data.parent;
        invariant(parent !== null, ERROR_NOPARENT);

        const parentNode = state.nodes[parent!];

        if (parentNode && isCanvas(node) && !isCanvas(parentNode)) {
          invariant(node.data.props.id, ERROR_ROOT_CANVAS_NO_ID);
          if (!parentNode.data._childCanvas) parentNode.data._childCanvas = {};
          node.data.parent = parentNode.id;
          parentNode.data._childCanvas[node.data.props.id] = node.id;
        } else {
          if (parentId) {
            if (parentNode.data.props.children)
              delete parentNode.data.props["children"];

            if (!parentNode.data.nodes) parentNode.data.nodes = [];
            const currentNodes = parentNode.data.nodes;
            currentNodes.splice(
              node.data.index !== undefined
                ? node.data.index
                : currentNodes.length,
              0,
              node.id
            );
            node.data.parent = parent;
          }
        }
        state.nodes[node.id] = node;
      });
    },
    /**
     * Move a target Node to a new Parent at a given index
     * @param targetId
     * @param newParentId
     * @param index
     */
    move(targetId: NodeId, newParentId: NodeId, index: number) {
      const targetNode = state.nodes[targetId],
        currentParentId = targetNode.data.parent!,
        newParent = state.nodes[newParentId],
        newParentNodes = newParent.data.nodes;

      query.node(newParentId).isDroppable(targetNode, (err) => {
        throw new Error(err);
      });

      const currentParent = state.nodes[currentParentId],
        currentParentNodes = currentParent.data.nodes!;

      currentParentNodes[currentParentNodes.indexOf(targetId)] = "marked";

      if (newParentNodes) newParentNodes.splice(index, 0, targetId);
      else newParent.data.nodes = [targetId];

      state.nodes[targetId].data.parent = newParentId;
      state.nodes[targetId].data.index = index;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
    },
    /**
     * Delete a Node
     * @param id
     */
    delete(id: NodeId) {
      invariant(id !== ROOT_NODE, "Cannot delete Root node");
      const targetNode = state.nodes[id];
      if (query.node(targetNode.id).isCanvas()) {
        invariant(
          !query.node(targetNode.id).isTopLevelCanvas(),
          "Cannot delete a Canvas that is not a direct child of another Canvas"
        );
        if (targetNode.data.nodes) {
          [...targetNode.data.nodes].forEach((childId) => {
            _("delete")(childId);
          });
        }
      }

      const parentNode = state.nodes[targetNode.data.parent],
        parentChildNodesId = parentNode.data.nodes!;

      if (parentNode && parentChildNodesId.indexOf(id) > -1) {
        parentChildNodesId.splice(parentChildNodesId.indexOf(id), 1);
      }
      updateEventsNode(state, id, true);
      delete state.nodes[id];
    },
    /**
     * Update the props of a Node
     * @param id
     * @param cb
     */
    setProp(id: NodeId, cb: (props: any) => void) {
      invariant(state.nodes[id], ERROR_INVALID_NODEID);
      cb(state.nodes[id].data.props);
    },
    /**
     * Hide a Node
     * @param id
     * @param bool
     */
    setHidden(id: NodeId, bool: boolean) {
      state.nodes[id].data.hidden = bool;
    },
    /**
     * Set custom values to a Node
     * @param id
     * @param cb
     */
    setCustom<T extends NodeId>(
      id: T,
      cb: (data: EditorState["nodes"][T]["data"]["custom"]) => void
    ) {
      cb(state.nodes[id].data.custom);
    },
    deserialize(json: string) {
      const reducedNodes: Record<NodeId, SerializedNodeData> = JSON.parse(json);
      const rehydratedNodes = Object.keys(reducedNodes).reduce(
        (accum: Nodes, id) => {
          const {
            type: Comp,
            props,
            parent,
            nodes,
            _childCanvas,
            isCanvas,
            hidden,
            custom,
          } = deserializeNode(reducedNodes[id], state.options.resolver);

          if (!Comp) return accum;

          accum[id] = query.createNode(createElement(Comp, props), {
            id,
            data: {
              ...(isCanvas && { isCanvas }),
              ...(hidden && { hidden }),
              parent,
              ...(isCanvas && { nodes }),
              ...(_childCanvas && { _childCanvas }),
              custom,
            },
          });
          return accum;
        },
        {}
      );

      state.events = {
        dragged: null,
        selected: null,
        hovered: null,
        indicator: null,
      };
      state.nodes = rehydratedNodes;
    },
  };
};
