import React from 'react';
import { Element } from './Element';
export declare type Canvas<T extends React.ElementType> = Element<T>;
export declare const deprecateCanvasComponent: () => void;
export declare function Canvas<T extends React.ElementType>({ ...props }: Canvas<T>): JSX.Element;
