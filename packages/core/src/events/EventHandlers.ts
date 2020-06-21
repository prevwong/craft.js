import { createShadow } from './createShadow';
import { Indicator, NodeId, NodeTree } from '../interfaces';
import {
  ConnectorsForHandlers,
  defineEventListener,
  Handlers,
} from '@craftjs/utils';
import { EditorStore } from '../editor/store';

type DraggedElement = NodeId | NodeTree;

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class EventHandlers extends Handlers<
  'select' | 'hover' | 'drag' | 'drop' | 'create'
> {
  static draggedElementShadow: HTMLElement;
  static draggedElement: DraggedElement;
  static events: { indicator: Indicator };

  handlers() {
    return {
      select: {
        init: () => () => this.store.actions.setNodeEvent('selected', null),
        events: [
          defineEventListener(
            'mousedown',
            (e, id: NodeId) => {
              this.store.actions.setNodeEvent('selected', id);
            },
            { blocking: true }
          ),
        ],
      },
      hover: {
        init: () => () => this.store.actions.setNodeEvent('hovered', null),
        events: [
          defineEventListener(
            'mouseover',
            (e, id: NodeId) => {
              this.store.actions.setNodeEvent('hovered', id);
            },
            { blocking: true }
          ),
        ],
      },
      drop: {
        events: [
          defineEventListener(
            'dragover',
            (e: MouseEvent) => {
              e.preventDefault();
            },
            { blocking: true }
          ),
          defineEventListener(
            'dragenter',
            (e: MouseEvent, targetId: NodeId) => {
              e.preventDefault();

              const draggedElement = EventHandlers.draggedElement as NodeTree;
              if (!draggedElement) {
                return;
              }

              const node = draggedElement.rootNodeId
                ? draggedElement.nodes[draggedElement.rootNodeId]
                : draggedElement;
              const { clientX: x, clientY: y } = e;
              const indicator = this.store.query.getDropPlaceholder(
                node,
                targetId,
                { x, y }
              );

              if (!indicator) {
                return;
              }
              this.store.actions.setIndicator(indicator);
              EventHandlers.events = { indicator };
            },
            { blocking: true }
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
          defineEventListener(
            'dragstart',
            (e: DragEvent, id: NodeId) => {
              this.store.actions.setNodeEvent('dragged', id);

              EventHandlers.draggedElementShadow = createShadow(e);
              EventHandlers.draggedElement = id;
            },
            { blocking: true }
          ),
          defineEventListener(
            'dragend',
            (e: DragEvent) => {
              const onDropElement = (draggedElement, placement) =>
                this.store.actions.move(
                  draggedElement as NodeId,
                  placement.parent.id,
                  placement.index + (placement.where === 'after' ? 1 : 0)
                );
              this.dropElement(onDropElement);
            },
            { blocking: true }
          ),
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
            (e: DragEvent, userElement: React.ReactElement) => {
              const tree = this.store.query
                .parseReactElement(userElement)
                .toNodeTree();

              EventHandlers.draggedElementShadow = createShadow(e);
              EventHandlers.draggedElement = tree;
            },
            { blocking: true }
          ),
          defineEventListener(
            'dragend',
            (e: DragEvent) => {
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
            },
            { blocking: true }
          ),
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
    const { draggedElement, draggedElementShadow, events } = EventHandlers;
    if (
      draggedElement &&
      events &&
      events.indicator &&
      !events.indicator.error
    ) {
      const { placement } = events.indicator;
      onDropNode(draggedElement, placement);
    }

    if (draggedElementShadow) {
      draggedElementShadow.parentNode.removeChild(draggedElementShadow);
      EventHandlers.draggedElementShadow = null;
    }

    EventHandlers.draggedElement = null;

    if (events) {
      EventHandlers.events.indicator = null;
    }

    this.store.actions.setIndicator(null);
    this.store.actions.setNodeEvent('dragged', null);
  }

  /**
   * Create a new instance of Handlers with reference to the current EventHandlers
   * @param type A class that extends DerivedEventHandlers
   * @param args Additional arguments to pass to the constructor
   */
  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    type: {
      new (store: EditorStore, derived: EventHandlers, ...args: U): T;
    },
    ...args: U
  ): T {
    return new type(this.store, this, ...args);
  }
}

/**
 *  Allows for external packages to easily extend EventHandlers
 */
export abstract class DerivedEventHandlers<T extends string> extends Handlers<
  T
> {
  derived: EventHandlers;

  protected constructor(store: EditorStore, derived: EventHandlers) {
    super(store);
    this.derived = derived;
  }
}

export type EventConnectors = ConnectorsForHandlers<EventHandlers>;
