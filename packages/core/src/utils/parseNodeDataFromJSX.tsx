import React, { Fragment } from "react";
import { NodeData } from "../interfaces";

const getReactElement = (elem) => {
  /* if the element is plain text, then we wrap it in a Fragment to make sure it's a valid React element */
  if (typeof elem === "string") {
    return React.createElement(Fragment, {}, elem);
  }
  return elem;
};

export const parseNodeDataFromJSX = (
  elem: React.ReactElement | string,
  data: Partial<NodeData> = {}
): Partial<NodeData> => {
  const { type, props } = getReactElement(elem);

  return {
    ...data,
    type,
    props: {
      ...props,
      ...(data.props || {}),
    },
  };
};
