import { Children } from "react";

export type ReduceNodeType ={
  name: string | {name: string}
}

export type ReducedNode = {
  type: ReduceNodeType
  props: any
}

export const serializeReducedNode = (data: {type: React.ElementType, props: any}): ReducedNode => {
  let { type, props: {children, ...props} } = data;
  const reducedType = ((typeof type === "string" ) ? type : {name: (type.displayName ? type.displayName : type.name)}) as ReduceNodeType;

  if ( children && (reducedType.name !== "Canvas") ) {
    props.children = Children.map(children, (child) => {
      if ( typeof child === "string" ) return child;
      return serializeReducedNode(child);
    })
  }
  return {
    type: reducedType,
    props
  };
}