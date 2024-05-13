import tags from 'html-tags';

import { Resolver, UserComponentConfig } from '../interfaces';

export const resolveComponentToType = (
  resolver: Resolver,
  comp: React.ElementType | string
) => {
  let Comp: string;
  const name = (comp as any).name || (comp as any).displayName;

  if (resolver[name]) return name;

  for (let i = 0; i < Object.keys(resolver).length; i++) {
    const name = Object.keys(resolver)[i],
      fn = resolver[name];
    if (fn === comp) {
      Comp = name;
      return Comp;
    }
  }

  if (typeof comp === 'string') return comp;
};

type ResolvedComponentConfig = UserComponentConfig<any> & {
  component: string | React.ComponentType;
};

export const getResolverConfig = (
  type: string,
  resolver: Resolver
): ResolvedComponentConfig => {
  const defaultConfig = {
    component: type,
    displayName: type,
    rules: {
      canDrag: () => true,
      canDrop: () => true,
      canMoveIn: () => true,
      canMoveOut: () => true,
    },
    related: {},
    props: {},
    custom: {},
    info: {},
    isCanvas: false,
  };

  const component = resolver[type];

  if (!component) {
    if (tags.includes(type)) {
      return defaultConfig;
    }

    return null;
  }

  const craftConfig: UserComponentConfig<any> = component['craft'] || {};

  return {
    ...defaultConfig,
    ...craftConfig,
    component,
    displayName: type,
    rules: {
      ...defaultConfig.rules,
      ...(craftConfig.rules || {}),
    },
  };
};
