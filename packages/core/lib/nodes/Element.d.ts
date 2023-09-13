import React from 'react';
import { NodeId } from '../interfaces';
export declare const defaultElementProps: {
    is: string;
    canvas: boolean;
    custom: {};
    hidden: boolean;
};
export declare const elementPropToNodeData: {
    is: string;
    canvas: string;
};
export declare type Element<T extends React.ElementType> = {
    id?: NodeId;
    is?: T;
    custom?: Record<string, any>;
    children?: React.ReactNode;
    canvas?: boolean;
} & React.ComponentProps<T>;
export declare function Element<T extends React.ElementType>({ id, children, ...elementProps }: Element<T>): JSX.Element;
