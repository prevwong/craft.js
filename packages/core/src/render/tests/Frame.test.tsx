import React from "react";
import { mount } from "enzyme";
import { Frame } from "../Frame";
import { useInternalEditor } from "../../editor/useInternalEditor";

jest.mock("tiny-invariant");
jest.mock("../../editor/useInternalEditor");
jest.mock("../../nodes/NodeElement", () => ({
  NodeElement: () => null,
}));

const mockEditor = useInternalEditor as jest.Mock<any>;

describe("<Frame />", () => {
  const data = {};
  const json = JSON.stringify(data);
  let actions;
  let query;

  beforeEach(() => {
    actions = { addTreeAtIndex: jest.fn(), deserialize: jest.fn() };
    query = { createNode: jest.fn(), parseTreeFromReactNode: jest.fn() };
    mockEditor.mockImplementation(() => ({ actions, query }));
  });
  describe("When rendering using `json`", () => {
    beforeEach(() => {
      mount(<Frame json={json} />);
    });
    it("should parse json and call setState", () => {
      expect(actions.deserialize).toHaveBeenCalledWith(JSON.parse(json));
    });
  });

  describe("When rendering using `data`", () => {
    beforeEach(() => {
      mount(<Frame data={data} />);
    });
    it("should deserialize the nodes", () => {
      expect(actions.deserialize).toHaveBeenCalledWith(data);
    });
  });
});
