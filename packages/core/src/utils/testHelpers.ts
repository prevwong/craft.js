import {
  EditorStoreConfig,
  Node,
  NodeEventTypes,
  NodeId,
  Nodes,
} from '../interfaces';
import { EditorStoreImpl, editorInitialState } from '../store';
import { getRandomNodeId } from '../utils/getRandomNodeId';

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
      nodes: [],
      linkedNodes: {},
    };

    flattenNodes[node.id].nodes = node.nodes.map((childNode) =>
      flattenNode(childNode, node.id)
    );
    flattenNodes[node.id].linkedNodes = Object.entries(node.linkedNodes).reduce(
      (accum, [id, linkedNode]) => ({
        ...accum,
        [id]: flattenNode(linkedNode, node.id),
      }),
      {}
    );

    return node.id;
  };

  flattenNode(node);

  return flattenNodes;
};

type TestEditorState = {
  nodes: PartialNestedNode;
  events: Record<NodeEventTypes, NodeId[]>;
};

export const createTestState = (state: Partial<TestEditorState> = {}) => {
  const { nodes: rootNode, events } = state;

  return {
    ...editorInitialState,
    ...state,
    nodes: rootNode ? createTestNodes(rootNode) : {},
    events: {
      ...editorInitialState.events,
      ...(!events
        ? {}
        : Object.entries(events).reduce(
            (accum, [eventType, array]) => ({
              ...accum,
              [eventType]: new Set(array),
            }),
            {}
          )),
    },
  };
};

export const createTestEditorStore = (
  config: Partial<EditorStoreConfig & { state: Partial<TestEditorState> }>
) => {
  const { state, ...otherConfig } = config;

  return new EditorStoreImpl({
    ...otherConfig,
    state: createTestState(state),
  });
};
