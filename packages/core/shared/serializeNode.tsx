import React,{  Children, isValidElement, memo } from "react";
import { NodeData, ReducedComp, ReduceCompType, SerializedNodeData } from "../interfaces";
import { Canvas } from "../nodes";
import { Resolver } from "../interfaces/root";

const resolve = (resolver: Resolver, comp: React.ElementType) => {
  let Comp;
  const name = (comp as any).name || (comp as any).displayName;

  if ( comp === Canvas ) return "Canvas";

  if ( resolver[name]) return name;
  
  if (!Comp ) {
    for (let i = 0; i < Object.keys(resolver).length; i++ ) {
      const name = Object.keys(resolver)[i],
            fn = resolver[name];
      if ( fn === comp ) {
        Comp = name;
        break;
      }
    }
  }

  return Comp;
}


const reduceType = (type: React.ElementType | string, resolver: Resolver) => {
  if ( typeof type === "string" ) return type;
  return { resolvedName: resolve(resolver, type) }
};

export const serializeComp = (data: Pick<NodeData, 'type' | 'subtype' | 'props'>, resolver: Resolver): ReducedComp => {
  let { type, subtype, props} = data;
  props = Object.keys(props).reduce((result: Record<string, any>, key) => {
    const prop = props[key];
    if (type === Canvas && key == 'children') return result;
    else if (key === 'children' && typeof prop !== 'string') {
      result[key] = Children.map(prop, (child) => {
        if (typeof child === 'string') return child;
        return serializeComp(child, resolver);
      })
    }
    else if (prop.type) {
      result[key] = serializeComp(prop, resolver)
    } else {
      result[key] = prop;
    }
    return result;
  }, {});

  return {
    type: reduceType(type, resolver),
    ...(subtype && { subtype: reduceType(subtype, resolver)}),
    props
  };
}

export const serializeNode = (data: Omit<NodeData, 'event'>, resolver: Resolver): SerializedNodeData => {
  let { type, props, subtype, ...nodeData } = data;

  const reducedComp = serializeComp({ type, subtype, props }, resolver);

  return {
    ...reducedComp,
    ...nodeData
  };
}