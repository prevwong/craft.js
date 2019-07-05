import React, { Children } from "react";
import { NodeData, SerializedNodeData, ReducedComp, Resolver, ResolverFunction, ReduceCompType } from "../interfaces";
import { Canvas } from "../nodes";

const resolve = (resolver: Resolver, comp: string) => {
  let Comp;
  if (typeof resolver == "function") Comp = resolver(comp);
  else { Comp = resolver[comp]; }

  return Comp;
}

const restoreType = (type: ReduceCompType, resolver: Resolver) => typeof type === "object" && type.resolvedName ? resolve(resolver, type.resolvedName) : typeof type === "string" ? type : null;

export const deserializeComp = (data: ReducedComp, resolver: Resolver, index?: number): JSX.Element & {subtype?: React.ElementType | string} => {
  let { type, subtype, props } = data;
  const main = restoreType(type, resolver);
  if (!main) {
    return;
  }
  // console.log(subtype)
  props = Object.keys(props).reduce((result: Record<string, any>, key) => {
    const prop = props[key];
    if (typeof prop === "object" && prop.resolvedName) {
      result[key] = deserializeComp(prop, resolver);
    }
    else result[key] = prop;
    return result;
  }, {});


  if (index) props.key = index;
  
  return {
    ...React.createElement(main, props),
    ...(subtype && { subtype: restoreType(subtype, resolver) }),
  }
}

export const deserializeNode = (data: SerializedNodeData, resolver: Resolver): Omit<NodeData, 'event'> => {
  let { type, subtype, props, ...nodeData } = data;

  const reducedComp = deserializeComp({ type, subtype, props }, resolver);

  // console.log(reducedComp)
  return {
    ...reducedComp,
    ...nodeData
  };
}