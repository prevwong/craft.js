import { getDOMInfo } from '@craftjs/utils';

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

  private currentTargetId: NodeId | null;
  private currentTargetChildDimensions: NodeInfo[] | null;
  private currentIndicator: Indicator | null = null;

  private dragError: string | null;
  private draggedNodes: NodeSelectorWrapper[];

  constructor(readonly store: EditorStore, readonly dragTarget: DragTarget) {
    this.currentTargetId = null;
    this.currentTargetChildDimensions = null;
    this.dragError = null;
    this.draggedNodes = this.getDraggedNodes();

    this.validateDraggedNodes();
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

  private getNodeAtDropPosition(
    childrenDimensions: NodeInfo[],
    position: DropPosition
  ) {
    let currentNodeId =
      childrenDimensions[position.index] &&
      childrenDimensions[position.index].id;

    if (!currentNodeId) {
      return;
    }

    return this.store.query.node(currentNodeId).get();
  }

  /**
   * Get dimensions of every child Node in the specified parent Node
   */
  private getChildDimensions(newParentNode: Node) {
    // Return the previous dimensions
    // if the input drop target is the same as the previous one
    if (
      this.currentTargetId === newParentNode.id &&
      this.currentTargetChildDimensions
    ) {
      return this.currentTargetChildDimensions;
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
   * Compute a new Indicator object based on the dropTarget and x,y coords
   * Returns null if theres no change from the previous Indicator
   */
  computeIndicator(dropTargetId: NodeId, x: number, y: number): Indicator {
    let newParentNode = this.store.query.node(dropTargetId).get();

    if (!newParentNode) {
      return;
    }

    // Get parent if we're hovering at the border of the current node
    if (
      this.isNearBorders(getDOMInfo(newParentNode.dom), x, y) &&
      newParentNode.data.parent &&
      // Ignore if linked node because there's won't be an adjacent sibling anyway
      !this.store.query.node(newParentNode.id).isLinkedNode()
    ) {
      newParentNode = this.store.query.node(newParentNode.data.parent).get();
    }

    if (
      !newParentNode ||
      // Note: Even though the target Node may not be a Canvas Node
      // But it might have linked canvas Nodes which we might want to take into consideration in the future
      newParentNode.data.isCanvas === false
    ) {
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

    const currentNode = this.getNodeAtDropPosition(
      this.currentTargetChildDimensions,
      position
    );

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
