import React from 'react';
import { useManager } from '../connectors';
import invariant from 'invariant';
export type Selector = { 
  is?: string,
  render: JSX.Element
}

export const Selector: React.FC<Selector> = ({render, is = "div", children, ...props}) => {
  const {connectors, query} = useManager();

  invariant(typeof is == "string", "The 'is' prop passed to the <Selector /> must be a string");
  
  return React.createElement(is, {
    draggable: true,   
    children,
    ref: (ref) => connectors.drag(ref, query.transformJSXToNode(React.createElement(render.type, render.props)))
  });
}