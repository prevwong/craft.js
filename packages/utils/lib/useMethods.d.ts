import { Patch } from 'immer';
import { History } from './History';
import { Delete } from './utilityTypes';
export declare type SubscriberAndCallbacksFor<M extends MethodsOrOptions, Q extends QueryMethods = any> = {
    subscribe: Watcher<StateFor<M>>['subscribe'];
    getState: () => {
        prev: StateFor<M>;
        current: StateFor<M>;
    };
    actions: CallbacksFor<M>;
    query: QueryCallbacksFor<Q>;
    history: History;
};
export declare type StateFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<infer S, any> ? S : never;
export declare type CallbacksFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<any, infer R> ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => void;
} & {
    history: {
        undo: () => void;
        redo: () => void;
        clear: () => void;
        throttle: (rate?: number) => Delete<{
            [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => void;
        }, M extends Options ? M['ignoreHistoryForActions'][number] : never>;
        merge: () => Delete<{
            [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => void;
        }, M extends Options ? M['ignoreHistoryForActions'][number] : never>;
        ignore: () => Delete<{
            [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => void;
        }, M extends Options ? M['ignoreHistoryForActions'][number] : never>;
    };
} : {};
export declare type Methods<S = any, R extends MethodRecordBase<S> = any, Q = any> = (state: S, query: Q) => R;
export declare type Options<S = any, R extends MethodRecordBase<S> = any, Q = any> = {
    methods: Methods<S, R, Q>;
    ignoreHistoryForActions: ReadonlyArray<keyof MethodRecordBase>;
    normalizeHistory?: (state: S) => void;
};
export declare type MethodsOrOptions<S = any, R extends MethodRecordBase<S> = any, Q = any> = Methods<S, R, Q> | Options<S, R, Q>;
export declare type MethodRecordBase<S = any> = Record<string, (...args: any[]) => S extends object ? S | void : S>;
export declare type Action<T = any, P = any> = {
    type: T;
    payload?: P;
    config?: Record<string, any>;
};
export declare type ActionUnion<R extends MethodRecordBase> = {
    [T in keyof R]: {
        type: T;
        payload: Parameters<R[T]>;
    };
}[keyof R];
export declare type ActionByType<A, T> = A extends {
    type: infer T2;
} ? T extends T2 ? A : never : never;
export declare type QueryMethods<S = any, O = any, R extends MethodRecordBase<S> = any> = (state?: S, options?: O) => R;
export declare type QueryCallbacksFor<M extends QueryMethods> = M extends QueryMethods<any, any, infer R> ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => ReturnType<R[T]>;
} & {
    history: {
        canUndo: () => boolean;
        canRedo: () => boolean;
    };
} : {};
export declare type PatchListenerAction<S, M extends MethodsOrOptions> = {
    type: keyof CallbacksFor<M>;
    params: any;
    patches: Patch[];
};
export declare type PatchListener<S, M extends MethodsOrOptions, Q extends QueryMethods> = (newState: S, previousState: S, actionPerformedWithPatches: PatchListenerAction<S, M>, query: QueryCallbacksFor<Q>, normalizer: (cb: (draft: S) => void) => void) => void;
export declare function useMethods<S, R extends MethodRecordBase<S>>(methodsOrOptions: MethodsOrOptions<S, R>, // methods to manipulate the state
initialState: any): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>>;
export declare function useMethods<S, R extends MethodRecordBase<S>, Q extends QueryMethods>(methodsOrOptions: MethodsOrOptions<S, R, QueryCallbacksFor<Q>>, // methods to manipulate the state
initialState: any, queryMethods: Q): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q>;
export declare function useMethods<S, R extends MethodRecordBase<S>, Q extends QueryMethods>(methodsOrOptions: MethodsOrOptions<S, R, QueryCallbacksFor<Q>>, // methods to manipulate the state
initialState: any, queryMethods: Q, patchListener: PatchListener<S, MethodsOrOptions<S, R, QueryCallbacksFor<Q>>, Q>): SubscriberAndCallbacksFor<MethodsOrOptions<S, R>, Q>;
export declare function createQuery<Q extends QueryMethods>(queryMethods: Q, getState: any, history: History): QueryCallbacksFor<Q> & {
    history: {
        canUndo: () => boolean;
        canRedo: () => boolean;
    };
};
declare class Watcher<S> {
    getState: any;
    subscribers: Subscriber[];
    constructor(getState: any);
    /**
     * Creates a Subscriber
     * @returns {() => void} a Function that removes the Subscriber
     */
    subscribe<C>(collector: (state: S) => C, onChange: (collected: C) => void, collectOnCreate?: boolean): () => void;
    unsubscribe(subscriber: any): Subscriber[];
    notify(): void;
}
declare class Subscriber {
    collected: any;
    collector: () => any;
    onChange: (collected: any) => void;
    id: any;
    /**
     * Creates a Subscriber
     * @param collector The method that returns an object of values to be collected
     * @param onChange A callback method that is triggered when the collected values has changed
     * @param collectOnCreate If set to true, the collector/onChange will be called on instantiation
     */
    constructor(collector: any, onChange: any, collectOnCreate?: boolean);
    collect(): void;
}
export {};
