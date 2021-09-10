import { useEditor } from '@craftjs/core';
import { RenderIndicator } from '@craftjs/utils';
import React, { useMemo } from 'react';

import { useLayerManager } from '../manager/useLayerManager';

export const RenderLayerIndicator: React.FC<any> = ({ children }) => {
  const { layers, events } = useLayerManager((state) => state);
  const { query } = useEditor((state) => ({ enabled: state.options.enabled }));
  const { indicator: indicatorStyles } = query.getOptions();

  const indicatorPosition = useMemo(() => {
    const { indicator } = events;

    if (indicator) {
      const {
        placement: { where, parent, currentNode },
        error,
      } = indicator;
      const layerId = currentNode ? currentNode.id : parent.id;

      let top;
      const color = error ? indicatorStyles.error : indicatorStyles.success;

      if (indicator.onCanvas && layers[parent.id].dom != null) {
        const parentPos = layers[parent.id].dom.getBoundingClientRect();
        const parentHeadingPos = layers[
          parent.id
        ].headingDom.getBoundingClientRect();
        return {
          top: parentHeadingPos.top,
          left: parentPos.left,
          width: parentPos.width,
          height: parentHeadingPos.height,
          background: 'transparent',
          borderWidth: '1px',
          borderColor: color,
        };
      } else {
        if (!layers[layerId]) return;
        const headingPos = layers[layerId].headingDom.getBoundingClientRect();
        const pos = layers[layerId].dom.getBoundingClientRect();

        if (where === 'after' || !currentNode) {
          top = pos.top + pos.height;
        } else {
          top = pos.top;
        }

        return {
          top,
          left: headingPos.left,
          width: pos.width - headingPos.left,
          height: 2,
          borderWidth: 0,
          background: color,
        };
      }
    }
  }, [events, indicatorStyles.error, indicatorStyles.success, layers]);

  return (
    <div>
      {events.indicator
        ? React.createElement(RenderIndicator, {
            style: indicatorPosition,
          })
        : null}
      {children}
    </div>
  );
};
