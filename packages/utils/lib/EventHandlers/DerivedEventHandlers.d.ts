import { EventHandlers } from './EventHandlers';
import { EventHandlerConnectors } from './interfaces';
export declare abstract class DerivedEventHandlers<P extends EventHandlers, O extends Record<string, any> = {}> extends EventHandlers<O> {
    derived: P;
    unsubscribeParentHandlerListener: () => void;
    constructor(derived: P, options?: O);
    inherit(cb: (connectors: EventHandlerConnectors<P>) => void): () => void;
    cleanup(): void;
}
