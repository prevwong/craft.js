import React from "react";
import { NodeData, SerializedNodeData, ReducedComp, ReduceCompType } from "../interfaces";
import { Canvas } from "../nodes";
import { Resolver } from "../interfaces";
import { resolveComponent } from "./resolveComponent";

const restoreType = (type: ReduceCompType,  resolver: Resolver) => 
  typeof type === "object" && type.resolvedName ? 
    resolver[type.resolvedName] : 
    typeof type === "string" ? 
      type : null;

export const deserializeComp = (data: ReducedComp, resolver: Resolver, index?: number): JSX.Element & {subtype?: React.ElementType | string} & { name: string } => {
  let { type, props } = data;
  const main = restoreType(type, resolver);

  if (!main) {
    return;
  }
  
  props = Object.keys(props).reduce((result: Record<string, any>, key) => {
    const prop = props[key];
    if (typeof prop === "object" && prop.resolvedName) {
      result[key] = deserializeComp(prop, resolver);
    }
    else result[key] = prop;
    return result;
  }, {});


  if (index) props.key = index;
  
  const jsx = {
    ...React.createElement(main, {
      ...props,
    }),
  }

  return {
    ...jsx,
    name: resolveComponent(resolver, jsx.type)
  }
}

export const deserializeNode = (data: SerializedNodeData, resolver: Resolver): Omit<NodeData, 'event'> => {
  let { type , props, ...nodeData } = data;

  const reducedComp = deserializeComp({ type, props }, resolver);

  return {
    ...reducedComp,
    ...nodeData
  };
}