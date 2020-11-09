import { useEditor } from '@craftjs/core';
import { useContext, useMemo } from 'react';

import { LayerContext } from './LayerContext';

import { Layer } from '../interfaces';
import { useLayerManager } from '../manager';

type internalActions = LayerContext & {
  children: string[];
  actions: {
    toggleLayer: () => void;
  };
};

export type useLayer<S = null> = S extends null
  ? internalActions
  : S & internalActions;
export function useLayer(): useLayer;
export function useLayer<S = null>(collect?: (node: Layer) => S): useLayer<S>;
export function useLayer<S = null>(collect?: (layer: Layer) => S): useLayer<S> {
  const { id, depth, connectors } = useContext(LayerContext);

  const { actions: managerActions, ...collected } = useLayerManager((state) => {
    return id && state.layers[id] && collect && collect(state.layers[id]);
  });

  const { children } = useEditor((state, query) => ({
    children: state.nodes[id] && query.node(id).descendants(),
  }));

  const actions = useMemo(() => {
    return {
      toggleLayer: () => managerActions.toggleLayer(id),
    };
  }, [managerActions, id]);

  return {
    id,
    depth,
    children,
    actions,
    connectors,
    ...(collected as any),
  };
}
