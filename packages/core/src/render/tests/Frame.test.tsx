import React from "react";
import { mount } from "enzyme";
import invariant from "tiny-invariant";
import { ERROR_FRAME_IMMEDIATE_NON_CANVAS } from "@craftjs/utils";

import { Frame } from "../Frame";
import { useInternalEditor } from "../../editor/useInternalEditor";

const children = <h1>a children</h1>;

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
    actions = { replaceNodes: jest.fn(), setState: jest.fn() };
    query = { parseNodeFromReactNode: jest.fn() };
    mockEditor.mockImplementation(() => ({ actions, query }));
  });
  describe("When rendering a Frame with no Children and no Data", () => {
    it("should throw an error if the children is not a canvas", () => {
      mount(<Frame>{children}</Frame>);
      expect(invariant).toHaveBeenCalledWith(
        false,
        ERROR_FRAME_IMMEDIATE_NON_CANVAS
      );
    });
  });

  describe("When rendering using `json`", () => {
    beforeEach(() => {
      mount(<Frame json={json} />);
    });
    it("should parse json and call setState", () => {
      expect(actions.setState).toHaveBeenCalledWith(JSON.parse(json));
    });
  });

  describe("When rendering using `data`", () => {
    beforeEach(() => {
      mount(<Frame data={data} />);
    });
    it("should deserialize the nodes", () => {
      expect(actions.setState).toHaveBeenCalledWith(data);
    });
  });
});
