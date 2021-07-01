import { createNode } from '../createNode';
import { getNodesFromSelector } from '../getNodesFromSelector';
import { createTestNodes } from '../testHelpers';

const nodes = createTestNodes({
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
});

const getSelector = (node, exists) => ({ node, exists });

describe('getNodesFromSelector', () => {
  describe('when a NodeId is passed', () => {
    it('should return Node from state', () => {
      expect(getNodesFromSelector(nodes, 'canvas-node')).toMatchObject([
        getSelector(nodes['canvas-node'], true),
      ]);
    });
    it('should pass exist=false if NodeId is non-existent in state', () => {
      expect(getNodesFromSelector(nodes, 'canvas-node2')).toMatchObject([
        getSelector(undefined, false),
      ]);
    });
  });

  describe('when a Node is passed', () => {
    it('should return Node from state if exist', () => {
      expect(getNodesFromSelector(nodes, nodes['canvas-node'])).toMatchObject([
        getSelector(nodes['canvas-node'], true),
      ]);
    });
    it('should pass exist=false if Node is non-existent in state', () => {
      const node = createNode({
        id: 'some-node',
        type: 'button',
      });
      expect(getNodesFromSelector(nodes, node)).toMatchObject([
        getSelector(node, false),
      ]);
    });
  });

  describe('when existOnly=true', () => {
    it('should throw if contains non-existing Node', () => {
      expect(() =>
        getNodesFromSelector(nodes, ['canvas-node2'], { existOnly: true })
      ).toThrow();
    });
  });
});
