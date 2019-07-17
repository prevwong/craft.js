import produce, { PatchListener } from 'immer';
import { createStore, Unsubscribe } from 'redux';

type Subscriber = (listener: () => void) => Unsubscribe
export type QueryParameters<Q extends Methods> = Partial<Parameters<Q>> & Array<any>

export type SubscriberAndCallbacksFor<M extends MethodsOrOptions, Q extends QueryMethods> = [
  Subscriber,
  () => { prev: StateFor<M>, current: StateFor<M> },
  (...payload: QueryParameters<Q>) => QueryCallbacksFor<Q>,
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

export type Methods<S = any, R extends MethodRecordBase<S> = any> = (state?: S) => R;

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


export type QueryMethods<S = any, O=any, R extends MethodRecordBase<S> = any> = (state?: S, options?: O) => R;
export type QueryCallbacksFor<M extends QueryMethods> = M extends QueryMethods<any, any, infer R>
  ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => ReturnType<R[T]>
  }
  : never;

export default function createReduxMethods<S, R extends MethodRecordBase<S>, Q extends QueryMethods>(
  methodsOrOptions: MethodsOrOptions<S, R>,
  queryHelper: Q,
  initialState: any
): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q> {

  let prevState = initialState;
  let methods: Methods<S, R>;
  let patchListener: PatchListener | undefined;
  if (typeof methodsOrOptions === 'function') {
    methods = methodsOrOptions;
  } else {
    methods = methodsOrOptions.methods;
    patchListener = methodsOrOptions.patchListener;
  }
  const reducer = (state: S, action: ActionUnion<R>) => {
    return (produce as Function)(
      state,
      (draft: S) => {
        if (methods(draft)[action.type]) {
          return methods(draft)[action.type](...action.payload)
        }
      },
      patchListener,
    );
  }
  const methodsFactory = methods;

  const { state, dispatch, subscribe, getState } = createStore(reducer, initialState);
  const actionTypes: ActionUnion<R>['type'][] = Object.keys(methodsFactory(state));
  const actions = actionTypes.reduce(
    (accum, type) => {
      accum[type] = (...payload) => {

        prevState = { ...getState() };

        return dispatch({ type, payload } as ActionUnion<R>)
      };
      return accum;
    },
    {} as CallbacksFor<typeof methodsFactory>,
  );


  return [
    subscribe,
    () => ({ prev: prevState, current: getState() }),
    queryHelper,
    actions
  ];
}