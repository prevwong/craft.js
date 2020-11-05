// https://github.com/pelotom/use-methods
import produce, { Patch, produceWithPatches } from 'immer';
import { useMemo, useEffect, useRef, useReducer, useCallback } from 'react';
import isEqualWith from 'lodash.isequalwith';
import { History, HISTORY_ACTIONS } from './History';
import { Delete } from './utilityTypes';

export type SubscriberAndCallbacksFor<
  M extends MethodsOrOptions,
  Q extends QueryMethods = any
> = {
  subscribe: Watcher<StateFor<M>>['subscribe'];
  getState: () => { prev: StateFor<M>; current: StateFor<M> };
  actions: CallbacksFor<M>;
  query: QueryCallbacksFor<Q>;
  history: History;
};

export type StateFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<
  infer S,
  any
>
  ? S
  : never;

export type CallbacksFor<
  M extends MethodsOrOptions
> = M extends MethodsOrOptions<any, infer R>
  ? {
      [T in ActionUnion<R>['type']]: (
        ...payload: ActionByType<ActionUnion<R>, T>['payload']
      ) => void;
    } & {
      history: {
        undo: () => void;
        redo: () => void;
        throttle: (
          rate?: number
        ) => Delete<
          {
            [T in ActionUnion<R>['type']]: (
              ...payload: ActionByType<ActionUnion<R>, T>['payload']
            ) => void;
          },
          M extends Options ? M['ignoreHistoryForActions'][number] : never
        >;
        ignore: () => Delete<
          {
            [T in ActionUnion<R>['type']]: (
              ...payload: ActionByType<ActionUnion<R>, T>['payload']
            ) => void;
          },
          M extends Options ? M['ignoreHistoryForActions'][number] : never
        >;
      };
    }
  : never;

export type Methods<S = any, R extends MethodRecordBase<S> = any, Q = any> = (
  state: S,
  query: Q
) => R;

export type Options<S = any, R extends MethodRecordBase<S> = any, Q = any> = {
  methods: Methods<S, R, Q>;
  ignoreHistoryForActions: ReadonlyArray<keyof MethodRecordBase>;
  normalizeHistory?: (state: S) => void;
};

export type MethodsOrOptions<
  S = any,
  R extends MethodRecordBase<S> = any,
  Q = any
> = Methods<S, R, Q> | Options<S, R, Q>;

export type MethodRecordBase<S = any> = Record<
  string,
  (...args: any[]) => S extends object ? S | void : S
>;

export type Action<T = any, P = any> = {
  type: T;
  payload?: P;
  config?: Record<string, any>;
};

export type ActionUnion<R extends MethodRecordBase> = {
  [T in keyof R]: Action<T, Parameters<R[T]>>;
}[keyof R];

export type ActionByType<A, T> = A extends { type: infer T2 }
  ? T extends T2
    ? A
    : never
  : never;

export type QueryMethods<
  S = any,
  O = any,
  R extends MethodRecordBase<S> = any
> = (state?: S, options?: O) => R;
export type QueryCallbacksFor<M extends QueryMethods> = M extends QueryMethods<
  any,
  any,
  infer R
>
  ? {
      [T in ActionUnion<R>['type']]: (
        ...payload: ActionByType<ActionUnion<R>, T>['payload']
      ) => ReturnType<R[T]>;
    } & {
      history: {
        canUndo: () => boolean;
        canRedo: () => boolean;
      };
    }
  : never;

export type PatchListenerAction<S, M extends MethodsOrOptions> = {
  type: keyof CallbacksFor<M>;
  params: any;
  patches: Patch[];
};

export type PatchListener<
  S,
  M extends MethodsOrOptions,
  Q extends QueryMethods
> = (
  newState: S,
  previousState: S,
  actionPerformedWithPatches: PatchListenerAction<S, M>,
  query: QueryCallbacksFor<Q>,
  normalizer: (cb: (draft: S) => void) => void
) => void;

export function useMethods<S, R extends MethodRecordBase<S>>(
  methodsOrOptions: Methods<S, R>,
  initialState: any
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>>;

export function useMethods<
  S,
  R extends MethodRecordBase<S>,
  Q extends QueryMethods
>(
  methodsOrOptions: MethodsOrOptions<S, R, QueryCallbacksFor<Q>>, // methods to manipulate the state
  initialState: any,
  queryMethods: Q
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q>;

export function useMethods<
  S,
  R extends MethodRecordBase<S>,
  Q extends QueryMethods
>(
  methodsOrOptions: MethodsOrOptions<S, R, QueryCallbacksFor<Q>>, // methods to manipulate the state
  initialState: any,
  queryMethods: Q,
  patchListener: PatchListener<
    S,
    MethodsOrOptions<S, R, QueryCallbacksFor<Q>>,
    Q
  >
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q>;

export function useMethods<
  S,
  R extends MethodRecordBase<S>,
  Q extends QueryMethods
>(
  methodsOrOptions: MethodsOrOptions<S, R, QueryCallbacksFor<Q>>, // methods to manipulate the state
  initialState: any,
  queryMethods: Q,
  patchListener: PatchListener<
    S,
    MethodsOrOptions<S, R, QueryCallbacksFor<Q>>,
    Q
  >
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q>;

export function useMethods<
  S,
  R extends MethodRecordBase<S>,
  Q extends QueryMethods = null
>(
  methodsOrOptions: MethodsOrOptions<S, R>,
  initialState: any,
  queryMethods?: Q,
  patchListener?: any
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q> {
  const history = useMemo(() => new History(), []);

  let methods: Methods<S, R>;
  let ignoreHistoryForActionsRef = useRef([]);
  let normalizeHistoryRef = useRef<any>();

  if (typeof methodsOrOptions === 'function') {
    methods = methodsOrOptions;
  } else {
    methods = methodsOrOptions.methods;
    ignoreHistoryForActionsRef.current = methodsOrOptions.ignoreHistoryForActions as any;
    normalizeHistoryRef.current = methodsOrOptions.normalizeHistory;
  }

  const patchListenerRef = useRef(patchListener);
  patchListenerRef.current = patchListener;

  const [reducer, methodsFactory] = useMemo(() => {
    const { current: normalizeHistory } = normalizeHistoryRef;
    const { current: ignoreHistoryForActions } = ignoreHistoryForActionsRef;
    const { current: patchListener } = patchListenerRef;

    return [
      (state: S, action: Action) => {
        const query =
          queryMethods && createQuery(queryMethods, () => state, history);

        let finalState;
        let [nextState, patches, inversePatches] = (produceWithPatches as any)(
          state,
          (draft: S) => {
            switch (action.type) {
              case HISTORY_ACTIONS.UNDO: {
                return history.undo(draft);
              }
              case HISTORY_ACTIONS.REDO: {
                return history.redo(draft);
              }

              // TODO: Simplify History API
              case HISTORY_ACTIONS.IGNORE:
              case HISTORY_ACTIONS.THROTTLE: {
                const [type, ...params] = action.payload;
                methods(draft, query)[type](...params);
                break;
              }
              default:
                methods(draft, query)[action.type](...action.payload);
            }
          }
        );

        finalState = nextState;

        if (patchListener) {
          patchListener(
            nextState,
            state,
            { type: action.type, params: action.payload, patches },
            query,
            (cb) => {
              let normalizedDraft = produceWithPatches(nextState, cb);
              finalState = normalizedDraft[0];

              patches = [...patches, ...normalizedDraft[1]];
              inversePatches = [...normalizedDraft[2], ...inversePatches];
            }
          );
        }

        if (
          [HISTORY_ACTIONS.UNDO, HISTORY_ACTIONS.REDO].includes(
            action.type as any
          ) &&
          normalizeHistory
        ) {
          finalState = produce(finalState, normalizeHistory);
        }

        if (
          ![
            ...ignoreHistoryForActions,
            HISTORY_ACTIONS.UNDO,
            HISTORY_ACTIONS.REDO,
            HISTORY_ACTIONS.IGNORE,
          ].includes(action.type as any)
        ) {
          if (action.type === HISTORY_ACTIONS.THROTTLE) {
            history.throttleAdd(
              patches,
              inversePatches,
              action.config && action.config.rate
            );
          } else {
            history.add(patches, inversePatches);
          }
        }

        return finalState;
      },
      methods,
    ];
  }, [history, methods, queryMethods]);

  const [state, dispatch] = useReducer(reducer, initialState);

  // Create ref for state, so we can use it inside memoized functions without having to add it as a dependency
  const currState = useRef();
  currState.current = state;

  const query = useMemo(
    () =>
      !queryMethods
        ? []
        : createQuery(queryMethods, () => currState.current, history),
    [history, queryMethods]
  );

  const actions = useMemo(() => {
    const actionTypes = Object.keys(methodsFactory(null, null));

    const { current: ignoreHistoryForActions } = ignoreHistoryForActionsRef;

    return {
      ...actionTypes.reduce((accum, type) => {
        accum[type] = (...payload) => dispatch({ type, payload });
        return accum;
      }, {} as any),
      history: {
        undo() {
          return dispatch({
            type: HISTORY_ACTIONS.UNDO,
          });
        },
        redo() {
          return dispatch({
            type: HISTORY_ACTIONS.REDO,
          });
        },
        throttle: (rate) => {
          return {
            ...actionTypes
              .filter((type) => !ignoreHistoryForActions.includes(type))
              .reduce((accum, type) => {
                accum[type] = (...payload) =>
                  dispatch({
                    type: HISTORY_ACTIONS.THROTTLE,
                    payload: [type, ...payload],
                    config: {
                      rate: rate,
                    },
                  });
                return accum;
              }, {} as any),
          };
        },
        ignore: () => {
          return {
            ...actionTypes
              .filter((type) => !ignoreHistoryForActions.includes(type))
              .reduce((accum, type) => {
                accum[type] = (...payload) =>
                  dispatch({
                    type: HISTORY_ACTIONS.IGNORE,
                    payload: [type, ...payload],
                  });
                return accum;
              }, {} as any),
          };
        },
      },
    };
  }, [methodsFactory]);

  const getState = useCallback(() => currState.current, []);
  const watcher = useMemo(() => new Watcher<S>(getState), [getState]);

  useEffect(() => {
    currState.current = state;
    watcher.notify();
  }, [state, watcher]);

  return useMemo(
    () => ({
      getState,
      subscribe: (collector, cb, collectOnCreate) =>
        watcher.subscribe(collector, cb, collectOnCreate),
      actions,
      query,
      history,
    }),
    [actions, query, watcher, getState, history]
  ) as any;
}

export function createQuery<Q extends QueryMethods>(
  queryMethods: Q,
  getState,
  history: History
) {
  const queries = Object.keys(queryMethods()).reduce((accum, key) => {
    return {
      ...accum,
      [key]: (...args: any) => {
        return queryMethods(getState())[key](...args);
      },
    };
  }, {} as QueryCallbacksFor<typeof queryMethods>);

  return {
    ...queries,
    history: {
      canUndo: () => history.canUndo(),
      canRedo: () => history.canRedo(),
    },
  };
}

class Watcher<S> {
  getState;
  subscribers: Subscriber[] = [];

  constructor(getState) {
    this.getState = getState;
  }

  /**
   * Creates a Subscriber
   * @returns {() => void} a Function that removes the Subscriber
   */
  subscribe<C>(
    collector: (state: S) => C,
    onChange: (collected: C) => void,
    collectOnCreate?: boolean
  ): () => void {
    const subscriber = new Subscriber(
      () => collector(this.getState()),
      onChange,
      collectOnCreate
    );
    this.subscribers.push(subscriber);
    return this.unsubscribe.bind(this, subscriber);
  }

  unsubscribe(subscriber) {
    if (this.subscribers.length) {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) return this.subscribers.splice(index, 1);
    }
  }

  notify() {
    this.subscribers.forEach((subscriber) => subscriber.collect());
  }
}

class Subscriber {
  collected: any;
  collector: () => any;
  onChange: (collected: any) => void;
  id;

  /**
   * Creates a Subscriber
   * @param collector The method that returns an object of values to be collected
   * @param onChange A callback method that is triggered when the collected values has changed
   * @param collectOnCreate If set to true, the collector/onChange will be called on instantiation
   */
  constructor(collector, onChange, collectOnCreate = false) {
    this.collector = collector;
    this.onChange = onChange;

    // Collect and run onChange callback when Subscriber is created
    if (collectOnCreate) this.collect();
  }

  collect() {
    try {
      const recollect = this.collector();
      if (!isEqualWith(recollect, this.collected)) {
        this.collected = recollect;
        if (this.onChange) this.onChange(this.collected);
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
