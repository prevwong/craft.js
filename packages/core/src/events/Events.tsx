import { RenderIndicator, getDOMInfo } from '@craftjs/utils';
import React, { useEffect, useRef } from 'react';

import { EventHandlerContext } from './EventContext';
import movePlaceholder from './movePlaceholder';

import { useInternalEditor } from '../editor/useInternalEditor';

export const Events: React.FC = ({ children }) => {
  const {
    actions,
    indicator,
    indicatorOptions,
    store,
    handlers,
    handlersFactory,
    enabled,
    hydrationTimestamp,
  } = useInternalEditor((state) => ({
    enabled: state.options.enabled,
    indicator: state.events.indicator,
    indicatorOptions: state.options.indicator,
    handlers: state.handlers,
    handlersFactory: state.options.handlers,
    hydrationTimestamp:
      state.nodes.ROOT && state.nodes.ROOT._hydrationTimestamp,
  }));

  const storeRef = useRef(store);
  storeRef.current = store;

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // Generate new handlers whenever the editor deserializes a new state
  useEffect(() => {
    // TODO: Remove this when we refactor the EditorState
    actions.history
      .ignore()
      .setState(
        (state) => (state.handlers = handlersFactory(storeRef.current))
      );

    return () => {
      if (!handlersRef.current) {
        return;
      }

      handlersRef.current.cleanup();
    };
  }, [actions, handlersFactory, hydrationTimestamp]);

  // Disable/Enable handlers when the enabled state is toggled
  useEffect(() => {
    if (!handlers) {
      return;
    }

    if (!enabled) {
      handlers.disable();
      return;
    }

    handlers.enable();
  }, [enabled, handlers]);

  return handlers ? (
    <EventHandlerContext.Provider value={handlers}>
      {indicator &&
        React.createElement(RenderIndicator, {
          style: {
            ...movePlaceholder(
              indicator.placement,
              getDOMInfo(indicator.placement.parent.dom),
              indicator.placement.currentNode &&
                getDOMInfo(indicator.placement.currentNode.dom),
              indicatorOptions.thickness
            ),
            backgroundColor: indicator.error
              ? indicatorOptions.error
              : indicatorOptions.success,
            transition: indicatorOptions.transition || '0.2s ease-in',
          },
          parentDom: indicator.placement.parent.dom,
        })}
      {children}
    </EventHandlerContext.Provider>
  ) : null;
};
