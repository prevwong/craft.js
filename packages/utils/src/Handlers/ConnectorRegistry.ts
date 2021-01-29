import isEqual from 'shallowequal';
import shortid from 'shortid';

type ConnectorToRegister = {
  name: string;
  opts: any;
  connector: any;
};

type RegisteredConnector = {
  opts: any;
  enable: () => void;
  disable: () => void;
};

export class ConnectorRegistry {
  _elementIdMap: WeakMap<HTMLElement, string> = new WeakMap();
  _registry: Map<String, RegisteredConnector> = new Map();

  private getElementId(element: HTMLElement) {
    const existingId = this._elementIdMap.get(element);
    if (existingId) {
      return existingId;
    }

    const newId = shortid();
    this._elementIdMap.set(element, newId);
    return newId;
  }

  private getConnectorId(element: HTMLElement, connectorName: string) {
    const elementId = this.getElementId(element);
    return `${connectorName}--${elementId}`;
  }

  register(element: HTMLElement, toRegister: ConnectorToRegister) {
    if (this.get(element, toRegister.name)) {
      if (isEqual(toRegister.opts, this.get(element, toRegister.name).opts)) {
        return;
      }

      this.get(element, toRegister.name).disable();
    }

    let cleanup;
    this._registry.set(this.getConnectorId(element, toRegister.name), {
      opts: toRegister.opts,
      enable: () => {
        cleanup = toRegister.connector(element, toRegister.opts);
      },
      disable: () => {
        if (!cleanup) {
          return;
        }

        cleanup();
      },
    });

    this._registry.get(this.getConnectorId(element, toRegister.name)).enable();
  }

  get(element: HTMLElement, name: string) {
    return this._registry.get(this.getConnectorId(element, name));
  }

  enable() {
    this._registry.forEach((connectors) => {
      connectors.enable();
    });
  }

  disable() {
    this._registry.forEach((connectors) => {
      connectors.disable();
    });
  }

  clear() {
    this._elementIdMap = new WeakMap();
    this._registry.clear();
  }
}
