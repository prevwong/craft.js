import React from 'react';
import { useManager } from '../connectors';
import { transformJSXToNode } from '../utils/transformJSX';
import invariant from 'invariant';
import { ROOT_NODE } from 'craftjs-utils';

export type Selector = { 
  render: JSX.Element
}

export const Selector: React.FC<Selector> = ({render, children, ...props}) => {
  const {actions, query} = useManager();
  const child = React.Children.only(children) as React.ReactElement | string;
  invariant(typeof child !== 'string', '<Selector> child cannot be a string. Please use an element instead');
  
  if ( typeof child !== 'string' ) {
    return React.cloneElement(child, {
      onMouseDown: (e: React.MouseEvent) => {
        const node = query.transformJSXToNode(React.createElement(render.type, render.props));

        e.preventDefault();
        e.stopPropagation();
        actions.setPending(node);
        
        return false;
      }
    });
  }
  
  return null;
}