import { SerializedNodes } from '../../interfaces';
import { createNode } from '../../utils/createNode';
import { createTestEditorStore } from '../../utils/testHelpers';
import { EditorStore } from '../EditorStore';

describe('actions', () => {
  let store: EditorStore;

  beforeEach(() => {
    store = createTestEditorStore({
      state: {
        nodes: {
          id: 'ROOT',
          type: 'div',
        },
      },
    });
  });
  describe('add', () => {
    it('should be able to add node', () => {
      const node = createNode({
        id: 'node-test',
        type: 'span',
        parent: 'ROOT',
      });
      const node2 = createNode({
        id: 'node-test2',
        type: 'button',
        parent: 'ROOT',
      });

      store.actions.add(node, 'ROOT');
      store.actions.add(node2, 'ROOT', 0);

      expect(store.getState().nodes['node-test']).toEqual(node);
      expect(store.getState().nodes['node-test2']).toEqual(node2);
      expect(store.getState().nodes['ROOT'].nodes).toEqual([
        'node-test2',
        'node-test',
      ]);
    });
    it('should throw if invalid parentId', () => {
      expect(() =>
        store.actions.add(
          createNode({
            id: 'node-test',
            type: 'span',
          }),
          null
        )
      ).toThrow();
    });
  });
  describe('addNodeTree', () => {
    it('should be able to add NodeTree', () => {
      const cardNode = createNode({
        id: 'card',
        type: 'div',
        parent: 'ROOT',
        nodes: ['child'],
      });
      const cardChildNode = createNode({
        id: 'child',
        type: 'button',
        parent: 'card',
      });
      const nodes = {
        card: cardNode,
        child: cardChildNode,
      };
      store.actions.addNodeTree(
        {
          rootNodeId: 'card',
          nodes,
        },
        'ROOT'
      );

      expect(store.getState().nodes.ROOT.nodes).toEqual(['card']);
      expect(store.getState().nodes.card).toEqual(cardNode);
      expect(store.getState().nodes.child).toEqual(cardChildNode);
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      store = createTestEditorStore({
        state: {
          nodes: {
            id: 'ROOT',
            type: 'div',
            nodes: [
              {
                id: 'non-target',
                type: 'span',
              },
              {
                id: 'delete-target',
                type: 'div',
                nodes: [
                  {
                    id: 'delete-target-child-node',
                    type: 'button',
                  },
                  {
                    id: 'delete-target-child-node-2',
                    type: 'div',
                    linkedNodes: {
                      heading: {
                        id: 'delete-target-linked-node',
                        type: 'button',
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });
    it('should be able to delete node', () => {
      store.actions.delete('delete-target');
      expect(store.getState().nodes.ROOT.nodes).toEqual(['non-target']);
      expect(Object.keys(store.getState().nodes)).toEqual([
        'ROOT',
        'non-target',
      ]);
    });
  });
  describe('deserialize', () => {
    beforeEach(() => {
      store = createTestEditorStore({
        resolver: {
          Cover: () => null,
        },
      });
    });
    it('should be able the state correctly', () => {
      const nodes: SerializedNodes = {
        ROOT: {
          type: 'div',
          displayName: 'div',
          nodes: ['CHILD', 'CHILD2'],
          linkedNodes: {},
          props: {},
          hidden: false,
          isCanvas: true,
          parent: null,
        },
        CHILD: {
          type: 'div',
          displayName: 'div',
          nodes: [],
          linkedNodes: {
            heading: 'HEADING-LINKED',
          },
          props: {},
          hidden: false,
          isCanvas: false,
          parent: 'ROOT',
        },
        CHILD2: {
          type: {
            resolvedName: 'Cover',
          },
          displayName: 'Cover',
          nodes: [],
          linkedNodes: {},
          props: {},
          hidden: false,
          isCanvas: false,
          parent: 'ROOT',
        },
        'HEADING-LINKED': {
          type: 'button',
          displayName: 'button',
          nodes: [],
          linkedNodes: {},
          props: {},
          hidden: false,
          isCanvas: false,
          parent: 'CHILD',
        },
      };

      store.actions.deserialize(nodes);
      expect(store.getState().nodes).toEqual({
        ROOT: {
          id: 'ROOT',
          type: 'div',
          displayName: 'div',
          nodes: ['CHILD', 'CHILD2'],
          linkedNodes: {},
          props: {},
          custom: {},
          hidden: false,
          isCanvas: true,
          parent: null,
        },
        CHILD: {
          id: 'CHILD',
          type: 'div',
          displayName: 'div',
          nodes: [],
          linkedNodes: {
            heading: 'HEADING-LINKED',
          },
          props: {},
          custom: {},
          hidden: false,
          isCanvas: false,
          parent: 'ROOT',
        },
        CHILD2: {
          id: 'CHILD2',
          type: 'Cover',
          displayName: 'Cover',
          nodes: [],
          linkedNodes: {},
          props: {},
          custom: {},
          hidden: false,
          isCanvas: false,
          parent: 'ROOT',
        },
        'HEADING-LINKED': {
          id: 'HEADING-LINKED',
          type: 'button',
          displayName: 'button',
          nodes: [],
          linkedNodes: {},
          props: {},
          custom: {},
          hidden: false,
          isCanvas: false,
          parent: 'CHILD',
        },
      });
    });
  });
  describe('setNodeEvent', () => {
    it('should be able to change event state', () => {
      store.actions.add(
        createNode({
          id: 'test',
          type: 'button',
        }),
        'ROOT'
      );
      ['selected', 'hovered', 'dragged'].forEach((eventType) => {
        store.actions.setNodeEvent(eventType as any, ['ROOT', 'test']);
        expect(Array.from(store.getState().events[eventType])).toEqual([
          'ROOT',
          'test',
        ]);
      });
    });
  });
  describe('clearEvents', () => {
    beforeEach(() => {
      store = createTestEditorStore({
        state: {
          nodes: {
            id: 'ROOT',
            type: 'div',
          },
          events: {
            selected: ['ROOT'],
            hovered: ['ROOT'],
            dragged: ['ROOT'],
          },
        },
      });
    });
    it('should be able to remove all events', () => {
      store.actions.clearEvents();
      expect(store.getState().events).toEqual({
        selected: new Set(),
        hovered: new Set(),
        dragged: new Set(),
      });
    });
  });
  describe('setProp', () => {
    it('should be able to set component prop on Node', () => {
      store.actions.setProp('ROOT', (props) => {
        props.color = '#333';
      });

      expect(store.getState().nodes.ROOT.props).toEqual({
        color: '#333',
      });
    });
  });
  describe('setCustom', () => {
    it('should be able to set custom properties on Node', () => {
      store.actions.setCustom('ROOT', (custom) => {
        custom.color = '#333';
      });

      expect(store.getState().nodes.ROOT.custom).toEqual({
        color: '#333',
      });
    });
  });
  describe('setHidden', () => {
    it('should be able to set hidden property on node', () => {
      store.actions.setHidden('ROOT', true);
      expect(store.getState().nodes['ROOT'].hidden).toEqual(true);
      store.actions.setHidden('ROOT', false);
      expect(store.getState().nodes['ROOT'].hidden).toEqual(false);
    });
  });
  describe('setIndicator', () => {
    beforeEach(() => {
      store = createTestEditorStore({
        state: {
          nodes: {
            id: 'ROOT',
            type: 'div',
            isCanvas: true,
            nodes: [
              {
                id: 'node-a',
                type: 'button',
              },
            ],
          },
        },
      });
    });
    it('should be able to set indicator state', () => {
      const indicator = {
        placement: {
          currentNode: store.getState().nodes['node-a'],
          parent: store.getState().nodes['ROOT'],
          index: 0,
          where: 'after',
        },
        error: null,
      };

      store.actions.setIndicator(indicator);
      expect(store.getState().indicator).toEqual(indicator);
    });
  });
  describe('move', () => {
    beforeEach(() => {
      store = createTestEditorStore({
        state: {
          nodes: {
            id: 'ROOT',
            type: 'div',
            isCanvas: true,
            nodes: [
              {
                id: 'node-a',
                type: 'button',
              },
              {
                id: 'node-b',
                type: 'div',
                isCanvas: true,
                nodes: [
                  {
                    id: 'node-c',
                    type: 'button',
                  },
                ],
              },
            ],
          },
        },
      });
    });
    it('should be able to move node', () => {
      store.actions.move('node-c', 'ROOT', 2);
      expect(store.getState().nodes.ROOT.nodes).toEqual([
        'node-a',
        'node-b',
        'node-c',
      ]);
      expect(store.getState().nodes['node-b'].nodes).toEqual([]);
      expect(store.getState().nodes['node-c'].parent).toEqual('ROOT');
    });
  });
});
