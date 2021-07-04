import React from 'react';

import { NodeQuery } from '../../store';
import { useNode } from '../useNode';

export function connectNode<C>(collect?: (state: NodeQuery) => C) {
  return function (WrappedComponent: React.ElementType) {
    return (props: any) => {
      const node = useNode(collect);
      return <WrappedComponent {...node} {...props} />;
    };
  };
}
