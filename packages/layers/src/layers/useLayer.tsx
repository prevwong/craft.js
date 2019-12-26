import React, { useContext, useRef, useMemo } from "react";
import { LayerContext } from "./context";
import { useConnectorHooks, ConnectorElementWrapper } from "@craftjs/utils";
import { EventContext } from "../events";
import { useLayerManager } from "../manager";
import { useEditor } from "@craftjs/core";
import { Layer } from "../interfaces";



type internalActions = LayerContext & {
  children: string[],
  connectors: {
    drag: ConnectorElementWrapper;
    layer: ConnectorElementWrapper;
    layerHeader: ConnectorElementWrapper;
  },
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
    layer: (node) => {
      managerConnectors.select(node, id);
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
    layerHeader: (node) => {
      managerActions.setDOM(id, {
        headingDom: node,
      });
    },
    drag: [
      (node) => {
        node.setAttribute("draggable", "true");
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
    connectors,
    ...collected as any
  }
}