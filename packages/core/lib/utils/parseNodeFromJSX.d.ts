import React from 'react';
import { Node } from '../interfaces';
export declare function parseNodeFromJSX(jsx: React.ReactElement | string, normalize?: (node: Node, jsx: React.ReactElement) => void): Node;
