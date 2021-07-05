import {
  deprecationWarning,
  ERROR_NOT_IN_RESOLVER,
  getDOMInfo,
  ROOT_NODE,
} from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { EventQueryImpl } from './EventQueryImpl';
import { NodeQueryImpl } from './NodeQueryImpl';

import findPosition from '../../events/findPosition';
import {
  FreshNode,
  Indicator,
  Node,
  NodeEventTypes,
  NodeId,
  NodeInfo,
  NodeSelector,
  NodeTree,
  SerializedNode,
  SerializedNodes,
  EditorStore,
  EditorQuery,
  NodeQuery,
} from '../../interfaces';
import { deserializeNode } from '../../utils/deserializeNode';
import { getNodesFromSelector } from '../../utils/getNodesFromSelector';
import { parseNodeFromJSX } from '../../utils/parseNodeFromJSX';
import { adaptLegacyNode } from '../../utils/types';

export class EditorQueryImpl implements EditorQuery {
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

    return new NodeQueryImpl(this.store, id);
  }

  event(eventType: NodeEventTypes) {
    return new EventQueryImpl(this.store, eventType);
  }

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
        currentNode: currentNode.id,
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

  // ::Deprecated methods below:: //
  parseReactElement(reactElement: React.ReactElement) {
    return {
      toNodeTree: (
        normalize?: (node: Node, jsx: React.ReactElement) => void
      ): NodeTree => {
        return parseNodeFromJSX(reactElement, this.store.resolver, normalize);
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
        [nodeId]: new NodeQueryImpl(this.store, nodeId),
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
    return this.state.indicator;
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

  getSerializedNodes(): SerializedNodes {
    return Object.keys(this.state.nodes).reduce(
      (accum, id) => ({
        ...accum,
        [id]: this.node(id).toSerializedNode(),
      }),
      {}
    );
  }

  serialize(): string {
    return JSON.stringify(this.getSerializedNodes());
  }

  parseSerializedNode(serializedNode: SerializedNode) {
    return {
      toNode: (normalize?: (node: Node) => void) => {
        const data = deserializeNode(serializedNode, this.store.resolver);
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

  parseFreshNode(freshNode: FreshNode) {
    return {
      toNode: (normalize?: (node: Node) => void): Node => {
        let node = adaptLegacyNode(freshNode, this.store.resolver);

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
