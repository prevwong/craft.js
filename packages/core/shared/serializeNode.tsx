import { Children } from "react";
import { NodeData } from "../interfaces";

export type ReduceCompType ={
  name: string | {name: string}
}

export type ReducedComp = {
  type: ReduceCompType
  props: any
}

export const serializeComp = (data: {type: React.ElementType, props: any}): ReducedComp => {
  let { type, props: {children, ...props}, ...restData } = data;
  const reducedType = ((typeof type === "string" ) ? type : {name: (type.displayName ? type.displayName : type.name)}) as ReduceCompType;

  if ( children && (reducedType.name !== "Canvas") ) {
    props.children = Children.map(children, (child) => {
      if ( typeof child === "string" ) return child;
      return serializeComp(child);
    })
  }
  return {
    type: reducedType,
    props
  };
}

export const serializeNode = (data: Omit<NodeData, 'event'>) => {
  let { type, props, ...nodeData } = data;

  const reducedComp = serializeComp({type, props});

  return {
    ...reducedComp,
    ...nodeData
  };
}