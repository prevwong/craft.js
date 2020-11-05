import { documentWithVariousNodes } from '../../tests/fixtures';
import { getNodesFromSelector } from '../getNodesFromSelector';

const {
  'linked-node': linkedNode,
  ...nodes
} = documentWithVariousNodes.nodes as any;

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
      expect(getNodesFromSelector(nodes, linkedNode)).toMatchObject([
        getSelector(linkedNode, false),
      ]);
    });
  });

  describe('when existOnly=true', () => {
    it('should throw if contains non-existing Node', () => {
      expect(() =>
        getNodesFromSelector(nodes, linkedNode, { existOnly: true })
      ).toThrow();
    });
  });
});
