import { NodeId, DerivedCoreEventHandlers } from '@craftjs/core';

import { LayerIndicator } from '../interfaces';

export class LayerHandlers extends DerivedCoreEventHandlers<{
  layerStore: any;
}> {
  static draggedElement;
  static events: {
    indicator: LayerIndicator;
    currentCanvasHovered: NodeId;
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

            const canvasNode = editorStore.query.node(currentCanvasHovered);

            if (currentCanvasHovered && indicator) {
              const heading = this.getLayer(
                canvasNode.id
              ).headingDom.getBoundingClientRect();

              if (
                e.clientY > heading.top + 10 &&
                e.clientY < heading.bottom - 10
              ) {
                const currNode = canvasNode.getChildAtIndex(
                  canvasNode.getChildNodes().length
                );
                if (!currNode) {
                  // If the currentCanvasHovered has no child nodes, then we place the indicator as the first child
                  LayerHandlers.events.indicator = {
                    ...indicator,
                    placement: {
                      ...indicator.placement,
                      index: 0,
                      where: 'before',
                      parent: currentCanvasHovered,
                    },
                    onCanvas: true,
                  };
                  return;
                }

                LayerHandlers.events.indicator = {
                  ...indicator,
                  placement: {
                    currentNodeId: currNode.id,
                    index: canvasNode.getChildNodes().length,
                    where: 'after',
                    parentNodeId: canvasNode.id,
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
                const layer = this.getLayer(node);
                return layer && layer.dom;
              }
            );

            if (indicatorInfo) {
              const {
                placement: { parentNodeId },
              } = indicatorInfo;

              const parentNode = editorStore.query.node(parentNodeId);

              const parentHeadingInfo = this.getLayer(
                parentNode.id
              ).headingDom.getBoundingClientRect();

              LayerHandlers.events.currentCanvasHovered = null;
              if (editorStore.query.node(parentNodeId).isCanvas()) {
                if (parentNode.getParent()) {
                  const grandparentNode = parentNode.getParent();

                  if (editorStore.query.node(grandparentNode.id).isCanvas()) {
                    LayerHandlers.events.currentCanvasHovered = parentNode.id;
                    if (
                      (e.clientY > parentHeadingInfo.bottom - 10 &&
                        !this.getLayer(parentNode.id).expanded) ||
                      e.clientY < parentHeadingInfo.top + 10
                    ) {
                      indicatorInfo.placement.parentNodeId = grandparentNode.id;
                      indicatorInfo.placement.currentNodeId = parentNode.id;
                      indicatorInfo.placement.index = grandparentNode
                        .getChildNodes()
                        .map((node) => node.id)
                        .indexOf(parentNode.id);
                      if (
                        e.clientY > parentHeadingInfo.bottom - 10 &&
                        !this.getLayer(parentNode.id).expanded
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
            const { parentNodeId, index, where } = placement;

            editorStore.actions.move(
              LayerHandlers.draggedElement as NodeId,
              parentNodeId,
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
