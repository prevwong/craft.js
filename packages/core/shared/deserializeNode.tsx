import React, { Children } from "react";
import { NodeData, SerializedNodeData, ReducedComp } from "../interfaces";


export const deserializeComp = (data: ReducedComp, resolvers: Function, index?: number): any => {
    let { type, props: {children, ...props} } = data;
    const reducedType = typeof type === "object" && type.resolvedName ? resolvers(type.resolvedName) : type;
    
    let newChildren;
    if ( children && (reducedType.name !== "Canvas") ) {
        newChildren = typeof(children) === "string" ? children : Object.keys(children).map((key, i) => {
        const child = children[key];
        if ( typeof child === "string" ) return child;
        return deserializeComp(child, resolvers, i);
      })
    }

    if ( index ) props.key = index;
    return React.createElement(reducedType, props, newChildren ? newChildren : null); 
  }
  
  export const deserializeNode = (data: SerializedNodeData, resolvers: any): Omit<NodeData, 'event'> => {
    let { type, props, ...nodeData } = data;
  
    const reducedComp = deserializeComp({type, props}, resolvers);
  
    return {
      ...reducedComp,
      ...nodeData
    };
  }