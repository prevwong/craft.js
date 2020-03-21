import { NodeId } from "../interfaces";
import { Handlers, ConnectorsForHandlers } from "@craftjs/utils";
import { debounce } from "debounce";
import { EditorStore } from "../editor/store";

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class EventHandlers extends Handlers<
  "select" | "hover" | "drag" | "drop" | "create"
> {
  static draggedNodeShadow;
  static draggedNode: any;
  static events: any = {};

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
            (e: DragEvent, nodeOrEl: NodeId | React.ReactElement) => {
              e.stopPropagation();
              e.stopImmediatePropagation();

              let node = nodeOrEl;
              if (typeof nodeOrEl != "string") {
                node = store.query.createNode(node);
              }

              EventHandlers.draggedNodeShadow = createShadow(e);
              if (typeof node === "string")
                store.actions.setNodeEvent("dragged", node);
              EventHandlers.draggedNode = node;
            }
          ],
          [
            "dragend",
            (e: DragEvent) => {
              e.stopPropagation();
              const events = EventHandlers.events;

              if (
                EventHandlers.draggedNode &&
                events.indicator &&
                !events.indicator.error
              ) {
                const { placement } = events.indicator;
                const { parent, index, where } = placement;
                const { id: parentId } = parent;

                if (
                  typeof EventHandlers.draggedNode === "object" &&
                  EventHandlers.draggedNode.id
                ) {
                  EventHandlers.draggedNode.data.index =
                    index + (where === "after" ? 1 : 0);
                  this.store.actions.add(EventHandlers.draggedNode, parentId);
                } else {
                  this.store.actions.move(
                    EventHandlers.draggedNode as NodeId,
                    parentId,
                    index + (where === "after" ? 1 : 0)
                  );
                }
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
          ]
        ]
      },
      create: {}
    };

    handlers["create"] = handlers["drag"];

    return handlers;
  }

  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    type: { new (store: EditorStore, derived: EventHandlers, ...args: U): T },
    ...args: U
  ): T {
    const derivedHandler = new type(this.store, this, ...args);
    return derivedHandler;
  }
}

const createShadow = (e: DragEvent) => {
  const shadow = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
  const { width, height } = (e.target as HTMLElement).getBoundingClientRect();
  shadow.style.width = `${width}px`;
  shadow.style.height = `${height}px`;
  shadow.style.position = "fixed";
  shadow.style.left = "-100%";
  shadow.style.top = "-100%";

  document.body.appendChild(shadow);
  e.dataTransfer.setDragImage(shadow, 0, 0);

  return shadow;
};

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
