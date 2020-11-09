import { ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER } from '@craftjs/utils';
import React from 'react';
import invariant from 'tiny-invariant';

import { resolveComponent } from './resolveComponent';

import {
  NodeData,
  SerializedNode,
  ReducedComp,
  ReduceCompType,
} from '../interfaces';
import { Resolver } from '../interfaces';
import { Canvas } from '../nodes/Canvas';

type DeserialisedType = JSX.Element & { name: string };

const restoreType = (type: ReduceCompType, resolver: Resolver) =>
  typeof type === 'object' && type.resolvedName
    ? type.resolvedName === 'Canvas'
      ? Canvas
      : resolver[type.resolvedName]
    : typeof type === 'string'
    ? type
    : null;

export const deserializeComp = (
  data: ReducedComp,
  resolver: Resolver,
  index?: number
): DeserialisedType | void => {
  let { type, props } = data;

  const main = restoreType(type, resolver);

  if (!main) {
    return;
  }

  props = Object.keys(props).reduce((result: Record<string, any>, key) => {
    const prop = props[key];
    if (prop === null || prop === undefined) {
      result[key] = null;
    } else if (typeof prop === 'object' && prop.resolvedName) {
      result[key] = deserializeComp(prop, resolver);
    } else if (key === 'children' && Array.isArray(prop)) {
      result[key] = prop.map((child) => {
        if (typeof child === 'string') {
          return child;
        }
        return deserializeComp(child, resolver);
      });
    } else {
      result[key] = prop;
    }
    return result;
  }, {});

  if (index) {
    props.key = index;
  }

  const jsx = {
    ...React.createElement(main, {
      ...props,
    }),
  };

  return {
    ...jsx,
    name: resolveComponent(resolver, jsx.type),
  };
};

export const deserializeNode = (
  data: SerializedNode,
  resolver: Resolver
): Omit<NodeData, 'event'> => {
  const { type: Comp, props: Props, ...nodeData } = data;

  const isCompAnHtmlElement = Comp !== undefined && typeof Comp === 'string';
  const isCompAUserComponent =
    Comp !== undefined &&
    (Comp as { resolvedName?: string }).resolvedName !== undefined;

  invariant(
    isCompAnHtmlElement || isCompAUserComponent,
    ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER.replace(
      '%displayName%',
      data.displayName
    ).replace('%availableComponents%', Object.keys(resolver).join(', '))
  );

  const { type, name, props } = (deserializeComp(
    data,
    resolver
  ) as unknown) as NodeData;

  const { parent, custom, displayName, isCanvas, nodes, hidden } = nodeData;

  const linkedNodes = nodeData.linkedNodes || nodeData._childCanvas;

  return {
    type,
    name,
    displayName: displayName || name,
    props,
    custom: custom || {},
    isCanvas: !!isCanvas,
    hidden: !!hidden,
    parent,
    linkedNodes: linkedNodes || {},
    nodes: nodes || [],
  };
};
