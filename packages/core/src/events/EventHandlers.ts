import { createShadow } from "./createShadow";
import { NodeId, Indicator, Tree } from "../interfaces";
import { Handlers, ConnectorsForHandlers } from "@craftjs/utils";
import { debounce } from "debounce";
import { EditorStore } from "../editor/store";

type DraggedElement = NodeId | Tree;

const event = ({
  name,
  handler,
  capture,
}: {
  name: string;
  handler: (e: MouseEvent, payload: any) => void;
  capture?: boolean;
}) => (capture ? [name, handler, capture] : [name, handler]);
const rapidDebounce = (f) => debounce(f, 1);

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class EventHandlers extends Handlers<
  "select" | "hover" | "drag" | "drop" | "create"
> {
  static draggedElementShadow: HTMLElement;
  static draggedElement: DraggedElement;
  static events: { indicator: Indicator };

  handlers() {
    return {
      select: {
        init: () => () => this.store.actions.setNodeEvent("selected", null),
        events: [
          event({
            name: "mousedown",
            handler: rapidDebounce((_, id: NodeId) =>
              this.store.actions.setNodeEvent("selected", id)
            ),
            capture: true,
          }),
        ],
      },
      hover: {
        init: () => () => this.store.actions.setNodeEvent("hovered", null),
        events: [
          event({
            name: "mouseover",
            handler: rapidDebounce((_, id: NodeId) =>
              this.store.actions.setNodeEvent("hovered", id)
            ),
            capture: true,
          }),
        ],
      },
      drop: {
        events: [
          event({
            name: "dragover",
            handler: (e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
            },
          }),
          event({
            name: "dragenter",
            handler: (e: MouseEvent, targetId: NodeId) => {
              e.preventDefault();
              e.stopPropagation();

              const { draggedElement } = EventHandlers;
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
          }),
        ],
      },

      drag: {
        init: (el) => {
          el.setAttribute("draggable", true);
          return () => el.setAttribute("draggable", false);
        },
        events: [
          event({
            name: "dragstart",
            handler: (e: DragEvent, id: NodeId) => {
              e.stopPropagation();
              e.stopImmediatePropagation();

              this.store.actions.setNodeEvent("dragged", id);

              EventHandlers.draggedElementShadow = createShadow(e);
              EventHandlers.draggedElement = id;
            },
          }),
          event({
            name: "dragend",
            handler: (e: DragEvent) => {
              e.stopPropagation();

              const onDropElement = (draggedElement, placement) =>
                this.store.actions.move(
                  draggedElement as NodeId,
                  placement.parent.id,
                  placement.index + (placement.where === "after" ? 1 : 0)
                );
              this.dropElement(onDropElement);
            },
          }),
        ],
      },
      create: {
        init: (el) => {
          el.setAttribute("draggable", true);
          return () => el.removeAttribute("draggable");
        },
        events: [
          event({
            name: "dragstart",
            handler: (e: DragEvent, userElement: React.ElementType) => {
              e.stopPropagation();
              e.stopImmediatePropagation();

              const tree = this.store.query.parseTreeFromReactNode(userElement);

              EventHandlers.draggedElementShadow = createShadow(e);
              EventHandlers.draggedElement = tree;
            },
          }),
          event({
            name: "dragend",
            handler: (e: DragEvent) => {
              e.stopPropagation();

              const onDropElement = (draggedElement, placement) => {
                const index =
                  placement.index + (placement.where === "after" ? 1 : 0);
                this.store.actions.addTreeAtIndex(
                  draggedElement,
                  placement.parent.id,
                  index
                );
              };
              this.dropElement(onDropElement);
            },
          }),
        ],
      },
    };
  }

  private dropElement(
    onDropNode: (
      draggedElement: DraggedElement,
      placement: Indicator["placement"]
    ) => void
  ) {
    const { draggedElement, draggedElementShadow, events } = EventHandlers;
    if (draggedElement && events.indicator && !events.indicator.error) {
      const { placement } = events.indicator;
      onDropNode(draggedElement, placement);
    }

    if (draggedElementShadow) {
      draggedElementShadow.parentNode.removeChild(draggedElementShadow);
      EventHandlers.draggedElementShadow = null;
    }

    EventHandlers.draggedElement = null;
    this.store.actions.setIndicator(null);
    this.store.actions.setNodeEvent("dragged", null);
  }

  /**
   * Create a new instance of Handlers with reference to the current EventHandlers
   * @param type A class that extends DerivedEventHandlers
   * @param args Additional arguements to pass to the constructor
   */
  derive<T extends DerivedEventHandlers<any>, U extends any[]>(
    type: { new (store: EditorStore, derived: EventHandlers, ...args: U): T },
    ...args: U
  ): T {
    const derivedHandler = new type(this.store, this, ...args);
    return derivedHandler;
  }
}

/**
 *  Allows for external packages to easily extend EventHandlers
 */
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
