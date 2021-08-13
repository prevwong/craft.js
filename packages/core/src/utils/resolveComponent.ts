import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import invariant from 'tiny-invariant';

import { Resolver } from '../interfaces';

export const resolveComponent = (
  resolver: Resolver,
  comp: React.ElementType | string
) => {
  const componentName = (comp as any).name || (comp as any).displayName;

  const getNameInResolver = () => {
    if (resolver[componentName]) {
      return componentName;
    }

    for (let i = 0; i < Object.keys(resolver).length; i++) {
      const name = Object.keys(resolver)[i];
      const fn = resolver[name];

      if (fn === comp) {
        return name;
      }
    }

    if (typeof comp === 'string') {
      return comp;
    }
  };

  const resolvedName = getNameInResolver();

  invariant(
    resolvedName,
    ERROR_NOT_IN_RESOLVER.replace('%node_type%', componentName)
  );

  return resolvedName;
};
