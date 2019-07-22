import { LayerState, Layer, LayerEvents } from "./interfaces";

export const LayerMethods = (state: LayerState) => ({
  setLayerEvent: (event: LayerEvents, id: string) => {
    const current = state.events[event];
    if (current) {
      state.events[event] = null;
    }
    state.events[event] = state.layers[id]
  },
  setRef: (layerId: string, ref: string, value: any) => {
    if (!state.layers[layerId]) state.layers[layerId] = {id: layerId};
    state.layers[layerId][ref] = value;
  },
  toggleLayer: (id: string) => {
    state.layers[id].expanded = true
  }
});