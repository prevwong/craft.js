import React from 'react';
import { useManager } from '../connectors';
import invariant from 'invariant';
export type Selector = { 
  render: JSX.Element
}

export const Selector: React.FC<Selector> = ({render, children, ...props}) => {
  const {handlers, connectors, query} = useManager();

  const child = React.Children.only(children) as React.ReactElement | string;
  invariant(typeof child !== 'string', '<Selector> child cannot be a string. Please use an element instead');
  
  if ( typeof child !== 'string' ) {
    return React.cloneElement(child, {
      draggable: true,   
      ref: (ref) => connectors.drag(ref, query.transformJSXToNode(React.createElement(render.type, render.props)))
    });
  }
  
  return null;
}