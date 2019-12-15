import React from 'react';
import { useEditor } from '../connectors';
import invariant from 'invariant';
export type Selector = { 
  is?: string,
  render: JSX.Element
}

export const Selector: React.FC<Selector> = ({render, is = "div", children, ...props}) => {
  const {connectors, query} = useEditor();

  invariant(typeof is == "string", "The 'is' prop passed to the <Selector /> must be a string");
  
  return React.createElement(is, {
    draggable: true,   
    children,
    ref: (ref) => connectors.drag(ref, query.createNode(React.createElement(render.type, render.props)))
  });
}