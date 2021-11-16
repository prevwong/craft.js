import {
  deprecationWarning,
  ERROR_INVALID_NODEID,
  ROOT_NODE,
  DEPRECATED_ROOT_NODE,
  ERROR_NOPARENT,
  ERROR_DELETE_TOP_LEVEL_NODE,
} from '@craftjs/utils';
import invariant from 'tiny-invariant';

import {
  EditorState,
  Indicator,
  NodeId,
  Node,
  Nodes,
  LegacyStateOptions,
  NodeEventTypes,
  SerializedNodes,
  NodeSelector,
  NodeSelectorType,
  LegacyNode,
  BackwardsCompatibleNodeTree,
} from '../interfaces';
import { EditorStore } from '../store';
import { fromEntries } from '../utils/fromEntries';
import { getNodesFromSelector } from '../utils/getNodesFromSelector';
import { removeNodeFromEvents } from '../utils/removeNodeFromEvents';
import { adaptLegacyNode } from '../utils/types';

// TODO: refactor
export const ActionMethods = (state: EditorState, store: EditorStore) => {
  const query = store.query;

  /** Helper functions */
  const addNodeTreeToParent = (
    tree: BackwardsCompatibleNodeTree,
    parentId?: NodeId,
    addNodeType?:
      | {
          type: 'child';
          index: number;
        }
      | {
          type: 'linked';
          id: string;
        }
  ) => {
    const iterateChildren = (id: NodeId, parentId?: NodeId) => {
      const node = adaptLegacyNode(tree.nodes[id], store.resolver);

      state.nodes[id] = {
        ...node,
        parent: parentId,
      };

      if (node.nodes.length > 0) {
        delete state.nodes[id].props.children;

        node.nodes.forEach((childNodeId) =>
          iterateChildren(childNodeId, node.id)
        );
      }

      Object.values(node.linkedNodes).forEach((linkedNodeId) =>
        iterateChildren(linkedNodeId, node.id)
      );
    };

    iterateChildren(tree.rootNodeId, parentId);

    if (!parentId) {
      invariant(
        tree.rootNodeId === ROOT_NODE,
        'Cannot add non-root Node without a parent'
      );

      return;
    }

    const parent = getParentAndValidate(parentId);

    if (addNodeType.type === 'child') {
      const index = addNodeType.index;

      if (index != null) {
        parent.nodes.splice(index, 0, tree.rootNodeId);
      } else {
        parent.nodes.push(tree.rootNodeId);
      }

      return;
    }

    parent.linkedNodes[addNodeType.id] = tree.rootNodeId;
  };

  const getParentAndValidate = (parentId: NodeId): Node => {
    invariant(parentId, ERROR_NOPARENT);
    const parent = state.nodes[parentId];
    invariant(parent, ERROR_INVALID_NODEID);
    return parent;
  };

  const deleteNode = (id: NodeId) => {
    const targetNode = state.nodes[id],
      parentNode = state.nodes[targetNode.parent];

    if (targetNode.nodes) {
      // we deep clone here because otherwise immer will mutate the node
      // object as we remove nodes
      [...targetNode.nodes].forEach((childId) => deleteNode(childId));
    }

    if (targetNode.linkedNodes) {
      Object.values(targetNode.linkedNodes).map((linkedNodeId) =>
        deleteNode(linkedNodeId)
      );
    }

    const isChildNode = parentNode.nodes.includes(id);

    if (isChildNode) {
      const parentChildren = parentNode.nodes;
      parentChildren.splice(parentChildren.indexOf(id), 1);
    } else {
      const linkedId = Object.keys(parentNode.linkedNodes).find(
        (id) => parentNode.linkedNodes[id] === id
      );
      if (linkedId) {
        delete parentNode.linkedNodes[linkedId];
      }
    }

    removeNodeFromEvents(state, id);
    delete state.nodes[id];
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
    addLinkedNodeFromTree(
      tree: BackwardsCompatibleNodeTree,
      parentId: NodeId,
      id: string
    ) {
      const parent = getParentAndValidate(parentId);

      const existingLinkedNode = parent.linkedNodes[id];

      if (existingLinkedNode) {
        deleteNode(existingLinkedNode);
      }

      addNodeTreeToParent(tree, parentId, { type: 'linked', id });
    },

    /**
     * Add a new Node to the editor.
     *
     * @param nodeToAdd
     * @param parentId
     * @param index
     */
    add(
      nodeToAdd: Node | Node[] | LegacyNode | LegacyNode[],
      parentId: NodeId,
      index?: number
    ) {
      // TODO: Deprecate adding array of Nodes to keep implementation simpler
      let nodes = [nodeToAdd];
      if (Array.isArray(nodeToAdd)) {
        deprecationWarning('actions.add(node: Node[])', {
          suggest: 'actions.add(node: Node)',
        });
        nodes = nodeToAdd;
      }
      nodes.forEach((node: Node | LegacyNode) => {
        addNodeTreeToParent(
          {
            nodes: {
              [node.id]: node,
            },
            rootNodeId: node.id,
          },
          parentId,
          { type: 'child', index }
        );
      });
    },

    /**
     * Add a NodeTree to the editor
     *
     * @param tree
     * @param parentId
     * @param index
     */
    addNodeTree(
      tree: BackwardsCompatibleNodeTree,
      parentId?: NodeId,
      index?: number
    ) {
      addNodeTreeToParent(tree, parentId, { type: 'child', index });
    },

    /**
     * Delete a Node
     * @param id
     */
    delete(selector: NodeSelector<NodeSelectorType.Id>) {
      const targets = getNodesFromSelector(store, selector, {
        existOnly: true,
        idOnly: true,
      });

      targets.forEach(({ node }) => {
        invariant(
          !query.node(node.id).isTopLevelNode(),
          ERROR_DELETE_TOP_LEVEL_NODE
        );
        deleteNode(node.id);
      });
    },

    /**
     * Move a target Node to a new Parent at a given index
     * @param targetId
     * @param newParentId
     * @param index
     */
    move(selector: NodeSelector, newParentId: NodeId, index: number) {
      const targets = getNodesFromSelector(store, selector, {
        existOnly: true,
      });

      const newParent = state.nodes[newParentId];
      targets.forEach(({ node: targetNode }, i) => {
        const targetId = targetNode.id;
        const currentParentId = targetNode.parent;

        query.node(newParentId).isDroppable([targetId], (err) => {
          throw new Error(err);
        });

        const currentParent = state.nodes[currentParentId];
        const currentParentNodes = currentParent.nodes;

        currentParentNodes[currentParentNodes.indexOf(targetId)] = 'marked';

        newParent.nodes.splice(index + i, 0, targetId);

        state.nodes[targetId].parent = newParentId;
        currentParentNodes.splice(currentParentNodes.indexOf('marked'), 1);
      });
    },

    replaceNodes(nodes: Nodes) {
      this.clearEvents();
      state.nodes = nodes;
      state.timestamp = Date.now();
    },

    clearEvents() {
      this.setNodeEvent('selected', null);
      this.setNodeEvent('hovered', null);
      this.setNodeEvent('dragged', null);
      this.setIndicator(null);
    },

    /**
     * Resets all the editor state.
     */
    reset() {
      this.clearEvents();
      this.replaceNodes({});
    },

    setEnabled(enabled: boolean) {
      state.enabled = enabled;
    },

    setNodeEvent(
      eventType: NodeEventTypes,
      nodeIdSelector: NodeSelector<NodeSelectorType.Id>
    ) {
      state.events[eventType] = new Set();

      if (!nodeIdSelector) {
        return;
      }

      const targets = getNodesFromSelector(store, nodeIdSelector, {
        idOnly: true,
        existOnly: true,
      });

      const nodeIds: Set<NodeId> = new Set(targets.map(({ node }) => node.id));
      state.events[eventType] = nodeIds;
    },

    /**
     * Set custom values to a Node
     * @param id
     * @param cb
     */
    setCustom<T extends NodeId>(
      selector: NodeSelector<NodeSelectorType.Id>,
      cb: (data: EditorState['nodes'][T]['custom']) => void
    ) {
      const targets = getNodesFromSelector(store, selector, {
        idOnly: true,
        existOnly: true,
      });

      targets.forEach(({ node }) => cb(state.nodes[node.id].custom));
    },

    setIndicator(indicator: Indicator | null) {
      state.indicator = indicator;
    },

    /**
     * Hide a Node
     * @param id
     * @param bool
     */
    setHidden(id: NodeId, bool: boolean) {
      state.nodes[id].hidden = bool;
    },

    /**
     * Update the props of a Node
     * @param id
     * @param cb
     */
    setProp(
      selector: NodeSelector<NodeSelectorType.Id>,
      cb: (props: any) => void
    ) {
      const targets = getNodesFromSelector(store, selector, {
        idOnly: true,
        existOnly: true,
      });

      targets.forEach(({ node }) => cb(state.nodes[node.id].props));
    },

    selectNode(nodeIdSelector?: NodeSelector<NodeSelectorType.Id>) {
      if (nodeIdSelector) {
        const targets = getNodesFromSelector(store, nodeIdSelector, {
          idOnly: true,
          existOnly: true,
        });

        this.setNodeEvent(
          'selected',
          targets.map(({ node }) => node.id)
        );
      } else {
        this.setNodeEvent('selected', null);
      }

      this.setNodeEvent('hovered', null);
    },
    /**
     * Set editor options via a callback function
     * @deprecated
     * @param cb: function used to set the options.
     */
    setOptions(cb: (options: Partial<LegacyStateOptions>) => void) {
      const opts = { enabled: state.enabled };
      cb(opts);
      state.enabled = opts.enabled;
    },

    /**
     * @deprecated
     * @param input
     */
    deserialize(input: SerializedNodes | string) {
      const dehydratedNodes =
        typeof input == 'string' ? JSON.parse(input) : input;

      const nodePairs = Object.keys(dehydratedNodes).map((id) => {
        let nodeId = id;

        if (id === DEPRECATED_ROOT_NODE) {
          nodeId = ROOT_NODE;
        }

        return [
          nodeId,
          query
            .parseSerializedNode(dehydratedNodes[id])
            .toNode((node) => (node.id = nodeId)),
        ];
      });

      this.replaceNodes(fromEntries(nodePairs));
    },
  };
};
