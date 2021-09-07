import { isFunction } from 'lodash';

import { CoreEventHandlers, CreateHandlerOptions } from './CoreEventHandlers';
import { Positioner } from './Positioner';
import { createShadow } from './createShadow';

import { Indicator, NodeId, DragTarget } from '../interfaces';

export type DefaultEventHandlersOptions = {
  isMultiSelectEnabled: (e: MouseEvent) => boolean;
};

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class DefaultEventHandlers<O = {}> extends CoreEventHandlers<
  DefaultEventHandlersOptions & O
> {
  static draggedElementShadow: HTMLElement;
  dragTarget: DragTarget;
  positioner: Positioner | null = null;
  currentSelectedElementIds = [];

  handlers() {
    const store = this.options.store;

    return {
      connect: (el: HTMLElement, id: NodeId) => {
        store.actions.setDOM(id, el);

        return this.reflect((connectors) => {
          connectors.select(el, id);
          connectors.hover(el, id);
          connectors.drop(el, id);
        });
      },
      select: (el: HTMLElement, id: NodeId) => {
        const unbindOnMouseDown = this.addCraftEventListener(
          el,
          'mousedown',
          (e) => {
            e.craft.stopPropagation();

            let newSelectedElementIds = [];

            if (id) {
              const { query } = store;
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

            store.actions.setNodeEvent('selected', newSelectedElementIds);
          }
        );

        const unbindOnClick = this.addCraftEventListener(el, 'click', (e) => {
          e.craft.stopPropagation();

          const { query } = store;
          const selectedElementIds = query.getEvent('selected').all();

          const isMultiSelect = this.options.isMultiSelectEnabled(e);
          const isNodeAlreadySelected = this.currentSelectedElementIds.includes(
            id
          );

          let newSelectedElementIds = [...selectedElementIds];

          if (isMultiSelect && isNodeAlreadySelected) {
            newSelectedElementIds.splice(newSelectedElementIds.indexOf(id), 1);
            store.actions.setNodeEvent('selected', newSelectedElementIds);
          } else if (!isMultiSelect && selectedElementIds.length > 1) {
            newSelectedElementIds = [id];
            store.actions.setNodeEvent('selected', newSelectedElementIds);
          }

          this.currentSelectedElementIds = newSelectedElementIds;
        });

        return () => {
          store.actions.setNodeEvent('selected', null);
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
            store.actions.setNodeEvent('hovered', id);
          }
        );

        return () => {
          store.actions.setNodeEvent('hovered', null);
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

            if (!this.positioner) {
              return;
            }

            const indicator = this.positioner.computeIndicator(
              targetId,
              e.clientX,
              e.clientY
            );

            if (!indicator) {
              return;
            }

            store.actions.setIndicator(indicator);
          }
        );

        const unbindDragEnter = this.addCraftEventListener(
          el,
          'dragenter',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();
          }
        );

        return () => {
          unbindDragEnter();
          unbindDragOver();
        };
      },
      drag: (el: HTMLElement, id: NodeId) => {
        if (!store.query.node(id).isDraggable()) {
          return () => {};
        }

        el.setAttribute('draggable', 'true');

        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();

            const { query, actions } = store;
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
            this.dragTarget = {
              type: 'existing',
              nodes: selectedElementIds,
            };

            this.positioner = new Positioner(
              this.options.store,
              this.dragTarget
            );
          }
        );

        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();

          this.dropElement((dragTarget, indicator) => {
            if (dragTarget.type === 'new') {
              return;
            }

            const index =
              indicator.placement.index +
              (indicator.placement.where === 'after' ? 1 : 0);

            store.actions.move(
              dragTarget.nodes,
              indicator.placement.parent.id,
              index
            );
            this.positioner = null;
          });
        });

        return () => {
          el.setAttribute('draggable', 'false');
          unbindDragStart();
          unbindDragEnd();
        };
      },
      create: (
        el: HTMLElement,
        userElement: React.ReactElement,
        options?: Partial<CreateHandlerOptions>
      ) => {
        el.setAttribute('draggable', 'true');

        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();
            const tree = store.query
              .parseReactElement(userElement)
              .toNodeTree();

            const dom = e.currentTarget as HTMLElement;
            DefaultEventHandlers.draggedElementShadow = createShadow(e, dom, [
              el,
            ]);
            this.dragTarget = {
              type: 'new',
              tree,
            };

            this.positioner = new Positioner(
              this.options.store,
              this.dragTarget
            );
          }
        );

        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();
          this.dropElement((dragTarget, indicator) => {
            if (dragTarget.type === 'existing') {
              return;
            }

            const index =
              indicator.placement.index +
              (indicator.placement.where === 'after' ? 1 : 0);
            store.actions.addNodeTree(
              dragTarget.tree,
              indicator.placement.parent.id,
              index
            );

            if (options && isFunction(options.onCreate)) {
              options.onCreate(dragTarget.tree);
            }
          });
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
    onDropNode: (dragTarget: DragTarget, placement: Indicator) => void
  ) {
    const store = this.options.store;

    if (!this.positioner) {
      return;
    }

    const { draggedElementShadow } = DefaultEventHandlers;

    const indicator = this.positioner.getIndicator();

    if (this.dragTarget && indicator && !indicator.error) {
      onDropNode(this.dragTarget, indicator);
    }

    if (draggedElementShadow) {
      draggedElementShadow.parentNode.removeChild(draggedElementShadow);
      DefaultEventHandlers.draggedElementShadow = null;
    }

    this.dragTarget = null;

    store.actions.setIndicator(null);
    store.actions.setNodeEvent('dragged', null);
    this.positioner = null;
  }
}
