import { NodeId, Node, Indicator } from "../interfaces";
import { Handlers, ConnectorsForHandlers } from "@craftjs/utils";
import { debounce } from "debounce";
import { EditorStore } from "../editor/store";

/**
 * Specifies Editor-wide event handlers and connectors
 */

type DraggedElement = NodeId | Node;
export class EventHandlers extends Handlers<
  "select" | "hover" | "drag" | "drop" | "create"
> {
  static draggedNodeShadow: HTMLElement;
  static draggedNode: DraggedElement;
  static events: { indicator: Indicator };

  handlers() {
    const { store } = this;

    let handlers = {
      select: {
        init: () => {
          return () => {
            store.actions.setNodeEvent("selected", null);
          };
        },
        events: [
          [
            "mousedown",
            debounce((_, id: NodeId) => {
              store.actions.setNodeEvent("selected", id);
            }, 1),
            true
          ]
        ]
      },
      hover: {
        init: () => {
          return () => {
            store.actions.setNodeEvent("hovered", null);
          };
        },
        events: [
          [
            "mouseover",
            debounce((_, id: NodeId) => {
              store.actions.setNodeEvent("hovered", id);
            }, 1),
            true
          ]
        ]
      },
      drop: {
        events: [
          [
            "dragover",
            (e: MouseEvent, id: NodeId) => {
              e.preventDefault();
              e.stopPropagation();
            }
          ],
          [
            "dragenter",
            (e: MouseEvent, id: NodeId) => {
              e.preventDefault();
              e.stopPropagation();

              if (!EventHandlers.draggedNode) return;

              const getPlaceholder = this.store.query.getDropPlaceholder(
                EventHandlers.draggedNode,
                id,
                {
                  x: e.clientX,
                  y: e.clientY
                }
              );

              if (getPlaceholder) {
                this.store.actions.setIndicator(getPlaceholder);
                EventHandlers.events = {
                  indicator: getPlaceholder
                };
              }
            }
          ]
        ]
      },

      drag: {
        init: node => {
          node.setAttribute("draggable", true);
          return () => {
            node.setAttribute("draggable", false);
          };
        },
        events: [
          [
            "dragstart",
            (e: DragEvent, id: NodeId) => {
              e.stopPropagation();
              e.stopImmediatePropagation();
              store.actions.setNodeEvent("dragged", id);
            }
          ],
          [
            "dragend",
            (e: DragEvent) => {
              e.stopPropagation();
              this.dropElement((draggedElement, placement) => {
                this.store.actions.move(
                  draggedElement as NodeId,
                  placement.parent.id,
                  placement.index + (placement.where === "after" ? 1 : 0)
                );
              });
            }
          ]
        ]
      },
      create: {
        init: el => {
          el.setAttribute("draggable", true);
          return () => {
            el.removeAttribute("draggable");
          };
        },
        events: [
          [
            "dragstart",
            (e: DragEvent, userElement: React.ElementType) => {
              e.stopPropagation();
              e.stopImmediatePropagation();
              const node = store.query.createNode(userElement);
              EventHandlers.createShadow(e, node);
            }
          ],
          [
            "dragend",
            (e: DragEvent) => {
              e.stopPropagation();
              this.dropElement((draggedElement, placement) => {
                (draggedElement as Node).data.index =
                  placement.index + (placement.where === "after" ? 1 : 0);
                this.store.actions.add(draggedElement, placement.parent.id);
              });
            }
          ]
        ]
      }
    };

    return handlers;
  }

  private dropElement(
    onDropNode: (
      draggedNode: DraggedElement,
      placement: Indicator["placement"]
    ) => void
  ) {
    const events = EventHandlers.events;
    if (
      EventHandlers.draggedNode &&
      events.indicator &&
      !events.indicator.error
    ) {
      const { placement } = events.indicator;
      onDropNode(EventHandlers.draggedNode, placement);
    }

    if (EventHandlers.draggedNodeShadow) {
      EventHandlers.draggedNodeShadow.parentNode.removeChild(
        EventHandlers.draggedNodeShadow
      );
      EventHandlers.draggedNodeShadow = null;
    }

    EventHandlers.draggedNode = null;
    this.store.actions.setIndicator(null);
    this.store.actions.setNodeEvent("dragged", null);
  }

  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    type: { new (store: EditorStore, derived: EventHandlers, ...args: U): T },
    ...args: U
  ): T {
    const derivedHandler = new type(this.store, this, ...args);
    return derivedHandler;
  }

  static createShadow(e: DragEvent, node: Node) {
    const shadow = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
    const { width, height } = (e.target as HTMLElement).getBoundingClientRect();
    shadow.style.width = `${width}px`;
    shadow.style.height = `${height}px`;
    shadow.style.position = "fixed";
    shadow.style.left = "-100%";
    shadow.style.top = "-100%";

    document.body.appendChild(shadow);
    e.dataTransfer.setDragImage(shadow, 0, 0);

    EventHandlers.draggedNodeShadow = shadow;
    EventHandlers.draggedNode = node;
  }
}

export abstract class DerivedEventHandlers<T extends string> extends Handlers<
  T
> {
  derived: EventHandlers;
  constructor(store: EditorStore, derived: EventHandlers) {
    super(store);
    this.derived = derived;
  }
}

export type EventConnectors = ConnectorsForHandlers<EventHandlers>;
