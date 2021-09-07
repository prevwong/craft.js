import { getDOMInfo } from '@craftjs/utils';

import findPosition from './findPosition';

import { EditorStore } from '../editor/store';
import {
  DragTarget,
  DropPosition,
  Indicator,
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
  private currentTargetDimensions: NodeInfo[] | null;
  private currentIndicator: Indicator | null = null;

  private dragError: string | null;
  private draggedNodes: NodeSelectorWrapper[];

  constructor(readonly store: EditorStore, readonly dragTarget: DragTarget) {
    this.currentTargetId = null;
    this.currentTargetDimensions = null;
    this.dragError = null;
    this.draggedNodes = getNodesFromSelector(
      this.store.query.getNodes(),
      dragTarget.type === 'new'
        ? dragTarget.tree.nodes[dragTarget.tree.rootNodeId]
        : dragTarget.nodes
    );

    if (dragTarget.type === 'new') {
      return;
    }

    // Check if the elements being dragged are allowed to be dragged
    // We don't need to check for dragTarget.type = "new" because those nodes are not yet in the state (ie: via the .create() connector)
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
    if (!this.currentIndicator) {
      return null;
    }

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
      newParentNode.data.parent
    ) {
      // Ignore if the current node is a linked node
      const isLinkedNode = this.store.query
        .node(newParentNode.id)
        .isLinkedNode();
      newParentNode = !isLinkedNode
        ? this.store.query.node(newParentNode.data.parent).get()
        : null;
    }

    if (!newParentNode || newParentNode.data.isCanvas === false) {
      return;
    }

    const dimensions =
      this.currentTargetId === dropTargetId
        ? this.currentTargetDimensions
        : newParentNode.data.nodes.reduce((result, id: NodeId) => {
            const dom = this.store.query.node(id).get().dom;

            if (dom) {
              result.push({
                id,
                ...getDOMInfo(dom),
              });
            }

            return result;
          }, [] as NodeInfo[]);

    this.currentTargetDimensions = dimensions;

    const position = findPosition(newParentNode, dimensions, x, y);

    // Ignore if the position is similar as the previous one
    if (!this.isDiff(position)) {
      return;
    }

    const currentNode =
      newParentNode.data.nodes.length &&
      this.store.query.node(newParentNode.data.nodes[position.index]).get();

    let error = this.dragError || false;

    // Last thing to check for is if the dragged nodes can be dropped in the target area
    if (!error) {
      this.store.query.node(newParentNode.id).isDroppable(
        this.draggedNodes.map((sourceNode) => sourceNode.node),
        (err) => {
          error = err;
        }
      );
    }

    const indicator = {
      placement: {
        ...position,
        currentNode,
      },
      error,
    };

    this.currentIndicator = indicator;

    return indicator;
  }

  getIndicator() {
    return this.currentIndicator;
  }
}
