import { useMethods, SubscriberAndCallbacksFor } from '@craftjs/utils';

import { ActionMethods } from './actions';
import { QueryMethods } from './query';

import { DefaultEventHandlers } from '../events';
import { EditorState, Options, NodeEventTypes } from '../interfaces';

export const editorInitialState: EditorState = {
  nodes: {},
  events: {
    dragged: null,
    selected: null,
    hovered: null,
    indicator: null,
  },
  handlers: null,
  options: {
    onNodesChange: () => null,
    onRender: ({ render }) => render,
    resolver: {},
    enabled: true,
    indicator: {
      error: 'red',
      success: 'rgb(98, 196, 98)',
    },
    handlers: (store) =>
      new DefaultEventHandlers({
        store,
      }),
  },
};

export const ActionMethodsWithConfig = {
  methods: ActionMethods,
  ignoreHistoryForActions: [
    'setDOM',
    'setNodeEvent',
    'selectNode',
    'clearEvents',
    'setOptions',
    'setIndicator',
  ] as const,
  normalizeHistory: (state: EditorState) => {
    /**
     * On every undo/redo, we remove events pointing to deleted Nodes
     */
    Object.keys(state.events).forEach((eventName: NodeEventTypes) => {
      const nodeId = state.events[eventName];

      if (!!nodeId && !state.nodes[nodeId]) {
        state.events[eventName] = null;
      }
    });

    // Remove any invalid node[nodeId].events
    // TODO(prev): it's really cumbersome to have to ensure state.events and state.nodes[nodeId].events are in sync
    // Find a way to make it so that once state.events is set, state.nodes[nodeId] automatically reflects that (maybe using proxies?)
    Object.keys(state.nodes).forEach((id) => {
      const node = state.nodes[id];

      Object.keys(node.events).forEach((eventName: NodeEventTypes) => {
        const isEventActive = !!node.events[eventName];

        if (
          isEventActive &&
          state.events[eventName] &&
          state.events[eventName] !== node.id
        ) {
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

export const useEditorStore = (options: Partial<Options>): EditorStore => {
  return useMethods(
    ActionMethodsWithConfig,
    {
      ...editorInitialState,
      options: {
        ...editorInitialState.options,
        ...options,
      },
    },
    QueryMethods
  ) as EditorStore;
};
