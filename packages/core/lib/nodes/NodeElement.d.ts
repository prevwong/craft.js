import React from 'react';
import { NodeId } from '../interfaces';
export declare type NodeElementProps = {
    id: NodeId;
    render?: React.ReactElement;
};
export declare const NodeElement: React.FC<NodeElementProps>;
