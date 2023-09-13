import { SubscriberAndCallbacksFor } from './useMethods';
import { ConditionallyMergeRecordTypes } from './utilityTypes';
declare type CollectorMethods<S extends SubscriberAndCallbacksFor<any, any>> = {
    actions: S['actions'];
    query: S['query'];
};
export declare type useCollectorReturnType<S extends SubscriberAndCallbacksFor<any, any>, C = null> = ConditionallyMergeRecordTypes<C, CollectorMethods<S>>;
export declare function useCollector<S extends SubscriberAndCallbacksFor<any, any>, C>(store: S, collector?: (state: ReturnType<S['getState']>['current'], query: S['query']) => C): useCollectorReturnType<S, C>;
export {};
