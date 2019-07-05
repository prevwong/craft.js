import React, { Children } from "react";
import { NodeData, SerializedNodeData, ReducedComp, Resolver, ResolverFunction } from "../interfaces";
import { Canvas } from "../nodes";

const resolve = (resolver: Resolver, comp: string) => {
  let Comp;
  if (typeof resolver == "function") Comp = resolver(comp);
  else { Comp = resolver[comp]; }

  return Comp;
}

export const deserializeComp = (data: ReducedComp, resolver: Resolver, index?: number): JSX.Element => {
  let { type, props: { children, ...props } } = data;
  const reducedType = typeof type === "object" && type.resolvedName ? resolve(resolver, type.resolvedName) : typeof type === "string" ? type : null;

  if (!reducedType) return;
  let newChildren;
  if (children && (reducedType !== Canvas)) {
    newChildren = typeof (children) === "string" ? children : Object.keys(children).map((key, i) => {
      const child = children[key];
      if (typeof child === "string") return child;
      return deserializeComp(child, resolver, i);
    })
  }

  if (index) props.key = index;
  
  return React.createElement(reducedType, props, newChildren ? newChildren : null);
}

export const deserializeNode = (data: SerializedNodeData, resolver: Resolver): Omit<NodeData, 'event'> => {
  let { type, props, ...nodeData } = data;

  const reducedComp = deserializeComp({ type, props }, resolver);

  return {
    ...reducedComp,
    ...nodeData
  };
}