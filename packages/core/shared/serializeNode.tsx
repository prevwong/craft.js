import { Children } from "react";
import { NodeData, ReducedComp, ReduceCompType, SerializedNodeData } from "../interfaces";
import { Canvas } from "../nodes";


export const serializeComp = (data: {type: React.ElementType, props: any}): ReducedComp => {
  let { type, props: {children, ...props} } = data;
  const reducedType: ReduceCompType = typeof type === "string" ? type : {resolvedName: type.name || type.displayName};

  if (children && (type !== Canvas) ) {
    props.children = Children.count(children) === 1 && typeof children === "string" ? children : Children.map(children, (child) => {
      if ( typeof child === "string" ) return child;
      return serializeComp(child);
    })
  }
  return {
    type: reducedType,
    props
  };
}

export const serializeNode = (data: Omit<NodeData, 'event'>): SerializedNodeData => {
  let { type, props, ...nodeData } = data;

  const reducedComp = serializeComp({type, props});

  return {
    ...reducedComp,
    ...nodeData
  };
}