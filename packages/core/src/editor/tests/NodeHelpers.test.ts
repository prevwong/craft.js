import {
  card,
  documentWithVariousNodes,
  primaryButton,
  rootNode,
  secondaryButton,
} from '../../tests/fixtures';
import { serializeNode } from '../../utils/serializeNode';
import { NodeHelpers } from '../NodeHelpers';

let helper;

jest.mock('../../utils/serializeNode', () => ({
  serializeNode: jest.fn(),
}));

describe('NodeHelpers', () => {
  beforeEach(() => {
    helper = (id) => NodeHelpers(documentWithVariousNodes as any, id);
  });

  it('should throw error if invalid value supplied as NodeId', () => {
    expect(() => helper({})).toThrowError();
  });

  describe('isRoot', () => {
    it('should return true if root node', () => {
      expect(helper('ROOT').isRoot()).toBe(true);
    });
    it('should return false if non-root node', () => {
      expect(helper('node-card').isRoot()).toBe(false);
    });
  });

  describe('isCanvas', () => {
    it('should return true if node is canvas', () => {
      expect(helper('canvas-node').isCanvas()).toBe(true);
    });
    it('should return false if node is non-canvas', () => {
      expect(helper(primaryButton.id).isCanvas()).toBe(false);
    });
  });

  describe('isTopLevelNode', () => {
    it('should return true if linked Node', () => {
      expect(helper('linked-node').isTopLevelNode()).toBe(true);
    });
    it('should return true if root Node', () => {
      expect(helper('ROOT').isTopLevelNode()).toBe(true);
    });
    it('should return false if non-top-level Node', () => {
      expect(helper(secondaryButton.id).isCanvas()).toBe(false);
    });
  });

  describe('isDeletable', () => {
    it('should return true if non-top level Node', () => {
      expect(helper(secondaryButton.id).isDeletable()).toBe(true);
    });
    it('should return false if top-level Node', () => {
      expect(helper('linked-node').isDeletable()).toBe(false);
    });
  });

  describe('get', () => {
    it('should return node', () => {
      expect(helper(secondaryButton.id).get()).toBe(
        documentWithVariousNodes.nodes[secondaryButton.id]
      );
    });
  });

  describe('descendants', () => {
    it('should return immediate child and linked node ids', () => {
      expect(
        helper('canvas-node-reject-outgoing-dnd').descendants()
      ).toStrictEqual(
        helper('canvas-node-reject-outgoing-dnd').get().data.nodes
      );
    });
    describe('when "includeOnly" is unset', () => {
      it('should return all child and linked nodes', () => {
        expect(
          helper('canvas-node-reject-outgoing-dnd').descendants(true)
        ).toStrictEqual([
          ...documentWithVariousNodes.nodes['canvas-node-reject-outgoing-dnd']
            .data.nodes,
          ...Object.values(
            documentWithVariousNodes.nodes['parent-of-linked-node'].data
              .linkedNodes || {}
          ),
          ...documentWithVariousNodes.nodes['linked-node'].data.nodes,
        ]);
      });
    });
    describe('when "includeOnly" is set to childNodes', () => {
      it('should return all child nodes only', () => {
        expect(
          helper('canvas-node-reject-outgoing-dnd').descendants(
            true,
            'childNodes'
          )
        ).toStrictEqual([
          ...documentWithVariousNodes.nodes['canvas-node-reject-outgoing-dnd']
            .data.nodes,
        ]);
      });
    });
    describe('when "includeOnly" is set to linkedNodes', () => {
      it('should return all linked nodes only', () => {
        expect(
          helper('canvas-node-reject-dnd').descendants(true, 'linkedNodes')
        ).toStrictEqual([]);
        expect(
          helper('parent-of-linked-node').descendants(true, 'linkedNodes')
        ).toStrictEqual(
          Object.values(
            documentWithVariousNodes.nodes['parent-of-linked-node'].data
              .linkedNodes || {}
          )
        );
      });
    });
  });

  describe('ancestors', () => {
    it('should return immediate parent node id', () => {
      expect(helper(card.id).ancestors()).toStrictEqual([rootNode.id]);
    });
    it('should return parent node id', () => {
      expect(helper(secondaryButton.id).ancestors(true)).toStrictEqual([
        card.id,
        rootNode.id,
      ]);
    });
  });

  describe('isDraggable', () => {
    it('should return false if top-level node', () => {
      expect(helper(rootNode.id).isDraggable()).toEqual(false);
    });
    it("should return false if node's rule rejects", () => {
      expect(helper('node-reject-dnd').isDraggable()).toEqual(false);
    });
  });

  describe('isDroppable', () => {
    it('should return false if target node is a top-level node', () => {
      expect(helper('canvas-node').isDroppable('linked-node')).toEqual(false);
    });
    it('should return false if target node is a not an immediate child of a Canvas', () => {
      expect(
        helper('canvas-node').isDroppable('non-immediate-canvas-child')
      ).toEqual(false);
    });
    it('should return false if droppable node is a not a Canvas', () => {
      expect(helper(primaryButton.id).isDroppable(secondaryButton.id)).toEqual(
        false
      );
    });
    it("should return false if node's rule rejects incoming target", () => {
      expect(
        helper('canvas-node-reject-incoming-dnd').isDroppable(
          secondaryButton.id
        )
      ).toEqual(false);
    });
    it("should return false if node's rule rejects outgoing target", () => {
      // Should not return false if the target is moving within the same parent
      expect(
        helper('canvas-node-reject-outgoing-dnd').isDroppable(
          'fixed-child-node'
        )
      ).toEqual(true);

      // should return false if the target moved to a different parent
      expect(helper('canvas-node').isDroppable('fixed-child-node')).toEqual(
        false
      );
    });
    it('should return false if target is a descendant', () => {
      expect(
        helper('linked-node-child-canvas').isDroppable('parent-of-linked-node')
      ).toEqual(false);
    });
  });

  describe('toSerializedNode', () => {
    it('should call serializeNode', () => {
      helper('canvas-node').toSerializedNode();
      expect(serializeNode).toBeCalledTimes(1);
    });
  });
  describe('toNodeTree', () => {
    let tree;
    let testHelper;
    let testDescendants = jest.fn().mockImplementation(() => []);
    let descendantType;
    beforeEach(() => {
      testHelper = jest.fn().mockImplementation(function (...args) {
        return {
          ...helper(...args),
          descendants: testDescendants,
        };
      });

      tree = testHelper('canvas-node-reject-dnd').toNodeTree(descendantType);
    });

    it('should have correct rootNodeId', () => {
      expect(tree.rootNodeId).toEqual('canvas-node-reject-dnd');
    });
    it('should have called .descendants', () => {
      expect(testDescendants).toHaveBeenCalledWith(true, descendantType);
    });
  });
});
