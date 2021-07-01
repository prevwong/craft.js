import { Node, NodeId, Nodes } from '../interfaces';
import {
  EditorStoreConfig,
  EditorStoreImpl,
  editorInitialState,
} from '../store';
import { getRandomNodeId } from '../utils/getRandomNodeId';

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

type NestedNode = Omit<Node, 'nodes' | 'linkedNodes' | 'parent'> & {
  nodes: NestedNode[];
  linkedNodes: Record<NodeId, NestedNode>;
};

type PartialNestedNode = Partial<
  Omit<NestedNode, 'nodes' | 'linkedNodes'> & {
    nodes: PartialNestedNode[];
    linkedNodes: Record<NodeId, PartialNestedNode>;
  }
>;

export const createTestNodes = (node: PartialNestedNode) => {
  const flattenNodes: Nodes = {};
  const flattenNode = (partialNode: PartialNestedNode, parent = null) => {
    const node = {
      id: getRandomNodeId(),
      nodes: [],
      linkedNodes: {},
      props: {},
      custom: {},
      type: 'div',
      displayName: 'div',
      isCanvas: false,
      hidden: false,
      ...partialNode,
    };

    flattenNodes[node.id] = {
      ...node,
      parent,
      nodes: node.nodes.map((childNode) => flattenNode(childNode, node.id)),
      linkedNodes: Object.entries(node.linkedNodes).reduce(
        (accum, [id, linkedNode]) => ({
          ...accum,
          [id]: flattenNode(linkedNode, node.id),
        }),
        {}
      ),
    };

    return node.id;
  };

  flattenNode(node);

  return flattenNodes;
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

export const createTestEditorStore = (
  config: Partial<EditorStoreConfig & { state: { nodes: PartialNestedNode } }>
) => {
  const { state, ...otherConfig } = config;

  return new EditorStoreImpl({
    ...otherConfig,
    state: createTestState(state),
  });
};
