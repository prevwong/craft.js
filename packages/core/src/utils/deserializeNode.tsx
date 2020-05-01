import React from "react";
import {
  NodeData,
  SerializedNodeData,
  ReducedComp,
  ReduceCompType,
} from "../interfaces";
import { Canvas } from "../nodes/Canvas";
import { Resolver } from "../interfaces";
import { resolveComponent } from "./resolveComponent";

type DeserialisedType = JSX.Element & { name: string };

const restoreType = (type: ReduceCompType, resolver: Resolver) =>
  typeof type === "object" && type.resolvedName
    ? type.resolvedName === "Canvas"
      ? Canvas
      : resolver[type.resolvedName]
    : typeof type === "string"
    ? type
    : null;

export const deserializeComp = (
  data: ReducedComp,
  resolver: Resolver,
  index?: number
): DeserialisedType | void => {
  let { type, props } = data;
  const main = restoreType(type, resolver);

  if (!main) {
    return;
  }

  props = Object.keys(props).reduce((result: Record<string, any>, key) => {
    const prop = props[key];
    if (typeof prop === "object" && prop.resolvedName) {
      result[key] = deserializeComp(prop, resolver);
    } else if (key === "children" && Array.isArray(prop)) {
      result[key] = prop.map((child) => {
        if (typeof child === "string") {
          return child;
        }
        return deserializeComp(child, resolver);
      });
    } else {
      result[key] = prop;
    }
    return result;
  }, {});

  if (index) {
    props.key = index;
  }

  const jsx = {
    ...React.createElement(main, {
      ...props,
    }),
  };

  return {
    ...jsx,
    name: resolveComponent(resolver, jsx.type),
  };
};

export const deserializeNode = (
  data: SerializedNodeData,
  resolver: Resolver
): Omit<NodeData, "event"> => {
  const { type: Comp, props: Props, ...nodeData } = data;

  const {
    type,
    name,
    props,
    parent,
    nodes,
    _childCanvas,
    isCanvas,
    hidden,
    custom,
  } = (deserializeComp(data, resolver) as unknown) as NodeData;

  return {
    type,
    name,
    props,
    parent,
    nodes,
    _childCanvas,
    isCanvas,
    hidden,
    custom,
    ...nodeData,
  };
};
