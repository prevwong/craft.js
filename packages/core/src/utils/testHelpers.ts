import cloneDeep from 'lodash/cloneDeep';

import { createNode } from './createNode';

import { Nodes } from '../interfaces';
import { editorInitialState } from '../store';

const getTestNode = (node) => {
  const {
    events,
    data: { nodes: childNodes, linkedNodes },
    ...restNode
  } = node;
  const validNode = createNode(cloneDeep(node));

  node = {
    ...validNode,
    ...restNode,
    data: {
      type: 'div',
      ...validNode.data,
      ...restNode.data,
    },
    events: {
      ...validNode.events,
      ...events,
    },
    dom: node.dom || validNode.dom,
  };

  return {
    node,
    childNodes,
    linkedNodes,
  };
};

export const expectEditorState = (lhs, rhs) => {
  const { nodes: nodesRhs, ...restRhs } = rhs;
  const { nodes: nodesLhs, ...restLhs } = lhs;
  expect(restLhs).toEqual(restRhs);

  const nodesRhsSimplified = Object.keys(nodesRhs).reduce((accum, id) => {
    const { _hydrationTimestamp, rules, ...node } = nodesRhs[id];
    accum[id] = node;
    return accum;
  }, {});

  const nodesLhsSimplified = Object.keys(nodesLhs).reduce((accum, id) => {
    const { _hydrationTimestamp, rules, ...node } = nodesLhs[id];
    accum[id] = node;
    return accum;
  }, {});

  expect(nodesLhsSimplified).toEqual(nodesRhsSimplified);
};

export const createTestNode = (node) => {
  return getTestNode(node).node;
};

export const createTestNodes = (rootNode): Nodes => {
  const nodes = {};
  const iterateNodes = (testNode) => {
    const { node: parentNode, childNodes, linkedNodes } = getTestNode(testNode);
    nodes[parentNode.id] = parentNode;

    if (childNodes) {
      childNodes.forEach((childTestNode, i) => {
        const {
          node: childNode,
          childNodes: grandChildNodes,
          linkedNodes: grandChildLinkedNodes,
        } = getTestNode(childTestNode);
        childNode.data.parent = parentNode.id;
        nodes[childNode.id] = childNode;
        parentNode.data.nodes[i] = childNode.id;
        iterateNodes({
          ...childNode,
          data: {
            ...childNode.data,
            nodes: grandChildNodes || [],
            linkedNodes: grandChildLinkedNodes || {},
          },
        });
      });
    }

    if (linkedNodes) {
      Object.keys(linkedNodes).forEach((linkedId) => {
        const {
          node: childNode,
          childNodes: grandChildNodes,
          linkedNodes: grandChildLinkedNodes,
        } = getTestNode(linkedNodes[linkedId]);
        parentNode.data.linkedNodes[linkedId] = childNode.id;

        childNode.data.parent = parentNode.id;
        nodes[childNode.id] = childNode;
        iterateNodes({
          ...childNode,
          data: {
            ...childNode.data,
            nodes: grandChildNodes || [],
            linkedNodes: grandChildLinkedNodes || {},
          },
        });
      });
    }
  };

  iterateNodes(rootNode);

  return nodes;
};

export const createTestState = (state = {} as any) => {
  const { nodes: rootNode, events } = state;

  return {
    ...editorInitialState,
    ...state,
    nodes: rootNode ? createTestNodes(rootNode) : {},
    events: {
      ...editorInitialState.events,
      ...(events || {}),
    },
  };
};
