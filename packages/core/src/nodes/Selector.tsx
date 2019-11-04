import React from 'react';
import { useManager } from '../connectors';
import { transformJSXToNode } from '../utils/transformJSX';
import invariant from 'invariant';
import { ROOT_NODE } from 'craftjs-utils';
import { useContext } from 'react';
import { Node } from '../interfaces';
import { useInternalManager } from '../manager/useInternalManager';

export type Selector = { 
  render: JSX.Element
}

export const Selector: React.FC<Selector> = ({render, children, ...props}) => {
  const {handlers, query} = useInternalManager();

  const child = React.Children.only(children) as React.ReactElement | string;
  invariant(typeof child !== 'string', '<Selector> child cannot be a string. Please use an element instead');
  
  if ( typeof child !== 'string' ) {
    return React.cloneElement(child, {
      draggable: true,
      onDragStart: (e: React.MouseEvent) => {
        e.stopPropagation();
        const node = query.transformJSXToNode(React.createElement(render.type, render.props));
        handlers.dnd.onDragStart(e, node as Node);
      },
      onDragEnd: (e: React.MouseEvent) => {
        e.stopPropagation();
        handlers.dnd.onDragEnd(e);
      }
    });
  }
  
  return null;
}