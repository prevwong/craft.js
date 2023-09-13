import { EventHandlerUpdates, CraftEventListener, EventHandlerConnectors, ConnectorsUsage } from './interfaces';
export declare abstract class EventHandlers<O extends Record<string, any> = {}> {
    options: O;
    private registry;
    private subscribers;
    onEnable?(): void;
    onDisable?(): void;
    constructor(options?: O);
    listen(cb: (msg: EventHandlerUpdates) => void): () => boolean;
    disable(): void;
    enable(): void;
    cleanup(): void;
    addCraftEventListener<K extends keyof HTMLElementEventMap>(el: HTMLElement, eventName: K, listener: CraftEventListener<K>, options?: boolean | AddEventListenerOptions): () => void;
    abstract handlers(): Record<string, (el: HTMLElement, ...args: any[]) => any>;
    /**
     * Creates a record of chainable connectors and tracks their usages
     */
    createConnectorsUsage(): ConnectorsUsage<this>;
    derive<C extends EventHandlers>(type: {
        new (...args: any[]): C;
    }, opts: C['options']): C;
    protected createProxyHandlers<H extends EventHandlers>(instance: H, cb: (connectors: EventHandlerConnectors<H>) => void): () => void;
    reflect(cb: (connectors: EventHandlerConnectors<this>) => void): () => void;
}
