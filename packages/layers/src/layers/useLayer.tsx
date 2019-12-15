import React, { useContext, useRef, useMemo } from "react";
import { LayerContext } from "./context";
import { useConnectorHooks, ConnectorElementWrapper } from "craftjs-utils";
import { EventContext } from "../events";
import { useLayerManager } from "../manager";
import { useEditor } from "craftjs";
import { Layer } from "../interfaces";



type internalActions = LayerContext & {
  children: string[],
  connectDrag: ConnectorElementWrapper;
  connectLayer: ConnectorElementWrapper;
  connectLayerHeader: ConnectorElementWrapper;
  actions: {
    toggleLayer: () => void
  }
}

export type useLayer<S = null> = S extends null ? internalActions : S & internalActions;
export function useLayer(): useLayer
export function useLayer<S = null>(collect?: (node: Layer) => S): useLayer<S>
export function useLayer<S = null>(collect?: (layer: Layer) => S): useLayer <S> {
  
  const {id, depth } = useContext(LayerContext);
  const { actions: managerActions, ...collected } = collect ? useLayerManager((state) => {
    return id && state.layers[id] && collect(state.layers[id]) 
  }) : useLayerManager();

  const { enabled, children, connectors: managerConnectors } = useEditor((state, query) => ({
    children: state.nodes[id] && query.getDeepNodes(id, false),
    enabled: state.options.enabled
  }));


  const handlers = useContext(EventContext);


  const connectors = useConnectorHooks({
    connectLayer: (node) => {
      managerConnectors.active(node, id);
      managerConnectors.hover(node, id);
      handlers.onMouseOver(node, id)
      handlers.onDragOver(node, id)
      handlers.onDragEnter(node, id)
      handlers.onDragEnd(node, id)
      managerConnectors.drag(node, id);

      managerActions.setDOM(id, {
        dom: node,
      });
    }, 
    connectLayerHeader: (node) => {
      managerActions.setDOM(id, {
        headingDom: node,
      });
    },
    connectDrag: [
      (node) => {
        node.setAttribute("draggable", true);
        handlers.onDragStart(node, id);
      },
      (node) => node.removeAttribute("draggable")
    ]
  }, enabled) as any;

  const actions = useMemo(() => {
    return {
      toggleLayer: () => managerActions.toggleLayer(id)
    }
  }, []);

  return {
    id,
    depth,
    children,
    actions,
    ...connectors as any,
    ...collected as any
  }
}