import {
  deprecationWarning,
  ERROR_CANNOT_DRAG,
  ERROR_INVALID_NODE_ID,
  ERROR_MOVE_CANNOT_DROP,
  ERROR_MOVE_INCOMING_PARENT,
  ERROR_MOVE_NONCANVAS_CHILD,
  ERROR_MOVE_OUTGOING_PARENT,
  ERROR_MOVE_TOP_LEVEL_NODE,
  ERROR_MOVE_TO_DESCENDANT,
  ERROR_MOVE_TO_NONCANVAS_PARENT,
  ERROR_NOT_IN_RESOLVER,
  ROOT_NODE,
} from '@craftjs/utils';
import { createElement } from 'react';
import invariant from 'tiny-invariant';

import { EditorStore } from '..';
import {
  LegacyNodeData,
  NodeEventTypes,
  NodeId,
  Node,
  NodeRules,
  NodeSelector,
  BackwardsCompatibleNode,
  LegacyNode,
  NodeTree,
  LegacyNodeTree,
  StateVersionOpt,
  BackwardsCompatibleNodeTree,
} from '../../interfaces';
import { NodeProvider } from '../../nodes';
import { getNodesFromSelector } from '../../utils/getNodesFromSelector';
import { getResolverConfig } from '../../utils/resolveNode';
import { serializeNode } from '../../utils/serializeNode';

/**
 * NodeQuery helpes define a Node in the EditorState
 */
export class NodeQuery {
  node: Node;

  constructor(private readonly store: EditorStore, readonly id: NodeId) {
    this.node = this.store.getState().nodes[this.id];
    invariant(this.node, ERROR_INVALID_NODE_ID);
  }

  /**
   * Returns an object with all the properties from both Node and LegacyNode
   * This is primarily used in places such as NodeRules where the Node is exposed to the APIs
   * Hence, we need to consider all existing codebases that're still using the LegacyNode
   * @param node
   * @returns BackwardsCompatibleNode
   */
  private _createBackwardsCompatibleNode(node: Node): BackwardsCompatibleNode {
    const existingNode = this.find(node.id);
    if (existingNode) {
      return {
        id: existingNode.id,
        data: existingNode.data,
        related: existingNode.related,
        dom: existingNode.dom,
        rules: existingNode.rules,
        events: existingNode.events,
        ...node,
      };
    }

    const config = getResolverConfig(node.type, this.store.resolver);

    return {
      id: node.id,
      data: {
        ...node,
        type: config.component,
        name: node.type,
        displayName: config.displayName,
      },
      related: config.related,
      dom: null,
      rules: config.rules,
      events: {
        selected: false,
        hovered: false,
        dragged: false,
      },
      ...node,
    };
  }

  private getConfig() {
    const config = getResolverConfig(this.type, this.store.resolver);
    invariant(config, ERROR_NOT_IN_RESOLVER);
    return config;
  }

  get type() {
    return this.node.type;
  }

  get props() {
    return this.node.props;
  }

  get custom() {
    return this.node.custom;
  }

  getState() {
    return this.node;
  }

  getParent() {
    return this.node.parent ? this.find(this.node.parent) : null;
  }

  getLinkedNodes() {
    return Object.entries(this.node.linkedNodes).reduce<
      { id: string; node: NodeQuery }[]
    >(
      (accum, [linkedId, nodeId]) => [
        ...accum,
        { id: linkedId, node: this.find(nodeId) },
      ],
      []
    );
  }

  getChildNodes() {
    return this.node.nodes.map((childNodeId) => this.find(childNodeId));
  }

  indexOf(childNodeId: NodeId) {
    return this.node.nodes.indexOf(childNodeId);
  }

  getChildAtIndex(index) {
    const childIdAtIndex = this.node.nodes[index];
    return this.find(childIdAtIndex);
  }

  getAncestors() {
    const appendParentNode = (
      id: NodeId,
      ancestors: NodeQuery[] = [],
      depth: number = 0
    ): NodeQuery[] => {
      const node = this.find(id);

      if (!node) {
        return ancestors;
      }

      ancestors.push(node);

      if (!node.getParent()) {
        return ancestors;
      }

      return appendParentNode(node.getParent().id, ancestors, depth + 1);
    };

    return appendParentNode(this.node.parent);
  }

  getDescendants() {
    const appendChildNode = (
      id: NodeId,
      descendants: NodeQuery[] = [],
      depth: number = 0
    ): NodeQuery[] => {
      const node = this.find(id);

      if (!node) {
        return descendants;
      }

      // Include linkedNodes if any
      const linkedNodes = this.find(id)
        .getLinkedNodes()
        .map((linkedNodes) => linkedNodes.node);
      const childNodes = this.find(id).getChildNodes();

      [...linkedNodes, ...childNodes].forEach((node) => {
        descendants.push(node);
        descendants = appendChildNode(node.id, descendants, depth + 1);
      });

      return descendants;
    };
    return appendChildNode(this.id);
  }

  getComponent() {
    return this.getConfig().component;
  }

  getDOM() {
    return this.store.handlers.dom.get(this.node.id) || null;
  }

  getRules(): NodeRules {
    return this.getConfig().rules;
  }

  // TODO: Related Components are difficult to maintain; might need to find an alternative
  getRelated(id: string) {
    return this.related[id];
  }

  isCanvas() {
    return !!this.node.isCanvas;
  }

  isRoot() {
    return this.node.id === ROOT_NODE;
  }

  isLinkedNode() {
    return (
      this.node.parent &&
      this.getParent()
        .getLinkedNodes()
        .map((linkedNodes) => linkedNodes.node.id)
        .includes(this.node.id)
    );
  }

  isTopLevelNode() {
    return this.isRoot() || this.isLinkedNode();
  }

  isDeletable() {
    return !this.isTopLevelNode();
  }

  isParentOfTopLevelNodes() {
    return this.getLinkedNodes().length > 0;
  }

  isParentOfTopLevelCanvas() {
    deprecationWarning('query.node(id).isParentOfTopLevelCanvas', {
      suggest: 'query.node(id).isParentOfTopLevelNodes',
    });
    return this.isParentOfTopLevelNodes();
  }

  isSelected() {
    const { events } = this.store.getState();
    return events.selected.has(this.id);
  }

  isHovered() {
    const { events } = this.store.getState();
    return events.hovered.has(this.id);
  }

  isDragged() {
    const { events } = this.store.getState();
    return events.dragged.has(this.id);
  }

  isDraggable(onError?: (err: string) => void) {
    try {
      invariant(!this.isTopLevelNode(), ERROR_MOVE_TOP_LEVEL_NODE);
      invariant(
        this.find(this.node.parent).isCanvas(),
        ERROR_MOVE_NONCANVAS_CHILD
      );
      invariant(
        this.getRules().canDrag(
          this._createBackwardsCompatibleNode(this.node),
          (id: NodeId) => this.find(id)
        ),
        ERROR_CANNOT_DRAG
      );
      return true;
    } catch (err) {
      if (onError) {
        onError(err);
      }
      return false;
    }
  }

  isDroppable(selector: NodeSelector, onError?: (err: string) => void) {
    const targets = getNodesFromSelector(this.store, selector);
    try {
      invariant(this.isCanvas(), ERROR_MOVE_TO_NONCANVAS_PARENT);
      invariant(
        this.getRules().canMoveIn(
          targets.map((selector) =>
            this._createBackwardsCompatibleNode(selector.node)
          ),
          this._createBackwardsCompatibleNode(this.node),
          (id: NodeId) => this.find(id)
        ),
        ERROR_MOVE_INCOMING_PARENT
      );

      const parentNodes: Record<NodeId, Node[]> = {};

      targets.forEach(({ node: targetNode, exists }) => {
        const rules = this.getRules();

        invariant(
          rules.canDrop(
            this._createBackwardsCompatibleNode(this.node),
            this._createBackwardsCompatibleNode(targetNode),
            (id: NodeId) => this.find(id)
          ),
          ERROR_MOVE_CANNOT_DROP
        );

        // Ignore other checking if the Node is new
        if (!exists) {
          return;
        }
        const targetDeepNodes = this.descendants();

        invariant(
          !targetDeepNodes.includes(this.id) && this.id !== targetNode.id,
          ERROR_MOVE_TO_DESCENDANT
        );

        const currentParentNode = this.find(targetNode.parent);

        invariant(currentParentNode.isCanvas(), ERROR_MOVE_NONCANVAS_CHILD);

        if (currentParentNode.id !== this.id) {
          if (!parentNodes[currentParentNode.id]) {
            parentNodes[currentParentNode.id] = [];
          }

          parentNodes[currentParentNode.id].push(targetNode);
        }
      });

      Object.keys(parentNodes).forEach((parentNodeId) => {
        const childNodes = parentNodes[parentNodeId];
        const parentNode = this.find(parentNodeId);

        invariant(
          parentNode.getRules().canMoveOut(
            childNodes.map((node) => this._createBackwardsCompatibleNode(node)),
            this._createBackwardsCompatibleNode(parentNode.node),
            (id: NodeId) => this.find(id)
          ),
          ERROR_MOVE_OUTGOING_PARENT
        );
      });

      return true;
    } catch (err) {
      if (onError) {
        onError(err);
      }
      return false;
    }
  }

  toNodeTree(): NodeTree;
  toNodeTree(opt: { version: 'v1' }): LegacyNodeTree;
  toNodeTree(opt: { version: 'latest' }): NodeTree;
  toNodeTree(
    opt: StateVersionOpt = { version: 'latest' }
  ): BackwardsCompatibleNodeTree {
    const nodes: Record<NodeId, Node> = [this, ...this.getDescendants()].reduce(
      (accum, node) => {
        accum[node.id] = opt.version === 'v1' ? node.get() : node.getState();
        return accum;
      },
      {}
    );

    return {
      rootNodeId: this.id,
      nodes,
    };
  }

  private find(id: NodeId) {
    const node = this.store.getState().nodes[id];
    if (!node) {
      return null;
    }

    return new NodeQuery(this.store, id);
  }

  /**
   * @deprecated
   */
  get(): LegacyNode {
    return {
      id: this.id,
      data: this.data,
      rules: this.rules,
      related: this.related,
      dom: this.dom,
      events: this.events,
    };
  }

  /**
   * @deprecated
   */
  get data(): LegacyNodeData {
    return {
      type: this.getComponent(),
      name: this.type,
      displayName: this.type,
      custom: this.node.custom,
      props: this.node.props,
      linkedNodes: this.node.linkedNodes,
      nodes: this.node.nodes,
      parent: this.node.parent,
      isCanvas: this.node.isCanvas,
      hidden: this.node.hidden,
    };
  }

  /**
   * @deprecated
   */
  get events(): Record<NodeEventTypes, boolean> {
    return {
      selected: this.isSelected(),
      hovered: this.isHovered(),
      dragged: this.isDragged(),
    };
  }

  /**
   * @deprecated
   */
  get dom() {
    return this.getDOM();
  }

  /**
   * @deprecated
   */
  get related(): Record<string, React.ElementType> {
    const related = this.getConfig().related;

    const relatedNodeContext = {
      id: this.id,
      related: true,
    };

    return Object.keys(related).reduce((accum, comp) => {
      const relatedType = this.store.related.get(this.id, comp);

      return {
        ...accum,
        [comp]:
          relatedType ||
          this.store.related.add(this.id, comp, () =>
            createElement(
              NodeProvider,
              relatedNodeContext,
              createElement(related[comp])
            )
          ),
      };
    }, {});
  }

  /**
   * @deprecated
   */
  get rules() {
    return this.getRules();
  }

  /**
   * @deprecated
   */
  get _hydrationTimestamp() {
    deprecationWarning('Node._hydrationTimestamp', {
      suggest: 'EditorState.timestamp',
    });

    return this.store.getState().timestamp;
  }

  /**
   * @deprecated
   */
  linkedNodes() {
    return Object.values(this.node.linkedNodes);
  }

  /**
   * @deprecated
   */
  childNodes() {
    return this.node.nodes;
  }

  /**
   * @deprecated
   */
  isTopLevelCanvas() {
    return !this.isRoot() && !this.getParent();
  }

  /**
   * @deprecated
   */
  ancestors(deep = false): NodeId[] {
    const appendParentNode = (
      id: NodeId,
      ancestors: NodeId[] = [],
      depth: number = 0
    ) => {
      const node = this.store.getState().nodes[id];
      if (!node) {
        return ancestors;
      }

      ancestors.push(id);

      if (!node.parent) {
        return ancestors;
      }

      if (deep || (!deep && depth === 0)) {
        ancestors = appendParentNode(node.parent, ancestors, depth + 1);
      }
      return ancestors;
    };
    return appendParentNode(this.node.parent);
  }

  /**
   * @deprecated
   */
  descendants(
    deep = false,
    includeOnly?: 'linkedNodes' | 'childNodes'
  ): NodeId[] {
    const appendChildNode = (
      id: NodeId,
      descendants: NodeId[] = [],
      depth: number = 0
    ) => {
      if (deep || (!deep && depth === 0)) {
        const node = this.store.getState().nodes[id];

        if (!node) {
          return descendants;
        }

        if (includeOnly !== 'childNodes') {
          // Include linkedNodes if any
          const linkedNodes = this.find(id).linkedNodes();

          linkedNodes.forEach((nodeId) => {
            descendants.push(nodeId);
            descendants = appendChildNode(nodeId, descendants, depth + 1);
          });
        }

        if (includeOnly !== 'linkedNodes') {
          const childNodes = this.find(id).childNodes();

          childNodes.forEach((nodeId) => {
            descendants.push(nodeId);
            descendants = appendChildNode(nodeId, descendants, depth + 1);
          });
        }

        return descendants;
      }
      return descendants;
    };

    return appendChildNode(this.id);
  }

  /**
   * @deprecated
   */
  toSerializedNode() {
    return serializeNode(this.data, this.store.resolver);
  }
}
