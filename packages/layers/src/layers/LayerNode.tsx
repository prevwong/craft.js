import React, { useContext, useMemo, useRef, useEffect } from "react";
import { useManager } from "craftjs";
import { useLayerManager } from "../manager/useLayerManager";
import { useLayer } from "./useLayer";
import { LayerContextProvider } from "./context";
import { EventContext } from "../events";

export const LayerNode: React.FC = () => {
  const { id, depth, children, expanded  } = useLayer((layer) => ({
    expanded: layer.expanded
  }));

  const { data, query, shouldBeExpanded } = useManager((state, query) => ({
    data: state.nodes[id] && state.nodes[id].data,
    shouldBeExpanded: state.events.active && query.getAllParents(state.events.active).includes(id)
  }));

  const { actions, renderLayer, renderLayerHeader } = useLayerManager((state) => ({
    renderLayer: state.options.renderLayer,
    renderLayerHeader: state.options.renderLayerHeader
  }));

  const expandedRef = useRef<boolean>(expanded);
  expandedRef.current = expanded;

  useEffect(() => {
    if (!expandedRef.current && shouldBeExpanded ) {
      actions.toggleLayer(id);
    }
  }, [shouldBeExpanded])
  

  actions.registerLayer(id);
  return (
    data ? ( 
      <div 
        className={`craft-layer-node ${id}`}
       
      >
        {
          React.createElement(renderLayer, {}, 
            (children && expanded) ?
              children.map(id =>
                <LayerContextProvider key={id} id={id} depth={depth + 1} />
              ) : null   
          )
        }
      </div>
    ): null
  );
}
