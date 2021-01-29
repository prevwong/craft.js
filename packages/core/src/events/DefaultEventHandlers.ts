import { CoreEventHandlers } from './CoreEventHandlers';
import { createShadow } from './createShadow';

import { Indicator, NodeId, NodeTree, Node } from '../interfaces';

type DraggedElement = NodeId[] | NodeTree;

type DefaultEventHandlersOptions = {
  isMultiSelectEnabled: (e) => boolean;
};

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class DefaultEventHandlers extends CoreEventHandlers {
  static draggedElementShadow: HTMLElement;
  static draggedElement: DraggedElement;
  static indicator: Indicator = null;

  options: DefaultEventHandlersOptions;
  currentSelectedElementIds = [];

  constructor(store, options?: DefaultEventHandlersOptions) {
    super(store);
    this.options = {
      isMultiSelectEnabled: (e: MouseEvent) => !!e.metaKey,
      ...(options || {}),
    };
  }

  handlers() {
    return {
      connect: (el: HTMLElement, id: NodeId) => {
        this.store.actions.setDOM(id, el);
        this.connectors().select(el, id);
        this.connectors().hover(el, id);
        this.connectors().drop(el, id);
        this.connectors().drag(el, id);
        return () => {};
      },
      select: (el: HTMLElement, id: NodeId) => {
        const unbindOnMouseDown = this.addCraftEventListener(
          el,
          'mousedown',
          (e) => {
            e.craft.stopPropagation();

            let newSelectedElementIds = [];

            if (id) {
              const { query } = this.store;
              const selectedElementIds = query.getEvent('selected').all();
              const isMultiSelect = this.options.isMultiSelectEnabled(e);

              /**
               * Retain the previously select elements if the multi-select condition is enabled
               * or if the currentNode is already selected
               *
               * so users can just click to drag the selected elements around without holding the multi-select key
               */

              if (isMultiSelect || selectedElementIds.includes(id)) {
                newSelectedElementIds = selectedElementIds.filter(
                  (selectedId) => {
                    const descendants = query
                      .node(selectedId)
                      .descendants(true);
                    const ancestors = query.node(selectedId).ancestors(true);

                    // Deselect ancestors/descendants
                    if (descendants.includes(id) || ancestors.includes(id)) {
                      return false;
                    }

                    return true;
                  }
                );
              }

              if (!newSelectedElementIds.includes(id)) {
                newSelectedElementIds.push(id);
              }
            }

            this.store.actions.setNodeEvent('selected', newSelectedElementIds);
          }
        );

        const unbindOnClick = this.addCraftEventListener(el, 'click', (e) => {
          e.craft.stopPropagation();

          const { query } = this.store;
          const selectedElementIds = query.getEvent('selected').all();

          const isMultiSelect = this.options.isMultiSelectEnabled(e);
          const isNodeAlreadySelected = this.currentSelectedElementIds.includes(
            id
          );

          let newSelectedElementIds = [...selectedElementIds];

          if (isMultiSelect && isNodeAlreadySelected) {
            newSelectedElementIds.splice(newSelectedElementIds.indexOf(id), 1);
            this.store.actions.setNodeEvent('selected', newSelectedElementIds);
          } else if (!isMultiSelect && selectedElementIds.length > 1) {
            newSelectedElementIds = [id];
            this.store.actions.setNodeEvent('selected', newSelectedElementIds);
          }

          this.currentSelectedElementIds = newSelectedElementIds;
        });

        return () => {
          this.store.actions.setNodeEvent('selected', null);
          unbindOnMouseDown();
          unbindOnClick();
        };
      },
      hover: (el: HTMLElement, id: NodeId) => {
        const unbindMouseover = this.addCraftEventListener(
          el,
          'mouseover',
          (e) => {
            e.craft.stopPropagation();
            this.store.actions.setNodeEvent('hovered', id);
          }
        );

        return () => {
          this.store.actions.setNodeEvent('hovered', null);
          unbindMouseover();
        };
      },
      drop: (el: HTMLElement, targetId: NodeId) => {
        const unbindDragOver = this.addCraftEventListener(
          el,
          'dragover',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();
          }
        );

        const unbindDragEnter = this.addCraftEventListener(
          el,
          'dragenter',
          (e) => {
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

            if (!indicator) {
              return;
            }
            this.store.actions.setIndicator(indicator);
            DefaultEventHandlers.indicator = indicator;
          }
        );

        return () => {
          unbindDragEnter();
          unbindDragOver();
        };
      },
      drag: (el: HTMLElement, id: NodeId) => {
        if (this.store.query.node(id).isDraggable()) {
          el.setAttribute('draggable', 'true');
        }

        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();

            const { query, actions } = this.store;
            const selectedElementIds = query.getEvent('selected').all();

            actions.setNodeEvent('dragged', selectedElementIds);

            const selectedDOMs = selectedElementIds.map(
              (id) => query.node(id).get().dom
            );

            DefaultEventHandlers.draggedElementShadow = createShadow(
              e,
              query.node(id).get().dom,
              selectedDOMs
            );
            DefaultEventHandlers.draggedElement = selectedElementIds;
          }
        );

        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();
          const onDropElement = (draggedElement, placement) => {
            const index =
              placement.index + (placement.where === 'after' ? 1 : 0);
            this.store.actions.move(draggedElement, placement.parent.id, index);
          };
          this.dropElement(onDropElement);
        });

        return () => {
          el.setAttribute('draggable', 'false');
          unbindDragStart();
          unbindDragEnd();
        };
      },
      create: (el: HTMLElement, userElement: React.ReactElement) => {
        el.setAttribute('draggable', 'true');

        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();
            const tree = this.store.query
              .parseReactElement(userElement)
              .toNodeTree();

            const dom = e.currentTarget as HTMLElement;

            DefaultEventHandlers.draggedElementShadow = createShadow(e, dom, [
              dom,
            ]);
            DefaultEventHandlers.draggedElement = tree;
          }
        );

        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
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
        });

        return () => {
          el.removeAttribute('draggable');
          unbindDragStart();
          unbindDragEnd();
        };
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
