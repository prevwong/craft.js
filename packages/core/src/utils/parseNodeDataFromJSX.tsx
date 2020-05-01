import React, { Fragment } from "react";
import { Canvas } from "../nodes/Canvas";
import { NodeId, NodeData } from "../interfaces";
import { createNode } from "./createNode";

const getReactElement = (elem) => {
  /* if the element is plain text, then we wrap it in a div to make sure it's a valid DOM element */
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
