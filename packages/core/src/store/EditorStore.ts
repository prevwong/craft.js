import {
  Store,
  History,
  HistoryMergeOpts,
  ERROR_RESOLVER_NOT_AN_OBJECT,
} from '@craftjs/utils';
import invariant from 'tiny-invariant';

import { ActionMethods } from './actions';
import { EditorQuery } from './query';

import { CoreEventHandlers } from '../events/CoreEventHandlers';
import { DefaultEventHandlers } from '../events/DefaultEventHandlers';
import { EditorStoreConfig } from '../interfaces';
import { EditorState, NodeId } from '../interfaces';
import { RelatedComponents } from '../nodes/RelatedComponents';

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
};

export const editorInitialState: EditorState = {
  nodes: {},
  enabled: true,
  events: {
    dragged: new Set<NodeId>(),
    selected: new Set<NodeId>(),
    hovered: new Set<NodeId>(),
  },
  indicator: null,
  timestamp: Date.now(),
};

export class EditorStore extends Store<EditorState> {
  history: History;
  config: EditorStoreConfig;
  handlers: CoreEventHandlers;
  related: RelatedComponents;

  constructor(
    config?: Partial<EditorStoreConfig & { state: Partial<EditorState> }>
  ) {
    const { state, ...storeConfig } = config;

    super({
      ...editorInitialState,
      ...state,
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
      resolver: {},
      ...(storeConfig || {}),
    };

    // we do not want to warn the user if no resolver was supplied
    if (this.config.resolver !== undefined) {
      invariant(
        typeof this.config.resolver === 'object' &&
          !Array.isArray(this.config.resolver),
        ERROR_RESOLVER_NOT_AN_OBJECT
      );
    }

    this.history = new History();
    this.related = new RelatedComponents();
    this.handlers = this.config.handlers(this);

    this.subscribe(
      (state) => ({ enabled: state.enabled }),
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
    const methods = ActionMethods(null, this);
    const currentState = this.getState();

    const getBaseActions = (
      historyCallback?: (patches, inversePatches, type: string) => void
    ) =>
      Object.keys(methods).reduce((accum, actionKey) => {
        return {
          ...accum,
          [actionKey]: (...args) => {
            return this.setState(
              (state) => {
                ActionMethods(state, this)[actionKey](...args);

                // TODO: this will be deprecated
                // Keeping it here until we improve the actions API
                if (this.config.normalizeNodes) {
                  return;
                }

                this.config.normalizeNodes(state, currentState);
              },
              {
                onPatch: (patches, inversePatches) => {
                  if (
                    [
                      'setDOM',
                      'setNodeEvent',
                      'selectNode',
                      'clearEvents',
                      'setOptions',
                      'setIndicator',
                      'setEnabled',
                    ].includes(actionKey) ||
                    !historyCallback
                  ) {
                    return;
                  }

                  if (this.config.onNodesChange) {
                    this.config.onNodesChange(this.query);
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
      merge: (opts?: HistoryMergeOpts) =>
        getBaseActions((patch, inversePatch) =>
          this.history.merge(patch, inversePatch, opts)
        ),
    };

    return {
      ...getBaseActions((patch, inversePatch) =>
        this.history.add(patch, inversePatch)
      ),
      history,
    };
  }

  reconfigure(config: Partial<EditorStoreConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.notify();
  }

  // TODO: move to useEditor/useInternalEditor hook
  get query() {
    return new EditorQuery(this);
  }

  get resolver() {
    return this.config.resolver;
  }
}
