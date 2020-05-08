import React from "react";
import identity from "lodash/identity";
import { mount } from "enzyme";

import { Canvas } from "../../nodes/Canvas";
import { NodeElement } from "../../nodes/NodeElement";
import { RenderNodeToElement } from "../RenderNode";
import { SimpleElement } from "../SimpleElement";
import { Node } from "@craftjs/core";

let node: { type: any; props?: any; hidden?: boolean };
let onRender;

jest.mock("../../editor/useInternalEditor", () => ({
  useInternalEditor: () => ({ onRender }),
}));
jest.mock("../../hooks/useNode", () => ({
  useNode: () => ({
    ...node,
    connectors: { connect: identity, drag: identity },
  }),
}));
jest.mock("../../nodes/Canvas", () => ({
  Canvas: () => null,
}));
jest.mock("../../nodes/NodeElement", () => ({
  NodeElement: () => null,
}));

describe("<RenderNode />", () => {
  const injectedProps = { className: "hi", style: { fontSize: 18 } };
  let component;

  beforeEach(() => {
    onRender = jest.fn().mockImplementation(({ render }) => render);
  });

  describe("When the node is hidden", () => {
    beforeEach(() => {
      node = { hidden: true, type: jest.fn() };
      component = mount(<RenderNodeToElement />);
    });
    it("should not have called onRender", () => {
      expect(onRender).not.toHaveBeenCalled();
    });
    it("should not have called type", () => {
      expect(node.type).not.toHaveBeenCalled();
    });
  });

  describe("When the component is a simple component", () => {
    const props = { className: "hello" };
    beforeEach(() => {
      node = { type: "h1", props };
      component = mount(<RenderNodeToElement {...injectedProps} />);
    });
    it("should contain a SimpleElement", () => {
      expect(component.find(SimpleElement)).toHaveLength(1);
    });
    it("should have called onRender", () => {
      expect(onRender).toHaveBeenCalled();
    });
    it("should contain the right props", () => {
      expect(component.props()).toEqual({ ...props, ...injectedProps });
    });
  });

  describe("When the node has type and no nodes", () => {
    const type = () => (
      <p>
        <button />
      </p>
    );
    const props = { className: "hello" };
    beforeEach(() => {
      node = { type, props };
      component = mount(<RenderNodeToElement {...injectedProps} />);
    });
    it("should have called onRender", () => {
      expect(onRender).toHaveBeenCalled();
    });
    it("should not contain a SimpleElement", () => {
      expect(component.find(SimpleElement)).toHaveLength(0);
    });
    it("should contain the right props", () => {
      expect(component.props()).toEqual({ ...props, ...injectedProps });
    });
    it("should contain a button", () => {
      expect(component.find("button")).toHaveLength(1);
    });
  });

  describe("When the node is a canvas", () => {
    const type = Canvas;
    const props = { className: "hello" };

    beforeEach(() => {
      node = { type, props };
      component = mount(<RenderNodeToElement {...injectedProps} />);
    });
    it("should have called onRender", () => {
      expect(onRender).toHaveBeenCalled();
    });
    it("should contain a Canvas", () => {
      expect(component.find(Canvas)).toHaveLength(1);
    });
    it("should contain the right props", () => {
      expect(component.props()).toEqual({ ...props, ...injectedProps });
    });
    it("should contain no node elements", () => {
      expect(component.find(NodeElement)).toHaveLength(0);
    });
  });
});
