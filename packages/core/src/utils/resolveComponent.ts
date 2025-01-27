import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { Resolver } from '../interfaces';

type ReversedResolver = Map<React.ComponentType | string, string>;

type CachedResolverData = {
  resolver: Resolver;
  reversed: ReversedResolver;
};

let CACHED_RESOLVER_DATA: CachedResolverData | null = null;

const getReversedResolver = (resolver: Resolver): ReversedResolver => {
  if (CACHED_RESOLVER_DATA && CACHED_RESOLVER_DATA.resolver === resolver) {
    return CACHED_RESOLVER_DATA.reversed;
  }

  CACHED_RESOLVER_DATA = {
    resolver,
    reversed: new Map(),
  };

  for (const [name, comp] of Object.entries(resolver)) {
    CACHED_RESOLVER_DATA.reversed.set(comp, name);
  }

  return CACHED_RESOLVER_DATA.reversed;
};

const getComponentName = (component: React.ElementType): string | undefined => {
  return (component as any).name || (component as any).displayName;
};

const searchComponentInResolver = (
  resolver: Resolver,
  comp: React.ElementType
): string | null => {
  const name = getReversedResolver(resolver).get(comp);
  return name !== undefined ? name : null;
};

export const resolveComponent = (
  resolver: Resolver,
  comp: React.ElementType | string
): string => {
  if (typeof comp === 'string') {
    return comp;
  }

  const resolvedName = searchComponentInResolver(resolver, comp);

  invariant(
    resolvedName,
    ERROR_NOT_IN_RESOLVER.replace('%node_type%', getComponentName(comp))
  );

  return resolvedName;
};
