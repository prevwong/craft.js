import { Patch } from 'immer';
declare type Timeline = Array<{
    patches: Patch[];
    inversePatches: Patch[];
    timestamp: number;
}>;
export declare const HISTORY_ACTIONS: {
    UNDO: string;
    REDO: string;
    THROTTLE: string;
    IGNORE: string;
    MERGE: string;
    CLEAR: string;
};
export declare class History {
    timeline: Timeline;
    pointer: number;
    add(patches: Patch[], inversePatches: Patch[]): void;
    throttleAdd(patches: Patch[], inversePatches: Patch[], throttleRate?: number): void;
    merge(patches: Patch[], inversePatches: Patch[]): void;
    clear(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    undo(state: any): any;
    redo(state: any): any;
}
export {};
