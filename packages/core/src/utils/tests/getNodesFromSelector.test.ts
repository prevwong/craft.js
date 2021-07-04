import { getNodesFromSelector } from '../getNodesFromSelector';
import { createTestEditorStore } from '../testHelpers';
import { createNode } from '../types';

const store = createTestEditorStore({
  state: {
    nodes: {
      id: 'ROOT',
      linkedNodes: {
        heading: {
          id: 'linked-node',
          type: 'button',
        },
      },
      nodes: [
        {
          id: 'canvas-node',
          type: 'div',
          isCanvas: true,
        },
      ],
    },
  },
});

const getSelector = (node, exists) => ({ node, exists });

describe('getNodesFromSelector', () => {
  describe('when a NodeId is passed', () => {
    it('should return Node from state', () => {
      expect(getNodesFromSelector(store, 'canvas-node')).toMatchObject([
        getSelector(store.getState().nodes['canvas-node'], true),
      ]);
    });
    it('should pass exist=false if NodeId is non-existent in state', () => {
      expect(getNodesFromSelector(store, 'canvas-node2')).toMatchObject([
        getSelector(undefined, false),
      ]);
    });
  });

  describe('when a Node is passed', () => {
    it('should return Node from state if exist', () => {
      expect(
        getNodesFromSelector(store, store.getState().nodes['canvas-node'])
      ).toMatchObject([
        getSelector(store.getState().nodes['canvas-node'], true),
      ]);
    });
    it('should pass exist=false if Node is non-existent in state', () => {
      const node = createNode({
        id: 'some-node',
        type: 'button',
      });
      expect(getNodesFromSelector(store, node)).toMatchObject([
        getSelector(node, false),
      ]);
    });
  });

  describe('when existOnly=true', () => {
    it('should throw if contains non-existing Node', () => {
      expect(() =>
        getNodesFromSelector(store, ['canvas-node2'], { existOnly: true })
      ).toThrow();
    });
  });
});
