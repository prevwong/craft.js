import React from 'react';
import { NodeData, SerializedNode, ReducedComp } from '../interfaces';
declare type DeserialisedType = JSX.Element & {
    name: string;
};
export declare const deserializeComp: (data: ReducedComp, resolver: Record<string, string | React.ComponentClass<any, any> | React.FunctionComponent<any>>, index?: number) => void | DeserialisedType;
export declare const deserializeNode: (data: SerializedNode, resolver: Record<string, string | React.ComponentClass<any, any> | React.FunctionComponent<any>>) => Pick<NodeData, "type" | "name" | "props" | "displayName" | "isCanvas" | "parent" | "linkedNodes" | "nodes" | "hidden" | "custom" | "_childCanvas">;
export {};
