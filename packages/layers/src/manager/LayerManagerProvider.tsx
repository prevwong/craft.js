import { useEditor } from '@craftjs/core';
import React, { useMemo } from 'react';

import { LayerStore } from './LayerStore';
import { LayerManagerContext } from './context';

import { RenderLayerIndicator } from '../events';
import { LayerOptions } from '../interfaces';
import { DefaultLayer } from '../layers';

export const LayerManagerProvider: React.FC<{
  options: Partial<LayerOptions>;
}> = ({ children, options }) => {
  const { store: editorStore } = useEditor();

  const store = useMemo(
    () =>
      new LayerStore(
        {
          layers: {},
          events: {
            selected: null,
            hovered: null,
            indicator: null,
          },
          options: {
            expandRootOnLoad: true,
            renderLayer: DefaultLayer,
            ...options,
          },
        },
        editorStore
      ),
    [options, editorStore]
  );

  return (
    <LayerManagerContext.Provider value={{ store }}>
      <RenderLayerIndicator>{children}</RenderLayerIndicator>
    </LayerManagerContext.Provider>
  );
};
