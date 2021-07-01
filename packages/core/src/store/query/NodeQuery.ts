import {
  deprecationWarning,
  ERROR_CANNOT_DRAG,
  ERROR_MOVE_CANNOT_DROP,
  ERROR_MOVE_INCOMING_PARENT,
  ERROR_MOVE_NONCANVAS_CHILD,
  ERROR_MOVE_OUTGOING_PARENT,
  ERROR_MOVE_TOP_LEVEL_NODE,
  ERROR_MOVE_TO_DESCENDANT,
  ERROR_MOVE_TO_NONCANVAS_PARENT,
  ROOT_NODE,
} from '@craftjs/utils';
import invariant from 'tiny-invariant';
import { createElement } from 'react';

import { Query } from './Query';
import { NodeProvider } from '../../nodes';
import {
  LegacyNode,
  LegacyNodeData,
  LegacyNodeQuery,
  NodeEventTypes,
  NodeId,
  NodeRules,
  NodeSelector,
} from '../../interfaces';
import { getNodesFromSelector } from '../../utils/getNodesFromSelector';
import { serializeNode } from '../../utils/serializeNode';

type NodeQueryParams = {
  id: NodeId;
};
// A utility class to describe a Craft Node
export class NodeQuery extends Query<NodeQueryParams>
  implements LegacyNodeQuery {
  protected setup() {
    invariant(this.node, 'Node not found');
  }

  protected get node() {
    return this.store.getState().nodes[this.params.id];
  }

  getId() {
    return this.node.id;
  }

  getParent() {
    return this.node.parent;
  }
  getType() {
    return this.node.type;
  }

  getComponent() {
    return this.store.resolver[this.getType()] || this.getType();
  }

  getConfig() {
    const component = this.getComponent();
    const craftConfig =
      typeof component === 'function' ? component['craft'] || {} : {};

    return {
      rules: {
        canDrag: () => true,
        canDrop: () => true,
        canMoveIn: () => true,
        canMoveOut: () => true,
        ...(craftConfig['rules'] || {}),
      },
      related: {
        ...(craftConfig['related'] || {}),
      },
    };
  }

  getDOM() {
    return this.store.handlers.dom.get(this.node.id);
  }

  getRules(): NodeRules {
    return this.getConfig().rules;
  }

  getRelated() {
    const related = this.getConfig().related;

    const relatedNodeContext = {
      id: this.getId(),
      related: true,
    };

    return Object.keys(related).reduce((accum, comp) => {
      const relatedType = this.store.related.get(this.getId(), comp);

      return {
        ...accum,
        [comp]:
          relatedType ||
          this.store.related.add(this.getId(), comp, () =>
            createElement(
              NodeProvider,
              relatedNodeContext,
              createElement(related[comp])
            )
          ),
      };
    }, {});
  }

  linkedNodes() {
    return Object.values(this.node.linkedNodes || {});
  }

  childNodes() {
    return this.node.nodes || [];
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
      this.find({ id: this.node.parent }).linkedNodes().includes(this.node.id)
    );
  }

  isTopLevelNode() {
    return this.isRoot() || this.isLinkedNode();
  }

  isDeletable() {
    return !this.isTopLevelNode();
  }

  isParentOfTopLevelNodes() {
    return this.linkedNodes() && this.linkedNodes().length > 0;
  }

  isParentOfLinkedNodes() {
    return this.linkedNodes.length > 0;
  }

  isSelected() {
    const { events } = this.store.getState();
    return events.selected.has(this.getId());
  }

  isHovered() {
    const { events } = this.store.getState();
    return events.hovered.has(this.getId());
  }

  isDragged() {
    const { events } = this.store.getState();
    return events.dragged.has(this.getId());
  }

  ancestors() {
    const appendParentNode = (
      id: NodeId,
      ancestors: NodeId[] = [],
      depth: number = 0
    ) => {
      const node = this.find({ id });

      if (!node) {
        return ancestors;
      }

      ancestors.push(id);

      if (!node.getParent()) {
        return ancestors;
      }

      return appendParentNode(node.getParent(), ancestors, depth + 1);
    };

    return appendParentNode(this.getParent());
  }

  descendants(): NodeId[] {
    const appendChildNode = (
      id: NodeId,
      descendants: NodeId[] = [],
      depth: number = 0
    ) => {
      const node = this.find({ id });

      if (!node) {
        return descendants;
      }

      // Include linkedNodes if any
      const linkedNodes = this.find({ id }).linkedNodes();

      linkedNodes.forEach((nodeId) => {
        descendants.push(nodeId);
        descendants = appendChildNode(nodeId, descendants, depth + 1);
      });

      const childNodes = this.find({ id }).childNodes();

      childNodes.forEach((nodeId) => {
        descendants.push(nodeId);
        descendants = appendChildNode(nodeId, descendants, depth + 1);
      });

      return descendants;
    };
    return appendChildNode(this.getId());
  }

  isDraggable(onError?: (err: string) => void) {
    try {
      invariant(!this.isTopLevelNode(), ERROR_MOVE_TOP_LEVEL_NODE);
      invariant(
        this.find({ id: this.node.parent }).isCanvas(),
        ERROR_MOVE_NONCANVAS_CHILD
      );
      invariant(
        this.getRules().canDrag(this.find({ id: this.getId() }), (id: NodeId) =>
          this.find({ id })
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
    const targets = getNodesFromSelector(this.store.getState().nodes, selector);
    try {
      invariant(this.isCanvas(), ERROR_MOVE_TO_NONCANVAS_PARENT);
      invariant(
        this.getRules().canMoveIn(
          targets.map((selector) => this.find({ id: selector.node.id })),
          this,
          (id: NodeId) => this.find({ id })
        ),
        ERROR_MOVE_INCOMING_PARENT
      );

      const parentNodes = {};

      targets.forEach(({ node: targetNode, exists }) => {
        const rules = this.getRules();

        invariant(
          rules.canDrop(this, this.find({ id: targetNode.id }), (id: NodeId) =>
            this.find({ id })
          ),
          ERROR_MOVE_CANNOT_DROP
        );

        // Ignore other checking if the Node is new
        if (!exists) {
          return;
        }
        const targetDeepNodes = this.descendants();

        invariant(
          !targetDeepNodes.includes(this.getId()) &&
            this.getId() !== targetNode.id,
          ERROR_MOVE_TO_DESCENDANT
        );

        const currentParentNode = this.find({ id: targetNode.parent });

        invariant(currentParentNode.isCanvas(), ERROR_MOVE_NONCANVAS_CHILD);

        if (currentParentNode.getId() !== this.getId()) {
          if (!parentNodes[currentParentNode.getId()]) {
            parentNodes[currentParentNode.getId()] = [];
          }

          parentNodes[currentParentNode.getId()].push(targetNode);
        }
      });

      Object.keys(parentNodes).forEach((parentNodeId) => {
        const childNodes = parentNodes[parentNodeId];
        const parentNode = this.find({ id: parentNodeId });

        invariant(
          parentNode.getRules().canMoveOut(
            childNodes.map((node) => this.find({ id: node.id })),
            parentNode,
            (id: NodeId) => this.find({ id })
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

  toNodeTree() {
    const nodes = [this.getId(), ...this.descendants()].reduce(
      (accum, descendantId) => {
        accum[descendantId] = this.find({ id: descendantId }).get();
        return accum;
      },
      {}
    );

    return {
      rootNodeId: this.getId(),
      nodes,
    };
  }

  /**
   * @deprecated
   */
  get id() {
    return this.node.id;
  }

  /**
   * @deprecated
   */
  get data(): LegacyNodeData {
    return {
      type: this.getComponent(),
      name: this.getType(),
      displayName: this.getType(),
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
  get related() {
    return this.getRelated();
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
  get(): LegacyNode {
    return {
      id: this.getId(),
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
  toSerializedNode() {
    return serializeNode(this.data, this.store.resolver);
  }
}
