import { NodeHelpers } from "../NodeHelpers";
import {
  card,
  documentWithVariousNodes,
  primaryButton,
  rootNode,
  secondaryButton,
} from "../../tests/fixtures";
import { serializeNode } from "../../utils/serializeNode";

let helper;

jest.mock("../../utils/serializeNode", () => ({
  serializeNode: jest.fn(),
}));

describe("NodeHelpers", () => {
  beforeEach(() => {
    helper = (id) => NodeHelpers(documentWithVariousNodes as any, id);
  });

  it("should throw error if invalid value supplied as NodeId", () => {
    expect(() => helper({})).toThrowError();
  });

  describe("isRoot", () => {
    it("should return true if root node", () => {
      expect(helper("canvas-ROOT").isRoot()).toBe(true);
    });
    it("should return false if non-root node", () => {
      expect(helper("node-card").isRoot()).toBe(false);
    });
  });

  describe("isCanvas", () => {
    it("should return true if node is canvas", () => {
      expect(helper("canvas-node").isCanvas()).toBe(true);
    });
    it("should return false if node is non-canvas", () => {
      expect(helper(primaryButton.id).isCanvas()).toBe(false);
    });
  });

  describe("isTopLevelNode", () => {
    it("should return true if linked Node", () => {
      expect(helper("linked-node").isTopLevelNode()).toBe(true);
    });
    it("should return true if root Node", () => {
      expect(helper("canvas-ROOT").isTopLevelNode()).toBe(true);
    });
    it("should return false if non-top-level Node", () => {
      expect(helper(secondaryButton.id).isCanvas()).toBe(false);
    });
  });

  describe("isDeletable", () => {
    it("should return true if non-top level Node", () => {
      expect(helper(secondaryButton.id).isDeletable()).toBe(true);
    });
    it("should return false if top-level Node", () => {
      expect(helper("linked-node").isDeletable()).toBe(false);
    });
  });

  describe("get", () => {
    it("should return node", () => {
      expect(helper(secondaryButton.id).get()).toBe(
        documentWithVariousNodes.nodes[secondaryButton.id]
      );
    });
  });

  describe("descendants", () => {
    it("should return immediate child node ids", () => {
      expect(helper(rootNode.id).descendants()).toStrictEqual([card.id]);
    });
    it("should return all child nodes", () => {
      expect(helper(rootNode.id).descendants(true)).toStrictEqual([
        card.id,
        ...documentWithVariousNodes.nodes[card.id].data.nodes,
      ]);
    });
  });

  describe("ancestors", () => {
    it("should return immediate parent node id", () => {
      expect(helper(card.id).ancestors()).toStrictEqual([rootNode.id]);
    });
    it("should return parent node id", () => {
      expect(helper(secondaryButton.id).ancestors(true)).toStrictEqual([
        card.id,
        rootNode.id,
      ]);
    });
  });

  describe("isDraggable", () => {
    it("should return false if top-level node", () => {
      expect(helper(rootNode.id).isDraggable()).toEqual(false);
    });
    it("should return false if node's rule rejects", () => {
      expect(helper("node-reject-dnd").isDraggable()).toEqual(false);
    });
  });

  describe("isDroppable", () => {
    it("should return false if target node is a top-level node", () => {
      expect(helper("canvas-node").isDroppable("linked-node")).toEqual(false);
    });
    it("should return false if target node is a not an immediate child of a Canvas", () => {
      expect(
        helper("canvas-node").isDroppable("non-immediate-canvas-child")
      ).toEqual(false);
    });
    it("should return false if droppable node is a not a Canvas", () => {
      expect(helper(primaryButton.id).isDroppable(secondaryButton.id)).toEqual(
        false
      );
    });
    it("should return false if node's rule rejects incoming target", () => {
      expect(
        helper("canvas-node-reject-dnd").isDroppable(secondaryButton.id)
      ).toEqual(false);
    });
    it("should return false if node's rule rejects outgoing target", () => {
      expect(helper("canvas-node").isDroppable("fixed-child-node")).toEqual(
        false
      );
    });
    it("should return false if target is a descendant", () => {
      expect(
        helper("parent-of-linked-node").isDroppable("canvas-node-reject-dnd")
      ).toEqual(false);
    });
  });

  describe("toSerializedNode", () => {
    it("should call serializeNode", () => {
      helper("canvas-node").toSerializedNode();
      expect(serializeNode).toBeCalledTimes(1);
    });
  });
  describe("toNodeTree", () => {
    let tree;
    beforeEach(() => {
      tree = helper("canvas-ROOT").toNodeTree();
    });

    it("should have correct rootNodeId", () => {
      expect(tree.rootNodeId).toEqual("canvas-ROOT");
    });
    it("should contain root and child nodes", () => {
      const { nodes } = tree;

      expect(nodes).toStrictEqual({
        "canvas-ROOT": documentWithVariousNodes.nodes["canvas-ROOT"],
        ...documentWithVariousNodes.nodes["canvas-ROOT"].data.nodes.reduce(
          (accum, key) => {
            accum[key] = documentWithVariousNodes.nodes[key];
            return accum;
          },
          {}
        ),
        ...documentWithVariousNodes.nodes[card.id].data.nodes.reduce(
          (accum, key) => {
            accum[key] = documentWithVariousNodes.nodes[key];
            return accum;
          },
          {}
        ),
      });
    });
  });
});
