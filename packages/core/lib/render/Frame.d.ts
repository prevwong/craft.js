import React from 'react';
import { SerializedNodes } from '../interfaces';
export declare type Frame = {
    json?: string;
    data?: string | SerializedNodes;
};
/**
 * A React Component that defines the editable area
 */
export declare const Frame: React.FC<Frame>;
