import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { Resolver } from '../interfaces';

let currResolver: Resolver | undefined = undefined;
const reversedResolver = new Map<React.ElementType | string, string>();

export const resolveComponent = (
  resolver: Resolver,
  comp: React.ElementType | string
) => {
  const componentName = (comp as any).name || (comp as any).displayName;
  const resolvedName = resolver[componentName]
    ? componentName
    : searchComponentInResolver(resolver, comp);

  invariant(
    resolvedName,
    ERROR_NOT_IN_RESOLVER.replace('%node_type%', componentName)
  );

  return resolvedName;
};

const searchComponentInResolver = (
  resolver: Resolver,
  comp: React.ElementType | string
): string | undefined => {
  if (currResolver !== resolver) updateReversedResolver(resolver);

  const name = reversedResolver.get(comp);
  if (name !== undefined) return name;

  if (typeof comp === 'string') return comp;

  return undefined;
};

const updateReversedResolver = (resolver: Resolver): void => {
  currResolver = resolver;
  reversedResolver.clear();
  for (const [name, comp] of Object.entries(resolver)) {
    reversedResolver.set(comp, name);
  }
};
