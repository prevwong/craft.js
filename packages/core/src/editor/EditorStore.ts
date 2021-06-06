import { Store, History } from '@craftjs/utils';

import { ActionMethods } from './actions';
import { QueryMethods } from './query';

import { DefaultEventHandlers } from '../events';
import { EditorState, NodeId } from '../interfaces';

export const editorInitialState: EditorState = {
  nodes: {},
  events: {
    dragged: new Set<NodeId>(),
    selected: new Set<NodeId>(),
    hovered: new Set<NodeId>(),
  },
  indicator: null,
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
        isMultiSelectEnabled: (e: MouseEvent) => !!e.metaKey,
      }),
    normalizeNodes: () => {},
  },
};

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

const shouldNormalize = (patches, action) => {
  for (let i = 0; i < patches.length; i++) {
    const { path } = patches[i];
    const isModifyingNodeData =
      path.length > 2 && path[0] === 'nodes' && path[2] === 'data';

    if (['setState', 'deserialize'].includes(action) || isModifyingNodeData) {
      return true; // we exit the loop as soon as we find a change in node.data
    }
  }

  return false;
};

export class EditorStore extends Store<EditorState> {
  private history: History;

  constructor(initialState: EditorState) {
    super(initialState);
    this.history = new History();
  }

  // TODO: The actions api will be updated to use an operations-like model, we're keeping this here for now
  get actions() {
    const methods = ActionMethods(null, null);

    const getBaseActions = (
      patchCallback?: (patches, inversePatches, type: string) => void
    ) =>
      Object.keys(methods).reduce((accum, actionKey) => {
        return {
          ...accum,
          [actionKey]: (...args) =>
            this.setState(
              (state) => ActionMethods(state, this.query)[actionKey](...args),
              (patches, inversePatches) => {
                if (!patchCallback) {
                  return;
                }

                if (
                  [
                    'setDOM',
                    'setNodeEvent',
                    'selectNode',
                    'clearEvents',
                    'setOptions',
                    'setIndicator',
                  ].includes(actionKey)
                ) {
                  return;
                }

                if (
                  shouldNormalize(patches, actionKey) &&
                  this.getState().options.normalizeNodes
                ) {
                  const currentState = this.getState();
                  this.setState(
                    (state) =>
                      this.getState().options.normalizeNodes(
                        state,
                        currentState,
                        {
                          type: actionKey,
                          params: args,
                        }
                      ),
                    (newPatches, newInversePatches) => {
                      patches = [...patches, ...newPatches];
                      inversePatches = [
                        ...newInversePatches,
                        ...inversePatches,
                      ];
                    },
                    true
                  );
                }

                patchCallback(patches, inversePatches, actionKey);
              }
            ),
        };
      }, {} as ReturnType<typeof ActionMethods>);

    const history = {
      undo: () =>
        this.setState((state) => {
          normalizeStateOnUndoRedo(state);
          this.history.undo(state);
        }),
      redo: () =>
        this.setState((state) => {
          normalizeStateOnUndoRedo(state);
          this.history.redo(state);
        }),
      ignore: () => getBaseActions(),
      throttle: (rate: number = 500) =>
        getBaseActions((patch, inversePatch) =>
          this.history.throttleAdd(patch, inversePatch, rate)
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
