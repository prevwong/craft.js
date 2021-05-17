import {
  QueryCallbacksFor,
  ERROR_NOT_IN_RESOLVER,
  getDOMInfo,
  deprecationWarning,
  DEPRECATED_ROOT_NODE,
  ROOT_NODE,
} from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { EventHelpers } from './EventHelpers';
import { NodeHelpers } from './NodeHelpers';

import findPosition from '../events/findPosition';
import {
  NodeId,
  EditorState,
  Indicator,
  Node,
  Options,
  NodeEventTypes,
  NodeInfo,
  NodeSelector,
  NodeTree,
  SerializedNodes,
  SerializedNode,
  FreshNode,
} from '../interfaces';
import { createNode } from '../utils/createNode';
import { deserializeNode } from '../utils/deserializeNode';
import { fromEntries } from '../utils/fromEntries';
import { getNodesFromSelector } from '../utils/getNodesFromSelector';
import { mergeTrees } from '../utils/mergeTrees';
import { parseNodeFromJSX } from '../utils/parseNodeFromJSX';
import { resolveComponent } from '../utils/resolveComponent';

export function QueryMethods(state: EditorState) {
  const options = state && state.options;

  const _: () => QueryCallbacksFor<typeof QueryMethods> = () =>
    QueryMethods(state) as any;

  return {
    /**
     * Determine the best possible location to drop the source Node relative to the target Node
     */
    getDropPlaceholder: (
      source: NodeSelector,
      target: NodeId,
      pos: { x: number; y: number },
      nodesToDOM: (node: Node) => HTMLElement = (node) =>
        state.nodes[node.id].dom
    ) => {
      const targetNode = state.nodes[target],
        isTargetCanvas = _().node(targetNode.id).isCanvas();

      const targetParent = isTargetCanvas
        ? targetNode
        : state.nodes[targetNode.data.parent];

      if (!targetParent) return;

      const targetParentNodes = targetParent.data.nodes || [];

      const dimensionsInContainer = targetParentNodes
        ? targetParentNodes.reduce((result, id: NodeId) => {
            const dom = nodesToDOM(state.nodes[id]);
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
        // If source Node is already in the editor, check if it's draggable
        if (exists) {
          _()
            .node(node.id)
            .isDraggable((err) => (output.error = err));
        }
      });

      // Check if source Node is droppable in target
      _()
        .node(targetParent.id)
        .isDroppable(source, (err) => (output.error = err));

      return output;
    },

    /**
     * Helper to get ids of the nodes the user is currently dragging a node over
     *
     * @example
     * ```
     * <div data-nodeid="ROOT">
     *   <div data-nodeid="node-1-1">
     *      <div data-nodeid="node-2-1">A</div>
     *      <div data-nodeid="node-2-2">B</div>
     *   </div>
     *   <div data-nodeid="node-1-2">C</div>
     * </div>
     * ```
     *
     * Let's use the code above as an example. Imagine a user would drag a node over the div with content A. The list that getDraggedOverNodes will return
     * would be `['node-2-1', 'node-1-1', 'ROOT']`
     *
     * @returns The list of the node ids the user is currently dragging a node over. Ordered "descending" by the depth in the node tree.
     * The lowest node the "ROOT" will be last element and deepest element (the one we are dragging over) will be first. In between we have the ancestors of the first element
     * ordered by their depth accordingly.
     */
    getDraggedOverNodes(): Set<NodeId> {
      const draggedOverNodeId = Array.from(state.events.draggedOver)[0];
      if (draggedOverNodeId) {
        return new Set([
          draggedOverNodeId,
          ..._().node(draggedOverNodeId).ancestors(),
        ]);
      } else {
        return new Set();
      }
    },

    /**
     * Get the current Editor options
     */
    getOptions(): Options {
      return options;
    },

    /**
     * Helper methods to describe the specified Node
     * @param id
     */
    node(id: NodeId) {
      return NodeHelpers(state, id);
    },

    /**
     * Returns all the `nodes` in a serialized format
     */
    getSerializedNodes(): SerializedNodes {
      const nodePairs = Object.keys(state.nodes).map((id: NodeId) => [
        id,
        this.node(id).toSerializedNode(),
      ]);
      return fromEntries(nodePairs);
    },

    getEvent(eventType: NodeEventTypes) {
      return EventHelpers(state, eventType);
    },

    /**
     * Retrieve the JSON representation of the editor's Nodes
     */
    serialize(): string {
      return JSON.stringify(this.getSerializedNodes());
    },

    parseReactElement: (reactElement: React.ReactElement) => ({
      toNodeTree(
        normalize?: (node: Node, jsx: React.ReactElement) => void
      ): NodeTree {
        let node = parseNodeFromJSX(reactElement, (node, jsx) => {
          const name = resolveComponent(state.options.resolver, node.data.type);
          invariant(name !== null, ERROR_NOT_IN_RESOLVER);
          node.data.displayName = node.data.displayName || name;
          node.data.name = name;

          if (normalize) {
            normalize(node, jsx);
          }
        });

        let childrenNodes = [];

        if (reactElement.props && reactElement.props.children) {
          childrenNodes = React.Children.toArray(
            reactElement.props.children
          ).reduce((accum, child) => {
            if (React.isValidElement(child)) {
              accum.push(_().parseReactElement(child).toNodeTree(normalize));
            }
            return accum;
          }, []);
        }

        return mergeTrees(node, childrenNodes);
      },
    }),

    parseSerializedNode: (serializedNode: SerializedNode) => ({
      toNode(normalize?: (node: Node) => void): Node {
        const data = deserializeNode(serializedNode, state.options.resolver);
        invariant(data.type, ERROR_NOT_IN_RESOLVER);

        const id = typeof normalize === 'string' && normalize;

        if (id) {
          deprecationWarning(`query.parseSerializedNode(...).toNode(id)`, {
            suggest: `query.parseSerializedNode(...).toNode(node => node.id = id)`,
          });
        }

        return _()
          .parseFreshNode({
            ...(id ? { id } : {}),
            data,
          })
          .toNode(!id && normalize);
      },
    }),

    parseFreshNode: (node: FreshNode) => ({
      toNode(normalize?: (node: Node) => void): Node {
        return createNode(node, (node) => {
          if (node.data.parent === DEPRECATED_ROOT_NODE) {
            node.data.parent = ROOT_NODE;
          }

          const name = resolveComponent(state.options.resolver, node.data.type);
          invariant(name !== null, ERROR_NOT_IN_RESOLVER);
          node.data.displayName = node.data.displayName || name;
          node.data.name = name;

          if (normalize) {
            normalize(node);
          }
        });
      },
    }),

    createNode(reactElement: React.ReactElement, extras?: any) {
      deprecationWarning(`query.createNode(${reactElement})`, {
        suggest: `query.parseReactElement(${reactElement}).toNodeTree()`,
      });

      const tree = this.parseReactElement(reactElement).toNodeTree();

      const node = tree.nodes[tree.rootNodeId];

      if (!extras) {
        return node;
      }

      if (extras.id) {
        node.id = extras.id;
      }

      if (extras.data) {
        node.data = {
          ...node.data,
          ...extras.data,
        };
      }

      return node;
    },

    getState() {
      return state;
    },
  };
}
