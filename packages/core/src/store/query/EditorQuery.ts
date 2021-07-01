import {
  deprecationWarning,
  ERROR_NOT_IN_RESOLVER,
  getDOMInfo,
} from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { Query } from './Query';
import { NodeQuery } from './NodeQuery';
import findPosition from '../../events/findPosition';
import { getNodesFromSelector } from '../../utils/getNodesFromSelector';
import {
  FreshNode,
  Indicator,
  LegacyEditorQuery,
  Node,
  NodeEventTypes,
  NodeId,
  NodeInfo,
  NodeSelector,
  NodeTree,
  SerializedNode,
  SerializedNodes,
} from '../../interfaces';
import { EventHelpers } from '../EventHelpers';
import { parseNodeFromJSX } from '../../utils/parseNodeFromJSX';
import { mergeTrees } from '../../utils/mergeTrees';
import { deserializeNode } from '../../utils/deserializeNode';

export class EditorQuery extends Query implements LegacyEditorQuery {
  protected get state() {
    return this.store.getState();
  }

  isEnabled() {
    return this.state.enabled;
  }

  getNodes() {
    return Object.keys(this.state.nodes).reduce(
      (accum, nodeId) => ({
        ...accum,
        [nodeId]: new NodeQuery(this.store, { id: nodeId }),
      }),
      {}
    );
  }

  getNode(id: NodeId) {
    const node = this.state.nodes[id];
    if (!node) {
      return null;
    }

    return new NodeQuery(this.store, { id });
  }

  getEvent(eventType: NodeEventTypes) {
    return EventHelpers(this.state, eventType);
  }

  getDropPlaceholder(
    source: NodeSelector,
    target: NodeId,
    pos: { x: number; y: number },
    nodeIdToDOM?: (id: NodeId) => HTMLElement
  ) {
    const state = this.state;
    const targetNode = state.nodes[target],
      isTargetCanvas = this.getNode(target).isCanvas();

    const targetParent = isTargetCanvas
      ? targetNode
      : state.nodes[targetNode.parent];

    if (!targetParent) return;

    const targetParentNodes = targetParent.nodes || [];

    const dimensionsInContainer = targetParentNodes
      ? targetParentNodes.reduce((result, id: NodeId) => {
          const dom = nodeIdToDOM ? nodeIdToDOM(id) : this.getNode(id).getDOM();

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
      targetParent,
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
        currentNode,
      },
      error: false,
    };

    const sourceNodes = getNodesFromSelector(state.nodes, source);

    sourceNodes.forEach(({ node, exists }) => {
      if (!exists) {
        return;
      }

      // If source Node is already in the editor, check if it's draggable
      this.getNode(node.id).isDraggable((err) => (output.error = err));
    });

    // Check if source Node is droppable in target
    this.getNode(targetParent.id).isDroppable(
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
        let node = parseNodeFromJSX(reactElement, this.store.resolver);

        if (normalize) {
          normalize(node, reactElement);
        }

        let childrenNodes: NodeTree[] = [];

        if (reactElement.props && reactElement.props.children) {
          childrenNodes = React.Children.toArray(
            reactElement.props.children
          ).reduce<NodeTree[]>((accum, child: any) => {
            if (React.isValidElement(child)) {
              accum.push(this.parseReactElement(child).toNodeTree(normalize));
            }
            return accum;
          }, []);
        }

        return mergeTrees(node, childrenNodes);
      },
    };
  }

  get history() {
    return {
      canUndo: () => this.store.history.canUndo(),
      canRedo: () => this.store.history.canRedo(),
    };
  }

  /**
   * @deprecated
   */
  get events() {
    return this.state.events;
  }

  /**
   * @deprecated
   */
  get nodes(): Record<string, NodeQuery> {
    return Object.keys(this.state.nodes).reduce(
      (accum, nodeId) => ({
        ...accum,
        [nodeId]: new NodeQuery(this.store, { id: nodeId }),
      }),
      {}
    );
  }

  /**
   * @deprecated
   */
  get options() {
    return {
      ...this.store.config,
      enabled: this.isEnabled(),
    };
  }

  /**
   * @deprecated
   */
  get indicator() {
    return this.state.indicator;
  }

  /**
   * @deprecated
   */
  get timestamp() {
    return this.state.timestamp;
  }

  /**
   * @deprecated
   */
  node(id: NodeId) {
    return new NodeQuery(this.store, { id });
  }

  /**
   * @deprecated
   */
  getOptions() {
    return this.options;
  }

  /**
   * @deprecated
   */
  getSerializedNodes(): SerializedNodes {
    return Object.keys(this.state.nodes).reduce(
      (accum, id) => ({
        ...accum,
        [id]: this.getNode(id).toSerializedNode(),
      }),
      {}
    );
  }

  /**
   * @deprecated
   */
  serialize(): string {
    return JSON.stringify(this.getSerializedNodes());
  }

  /**
   * @deprecated
   * @param serializedNode
   */
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

  /**
   * @deprecated
   * @param freshNode
   */
  parseFreshNode(freshNode: FreshNode) {
    return {
      toNode: (normalize?: (node: Node) => void): Node => {
        let node = parseNodeFromJSX(
          React.createElement(freshNode.data.type, freshNode.data.props || {}),
          this.store.resolver
        );

        const { type, ...data } = freshNode.data;

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
