import React, { Fragment } from "react";
import { parseNodeFromJSX } from "../parseNodeFromJSX";

const Component = ({ href }) => <a href={href}>Hi</a>;

describe("parseNodeFromJSX", () => {
  const props = { href: "href" };

  describe("Returns correct type and props", () => {
    it("should transform a link correctly", () => {
      // eslint-disable-next-line  jsx-a11y/anchor-has-content
      const { data } = parseNodeFromJSX(<a {...props} />);

      expect({ type: data.type, props: data.props }).toEqual({
        type: "a",
        props,
      });
    });
    it("should normalise data correctly", () => {
      const extraData = { props: { style: "purple" } };
      const { data } = parseNodeFromJSX(
        <button {...(props as any)} />,
        (node) => {
          node.data.props = {
            ...node.data.props,
            ...extraData.props,
          };
        }
      );

      expect({ type: data.type, props: data.props }).toEqual({
        type: "button",
        props: {
          ...props,
          ...extraData.props,
        },
      });
    });
    it("should be able to parse a component correctly", () => {
      const { data } = parseNodeFromJSX(<Component {...props} />);

      expect({ type: data.type, props: data.props }).toEqual({
        type: Component,
        props,
      });
    });
    it("should transform text with `div` correctly", () => {
      const { data } = parseNodeFromJSX("div");
      expect({ type: data.type, props: data.props }).toEqual({
        type: Fragment,
        props: { children: "div" },
      });
    });
    it("should be able to parse plain text correctly", () => {
      const text = "hello there";
      const { data } = parseNodeFromJSX(text);
      expect({ type: data.type, props: data.props }).toEqual({
        type: Fragment,
        props: {
          children: text,
        },
      });
    });
  });
});
