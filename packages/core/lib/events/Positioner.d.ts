import { EditorStore } from '../editor/store';
import { DragTarget, Indicator, NodeId } from '../interfaces';
/**
 * Positioner is responsible for computing the drop Indicator during a sequence of drag-n-drop events
 */
export declare class Positioner {
    readonly store: EditorStore;
    readonly dragTarget: DragTarget;
    static BORDER_OFFSET: number;
    private currentDropTargetId;
    private currentDropTargetCanvasAncestorId;
    private currentIndicator;
    private currentTargetId;
    private currentTargetChildDimensions;
    private dragError;
    private draggedNodes;
    private onScrollListener;
    constructor(store: EditorStore, dragTarget: DragTarget);
    cleanup(): void;
    private onScroll;
    private getDraggedNodes;
    private validateDraggedNodes;
    private isNearBorders;
    private isDiff;
    /**
     * Get dimensions of every child Node in the specified parent Node
     */
    private getChildDimensions;
    /**
     * Get closest Canvas node relative to the dropTargetId
     * Return dropTargetId if it itself is a Canvas node
     *
     * In most cases it will be the dropTarget itself or its immediate parent.
     * We typically only need to traverse 2 levels or more if the dropTarget is a linked node
     *
     * TODO: We should probably have some special rules to handle linked nodes
     */
    private getCanvasAncestor;
    /**
     * Compute a new Indicator object based on the dropTarget and x,y coords
     * Returns null if theres no change from the previous Indicator
     */
    computeIndicator(dropTargetId: NodeId, x: number, y: number): Indicator;
    getIndicator(): Indicator;
}
