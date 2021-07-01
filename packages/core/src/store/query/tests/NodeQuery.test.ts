import { NodeId } from '../../../interfaces';
import { NodeQuery } from '../NodeQuery';
import { createTestEditorStore } from '../../../utils/testHelpers';

let helper: (id: NodeId) => NodeQuery;

const RandomComponent = () => null;

const RejectDragComponent = () => null;
RejectDragComponent.craft = {
  rules: {
    canDrag: () => false,
  },
};

const RejectDropButtonComponent = () => null;
RejectDropButtonComponent.craft = {
  rules: {
    canMoveIn: (nodes) => {
      return nodes.every((node) => node.getType() !== 'button');
    },
  },
};

const RejectDragOutgoingComponent = () => null;
RejectDragOutgoingComponent.craft = {
  rules: {
    canMoveOut: () => {
      return false;
    },
  },
};

describe('NodeQuery', () => {
  beforeEach(() => {
    helper = (id) =>
      new NodeQuery(
        createTestEditorStore({
          resolver: {
            RandomComponent,
            RejectDragComponent,
            RejectDropButtonComponent,
            RejectDragOutgoingComponent,
          },
          state: {
            nodes: {
              id: 'ROOT',
              type: 'div',
              isCanvas: true,
              nodes: [
                {
                  id: 'node-card',
                  type: 'div',
                  linkedNodes: {
                    header: {
                      id: 'linked-node',
                      isCanvas: true,
                      nodes: [
                        {
                          id: 'linked-node-child',
                          type: 'span',
                          nodes: [
                            {
                              id: 'linked-node-grandchild',
                              type: 'button',
                            },
                          ],
                        },
                      ],
                    },
                  },
                  nodes: [
                    {
                      id: 'node-card-child',
                      type: 'button',
                      nodes: [
                        {
                          id: 'node-card-grandchild',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'component-node',
                  type: 'RandomComponent',
                  props: { color: 'primary' },
                },
                {
                  id: 'canvas-node',
                  type: 'div',
                  isCanvas: true,
                  nodes: [
                    {
                      id: 'button',
                      type: 'button',
                    },
                    {
                      id: 'drag-reject-node',
                      type: 'RejectDragComponent',
                    },
                    {
                      id: 'drop-button-reject-node',
                      isCanvas: true,
                      type: 'RejectDropButtonComponent',
                    },
                    {
                      id: 'drag-reject-outgoing-node',
                      isCanvas: true,
                      type: 'RejectDragOutgoingComponent',
                      nodes: [
                        {
                          id: 'rejecting-parent',
                          type: 'button',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        }),
        { id }
      );
  });

  it('should throw error if invalid value supplied as NodeId', () => {
    expect(() => helper('some-non-existing-node')).toThrowError();
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
      expect(helper('button').isCanvas()).toBe(false);
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
      expect(helper('button').isTopLevelNode()).toBe(false);
    });
  });

  describe('isDeletable', () => {
    it('should return true if non-top level Node', () => {
      expect(helper('button').isDeletable()).toBe(true);
    });
    it('should return false if top-level Node', () => {
      expect(helper('linked-node').isDeletable()).toBe(false);
    });
  });

  describe('get', () => {
    it('should return LegacyNode', () => {
      const legacyNode = {
        id: 'ROOT',
        data: {
          type: 'div',
          name: 'div',
          displayName: 'div',
          custom: {},
          props: {},
          linkedNodes: {},
          nodes: ['node-card', 'component-node', 'canvas-node'],
          parent: null,
          isCanvas: true,
          hidden: false,
        },
        rules: {
          canDrag: expect.any(Function),
          canDrop: expect.any(Function),
          canMoveIn: expect.any(Function),
          canMoveOut: expect.any(Function),
        },
        related: {},
        dom: undefined,
        events: {
          selected: false,
          hovered: false,
          dragged: false,
        },
      };
      expect(helper('ROOT').get()).toEqual(legacyNode);
    });
  });

  describe('descendants', () => {
    it('should return all child and linked nodes', () => {
      expect(helper('node-card').descendants()).toEqual([
        'linked-node',
        'linked-node-child',
        'linked-node-grandchild',
        'node-card-child',
        'node-card-grandchild',
      ]);
    });
  });

  describe('ancestors', () => {
    it('should return parent node id', () => {
      expect(helper('linked-node-child').ancestors()).toEqual([
        'linked-node',
        'node-card',
        'ROOT',
      ]);
    });
  });

  describe('isDraggable', () => {
    it('should return false if top-level node', () => {
      expect(helper('ROOT').isDraggable()).toEqual(false);
    });
    it("should return false if node's rule rejects", () => {
      expect(helper('drag-reject-node').isDraggable()).toEqual(false);
    });
    it('should return true if node is draggable', () => {
      expect(helper('button').isDraggable()).toEqual(true);
    });
  });

  describe('isDroppable', () => {
    it('should return false if target node is a top-level node', () => {
      expect(helper('ROOT').isDroppable('linked-node')).toEqual(false);
    });
    it('should return false if target node is a not an immediate child of a Canvas', () => {
      expect(
        helper('canvas-node').isDroppable('linked-node-grandchild')
      ).toEqual(false);
    });
    it('should return false if droppable node is a not a Canvas', () => {
      expect(helper('button').isDroppable('linked-node-grandchild')).toEqual(
        false
      );
    });
    it("should return false if node's rule rejects incoming target", () => {
      expect(helper('drop-button-reject-node').isDroppable('button')).toEqual(
        false
      );
      expect(
        helper('drop-button-reject-node').isDroppable('linked-node-child')
      ).toEqual(true);
    });
    it("should return false if node's rule rejects outgoing target", () => {
      expect(helper('ROOT').isDroppable('rejecting-parent')).toEqual(false);
    });
    it('should return false if target is a descendant', () => {
      expect(helper('canvas-node').isDroppable('ROOT')).toEqual(false);
    });
  });

  describe('toSerializedNode', () => {
    it('should call serializeNode', () => {
      expect(helper('component-node').toSerializedNode()).toEqual({
        type: { resolvedName: 'RandomComponent' },
        isCanvas: false,
        props: { color: 'primary' },
        displayName: 'RandomComponent',
        custom: {},
        linkedNodes: {},
        nodes: [],
        parent: 'ROOT',
        hidden: false,
      });
    });
  });
});
