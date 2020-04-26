import {
  EditorState,
  EditorEvents,
  Indicator,
  NodeId,
  Node,
  Nodes,
  Options,
  NodeEvents,
  SerializedNodeData,
  Tree,
} from "../interfaces";
import {
  ERROR_INVALID_NODEID,
  ROOT_NODE,
  QueryCallbacksFor,
  ERROR_NOPARENT,
} from "@craftjs/utils";
import { QueryMethods } from "./query";
import { updateEventsNode } from "../utils/updateEventsNode";
import invariant from "tiny-invariant";
import { deserializeNode } from "../utils/deserializeNode";
import { createElement } from "react";

// TODO: move to a constants folder
const editorEmptyState = {
  nodes: {},
  events: {
    dragged: null,
    selected: null,
    hovered: null,
    indicator: null,
  },
};

export const Actions = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => {
  /** Helper functions */
  const addNodeToParentAtIndex = (node: Node, parent: Node, index: number) => {
    parent.data.nodes.splice(index, 0, node.id);
    node.data.parent = parent.id;
    state.nodes[node.id] = node;
  };

  const getParentAndValidate = (parentId: NodeId): Node => {
    invariant(parentId, ERROR_NOPARENT);
    const parent = state.nodes[parentId];
    invariant(parent, ERROR_INVALID_NODEID);
    return parent;
  };

  return {
    /**
     * Add a new Node(s) to the editor.
     *
     * @param nodes
     * @param parentId
     */
    add(nodes: Node[] | Node, parentId: NodeId) {
      const parent = getParentAndValidate(parentId);
      // reset the parent node ids
      parent.data.nodes = [];
      if (parent.data.props.children) {
        delete parent.data.props["children"];
      }

      const nodesToAdd = Array.isArray(nodes) ? nodes : [nodes];
      nodesToAdd.forEach((node, index) =>
        addNodeToParentAtIndex(node, parent, index)
      );
    },

    /**
     * Given a Node, it adds it at the correct position among the node children
     *
     * @param node
     * @param parentId
     * @param index
     */
    addNodeAtIndex(node: Node, parentId: NodeId, index: number) {
      const parent = getParentAndValidate(parentId);

      invariant(
        index > -1 && index <= parent.data.nodes.length,
        "AddNodeAtIndex: index must be between 0 and parentNodeLength inclusive"
      );

      addNodeToParentAtIndex(node, parent, index);
    },

    /**
     * Given a tree, it adds it at the correct position among the node children
     *
     * @param tree
     * @param parentId
     * @param index
     */
    addTreeAtIndex(tree: Tree, parentId: NodeId, index: number) {
      const parent = getParentAndValidate(parentId);

      invariant(
        index > -1 && index <= parent.data.nodes.length,
        "AddTreeAtIndex: index must be between 0 and parentNodeLength inclusive"
      );
      const node = tree.nodes[tree.rootNodeId];
      // first, add the node
      this.addNodeAtIndex(node, parentId, index);
      if (!node.data.nodes) {
        return;
      }
      // then add all the children
      const addChild = (childId, index) =>
        this.addTreeAtIndex(
          { rootNodeId: childId, nodes: tree.nodes },
          node.id,
          index
        );

      // we need to deep clone here...
      const childToAdd = [...node.data.nodes];
      node.data.nodes = [];
      childToAdd.forEach(addChild);
    },

    /**
     * Delete a Node
     * @param id
     */
    delete(id: NodeId) {
      invariant(id !== ROOT_NODE, "Cannot delete Root node");
      const targetNode = state.nodes[id];

      if (targetNode.data.nodes) {
        // we deep clone here because otherwise immer will mutate the node
        // object as we remove nodes
        [...targetNode.data.nodes].forEach((childId) => this.delete(childId));
      }

      const parentChildren = state.nodes[targetNode.data.parent].data.nodes!;
      parentChildren.splice(parentChildren.indexOf(id), 1);

      updateEventsNode(state, id, true);
      delete state.nodes[id];
    },

    deserialize(json: string) {
      const reducedNodes: Record<NodeId, SerializedNodeData> = JSON.parse(json);
      this.setState(reducedNodes);
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

      if (newParentNodes) {
        newParentNodes.splice(index, 0, targetId);
      } else {
        newParent.data.nodes = [targetId];
      }

      state.nodes[targetId].data.parent = newParentId;
      state.nodes[targetId].data.index = index;
      currentParentNodes.splice(currentParentNodes.indexOf("marked"), 1);
    },

    replaceEvents(events: EditorEvents) {
      state.events = events;
    },

    replaceNodes(nodes: Nodes) {
      state.nodes = nodes;
    },

    /**
     * Resets all the editor state.
     */
    reset() {
      this.replaceNodes({});
      this.replaceEvents(editorEmptyState.events);
    },

    /**
     * Set editor options via a callback function
     *
     * @param cb: function used to set the options.
     */
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

    /**
     * Given a `id`, it will set the `dom` porperty of that node.
     *
     * @param id of the node we want to set
     * @param dom
     */
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
     * Hide a Node
     * @param id
     * @param bool
     */
    setHidden(id: NodeId, bool: boolean) {
      state.nodes[id].data.hidden = bool;
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

    setState(dehydratedNodes: Record<NodeId, SerializedNodeData>) {
      const rehydratedNodes = Object.keys(dehydratedNodes).reduce(
        (accum: Nodes, id: string) => {
          const {
            type: Component,
            props,
            parent,
            nodes,
            _childCanvas,
            isCanvas,
            hidden,
            custom,
          } = deserializeNode(dehydratedNodes[id], state.options.resolver);

          if (!Component) {
            return accum;
          }

          accum[id] = query.createNode(createElement(Component, props), {
            id,
            data: {
              ...(isCanvas && { isCanvas }),
              ...(hidden && { hidden }),
              parent,
              ...{ nodes },
              ...(_childCanvas && { _childCanvas }),
              custom,
            },
          });
          return accum;
        },
        {}
      );

      this.replaceEvents(editorEmptyState.events);
      this.replaceNodes(rehydratedNodes);
    },
  };
};
