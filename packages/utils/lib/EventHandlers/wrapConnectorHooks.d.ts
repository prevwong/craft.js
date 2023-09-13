/// <reference types="react" />
import { ChainableConnectors, ConnectorsRecord } from './interfaces';
export declare function cloneWithRef(element: any, newRef: any): React.ReactElement<any>;
export declare function wrapHookToRecognizeElement(hook: (node: any, ...args: any[]) => void): (elementOrNode?: any, ...args: any) => any;
export declare function wrapConnectorHooks<H extends ConnectorsRecord>(connectors: H): ChainableConnectors<H, React.ReactElement | HTMLElement>;
