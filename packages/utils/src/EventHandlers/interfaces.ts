import { EventHandlers } from './EventHandlers';

export type Connector = (el: HTMLElement, ...args: any) => any;

export type ConnectorsRecord = Record<string, Connector>;

export type ChainableConnector<T extends Connector, O extends any> = T extends (
  element: infer E,
  ...args: infer P
) => any
  ? <B extends E | O>(element: B, ...args: P) => B
  : never;

export type ChainableConnectors<
  H extends ConnectorsRecord,
  E extends any = HTMLElement
> = {
  [T in keyof H]: H[T] extends Connector ? ChainableConnector<H[T], E> : never;
};

export type CraftDOMEvent<T extends Event> = T & {
  craft: {
    stopPropagation: () => void;
    blockedEvents: Record<string, HTMLElement[]>;
  };
};

export type CraftEventListener<K extends keyof HTMLElementEventMap> = (
  ev: CraftDOMEvent<HTMLElementEventMap[K]>
) => any;

export type EventHandlerConnectors<
  H extends EventHandlers,
  E extends any = HTMLElement
> = ChainableConnectors<ReturnType<H['handlers']>, E>;

export type ConnectorsUsage<H extends EventHandlers> = {
  register: () => void;
  cleanup: () => void;
  connectors: EventHandlerConnectors<H>;
};

export enum EventHandlerUpdates {
  HandlerDisabled,
  HandlerEnabled,
}

export type ConnectorToRegister = {
  name: string;
  required: any;
  connector: Connector;
  options?: Record<string, any>;
};

export type RegisteredConnector = {
  id: string;
  required: any;
  enable: () => void;
  disable: () => void;
  remove: () => void;
};
