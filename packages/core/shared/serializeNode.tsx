import {  Children, isValidElement } from "react";
import { NodeData, ReducedComp, ReduceCompType, SerializedNodeData } from "../interfaces";
import { Canvas } from "../nodes";

const reduceType = (type: React.ElementType | string) => typeof type === "string" ? type : { resolvedName: type.displayName || type.name };
export const serializeComp = (data: Pick<NodeData, 'type' | 'subtype' | 'props'>): ReducedComp => {
  let { type, subtype, props} = data;
  props = Object.keys(props).reduce((result: Record<string, any>, key) => {
    const prop = props[key];
    if (type === Canvas && key == 'children') return result;
    else if (key === 'children' && typeof prop !== 'string') {
      result[key] = Children.map(prop, (child) => {
        if (typeof child === 'string') return child;
        return serializeComp(child);
      })
    }
    else if (prop.type) {
      result[key] = serializeComp(prop)
    } else {
      result[key] = prop;
    }
    return result;
  }, {});
  return {
    type: reduceType(type),
    ...(subtype && { subtype: reduceType(subtype)}),
    props
  };
}

export const serializeNode = (data: Omit<NodeData, 'event'>): SerializedNodeData => {
  let { type, props, subtype, ...nodeData } = data;

  const reducedComp = serializeComp({type, subtype, props});

  return {
    ...reducedComp,
    ...nodeData
  };
}