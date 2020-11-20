/* eslint-disable no-param-reassign */
import { EditorState, Node } from '@craftjs/core';
import { original } from 'immer';
import { forEach } from 'lodash';
import React from 'react';

// import { BuiltInComponents } from 'craft/constants';
import { resolvers } from '../SlateEditor/resolvers';
type ResolverKeys = keyof typeof resolvers;

export default function wrapElement(
  state: EditorState,
  // TODO type Query
  query: any,
  previousState: EditorState,
  resolverType: ResolverKeys,
  acceptedChildrenType: string[]
) {
  const nodesToExpel: Array<{ nodeId: string; index: number }> = [];
  const nodesToAdd: { [key: string]: Node } = {};

  forEach(state.nodes, (node) => {
    if (!node.data.nodes) {
      return;
    }

    const isWrapperNode = node.data.name === resolverType;

    let lastWrapper: Node | null = isWrapperNode ? node : null;
    const childNodesIds = new Set<string>();

    // Go through each child Node
    node.data.nodes.forEach((id, i) => {
      const childNode = state.nodes[id];

      if (!childNode) {
        return;
      }

      // TODO figure this one out
      // @ts-ignore
      const isChildOfAcceptedType = acceptedChildrenType.includes(
        childNode.data.name
      );
      const isChildOfWrapperType = childNode.data.name === resolverType;

      // If the parent Node is of wrapperType
      if (isWrapperNode) {
        /**
         * If the child Node is not of acceptableType in the wrapper
         * break the wrapper node here, and expel the remaining child Nodes
         */
        if (!isChildOfAcceptedType) {
          // A node of wrapperType could have been dropped into the current wrapper
          lastWrapper = isChildOfWrapperType ? childNode : null;

          // Mark the current location to expel all child Nodes that follows
          nodesToExpel.push({
            nodeId: node.id,
            index: i,
          });

          childNodesIds.add(id);

          return;
        }

        if (lastWrapper === node) {
          childNodesIds.add(id);
          return;
        }
      }

      if (!isChildOfAcceptedType) {
        if (isChildOfWrapperType) {
          lastWrapper = childNode;
        } else {
          lastWrapper = null;
        }

        childNodesIds.add(id);
        return;
      }

      // Create a new node of wrapperType
      if (!lastWrapper) {
        const newNodeTree = query
          .parseReactElement(
            React.createElement(resolvers[resolverType] as any)
          )
          .toNodeTree();

        const newWrapper = newNodeTree.nodes[newNodeTree.rootNodeId];

        if (!newWrapper.data.nodes) {
          newWrapper.data.nodes = [];
        }

        const previousParentId =
          previousState &&
          previousState.nodes[childNode.id] &&
          previousState.nodes[childNode.id].data.parent;
        const previousParentNode = original(state.nodes[previousParentId]);

        // If the child's parent used to be of wrapperType
        // Then ensure the new wrapper inherits custom and props
        // This happens when the child Node has been split into a new wrapper
        if (
          previousParentNode &&
          previousParentNode.data.name === resolverType
        ) {
          newWrapper.data.custom = { ...previousParentNode.data.custom };
          newWrapper.data.props = { ...previousParentNode.data.props };
        }

        childNode.data.parent = newWrapper.id;
        newWrapper.data.nodes.push(id);
        newWrapper.data.parent = node.id;
        nodesToAdd[newWrapper.id] = newWrapper;
        lastWrapper = newWrapper;
      } else {
        childNode.data.parent = lastWrapper.id;

        if (!lastWrapper.data.nodes) {
          lastWrapper.data.nodes = [];
        }

        lastWrapper.data.nodes.push(id);
      }

      // @ts-ignore
      childNodesIds.add(lastWrapper.id);
    });

    node.data.nodes = Array.from(childNodesIds);
  });

  forEach(nodesToAdd, (newNode) => {
    state.nodes[newNode.id] = newNode;
  });

  nodesToExpel.forEach(({ nodeId, index }) => {
    const node = state.nodes[nodeId];

    if (!node) {
      return;
    }

    const parentId = node.data.parent;
    const parentNode = state.nodes[parentId];

    if (!parentNode || !node.data.nodes) {
      return;
    }

    const indexOfNodeInParent = parentNode.data.nodes.indexOf(nodeId);
    const nodeIdsToExpel = node.data.nodes.slice(index) || [];

    nodeIdsToExpel.forEach((id) => {
      if (!state.nodes[id]) {
        return;
      }

      state.nodes[id].data.parent = parentId;
    });

    parentNode.data.nodes.splice(indexOfNodeInParent + 1, 0, ...nodeIdsToExpel);
    node.data.nodes = node.data.nodes.slice(0, index);
  });
}
