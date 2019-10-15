import { LayerState, Layer, LayerEvents } from "./interfaces";

export const LayerMethods = (state: LayerState) => ({
  setLayerEvent: (event: LayerEvents, id: string) => {
    const current = state.events[event];
    if (current) {
      state.events[event] = null;
    }
    state.events[event] = state.layers[id]
  },
  setRef: (id: string, ref: Exclude<keyof Layer, 'expanded'>, value: any) => {
    if (!state.layers[id]) state.layers[id] = {id};
    const layer = state.layers[id];
    layer[ref] = value;
  },
  toggleLayer: (id: string) => {
    state.layers[id].expanded = true
  }
});