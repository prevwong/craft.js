import { NodeId, Node, DerivedCoreEventHandlers } from '@craftjs/core';

import { LayerIndicator } from '../interfaces';

export class LayerHandlers extends DerivedCoreEventHandlers<{
  layerStore: any;
}> {
  static draggedElement;
  static events: {
    indicator: LayerIndicator;
    currentCanvasHovered: Node;
  } = {
    indicator: null,
    currentCanvasHovered: null,
  };

  getLayer(id: NodeId) {
    return this.options.layerStore.getState().layers[id];
  }

  handlers() {
    const editorStore = this.derived.options.store;
    const { layerStore } = this.options;
    return {
      layer: (el: HTMLElement, layerId: NodeId) => {
        layerStore.actions.setDOM(layerId, {
          dom: el,
        });

        const cleanupParentConnectors = this.inherit((connectors) => {
          connectors.select(el, layerId);
          connectors.hover(el, layerId);
          connectors.drag(el, layerId);
        });

        const unbindMouseOver = this.addCraftEventListener(
          el,
          'mouseover',
          (e) => {
            e.craft.stopPropagation();
            layerStore.actions.setLayerEvent('hovered', layerId);
          }
        );

        const unbindDragOver = this.addCraftEventListener(
          el,
          'dragover',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();

            const { indicator, currentCanvasHovered } = LayerHandlers.events;

            if (
              currentCanvasHovered &&
              indicator &&
              currentCanvasHovered.data.nodes
            ) {
              const heading = this.getLayer(
                currentCanvasHovered.id
              ).headingDom.getBoundingClientRect();

              if (
                e.clientY > heading.top + 10 &&
                e.clientY < heading.bottom - 10
              ) {
                const currNode =
                  currentCanvasHovered.data.nodes[
                    currentCanvasHovered.data.nodes.length - 1
                  ];

                if (!currNode) {
                  return;
                }

                LayerHandlers.events.indicator = {
                  ...indicator,
                  placement: {
                    currentNode: editorStore.query.node(currNode).get(),
                    index: currentCanvasHovered.data.nodes.length,
                    where: 'after',
                    parent: currentCanvasHovered,
                  },
                  onCanvas: true,
                };

                layerStore.actions.setIndicator(LayerHandlers.events.indicator);
              }
            }
          }
        );

        const unbindDragEnter = this.addCraftEventListener(
          el,
          'dragenter',
          (e) => {
            e.craft.stopPropagation();
            e.preventDefault();

            const dragId = LayerHandlers.draggedElement;

            if (!dragId) return;

            let target = layerId;

            const indicatorInfo = editorStore.query.getDropPlaceholder(
              dragId,
              target,
              { x: e.clientX, y: e.clientY },
              (node) => {
                const layer = this.getLayer(node.id);
                return layer && layer.dom;
              }
            );

            if (indicatorInfo) {
              const {
                placement: { parent },
              } = indicatorInfo;
              const parentHeadingInfo = this.getLayer(
                parent.id
              ).headingDom.getBoundingClientRect();

              LayerHandlers.events.currentCanvasHovered = null;
              if (editorStore.query.node(parent.id).isCanvas()) {
                if (parent.data.parent) {
                  const grandparent = editorStore.query
                    .node(parent.data.parent)
                    .get();
                  if (editorStore.query.node(grandparent.id).isCanvas()) {
                    LayerHandlers.events.currentCanvasHovered = parent;
                    if (
                      (e.clientY > parentHeadingInfo.bottom - 10 &&
                        !this.getLayer(parent.id).expanded) ||
                      e.clientY < parentHeadingInfo.top + 10
                    ) {
                      indicatorInfo.placement.parent = grandparent;
                      indicatorInfo.placement.currentNode = parent;
                      indicatorInfo.placement.index = grandparent.data.nodes
                        ? grandparent.data.nodes.indexOf(parent.id)
                        : 0;
                      if (
                        e.clientY > parentHeadingInfo.bottom - 10 &&
                        !this.getLayer(parent.id).expanded
                      ) {
                        indicatorInfo.placement.where = 'after';
                      } else if (e.clientY < parentHeadingInfo.top + 10) {
                        indicatorInfo.placement.where = 'before';
                      }
                    }
                  }
                }
              }

              LayerHandlers.events.indicator = {
                ...indicatorInfo,
                onCanvas: false,
              };

              layerStore.actions.setIndicator(LayerHandlers.events.indicator);
            }
          }
        );

        return () => {
          cleanupParentConnectors();
          unbindMouseOver();
          unbindDragOver();
          unbindDragEnter();
        };
      },
      layerHeader: (el: HTMLElement, layerId: NodeId) => {
        layerStore.actions.setDOM(layerId, {
          headingDom: el,
        });
      },
      drag: (el: HTMLElement, layerId: NodeId) => {
        el.setAttribute('draggable', 'true');

        const unbindDragStart = this.addCraftEventListener(
          el,
          'dragstart',
          (e) => {
            e.craft.stopPropagation();
            LayerHandlers.draggedElement = layerId;
          }
        );

        const unbindDragEnd = this.addCraftEventListener(el, 'dragend', (e) => {
          e.craft.stopPropagation();
          const events = LayerHandlers.events;

          if (events.indicator && !events.indicator.error) {
            const { placement } = events.indicator;
            const { parent, index, where } = placement;
            const { id: parentId } = parent;

            editorStore.actions.move(
              LayerHandlers.draggedElement as NodeId,
              parentId,
              index + (where === 'after' ? 1 : 0)
            );
          }

          LayerHandlers.draggedElement = null;
          LayerHandlers.events.indicator = null;
          layerStore.actions.setIndicator(null);
        });

        return () => {
          el.removeAttribute('draggable');
          unbindDragStart();
          unbindDragEnd();
        };
      },
    };
  }
}
