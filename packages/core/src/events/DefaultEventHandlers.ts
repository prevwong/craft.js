import { CoreEventHandlers } from './CoreEventHandlers';
import { createShadow } from './createShadow';
import { generateNewTree } from './treeStuff';

import { Indicator, NodeId, NodeTree, Node } from '../interfaces';
import { defineEventListener, CraftDOMEvent } from '../utils/Handlers';

export * from '../utils/Handlers';

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

              this.store.actions.setNodeEvent(
                'selected',
                newSelectedElementIds
              );
            }
          ),
          this.defineNodeEventListener(
            'click',
            (e: CraftDOMEvent<MouseEvent>, id) => {
              e.craft.stopPropagation();

              const { query } = this.store;
              const selectedElementIds = query.getEvent('selected').all();

              const isMultiSelect = this.options.isMultiSelectEnabled(e);
              const isNodeAlreadySelected = this.currentSelectedElementIds.includes(
                id
              );

              let newSelectedElementIds = [...selectedElementIds];

              if (isMultiSelect && isNodeAlreadySelected) {
                newSelectedElementIds.splice(
                  newSelectedElementIds.indexOf(id),
                  1
                );
                this.store.actions.setNodeEvent(
                  'selected',
                  newSelectedElementIds
                );
              } else if (!isMultiSelect && selectedElementIds.length > 1) {
                newSelectedElementIds = [id];
                this.store.actions.setNodeEvent(
                  'selected',
                  newSelectedElementIds
                );
              }

              this.currentSelectedElementIds = newSelectedElementIds;
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
          defineEventListener('dragover', (e: CraftDOMEvent<MouseEvent>) => {
            e.craft.stopPropagation();
            e.preventDefault();
          }),
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

              let tree;
              if (userElement.props.nodeTree) {
                // generate fresh tree
                const { query } = this.store;
                const freshTree = generateNewTree(
                  userElement.props.nodeTree,
                  query
                );

                console.log({
                  serializedTree: userElement.props.nodeTree,
                  freshTree,
                });

                tree = freshTree;
              } else {
                tree = this.store.query
                  .parseReactElement(userElement)
                  .toNodeTree();
              }

              console.log({ tree });

              const dom = e.currentTarget as HTMLElement;

              DefaultEventHandlers.draggedElementShadow = createShadow(e, dom, [
                dom,
              ]);
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
