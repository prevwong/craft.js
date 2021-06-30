import { Store, History } from '@craftjs/utils';

import { EditorStore, EditorStoreConfig } from './EditorStore';
import { ActionMethods } from './actions';
import { QueryMethods } from './query';

import { CoreEventHandlers, DefaultEventHandlers } from '../events';
import { EditorState, NodeId, Options } from '../interfaces';

const normalizeStateOnUndoRedo = (state: EditorState) => {
  /**
   * On every undo/redo, we remove events pointing to deleted Nodes
   */
  Object.keys(state.events).forEach((eventName) => {
    const nodeIds: NodeId[] = Array.from(state.events[eventName] || []);

    nodeIds.forEach((id) => {
      if (!state.nodes[id]) {
        state.events[eventName].delete(id);
      }
    });
  });

  // Remove any invalid node[nodeId].events
  // TODO(prev): it's really cumbersome to have to ensure state.events and state.nodes[nodeId].events are in sync
  // Find a way to make it so that once state.events is set, state.nodes[nodeId] automatically reflects that (maybe using proxies?)
  Object.keys(state.nodes).forEach((id) => {
    const node = state.nodes[id];

    Object.keys(node.events).forEach((eventName) => {
      const isEventActive = !!node.events[eventName];

      if (
        isEventActive &&
        state.events[eventName] &&
        !state.events[eventName].has(node.id)
      ) {
        node.events[eventName] = false;
      }
    });
  });
};

export const editorInitialState: EditorState = {
  nodes: {},
  events: {
    dragged: new Set<NodeId>(),
    selected: new Set<NodeId>(),
    hovered: new Set<NodeId>(),
  },
  indicator: null,
  options: {
    resolver: {},
    enabled: true,
  },
};

export class EditorStoreImpl extends Store<EditorState> implements EditorStore {
  history: History;
  config: EditorStoreConfig;
  handlers: CoreEventHandlers;

  constructor(options?: Partial<Options>, config?: Partial<EditorStoreConfig>) {
    super({
      ...editorInitialState,
      options: {
        ...editorInitialState.options,
        ...(options || {}),
      },
    });

    this.config = {
      onNodesChange: () => null,
      onRender: ({ render }) => render,
      indicator: {
        error: 'red',
        success: 'rgb(98, 196, 98)',
      },
      handlers: (store) =>
        new DefaultEventHandlers({
          store,
          isMultiSelectEnabled: (e: MouseEvent) => !!e.metaKey,
        }),
      normalizeNodes: () => {},
      ...(config || {}),
    };
    this.history = new History();
    this.handlers = this.config.handlers(this);

    this.subscribe(
      (state) => ({ enabled: state.options.enabled }),
      ({ enabled }) => {
        if (!enabled) {
          this.handlers.disable();
          return;
        }

        this.handlers.enable();
      }
    );
  }

  // TODO: The actions api will be updated to use an operations-like model, we're keeping this here for now
  get actions() {
    const methods = ActionMethods(null, null);
    const currentState = this.getState();

    const getBaseActions = (
      historyCallback?: (patches, inversePatches, type: string) => void
    ) =>
      Object.keys(methods).reduce((accum, actionKey) => {
        return {
          ...accum,
          [actionKey]: (...args) => {
            return this.setState(
              (state) => ActionMethods(state, this.query)[actionKey](...args),
              {
                onPatch: (patches, inversePatches) => {
                  // TODO: this will be deprecated
                  // Keeping it here until we improve the actions API
                  if (this.config.normalizeNodes) {
                    this.setState((state) =>
                      this.config.normalizeNodes(state, currentState)
                    );
                  }
                  if (
                    [
                      'setDOM',
                      'setNodeEvent',
                      'selectNode',
                      'clearEvents',
                      'setOptions',
                      'setIndicator',
                    ].includes(actionKey) ||
                    !historyCallback
                  ) {
                    return;
                  }

                  if (this.config.onNodesChange) {
                    this.config.onNodesChange(this.query);
                  }

                  // When deserialize, make sure to cleanup any existing connectors
                  // Otherwise, connectors with existing Node ids won't get created correctly
                  if (actionKey === 'deserialize') {
                    this.handlers.cleanup();
                  }

                  historyCallback(patches, inversePatches, actionKey);
                },
              }
            );
          },
        };
      }, {} as ReturnType<typeof ActionMethods>);

    const history = {
      undo: () =>
        this.setState((state) => {
          this.history.undo(state);
          normalizeStateOnUndoRedo(state);
        }),
      redo: () =>
        this.setState((state) => {
          this.history.redo(state);
          normalizeStateOnUndoRedo(state);
        }),
      ignore: () => getBaseActions(),
      throttle: (rate: number = 500) =>
        getBaseActions((patch, inversePatch) =>
          this.history.throttleAdd(patch, inversePatch, rate)
        ),
      merge: () =>
        getBaseActions((patch, inversePatch) =>
          this.history.merge(patch, inversePatch)
        ),
    };

    return {
      ...getBaseActions((patch, inversePatch) =>
        this.history.add(patch, inversePatch)
      ),
      history,
    };
  }

  get query() {
    const baseQueries = Object.keys(QueryMethods(null)).reduce((accum, key) => {
      return {
        ...accum,
        [key]: (...args) => QueryMethods(this.getState())[key](...args),
      };
    }, {} as ReturnType<typeof QueryMethods>);

    const history = {
      canUndo: () => this.history.canUndo(),
      canRedo: () => this.history.canRedo(),
    };

    return {
      ...baseQueries,
      history,
    };
  }
}
