import {
  EditorState,
  Indicator,
  NodeId,
  Node,
  Nodes,
  Options,
  NodeEvents,
  NodeTree,
  SerializedNodes,
} from "../interfaces";
import {
  deprecationWarning,
  ERROR_INVALID_NODEID,
  ROOT_NODE,
  DEPRECATED_ROOT_NODE,
  QueryCallbacksFor,
  ERROR_NOPARENT,
  ERROR_DELETE_TOP_LEVEL_NODE,
} from "@craftjs/utils";
import { QueryMethods } from "./query";
import { fromEntries } from "../utils/fromEntries";
import { updateEventsNode } from "../utils/updateEventsNode";
import invariant from "tiny-invariant";
import { editorInitialState } from "./store";

export const Actions = (
  state: EditorState,
  query: QueryCallbacksFor<typeof QueryMethods>
) => {
  /** Helper functions */
  const addNodeToParentAtIndex = (
    node: Node,
    parentId: NodeId,
    index?: number
  ) => {
    const parent = getParentAndValidate(parentId);
    // reset the parent node ids
    if (!parent.data.nodes) {
      parent.data.nodes = [];
    }

    if (parent.data.props.children) {
      delete parent.data.props["children"];
    }

    if (index != null) {
      parent.data.nodes.splice(index, 0, node.id);
    } else {
      parent.data.nodes.push(node.id);
    }

    node.data.parent = parent.id;
    state.nodes[node.id] = node;
  };

  const addTreeToParentAtIndex = (
    tree: NodeTree,
    parentId?: NodeId,
    index?: number
  ) => {
    const node = tree.nodes[tree.rootNodeId];

    if (parentId != null) {
      addNodeToParentAtIndex(node, parentId, index);
    }

    if (!node.data.nodes) {
      return;
    }
    // we need to deep clone here...
    const childToAdd = [...node.data.nodes];
    node.data.nodes = [];
    childToAdd.forEach((childId, index) =>
      addTreeToParentAtIndex(
        { rootNodeId: childId, nodes: tree.nodes },
        node.id,
        index
      )
    );
  };

  const getParentAndValidate = (parentId: NodeId): Node => {
    invariant(parentId, ERROR_NOPARENT);
    const parent = state.nodes[parentId];
    invariant(parent, ERROR_INVALID_NODEID);
    return parent;
  };

  return {
    /**
     * @private
     * Add a new linked Node to the editor.
     * Only used internally by the <Element /> component
     *
     * @param tree
     * @param parentId
     * @param id
     */
    addLinkedNodeFromTree(tree: NodeTree, parentId: NodeId, id?: string) {
      const parent = getParentAndValidate(parentId);
      if (!parent.data.linkedNodes) {
        parent.data.linkedNodes = {};
      }

      parent.data.linkedNodes[id] = tree.rootNodeId;

      tree.nodes[tree.rootNodeId].data.parent = parentId;
      state.nodes[tree.rootNodeId] = tree.nodes[tree.rootNodeId];

      addTreeToParentAtIndex(tree);
    },

    /**
     * Add a new Node to the editor.
     *
     * @param nodeToAdd
     * @param parentId
     * @param index
     */
    add(nodeToAdd: Node | Node[], parentId: NodeId, index?: number) {
      // TODO: Deprecate adding array of Nodes to keep implementation simpler
      let nodes = [nodeToAdd];
      if (Array.isArray(nodeToAdd)) {
        deprecationWarning("actions.add(node: Node[])", {
          suggest: "actions.add(node: Node)",
        });
        nodes = nodeToAdd;
      }
      nodes.forEach((node: Node) => {
        addNodeToParentAtIndex(node, parentId, index);
      });
    },

    /**
     * Add a NodeTree to the editor
     *
     * @param tree
     * @param parentId
     * @param index
     */
    addNodeTree(tree: NodeTree, parentId?: NodeId, index?: number) {
      const node = tree.nodes[tree.rootNodeId];

      if (!parentId) {
        invariant(
          tree.rootNodeId === ROOT_NODE,
          "Cannot add non-root Node without a parent"
        );
        state.nodes[tree.rootNodeId] = node;
      }

      addTreeToParentAtIndex(tree, parentId, index);
    },

    /**
     * Delete a Node
     * @param id
     */
    delete(id: NodeId) {
      invariant(!query.node(id).isTopLevelNode(), ERROR_DELETE_TOP_LEVEL_NODE);

      const targetNode = state.nodes[id];
      if (targetNode.data.nodes) {
        // we deep clone here because otherwise immer will mutate the node
        // object as we remove nodes
        [...targetNode.data.nodes].forEach((childId) => this.delete(childId));
      }

      const parentChildren = state.nodes[targetNode.data.parent].data.nodes;
      parentChildren.splice(parentChildren.indexOf(id), 1);

      updateEventsNode(state, id, true);
      delete state.nodes[id];
    },

    deserialize(input: SerializedNodes | string) {
      const dehydratedNodes =
        typeof input == "string" ? JSON.parse(input) : input;

      const nodePairs = Object.keys(dehydratedNodes).map((id) => {
        let nodeId = id;

        if (id === DEPRECATED_ROOT_NODE) {
          nodeId = ROOT_NODE;
        }

        return [
          nodeId,
          query.parseSerializedNode(dehydratedNodes[id]).toNode(nodeId),
        ];
      });

      this.replaceNodes(fromEntries(nodePairs));
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

    replaceNodes(nodes: Nodes) {
      state.nodes = nodes;
      this.clearEvents();
    },

    clearEvents() {
      state.events = editorInitialState.events;
    },

    /**
     * Resets all the editor state.
     */
    reset() {
      this.replaceNodes({});
      this.clearEvents();
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
  };
};
