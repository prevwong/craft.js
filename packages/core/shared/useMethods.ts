import produce, { PatchListener } from 'immer';
import { Reducer, useMemo, useReducer, useRef } from 'react';
import { createStore, Unsubscribe } from 'redux';

export type StateAndCallbacksFor<M extends MethodsOrOptions> = [StateFor<M>, CallbacksFor<M>];

type Subscriber = (listener: () => void) => Unsubscribe
export type SubscriberAndCallbacksFor<M extends MethodsOrOptions> = [
  Subscriber, 
  () => { prev: StateFor<M>, current: StateFor<M>}, 
  CallbacksFor<M>
];

export type StateFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<infer S, any>
  ? S
  : never;

export type CallbacksFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<any, infer R>
  ? {
    [T in ActionUnion<R>['type']]: (
      ...payload: ActionByType<ActionUnion<R>, T>['payload']
    ) => void
  }
  : never;

export type Methods<S = any, R extends MethodRecordBase<S> = any> = (state: S) => R;

export type Options<S = any, R extends MethodRecordBase<S> = any> = {
  methods: Methods<S, R>;
  patchListener?: PatchListener;
};

export type MethodsOrOptions<S = any, R extends MethodRecordBase<S> = any> =
  | Methods<S, R>
  | Options<S, R>;

export type MethodRecordBase<S = any> = Record<
  string,
  (...args: any[]) => S extends object ? S | void : S
>;

export type ActionUnion<R extends MethodRecordBase> = {
  [T in keyof R]: { type: T; payload: Parameters<R[T]> }
}[keyof R];

export type ActionByType<A, T> = A extends { type: infer T2 } ? (T extends T2 ? A : never) : never;

export default function useMethods<S, R extends MethodRecordBase<S>>(
  methodsOrOptions: MethodsOrOptions<S, R>,
  initialState: S,
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>>;
export default function useMethods<S, R extends MethodRecordBase<S>>(
  methodsOrOptions: MethodsOrOptions<S, R>,
  initialState: any
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>> {
  const prevState = useRef(initialState);
  const [reducer, methodsFactory] = useMemo<[Reducer<S, ActionUnion<R>>, Methods<S, R>]>(() => {
    let methods: Methods<S, R>;
    let patchListener: PatchListener | undefined;
    if (typeof methodsOrOptions === 'function') {
      methods = methodsOrOptions;
    } else {
      methods = methodsOrOptions.methods;
      patchListener = methodsOrOptions.patchListener;
    }
    return [
      (state: S, action: ActionUnion<R>) => {
        return (produce as Function)(
          state,
          (draft: S) => {
            if (methods(draft)[action.type]) {
              return methods(draft)[action.type](...action.payload)
            }
          },
          patchListener,
        );
      },
      methods,
    ];
  }, [methodsOrOptions]);

  const store: SubscriberAndCallbacksFor<Methods<S,R>> = useMemo(() => {
    const { state, dispatch, subscribe, getState } = createStore(reducer as any, initialState);
      const actionTypes: ActionUnion<R>['type'][] = Object.keys(methodsFactory(state));

      const actions =  actionTypes.reduce(
        (accum, type) => {
          accum[type] = (...payload) => {
            prevState.current = getState();
            return dispatch({ type, payload } as ActionUnion<R>)
          };
          return accum;
        },
        {} as CallbacksFor<typeof methodsFactory>,
      );

    return [
      subscribe,
      () => ({ prev: prevState.current, current: getState()}),
      actions
    ]
  }, []);

  return store;
}