import isEqual from 'shallowequal';
import shortid from 'shortid';

import { Connector } from './interfaces';

type ConnectorToRegister = {
  name: string;
  required: any;
  options?: Record<string, any>;
  connector: Connector;
};

type RegisteredConnector = {
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

    const newId = shortid();
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
        return;
      }

      this.get(element, toRegister.name).disable();
    }

    let cleanup: () => void | null = null;

    this.registry.set(this.getConnectorId(element, toRegister.name), {
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

    this.registry.get(this.getConnectorId(element, toRegister.name)).enable();
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

  clear() {
    this.elementIdMap = new WeakMap();
    this.registry.clear();
  }
}
