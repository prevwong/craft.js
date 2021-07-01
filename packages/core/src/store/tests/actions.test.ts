import { mapValues } from 'lodash';

import { EditorState } from '../../interfaces';
import { createNode } from '../../utils/createNode';
import {
  createTestNodes,
  createTestState,
  expectEditorState,
} from '../../utils/testHelpers';
import { ActionMethods } from '../actions';
import { EditorQuery } from '../query';

describe('actions', () => {
  let state: EditorState, actions: ReturnType<typeof ActionMethods>;

  beforeEach(() => {
    state = createTestState({
      nodes: {
        id: 'ROOT',
        data: {
          type: 'div',
        },
      },
    });

    actions = ActionMethods(state, new EditorQuery(state));
  });
  describe('add', () => {
    it('should be able to add node', () => {
      const node = createNode({
        id: 'node-test',
        type: 'span',
        parent: 'ROOT',
      });
      actions.add(node, 'ROOT');

      const node2 = createNode({
        id: 'node-test2',
        type: 'button',
        parent: 'ROOT',
      });

      actions.add(node2, 'ROOT', 0);

      expect(state.nodes['node-test']).toEqual(node);
      expect(state.nodes['node-test2']).toEqual(node2);
      expect(state.nodes['ROOT'].nodes).toEqual(['node-test2', 'node-test']);
    });
    it('should throw if invalid parentId', () => {
      expect(() =>
        actions.add(
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
      actions.addNodeTree(
        {
          rootNodeId: 'card',
          nodes,
        },
        'ROOT'
      );

      expect(state.nodes.ROOT.nodes).toEqual(['card']);
      expect(state.nodes.card).toEqual(cardNode);
      expect(state.nodes.child).toEqual(cardChildNode);
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      state = createTestState({
        nodes: {
          id: 'ROOT',
          data: {
            type: 'div',
            nodes: [
              {
                id: 'non-target',
                data: {
                  type: 'button',
                },
              },
              {
                id: 'target',
                data: {
                  type: 'div',
                  nodes: [
                    {
                      id: 'child',
                      data: {
                        type: 'button',
                      },
                    },
                    {
                      id: 'child-2',
                      data: {
                        type: 'button',
                      },
                    },
                  ],
                  linkedNodes: {
                    linkedChild: {
                      id: 'linked-child',
                      data: {
                        type: 'button',
                      },
                    },
                    linkedChild2: {
                      id: 'linked-child-2',
                      data: {
                        type: 'button',
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      });
      actions = ActionMethods(state, QueryMethods(state));
    });
    it('should be able to delete node', () => {
      expect(Object.keys(state.nodes)).toEqual([
        'ROOT',
        'non-target',
        'target',
        'child',
        'child-2',
        'linked-child',
        'linked-child-2',
      ]);
      actions.delete('target');
      expect(state.nodes.ROOT.data.nodes).toEqual(['non-target']);
      expect(Object.keys(state.nodes)).toEqual(['ROOT', 'non-target']);
    });
  });
  describe('deserialize', () => {
    it('should be able the state correctly', () => {
      const nodes = {
        id: 'ROOT',
        data: {
          type: 'h1',
          nodes: [
            {
              id: 'btn',
              data: {
                type: 'button',
              },
            },
            {
              id: 'container',
              data: {
                type: 'div',
                linkedNodes: {
                  header: {
                    id: 'header',
                    data: {
                      type: 'div',
                    },
                  },
                },
              },
            },
          ],
        },
      };

      const serialized = mapValues(createTestNodes(nodes), ({ data }) => ({
        ...data,
      }));

      actions.deserialize(serialized as any);

      expectEditorState(
        state,
        createTestState({
          nodes,
        })
      );
    });
  });
  describe('setNodeEvent', () => {
    it('should be able to change event state', () => {
      actions.add(
        createNode({
          id: 'test',
          type: 'button',
        }),
        'ROOT'
      );
      ['selected', 'hovered', 'dragged'].forEach((eventType) => {
        actions.setNodeEvent(eventType as any, ['ROOT', 'test']);
        expect(Array.from(state.events[eventType])).toEqual(['ROOT', 'test']);
      });
    });
  });
  describe('clearEvents', () => {
    beforeEach(() => {
      state = createTestState({
        nodes: {
          id: 'ROOT',
          data: {
            type: 'div',
          },
        },
        events: {
          selected: ['ROOT'],
          hovered: ['ROOT'],
          dragged: ['ROOT'],
        },
      });
      actions = ActionMethods(state, QueryMethods(state));
    });
    it('should be able to remove all events', () => {
      actions.clearEvents();
      expect(state.events).toEqual({
        selected: new Set(),
        hovered: new Set(),
        dragged: new Set(),
      });
    });
  });
  describe('setProp', () => {
    it('should be able to set component prop on Node', () => {
      actions.setProp('ROOT', (props) => {
        props.color = '#333';
      });

      expect(state.nodes.ROOT.props).toEqual({
        color: '#333',
      });
    });
  });
  describe('setCustom', () => {
    it('should be able to set custom properties on Node', () => {
      actions.setCustom('ROOT', (custom) => {
        custom.color = '#333';
      });

      expect(state.nodes.ROOT.custom).toEqual({
        color: '#333',
      });
    });
  });
  describe('setHidden', () => {
    it('should be able to set hidden property on node', () => {
      actions.setHidden('ROOT', true);
      expect(state.nodes['ROOT'].hidden).toEqual(true);
      actions.setHidden('ROOT', false);
      expect(state.nodes['ROOT'].hidden).toEqual(false);
    });
  });
  describe('setIndicator', () => {
    beforeEach(() => {
      state = createTestState({
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
      });
      actions = ActionMethods(state, QueryMethods(state));
    });
    it('should be able to set indicator state', () => {
      const indicator = {
        placement: {
          currentNode: state.nodes['node-a'],
          parent: state.nodes['ROOT'],
          index: 0,
          where: 'after',
        },
        error: null,
      };

      actions.setIndicator(indicator);
      expect(state.indicator).toEqual(indicator);
    });
  });
  describe('move', () => {
    beforeEach(() => {
      state = createTestState({
        nodes: {
          id: 'ROOT',
          data: {
            type: 'div',
            isCanvas: true,
            nodes: [
              {
                id: 'node-a',
                data: {
                  type: 'button',
                },
              },
              {
                id: 'node-b',
                data: {
                  type: 'div',
                  isCanvas: true,
                  nodes: [
                    {
                      id: 'node-c',
                      data: {
                        type: 'button',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });
      actions = ActionMethods(state, QueryMethods(state));
    });
    it('should be able to move node', () => {
      actions.move('node-c', 'ROOT', 2);
      expect(state.nodes.ROOT.data.nodes).toEqual([
        'node-a',
        'node-b',
        'node-c',
      ]);
      expect(state.nodes['node-b'].data.nodes).toEqual([]);
      expect(state.nodes['node-c'].data.parent).toEqual('ROOT');
    });
  });
});
