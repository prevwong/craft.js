import { LayerState, LayerEvents } from '../interfaces';

export const LayerMethods = (state: LayerState) => ({
  setLayerEvent: (eventType: LayerEvents, id: string) => {
    if (id !== null && !state.layers[id]) return;

    const current = state.events[eventType];
    if (current && id !== current) {
      state.layers[current].event[eventType] = false;
    }

    if (id) {
      state.layers[id].event[eventType] = true;
      state.events[eventType] = id;
    } else {
      state.events[eventType] = null;
    }
  },
  registerLayer: (id: string) => {
    if (!state.layers[id]) {
      state.layers[id] = {
        dom: null,
        headingDom: null,
        expanded: false,
        id,
        event: {
          selected: false,
          hovered: false,
        },
      };
    }
  },
  setDOM: (
    id: string,
    domCollection: Partial<Record<'dom' | 'headingDom', HTMLElement>>
  ) => {
    state.layers[id] = {
      ...state.layers[id],
      ...(domCollection.dom ? { dom: domCollection.dom } : {}),
      ...(domCollection.headingDom
        ? { headingDom: domCollection.headingDom }
        : {}),
    };
  },
  toggleLayer: (id: string) => {
    state.layers[id].expanded = !state.layers[id].expanded;
  },
  setExpandedState: (id: string, expanded: boolean) => {
    state.layers[id].expanded = expanded;
  },
  setIndicator: (indicator) => {
    state.events.indicator = indicator;
  },
});
