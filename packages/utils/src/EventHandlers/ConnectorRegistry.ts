import isEqual from 'shallowequal';

import { Connector } from './interfaces';

import { getRandomId } from '../getRandomId';

type ConnectorToRegister = {
  name: string;
  required: any;
  options?: Record<string, any>;
  connector: Connector;
};

type RegisteredConnector = {
  id: string;
  required: any;
  enable: () => void;
  disable: () => void;
};

/**
 * Stores all connected DOM elements and their connectors here
 * This allows us to easily enable/disable and perform cleanups
 */
export class ConnectorRegistry {
  private elementIdMap: WeakMap<HTMLElement, string> = new WeakMap();
  private registry: Map<String, RegisteredConnector> = new Map();

  private getElementId(element: HTMLElement) {
    const existingId = this.elementIdMap.get(element);
    if (existingId) {
      return existingId;
    }

    const newId = getRandomId();

    this.elementIdMap.set(element, newId);
    return newId;
  }

  private getConnectorId(element: HTMLElement, connectorName: string) {
    const elementId = this.getElementId(element);
    return `${connectorName}--${elementId}`;
  }

  register(element: HTMLElement, toRegister: ConnectorToRegister) {
    if (this.get(element, toRegister.name)) {
      if (
        isEqual(
          toRegister.required,
          this.get(element, toRegister.name).required
        )
      ) {
        return () => this.remove(element, toRegister.name);
      }

      this.get(element, toRegister.name).disable();
    }

    let cleanup: () => void | null = null;

    const id = this.getConnectorId(element, toRegister.name);
    this.registry.set(id, {
      id,
      required: toRegister.required,
      enable: () => {
        if (cleanup) {
          cleanup();
        }

        cleanup = toRegister.connector(
          element,
          toRegister.required,
          toRegister.options
        );
      },
      disable: () => {
        if (!cleanup) {
          return;
        }

        cleanup();
      },
    });

    this.registry.get(id).enable();

    return () => this.remove(element, toRegister.name);
  }

  get(element: HTMLElement, name: string) {
    return this.registry.get(this.getConnectorId(element, name));
  }

  enable() {
    this.registry.forEach((connectors) => {
      connectors.enable();
    });
  }

  disable() {
    this.registry.forEach((connectors) => {
      connectors.disable();
    });
  }

  remove(element: HTMLElement, name: string) {
    const connector = this.get(element, name);
    if (!connector) {
      return;
    }

    connector.disable();
    this.registry.delete(connector.id);
  }

  clear() {
    this.disable();
    this.elementIdMap = new WeakMap();
    this.registry = new Map();
  }
}
