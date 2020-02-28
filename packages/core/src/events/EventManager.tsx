import React, { useRef, useMemo } from "react";
import { Node, NodeId, EditorEvents } from "../interfaces";
import movePlaceholder from "./movePlaceholder";
import {
  getDOMInfo,
  useConnectorHooks,
  RenderIndicator,
  useHandlerGuard
} from "@craftjs/utils";
import { useInternalEditor } from "../editor/useInternalEditor";
import { debounce } from "debounce";
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
  const { enabled, events, query, indicator, actions } = useInternalEditor(
    state => ({
      events: state.events,
      enabled: state.options.enabled,
      indicator: state.options.indicator
    })
  );

  const mutable = useRef<EditorEvents>(events);
  const draggedNode = useRef<Node | NodeId | null>(null);
  const draggedNodeShadow = useRef<HTMLElement | null>(null);

  mutable.current = events;

  const innerHandlers = useMemo(() => {
    const { add, setNodeEvent, setIndicator, move } = actions;

    return {
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
          if (!draggedNode.current) return;

          const getPlaceholder = query.getDropPlaceholder(
            draggedNode.current,
            id,
            {
              x: e.clientX,
              y: e.clientY
            }
          );

          if (getPlaceholder) {
            setIndicator(getPlaceholder);
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

            if (
              typeof draggedNode.current === "object" &&
              draggedNode.current.id
            ) {
              draggedNode.current.data.index =
                index + (where === "after" ? 1 : 0);
              add(draggedNode.current, parentId);
            } else {
              move(
                draggedNode.current as NodeId,
                parentId,
                index + (where === "after" ? 1 : 0)
              );
            }
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
    };
  }, [actions, query]);

  const handlers = useHandlerGuard(innerHandlers as any, enabled);

  const hooks = useMemo(() => {
    return {
      select: [
        handlers.selectNode,
        () => actions.setNodeEvent("selected", null)
      ],
      drag: [
        (node, id) => {
          node.setAttribute("draggable", "true");
          handlers.dragNode(node, id);
          handlers.dragNodeEnd(node);
        },
        node => {
          actions.setNodeEvent("dragged", null);
          node.removeAttribute("draggable");
        }
      ],
      hover: [handlers.hoverNode, () => actions.setNodeEvent("hovered", null)],
      create: [
        (node, el) => {
          node.setAttribute("draggable", "true");
          handlers.dragCreateNode(node, el);
          handlers.dragNodeEnd(node);
        },
        node => {
          actions.setNodeEvent("dragged", null);
          node.removeAttribute("draggable");
        }
      ],
      drop: (node, id) => {
        handlers.dragNodeOver(node, id);
        handlers.dragNodeEnter(node, id);
      }
    };
  }, [actions, handlers]);

  const connectors = useConnectorHooks(hooks as any, enabled);

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
