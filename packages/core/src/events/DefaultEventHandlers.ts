import throttle from 'lodash/throttle';

import { CoreEventHandlers } from './CoreEventHandlers';
import { createShadow } from './createShadow';

import { Indicator, NodeId, NodeTree, Node } from '../interfaces';
import { defineEventListener, CraftDOMEvent } from '../utils/Handlers';

export * from '../utils/Handlers';

type DraggedElement = NodeId | NodeTree;

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class DefaultEventHandlers extends CoreEventHandlers {
  static draggedElementShadow: HTMLElement;
  static draggedElement: DraggedElement;
  static indicator: Indicator = null;
  static lastDragPosition: { x: number; y: number } = null;

  onDragOver(x: number, y: number, targetId: NodeId) {
    const draggedElement = DefaultEventHandlers.draggedElement;
    if (!draggedElement) {
      return;
    }

    if (targetId) {
      const node = this.store.query.node(targetId).get();
      if (!node) {
        return;
      }
    }

    let node = (draggedElement as unknown) as Node;

    if ((draggedElement as NodeTree).rootNodeId) {
      const nodeTree = draggedElement as NodeTree;
      node = nodeTree.nodes[nodeTree.rootNodeId];
    }

    const indicator = this.store.query.getDropPlaceholder(node, targetId, {
      x,
      y,
    });

    if (!indicator) {
      return;
    }
    this.store.actions.setIndicator(indicator);
    DefaultEventHandlers.indicator = indicator;
  }

  throttledDragOver = throttle(this.onDragOver, 200, { leading: false });

  // Safely run handler if Node Id exists
  defineNodeEventListener(
    eventName: string,
    handler: (e: CraftDOMEvent<Event>, id: NodeId) => void,
    capture?: boolean
  ) {
    return defineEventListener(
      eventName,
      (e: CraftDOMEvent<Event>, id: NodeId) => {
        if (id) {
          const node = this.store.query.node(id).get();
          if (!node) {
            return;
          }
        }

        handler(e, id);
      },
      capture
    );
  }

  handlers() {
    return {
      connect: {
        init: (el, id) => {
          this.connectors().select(el, id);
          this.connectors().hover(el, id);
          this.connectors().drop(el, id);
          this.store.actions.setDOM(id, el);
        },
      },
      select: {
        init: () => () => this.store.actions.setNodeEvent('selected', null),
        events: [
          this.defineNodeEventListener(
            'mousedown',
            (e: CraftDOMEvent<MouseEvent>, id: NodeId) => {
              e.craft.stopPropagation();
              this.store.actions.setNodeEvent('selected', id);
            }
          ),
        ],
      },
      hover: {
        init: () => () => this.store.actions.setNodeEvent('hovered', null),
        events: [
          this.defineNodeEventListener(
            'mouseover',
            (e: CraftDOMEvent<MouseEvent>, id: NodeId) => {
              e.craft.stopPropagation();
              this.store.actions.setNodeEvent('hovered', id);
            }
          ),
        ],
      },
      drop: {
        events: [
          defineEventListener(
            'dragover',
            (e: CraftDOMEvent<MouseEvent>, targetId: NodeId) => {
              e.craft.stopPropagation();
              e.preventDefault();

              const { clientX: x, clientY: y } = e;
              if (
                DefaultEventHandlers.lastDragPosition &&
                DefaultEventHandlers.lastDragPosition.x === x &&
                DefaultEventHandlers.lastDragPosition.y === y
              ) {
                return;
              }
              DefaultEventHandlers.lastDragPosition = { x, y };

              const draggedElement = DefaultEventHandlers.draggedElement;
              if (!draggedElement) {
                return;
              }

              this.throttledDragOver(x, y, targetId);
            }
          ),
          this.defineNodeEventListener(
            'dragenter',
            (e: CraftDOMEvent<MouseEvent>, targetId: NodeId) => {
              e.craft.stopPropagation();
              e.preventDefault();

              const draggedElement = DefaultEventHandlers.draggedElement;
              if (!draggedElement) {
                return;
              }

              let node = (draggedElement as unknown) as Node;

              if ((draggedElement as NodeTree).rootNodeId) {
                const nodeTree = draggedElement as NodeTree;
                node = nodeTree.nodes[nodeTree.rootNodeId];
              }

              const { clientX: x, clientY: y } = e;
              const indicator = this.store.query.getDropPlaceholder(
                node,
                targetId,
                { x, y }
              );
              DefaultEventHandlers.lastDragPosition = { x, y };

              if (!indicator) {
                return;
              }
              this.store.actions.setIndicator(indicator);
              DefaultEventHandlers.indicator = indicator;
            }
          ),
        ],
      },

      drag: {
        init: (el, id) => {
          if (!this.store.query.node(id).isDraggable()) {
            return () => {};
          }

          el.setAttribute('draggable', 'true');
          return () => el.setAttribute('draggable', 'false');
        },
        events: [
          this.defineNodeEventListener(
            'dragstart',
            (e: CraftDOMEvent<DragEvent>, id: NodeId) => {
              e.craft.stopPropagation();
              this.store.actions.setNodeEvent('dragged', id);

              DefaultEventHandlers.draggedElementShadow = createShadow(e);
              DefaultEventHandlers.draggedElement = id;
            }
          ),
          defineEventListener('dragend', (e: CraftDOMEvent<DragEvent>) => {
            e.craft.stopPropagation();
            const onDropElement = (draggedElement, placement) => {
              const index =
                placement.index + (placement.where === 'after' ? 1 : 0);
              this.store.actions.move(
                draggedElement,
                placement.parent.id,
                index
              );
            };
            this.dropElement(onDropElement);
          }),
        ],
      },
      create: {
        init: (el) => {
          el.setAttribute('draggable', 'true');
          return () => el.removeAttribute('draggable');
        },
        events: [
          defineEventListener(
            'dragstart',
            (e: CraftDOMEvent<DragEvent>, userElement: React.ReactElement) => {
              e.craft.stopPropagation();
              const tree = this.store.query
                .parseReactElement(userElement)
                .toNodeTree();

              DefaultEventHandlers.draggedElementShadow = createShadow(e);
              DefaultEventHandlers.draggedElement = tree;
            }
          ),
          defineEventListener('dragend', (e: CraftDOMEvent<DragEvent>) => {
            e.craft.stopPropagation();
            const onDropElement = (draggedElement, placement) => {
              const index =
                placement.index + (placement.where === 'after' ? 1 : 0);
              this.store.actions.addNodeTree(
                draggedElement,
                placement.parent.id,
                index
              );
            };
            this.dropElement(onDropElement);
          }),
        ],
      },
    };
  }

  private dropElement(
    onDropNode: (
      draggedElement: DraggedElement,
      placement: Indicator['placement']
    ) => void
  ) {
    const {
      draggedElement,
      draggedElementShadow,
      indicator,
    } = DefaultEventHandlers;
    if (draggedElement && indicator && !indicator.error) {
      const { placement } = indicator;
      onDropNode(draggedElement, placement);
    }

    if (draggedElementShadow) {
      draggedElementShadow.parentNode.removeChild(draggedElementShadow);
      DefaultEventHandlers.draggedElementShadow = null;
    }

    DefaultEventHandlers.draggedElement = null;
    DefaultEventHandlers.indicator = null;

    this.store.actions.setIndicator(null);
    this.store.actions.setNodeEvent('dragged', null);
  }
}
