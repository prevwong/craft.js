import {
  deprecationWarning,
  ERROR_INVALID_NODEID,
  ROOT_NODE,
  DEPRECATED_ROOT_NODE,
  ERROR_NOPARENT,
} from '@craftjs/utils';
import invariant from 'tiny-invariant';

import { EditorStore } from './EditorStore';

import {
  EditorState,
  Indicator,
  NodeId,
  Node,
  Nodes,
  LegacyStateOptions,
  NodeEventTypes,
  NodeTree,
  SerializedNodes,
  NodeSelector,
  NodeSelectorType,
  LegacyNode,
} from '../interfaces';
import { fromEntries } from '../utils/fromEntries';
import { getNodesFromSelector } from '../utils/getNodesFromSelector';
import { removeNodeFromEvents } from '../utils/removeNodeFromEvents';
import { adaptLegacyNode } from '../utils/types';

// TODO: refactor
export const ActionMethods = (state: EditorState, store: EditorStore) => {
  const action = () => ActionMethods(state, store);
  const query = store.query;

  /** Helper functions */
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
    addLinkedNodeFromTree(tree: NodeTree, parentId: NodeId, id: string) {
      const parent = getParentAndValidate(parentId);
      if (!parent.linkedNodes) {
        parent.linkedNodes = {};
      }

      const existingLinkedNode = parent.linkedNodes[id];
      if (existingLinkedNode) {
        action().delete(existingLinkedNode);
      }

      parent.linkedNodes[id] = tree.rootNodeId;

      tree.nodes[tree.rootNodeId].parent = parentId;
      state.nodes[tree.rootNodeId] = tree.nodes[tree.rootNodeId];

      action().addNodeTree(tree);
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
      let nodes = [nodeToAdd];
      if (Array.isArray(nodeToAdd)) {
        deprecationWarning('actions.add(node: Node[])', {
          suggest: 'actions.add(node: Node)',
        });
        nodes = nodeToAdd;
      }

      nodes.forEach((nodeOrlegacyNode: Node | LegacyNode) => {
        const node = adaptLegacyNode(nodeOrlegacyNode, store.resolver);
        state.nodes[node.id] = node;

        if (parentId) {
          const parent = getParentAndValidate(parentId);

          if (index != null) {
            parent.nodes.splice(index, 0, node.id);
          } else {
            parent.nodes.push(node.id);
          }

          node.parent = parent.id;
        }
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
      const { nodes, linkedNodes, ...node } = tree.nodes[tree.rootNodeId];

      action().add(
        {
          ...node,
          nodes: [],
          linkedNodes: {},
        },
        parentId,
        index
      );

      if (nodes) {
        nodes.map((childNodeId) =>
          action().addNodeTree(
            { rootNodeId: childNodeId, nodes: tree.nodes },
            node.id
          )
        );
      }

      if (linkedNodes) {
        Object.keys(linkedNodes).forEach((linkedId) => {
          const nodeId = linkedNodes[linkedId];
          action().addLinkedNodeFromTree(
            { rootNodeId: nodeId, nodes: tree.nodes },
            node.id,
            linkedId
          );
        });
      }
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
        const { id } = node;

        const targetNode = state.nodes[id],
          parentNode = state.nodes[targetNode.parent];

        if (targetNode.nodes) {
          // we deep clone here because otherwise immer will mutate the node
          // object as we remove nodes
          [...targetNode.nodes].forEach((childId) => action().delete(childId));
        }

        if (targetNode.linkedNodes) {
          Object.values(targetNode.linkedNodes).map((linkedNodeId) =>
            action().delete(linkedNodeId)
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
