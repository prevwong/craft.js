/// <reference types="react" />
import { SubscriberAndCallbacksFor } from '@craftjs/utils';
import { LayerMethods } from './actions';
export declare type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export declare type LayerManagerContext = {
  store: LayerStore;
};
export declare const LayerManagerContext: import('react').Context<LayerManagerContext>;
