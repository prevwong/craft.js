import React, { Fragment } from "react";
import { parseNodeDataFromJSX } from "../parseNodeDataFromJSX";

const Component = ({ href }) => <a href={href}>Hi</a>;

describe("parseNodeDataFromJSX", () => {
  const props = { href: "href" };

  it("should transform a link correctly", () => {
    expect(parseNodeDataFromJSX(<a {...props} />)).toEqual({
      type: "a",
      props,
    });
  });
  it("should incorporate extra data correctly", () => {
    const extraData = { props: { style: "purple" } };
    expect(parseNodeDataFromJSX(<button {...props} />, extraData)).toEqual({
      type: "button",
      props: {
        ...props,
        ...extraData.props,
      },
    });
  });
  it("should be able to parse a component correctly", () => {
    expect(parseNodeDataFromJSX(<Component {...props} />)).toEqual({
      type: Component,
      props,
    });
  });
  it("should transform text with `div` correctly", () => {
    expect(parseNodeDataFromJSX("div")).toEqual({
      type: Fragment,
      props: { children: "div" },
    });
  });
  it("should be able to parse plain text correctly", () => {
    const text = "hello there";
    expect(parseNodeDataFromJSX(text)).toEqual({
      type: Fragment,
      props: {
        children: text,
      },
    });
  });
});
