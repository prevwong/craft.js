import { getDOMInfo, ROOT_NODE } from '@craftjs/utils';

import findPosition from './findPosition';

import { EditorStore } from '../editor/store';
import {
  DragTarget,
  DropPosition,
  Indicator,
  Node,
  NodeId,
  NodeInfo,
  NodeSelectorWrapper,
} from '../interfaces';
import { getNodesFromSelector } from '../utils/getNodesFromSelector';

/**
 * Positioner is responsible for computing the drop Indicator during a sequence of drag-n-drop events
 */
export class Positioner {
  static BORDER_OFFSET = 10;

  // Current Node being hovered on
  private currentDropTargetId: NodeId | null;
  // Current closest Canvas Node relative to the currentDropTarget
  private currentDropTargetCanvasAncestorId: NodeId | null;

  private currentIndicator: Indicator | null = null;

  private currentTargetId: NodeId | null;
  private currentTargetChildDimensions: NodeInfo[] | null;

  private dragError: string | null;
  private draggedNodes: NodeSelectorWrapper[];

  private onScrollListener: (e: Event) => void;

  constructor(readonly store: EditorStore, readonly dragTarget: DragTarget) {
    this.currentDropTargetId = null;
    this.currentDropTargetCanvasAncestorId = null;

    this.currentTargetId = null;
    this.currentTargetChildDimensions = null;

    this.currentIndicator = null;

    this.dragError = null;
    this.draggedNodes = this.getDraggedNodes();

    this.validateDraggedNodes();

    this.onScrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScrollListener, true);
  }

  cleanup() {
    window.removeEventListener('scroll', this.onScrollListener, true);
  }

  private onScroll(e: Event) {
    const scrollBody = e.target;
    const rootNode = this.store.query.node(ROOT_NODE).get();

    // Clear the currentTargetChildDimensions if the user has scrolled
    // Because we will have to recompute new dimensions relative to the new scroll pos
    const shouldClearChildDimensionsCache =
      scrollBody instanceof Element &&
      rootNode &&
      rootNode.dom &&
      scrollBody.contains(rootNode.dom);

    if (!shouldClearChildDimensionsCache) {
      return;
    }

    this.currentTargetChildDimensions = null;
  }

  private getDraggedNodes() {
    if (this.dragTarget.type === 'new') {
      return getNodesFromSelector(
        this.store.query.getNodes(),
        this.dragTarget.tree.nodes[this.dragTarget.tree.rootNodeId]
      );
    }

    return getNodesFromSelector(
      this.store.query.getNodes(),
      this.dragTarget.nodes
    );
  }

  // Check if the elements being dragged are allowed to be dragged
  private validateDraggedNodes() {
    // We don't need to check for dragTarget.type = "new" because those nodes are not yet in the state (ie: via the .create() connector)
    if (this.dragTarget.type === 'new') {
      return;
    }

    this.draggedNodes.forEach(({ node, exists }) => {
      if (!exists) {
        return;
      }

      this.store.query.node(node.id).isDraggable((err) => {
        this.dragError = err;
      });
    });
  }

  private isNearBorders(
    domInfo: ReturnType<typeof getDOMInfo>,
    x: number,
    y: number
  ) {
    const { top, bottom, left, right } = domInfo;

    if (
      top + Positioner.BORDER_OFFSET > y ||
      bottom - Positioner.BORDER_OFFSET < y ||
      left + Positioner.BORDER_OFFSET > x ||
      right - Positioner.BORDER_OFFSET < x
    ) {
      return true;
    }

    return false;
  }

  private isDiff(newPosition: DropPosition) {
    if (
      this.currentIndicator &&
      this.currentIndicator.placement.parent.id === newPosition.parent.id &&
      this.currentIndicator.placement.index === newPosition.index &&
      this.currentIndicator.placement.where === newPosition.where
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get dimensions of every child Node in the specified parent Node
   */
  private getChildDimensions(newParentNode: Node) {
    // Use previously computed child dimensions if newParentNode is the same as the previous one
    const existingTargetChildDimensions = this.currentTargetChildDimensions;
    if (
      this.currentTargetId === newParentNode.id &&
      existingTargetChildDimensions
    ) {
      return existingTargetChildDimensions;
    }

    return newParentNode.data.nodes.reduce((result, id: NodeId) => {
      const dom = this.store.query.node(id).get().dom;

      if (dom) {
        result.push({
          id,
          ...getDOMInfo(dom),
        });
      }

      return result;
    }, [] as NodeInfo[]);
  }

  /**
   * Get closest Canvas node relative to the dropTargetId
   * Return dropTargetId if it itself is a Canvas node
   *
   * In most cases it will be the dropTarget itself or its immediate parent.
   * We typically only need to traverse 2 levels or more if the dropTarget is a linked node
   *
   * TODO: We should probably have some special rules to handle linked nodes
   */
  private getCanvasAncestor(dropTargetId: NodeId) {
    // If the dropTargetId is the same as the previous one
    // Return the canvas ancestor node that we found previuously
    if (
      dropTargetId === this.currentDropTargetId &&
      this.currentDropTargetCanvasAncestorId
    ) {
      const node = this.store.query
        .node(this.currentDropTargetCanvasAncestorId)
        .get();

      if (node) {
        return node;
      }
    }

    const getCanvas = (nodeId: NodeId): Node => {
      const node = this.store.query.node(nodeId).get();

      if (node && node.data.isCanvas) {
        return node;
      }

      if (!node.data.parent) {
        return null;
      }

      return getCanvas(node.data.parent);
    };

    return getCanvas(dropTargetId);
  }

  /**
   * Compute a new Indicator object based on the dropTarget and x,y coords
   * Returns null if theres no change from the previous Indicator
   */
  computeIndicator(dropTargetId: NodeId, x: number, y: number): Indicator {
    let newParentNode = this.getCanvasAncestor(dropTargetId);

    if (!newParentNode) {
      return;
    }

    this.currentDropTargetId = dropTargetId;
    this.currentDropTargetCanvasAncestorId = newParentNode.id;

    // Get parent if we're hovering at the border of the current node
    if (
      newParentNode.data.parent &&
      this.isNearBorders(getDOMInfo(newParentNode.dom), x, y) &&
      // Ignore if linked node because there's won't be an adjacent sibling anyway
      !this.store.query.node(newParentNode.id).isLinkedNode()
    ) {
      newParentNode = this.store.query.node(newParentNode.data.parent).get();
    }

    if (!newParentNode) {
      return;
    }

    this.currentTargetChildDimensions = this.getChildDimensions(newParentNode);
    this.currentTargetId = newParentNode.id;

    const position = findPosition(
      newParentNode,
      this.currentTargetChildDimensions,
      x,
      y
    );

    // Ignore if the position is similar as the previous one
    if (!this.isDiff(position)) {
      return;
    }

    let error = this.dragError;

    // Last thing to check for is if the dragged nodes can be dropped in the target area
    if (!error) {
      this.store.query.node(newParentNode.id).isDroppable(
        this.draggedNodes.map((sourceNode) => sourceNode.node),
        (dropError) => {
          error = dropError;
        }
      );
    }

    const currentNodeId = newParentNode.data.nodes[position.index];
    const currentNode =
      currentNodeId && this.store.query.node(currentNodeId).get();

    this.currentIndicator = {
      placement: {
        ...position,
        currentNode,
      },
      error,
    };

    return this.currentIndicator;
  }

  getIndicator() {
    return this.currentIndicator;
  }
}
