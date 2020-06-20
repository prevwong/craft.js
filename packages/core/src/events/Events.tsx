import React, { useMemo } from 'react';
import { useInternalEditor } from '../editor/useInternalEditor';
import { RenderIndicator, getDOMInfo } from '@craftjs/utils';
import movePlaceholder from './movePlaceholder';
import { EventHandlers } from './EventHandlers';
import { EventHandlerContext } from './EventContext';

export const Events: React.FC = ({ children }) => {
  const { events, indicator, store } = useInternalEditor((state) => ({
    events: state.events,
    indicator: state.options.indicator,
  }));

  const handler = useMemo(() => new EventHandlers(store), [store]);

  return (
    <EventHandlerContext.Provider value={handler}>
      {events.indicator &&
        React.createElement(RenderIndicator, {
          style: {
            ...movePlaceholder(
              events.indicator.placement,
              getDOMInfo(events.indicator.placement.parent.dom),
              events.indicator.placement.currentNode &&
                getDOMInfo(events.indicator.placement.currentNode.dom)
            ),
            backgroundColor: events.indicator.error
              ? indicator.error
              : indicator.success,
            transition: '0.2s ease-in',
          },
        })}
      {children}
    </EventHandlerContext.Provider>
  );
};
