import { ConnectorToRegister, RegisteredConnector } from './interfaces';
/**
 * Stores all connected DOM elements and their connectors here
 * This allows us to easily enable/disable and perform cleanups
 */
export declare class ConnectorRegistry {
    private elementIdMap;
    private registry;
    private getElementId;
    private getConnectorId;
    register(element: HTMLElement, connectorPayload: ConnectorToRegister): RegisteredConnector;
    get(id: string): RegisteredConnector;
    remove(id: string): void;
    enable(): void;
    disable(): void;
    getByElement(element: HTMLElement, connectorName: string): RegisteredConnector;
    removeByElement(element: HTMLElement, connectorName: string): void;
    clear(): void;
}
