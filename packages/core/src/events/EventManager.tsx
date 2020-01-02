import React, { useRef } from "react";
import { Node, NodeId, EditorEvents } from "../interfaces";
import movePlaceholder from "./movePlaceholder";
import { getDOMInfo, useConnectorHooks, RenderIndicator } from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { debounce } from "debounce";
import { useHandlerGuard } from "@craftjs/utils";
import { EventContext } from "./EventContext";

// TODO: improve drag preview image
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

export const EventManager: React.FC = ({ children }) => {
  const {
    enabled,
    events,
    query,
    indicator,
    actions: { add, setNodeEvent, setIndicator, move }
  } = useInternalEditor(state => ({
    events: state.events,
    enabled: state.options.enabled,
    indicator: state.options.indicator
  }));

  const mutable = useRef<EditorEvents>(events);
  const draggedNode = useRef<Node | NodeId | null>(null);
  const draggedNodeShadow = useRef<HTMLElement | null>(null);

  mutable.current = events;

  const handlers = useHandlerGuard(
    {
      selectNode: [
        "mousedown",
        debounce((e: MouseEvent, id: NodeId) => {
          setNodeEvent("selected", id);
        }, 1),
        true
      ],
      hoverNode: [
        "mouseover",
        debounce((e: MouseEvent, id: NodeId) => {
          setNodeEvent("hovered", id);
        }, 1),
        true
      ],
      /** TODO: Merge dragCreateNode and dragNode */
      /** TODO: Fix drag preview image */
      dragCreateNode: [
        "dragstart",
        (e: DragEvent, el: React.ReactElement) => {
          e.stopPropagation();
          e.stopImmediatePropagation();
          const node = query.createNode(el);
          draggedNodeShadow.current = createShadow(e);
          if (typeof node === "string") setNodeEvent("dragged", node);
          draggedNode.current = node;
        }
      ],
      dragNode: [
        "dragstart",
        (e: DragEvent, node: Node | NodeId) => {
          e.stopPropagation();
          e.stopImmediatePropagation();
          draggedNodeShadow.current = createShadow(e);
          if (typeof node === "string") setNodeEvent("dragged", node);
          draggedNode.current = node;
        }
      ],
      dragNodeOver: [
        "dragover",
        (e: MouseEvent, id: NodeId) => {
          e.preventDefault();
          e.stopPropagation();
        }
      ],
      dragNodeEnter: [
        "dragenter",
        (e: MouseEvent, id: NodeId) => {
          e.preventDefault();
          e.stopPropagation();
          const { current: start } = draggedNode;
          if (!start) return;
          const dragId = typeof start === "object" ? start.id : start;

          const getPlaceholder = query.getDropPlaceholder(dragId, id, {
            x: e.clientX,
            y: e.clientY
          });

          if (getPlaceholder) {
            // TODO: Refactor creation of new Nodes via connectors.new()
            // Currently, no Indicator will be displayed if a new Node is dragged to a parent Container that rejects it
            try {
              if (typeof start === "object" && start.id) {
                start.data.index =
                  getPlaceholder.placement.index +
                  (getPlaceholder.placement.where === "after" ? 1 : 0);
                add(start, getPlaceholder.placement.parent.id);
                draggedNode.current = start.id;
              }
              setIndicator(getPlaceholder);
            } catch (err) {}
          }
        }
      ],
      dragNodeEnd: [
        "dragend",
        (e: MouseEvent) => {
          e.stopPropagation();
          const events = mutable.current;

          if (events.indicator && !events.indicator.error) {
            const { placement } = events.indicator;
            const { parent, index, where } = placement;
            const { id: parentId } = parent;

            move(
              draggedNode.current as NodeId,
              parentId,
              index + (where === "after" ? 1 : 0)
            );
          }

          if (draggedNodeShadow.current) {
            draggedNodeShadow.current.parentNode.removeChild(
              draggedNodeShadow.current
            );
            draggedNodeShadow.current = null;
          }

          draggedNode.current = null;
          setIndicator(null);
          setNodeEvent("dragged", null);
        }
      ]
    },
    enabled
  );

  const connectors = useConnectorHooks(
    {
      select: [handlers.selectNode, () => setNodeEvent("selected", null)],
      drag: [
        (node, id) => {
          node.setAttribute("draggable", "true");
          handlers.dragNode(node, id);
          handlers.dragNodeEnd(node);
        },
        (node, id) => {
          setNodeEvent("dragged", null);
          node.removeAttribute("draggable");
        }
      ],
      hover: [handlers.hoverNode, () => setNodeEvent("hovered", null)],
      create: [
        (node, el) => {
          node.setAttribute("draggable", "true");
          handlers.dragCreateNode(node, el);
          handlers.dragNodeEnd(node);
        },
        (node, id) => {
          setNodeEvent("dragged", null);
          node.removeAttribute("draggable");
        }
      ],
      drop: (node, id) => {
        handlers.dragNodeOver(node, id);
        handlers.dragNodeEnter(node, id);
      }
    },
    enabled
  );

  return (
    <EventContext.Provider value={connectors}>
      {events.indicator
        ? React.createElement(RenderIndicator, {
            style: {
              ...movePlaceholder(
                events.indicator.placement,
                getDOMInfo(events.indicator.placement.parent.dom),
                events.indicator.placement.currentNode
                  ? getDOMInfo(events.indicator.placement.currentNode.dom)
                  : null
              ),
              backgroundColor: events.indicator.error
                ? indicator.error
                : indicator.success,
              transition: "0.2s ease-in"
            }
          })
        : null}
      {children}
    </EventContext.Provider>
  );
};
