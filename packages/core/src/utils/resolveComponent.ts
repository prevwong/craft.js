import { Resolver } from '../interfaces';

export const resolveComponent = (
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
