import React from "react";
import { resolveComponent } from "../../utils/resolveComponent";
import { QueryMethods } from "../query";
import {
  rootNode,
  card,
  primaryButton,
  secondaryButton,
  documentWithCardState,
} from "../../tests/fixtures";

jest.mock("../../utils/resolveComponent", () => ({
  resolveComponent: () => null,
}));
jest.mock("../../utils/parseNodeDataFromJSX", () => ({
  parseNodeDataFromJSX: () => ({ ...rootNode.data, type: "div" }),
}));

describe("query", () => {
  const resolver = { H1: () => null };
  let query;
  let state;

  beforeEach(() => {
    state = { options: { resolver } };
    query = QueryMethods(state);
  });

  describe("parseNodeFromReactNode", () => {
    const extras = { id: 1 };
    const node = <h1>Hello</h1>;
    const name = "Document";
    let newNode;
    const nodeData = { ...rootNode.data, type: "div" };

    describe("when we can resolve the type", () => {
      beforeEach(() => {
        resolveComponent = jest.fn().mockImplementation(() => name);
        newNode = query.parseNodeFromReactNode(node, extras);
      });
      it("should have called the resolveComponent", () => {
        expect(resolveComponent).toHaveBeenCalledWith(
          state.options.resolver,
          nodeData.type
        );
      });
      it("should have changed the displayName and name of the node", () => {
        expect(rootNode.data.name).toEqual(name);
      });
    });

    describe("when we cant resolve a name", () => {
      beforeEach(() => {
        resolveComponent = jest.fn().mockImplementation(() => null);
      });
      it("should throw an error", () => {
        expect(() => query.parseNodeFromReactNode(node)).toThrow();
      });
    });
  });

  describe("parseTreeFromReactNode", () => {
    let tree;
    beforeEach(() => {
      query.parseNodeFromReactNode = jest
        .fn()
        .mockImplementation(() => rootNode);
    });

    describe("when there is a single node with no children", () => {
      const node = <button />;
      beforeEach(() => {
        tree = query.parseTreeFromReactNode(node);
      });
      it("should call parseNodeFromReactNode with the right payload", () => {
        expect(query.parseNodeFromReactNode).toHaveBeenCalledWith(node);
      });
      it("should have called parseNodeFromReactNode once", () => {
        expect(query.parseNodeFromReactNode).toHaveBeenCalledTimes(1);
      });
      it("should have replied with the right payload", () => {
        expect(tree).toEqual({
          rootNodeId: rootNode.id,
          nodes: { [rootNode.id]: rootNode },
        });
      });
    });

    describe("when there is a single node with a string children", () => {
      const node = <h1>hi</h1>;
      beforeEach(() => {
        tree = query.parseTreeFromReactNode(node);
      });
      it("should call parseNodeFromReactNode with the right payload", () => {
        expect(query.parseNodeFromReactNode).toHaveBeenCalledWith(node);
      });
      it("should have called parseNodeFromReactNode once", () => {
        expect(query.parseNodeFromReactNode).toHaveBeenCalledTimes(1);
      });
      it("should have replied with the right payload", () => {
        expect(tree).toEqual({
          rootNodeId: rootNode.id,
          nodes: { [rootNode.id]: rootNode },
        });
      });
    });

    describe("when there is a complex tree", () => {
      const node = (
        <div id="root">
          <div id="card">
            <button>one</button>
            <button>two</button>
          </div>
        </div>
      );
      beforeEach(() => {
        query.parseNodeFromReactNode = jest
          .fn()
          .mockImplementationOnce(() => rootNode)
          .mockImplementationOnce(() => card)
          .mockImplementationOnce(() => primaryButton)
          .mockImplementationOnce(() => secondaryButton);
        tree = query.parseTreeFromReactNode(node);
      });
      it("should call parseNodeFromReactNode with the right payload", () => {
        expect(query.parseNodeFromReactNode).toHaveBeenCalledWith(node);
      });
      it("should have called parseNodeFromReactNode 4 times", () => {
        expect(query.parseNodeFromReactNode).toHaveBeenCalledTimes(4);
      });
      it("should have replied with the right payload", () => {
        expect(tree).toEqual({
          rootNodeId: rootNode.id,
          nodes: documentWithCardState.nodes,
        });
      });
    });
  });
});
