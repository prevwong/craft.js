import {
  deprecationWarning,
  ERROR_NOT_IN_RESOLVER,
  getDOMInfo,
  ROOT_NODE,
} from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { EventQuery } from './EventQuery';
import { NodeQuery } from './NodeQuery';

import { EditorStore } from '..';
import findPosition from '../../events/findPosition';
import {
  FreshNode,
  Indicator,
  Node,
  NodeEventTypes,
  NodeId,
  NodeSelector,
  NodeTree,
  SerializedNode,
  SerializedNodes,
  NodeInfo,
} from '../../interfaces';
import { deserializeNode } from '../../utils/deserializeNode';
import { getNodesFromSelector } from '../../utils/getNodesFromSelector';
import { parseNodeFromJSX } from '../../utils/parseNodeFromJSX';
import { adaptLegacyNode } from '../../utils/types';

export class EditorQuery {
  constructor(private readonly store: EditorStore) {
    this.store = store;
  }

  protected get state() {
    return this.store.getState();
  }

  get root() {
    return this.node(ROOT_NODE);
  }

  isEnabled() {
    return this.state.enabled;
  }

  node(id: NodeId) {
    const node = this.state.nodes[id];
    if (!node) {
      return null;
    }

    return new NodeQuery(this.store, id);
  }

  event(eventType: NodeEventTypes) {
    return new EventQuery(this.store, eventType);
  }

  /**
   * Determine the best possible location to drop the source Node relative to the target Node
   *
   * TODO: replace with Positioner.computeIndicator();
   */
  getDropPlaceholder(
    source: NodeSelector,
    target: NodeId,
    pos: { x: number; y: number },
    nodeIdToDOM?: (id: NodeId) => HTMLElement
  ) {
    const state = this.state;
    const targetNode = state.nodes[target],
      isTargetCanvas = this.node(target).isCanvas();

    const targetParent = isTargetCanvas
      ? targetNode
      : state.nodes[targetNode.parent];

    if (!targetParent) return;

    const targetParentNodes = targetParent.nodes || [];

    const dimensionsInContainer = targetParentNodes
      ? targetParentNodes.reduce((result, id: NodeId) => {
          const dom = nodeIdToDOM ? nodeIdToDOM(id) : this.node(id).getDOM();

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
      targetParent.id,
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
        currentNodeId: currentNode.id,
      },
      error: false,
    };

    const sourceNodes = getNodesFromSelector(this.store, source);

    sourceNodes.forEach(({ node, exists }) => {
      if (!exists) {
        return;
      }

      // If source Node is already in the editor, check if it's draggable
      this.node(node.id).isDraggable((err) => (output.error = err));
    });

    // Check if source Node is droppable in target
    this.node(targetParent.id).isDroppable(
      source,
      (err) => (output.error = err)
    );

    return output;
  }

  getState() {
    return this.state;
  }

  parseReactElement(reactElement: React.ReactElement) {
    return {
      toNodeTree: (
        normalize?: (node: Node, jsx: React.ReactElement) => void
      ): NodeTree => {
        return parseNodeFromJSX(
          reactElement,
          this.store.getState().resolver,
          normalize
        );
      },
    };
  }

  get history() {
    return {
      canUndo: () => this.store.history.canUndo(),
      canRedo: () => this.store.history.canRedo(),
    };
  }

  get events() {
    return this.state.events;
  }

  get nodes(): Record<string, NodeQuery> {
    return Object.keys(this.state.nodes).reduce(
      (accum, nodeId) => ({
        ...accum,
        [nodeId]: new NodeQuery(this.store, nodeId),
      }),
      {}
    );
  }

  get options() {
    return {
      ...this.store.config,
      enabled: this.isEnabled(),
    };
  }

  get indicator() {
    if (!this.state.indicator) {
      return null;
    }

    const { placement, error } = this.state.indicator;

    return {
      error,
      placement: {
        ...placement,
        // The following are needed for backwards compatibility:
        parent: this.node(placement.parentNodeId),
        currentNode: placement.currentNodeId
          ? this.node(placement.currentNodeId)
          : null,
      },
    };
  }

  get timestamp() {
    return this.state.timestamp;
  }

  getEvent(eventType: NodeEventTypes) {
    return this.event(eventType);
  }

  getOptions() {
    return this.options;
  }

  /**
   * @deprecated
   * @returns
   */
  getSerializedNodes(): SerializedNodes {
    return Object.keys(this.state.nodes).reduce(
      (accum, id) => ({
        ...accum,
        [id]: this.node(id).toSerializedNode(),
      }),
      {}
    );
  }

  /**
   * @deprecated
   * @returns
   */
  serialize(): string {
    return JSON.stringify(this.getSerializedNodes());
  }

  /**
   * @deprecated
   * @param serializedNode
   * @returns
   */
  parseSerializedNode(serializedNode: SerializedNode) {
    return {
      toNode: (normalize?: (node: Node) => void) => {
        const data = deserializeNode(
          serializedNode,
          this.store.getState().resolver
        );
        invariant(data.type, ERROR_NOT_IN_RESOLVER);
        const id = typeof normalize === 'string' && normalize;
        if (id) {
          deprecationWarning(`query.parseSerializedNode(...).toNode(id)`, {
            suggest: `query.parseSerializedNode(...).toNode(node => node.id = id)`,
          });
        }

        return this.parseFreshNode({
          ...(id ? { id } : {}),
          data,
        }).toNode(!id && normalize);
      },
    };
  }

  /**
   * @deprecated
   * @param freshNode
   * @returns
   */
  parseFreshNode(freshNode: FreshNode) {
    return {
      toNode: (normalize?: (node: Node) => void): Node => {
        let node = adaptLegacyNode(freshNode, this.store.getState().resolver);

        const { type, name, ...data } = freshNode.data;

        node = {
          ...node,
          ...data,
        };

        if (normalize) {
          normalize(node);
        }

        return node;
      },
    };
  }
}
