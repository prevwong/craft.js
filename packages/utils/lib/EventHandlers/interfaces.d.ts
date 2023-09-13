import { EventHandlers } from './EventHandlers';
export declare type Connector = (el: HTMLElement, ...args: any) => any;
export declare type ConnectorsRecord = Record<string, Connector>;
export declare type ChainableConnector<T extends Connector, O extends any> = T extends (element: infer E, ...args: infer P) => any ? <B extends E | O>(element: B, ...args: P) => B : never;
export declare type ChainableConnectors<H extends ConnectorsRecord, E extends any = HTMLElement> = {
    [T in keyof H]: H[T] extends Connector ? ChainableConnector<H[T], E> : never;
};
export declare type CraftDOMEvent<T extends Event> = T & {
    craft: {
        stopPropagation: () => void;
        blockedEvents: Record<string, HTMLElement[]>;
    };
};
export declare type CraftEventListener<K extends keyof HTMLElementEventMap> = (ev: CraftDOMEvent<HTMLElementEventMap[K]>) => any;
export declare type EventHandlerConnectors<H extends EventHandlers, E extends any = HTMLElement> = ChainableConnectors<ReturnType<H['handlers']>, E>;
export declare type ConnectorsUsage<H extends EventHandlers> = {
    cleanup: () => void;
    connectors: EventHandlerConnectors<H>;
};
export declare enum EventHandlerUpdates {
    HandlerDisabled = 0,
    HandlerEnabled = 1
}
export declare type ConnectorToRegister = {
    name: string;
    required: any;
    connector: Connector;
    options?: Record<string, any>;
};
export declare type RegisteredConnector = {
    id: string;
    required: any;
    enable: () => void;
    disable: () => void;
    remove: () => void;
};
