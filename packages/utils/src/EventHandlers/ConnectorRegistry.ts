import isEqual from 'shallowequal';

import { ConnectorToRegister, RegisteredConnector } from './interfaces';

import { getRandomId } from '../getRandomId';

/**
 * Stores all connected DOM elements and their connectors here
 * This allows us to easily enable/disable and perform cleanups
 */
export class ConnectorRegistry {
  private isEnabled: boolean = true;

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

  getConnectorId(element: HTMLElement, connectorName: string) {
    const elementId = this.getElementId(element);
    return `${connectorName}--${elementId}`;
  }

  register(element: HTMLElement, connectorPayload: ConnectorToRegister) {
    const existingConnector = this.getByElement(element, connectorPayload.name);

    if (existingConnector) {
      if (isEqual(connectorPayload.required, existingConnector.required)) {
        return existingConnector;
      }

      this.getByElement(element, connectorPayload.name).disable();
    }

    let cleanup: () => void | null = null;

    const id = this.getConnectorId(element, connectorPayload.name);
    this.registry.set(id, {
      id,
      required: connectorPayload.required,
      enable: () => {
        if (cleanup) {
          cleanup();
        }

        cleanup = connectorPayload.connector(
          element,
          connectorPayload.required,
          connectorPayload.options
        );
      },
      disable: () => {
        if (!cleanup) {
          return;
        }

        cleanup();
      },
      remove: () => {
        return this.remove(id);
      },
    });

    if (this.isEnabled) {
      this.registry.get(id).enable();
    }

    return this.registry.get(id);
  }

  get(id: string) {
    return this.registry.get(id);
  }

  remove(id: string) {
    const connector = this.get(id);
    if (!connector) {
      return;
    }

    connector.disable();
    this.registry.delete(connector.id);
  }

  enable() {
    this.isEnabled = true;
    this.registry.forEach((connectors) => {
      connectors.enable();
    });
  }

  disable() {
    this.isEnabled = false;
    this.registry.forEach((connectors) => {
      connectors.disable();
    });
  }

  getByElement(element: HTMLElement, connectorName: string) {
    return this.get(this.getConnectorId(element, connectorName));
  }

  removeByElement(element: HTMLElement, connectorName: string) {
    return this.remove(this.getConnectorId(element, connectorName));
  }

  clear() {
    this.disable();
    this.elementIdMap = new WeakMap();
    this.registry = new Map();
  }
}
