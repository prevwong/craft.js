import { Node } from '../../interfaces';
import React from 'react';
import { useNode } from '../useNode';

export function connectNode<C>(collect?: (state: Node) => C) {
  return function (WrappedComponent: React.ElementType) {
    return (props: any) => {
      const node = useNode(collect);
      return <WrappedComponent {...node} {...props} />;
    };
  };
}
