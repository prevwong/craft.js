import { useEditor, ROOT_NODE } from '@craftjs/core';
import React, { useRef, useEffect } from 'react';

import { LayerContextProvider } from './LayerContextProvider';
import { useLayer } from './useLayer';

import { useLayerManager } from '../manager/useLayerManager';

export const LayerNode: React.FC = () => {
  const { id, depth, children, expanded } = useLayer((layer) => ({
    expanded: layer.expanded,
  }));

  const { data, shouldBeExpanded } = useEditor((state, query) => ({
    data: state.nodes[id] && state.nodes[id].data,
    shouldBeExpanded:
      state.events.selected &&
      query.node(state.events.selected).ancestors(true).includes(id),
  }));

  const { actions, renderLayer, expandRootOnLoad } = useLayerManager(
    (state) => ({
      renderLayer: state.options.renderLayer,
      expandRootOnLoad: state.options.expandRootOnLoad,
    })
  );

  const expandedRef = useRef<boolean>(expanded);
  expandedRef.current = expanded;

  const shouldBeExpandedOnLoad = useRef<boolean>(
    expandRootOnLoad && id === ROOT_NODE
  );

  useEffect(() => {
    if (!expandedRef.current && shouldBeExpanded) {
      actions.toggleLayer(id);
    }
  }, [actions, id, shouldBeExpanded]);

  useEffect(() => {
    if (shouldBeExpandedOnLoad.current) {
      actions.toggleLayer(id);
    }
  }, [actions, id]);

  const initRef = useRef<boolean>(false);

  if (!initRef.current) {
    actions.registerLayer(id);
    initRef.current = true;
  }

  return data ? (
    <div className={`craft-layer-node ${id}`}>
      {React.createElement(
        renderLayer,
        {},
        children && expanded
          ? children.map((id) => (
              <LayerContextProvider key={id} id={id} depth={depth + 1} />
            ))
          : null
      )}
    </div>
  ) : null;
};
