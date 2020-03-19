import { NodeId } from "../interfaces";
import { Handlers } from "@craftjs/utils";
import debounce from "lodash.debounce";

/**
 * Creates connectors
 */
export class EditorHandlers extends Handlers {
  static draggedNodeShadow;
  static draggedNode: any;
  static events: any = {};

  handlers() {
    const { editor } = this;

    const handlers = {
      select: {
        init: () => {
          return () => {
            editor.actions.setNodeEvent("selected", null);
          };
        },
        events: [
          [
            "mousedown",
            debounce((_, id: NodeId) => {
              editor.actions.setNodeEvent("selected", id);
            }, 1),
            true
          ]
        ]
      },
      hover: {
        init: () => {
          return () => {
            editor.actions.setNodeEvent("hovered", null);
          };
        },
        events: [
          [
            "mouseover",
            debounce((_, id: NodeId) => {
              editor.actions.setNodeEvent("hovered", id);
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

              if (!EditorHandlers.draggedNode) return;

              const getPlaceholder = this.editor.query.getDropPlaceholder(
                EditorHandlers.draggedNode,
                id,
                {
                  x: e.clientX,
                  y: e.clientY
                }
              );

              if (getPlaceholder) {
                this.editor.actions.setIndicator(getPlaceholder);
                EditorHandlers.events = {
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
                node = editor.query.createNode(node);
              }

              EditorHandlers.draggedNodeShadow = createShadow(e);
              if (typeof node === "string")
                editor.actions.setNodeEvent("dragged", node);
              EditorHandlers.draggedNode = node;
            }
          ],
          [
            "dragend",
            (e: DragEvent) => {
              e.stopPropagation();
              const events = EditorHandlers.events;

              if (
                EditorHandlers.draggedNode &&
                events.indicator &&
                !events.indicator.error
              ) {
                const { placement } = events.indicator;
                const { parent, index, where } = placement;
                const { id: parentId } = parent;

                if (
                  typeof EditorHandlers.draggedNode === "object" &&
                  EditorHandlers.draggedNode.id
                ) {
                  EditorHandlers.draggedNode.data.index =
                    index + (where === "after" ? 1 : 0);
                  this.editor.actions.add(EditorHandlers.draggedNode, parentId);
                } else {
                  this.editor.actions.move(
                    EditorHandlers.draggedNode as NodeId,
                    parentId,
                    index + (where === "after" ? 1 : 0)
                  );
                }
              }

              if (EditorHandlers.draggedNodeShadow) {
                EditorHandlers.draggedNodeShadow.parentNode.removeChild(
                  EditorHandlers.draggedNodeShadow
                );
                EditorHandlers.draggedNodeShadow = null;
              }

              EditorHandlers.draggedNode = null;
              this.editor.actions.setIndicator(null);
              this.editor.actions.setNodeEvent("dragged", null);
            }
          ]
        ]
      }
    };

    handlers["create"] = handlers["drag"];

    return handlers;
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
