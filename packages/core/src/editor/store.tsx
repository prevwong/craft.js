import { useMethods, SubscriberAndCallbacksFor } from '@craftjs/utils';
import { Actions } from './actions';
import { QueryMethods } from './query';

export const editorInitialState = {
  nodes: {},
  events: {
    dragged: null,
    selected: null,
    hovered: null,
    indicator: null,
  },
};

export const ActionMethodsWithConfig = {
  methods: Actions,
  ignoreHistoryForActions: [
    'setDOM',
    'setNodeEvent',
    'clearEvents',
    'setOptions',
    'setIndicator',
  ] as const,
  normalizeHistory: (state) => {
    // TODO(prev): this should be handled by the general normalising function

    /**
     * On every undo/redo, we remove events pointing to deleted Nodes
     */
    Object.keys(state.events).forEach((eventName) => {
      const nodeId = state.events[eventName];

      if (!!nodeId && !state.nodes[nodeId]) {
        state.events[eventName] = false;
      }
    });

    // Remove any invalid node[nodeId].events
    // TODO(prev): it's really cumbersome to have to ensure state.events and state.nodes[nodeId].events are in sync
    // Find a way to make it so that once state.events is set, state.nodes[nodeId] automatically reflects that (maybe using proxies?)
    Object.keys(state.nodes).forEach((id) => {
      const node = state.nodes[id];

      Object.keys(node.events).forEach((eventName) => {
        const isEventActive = node.events[eventName];

        if (!!isEventActive && !state.events[eventName] !== node.id) {
          node.events[eventName] = false;
        }
      });
    });
  },
};

export type EditorStore = SubscriberAndCallbacksFor<
  typeof ActionMethodsWithConfig,
  typeof QueryMethods
>;

export const useEditorStore = (options): EditorStore => {
  return useMethods(
    ActionMethodsWithConfig,
    {
      nodes: {},
      events: {
        selected: null,
        dragged: null,
        hovered: null,
        indicator: null,
      },
      options,
    },
    QueryMethods
  ) as EditorStore;
};
