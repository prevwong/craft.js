import { RenderIndicator, getDOMInfo } from '@craftjs/utils';
import React, { Fragment } from 'react';

import movePlaceholder from './movePlaceholder';

import { useInternalEditor } from '../editor/useInternalEditor';

export const Events: React.FC = ({ children }) => {
  const { indicator, store, query } = useInternalEditor((state) => ({
    indicator: state.indicator,
  }));

  const { indicator: indicatorOptions } = store.config;

  return (
    <Fragment>
      {indicator &&
        React.createElement(RenderIndicator, {
          style: {
            ...movePlaceholder(
              indicator.placement,
              getDOMInfo(query.node(indicator.placement.parent).dom),
              indicator.placement.currentNode &&
                getDOMInfo(query.node(indicator.placement.currentNode).dom),
              indicatorOptions.thickness
            ),
            backgroundColor: indicator.error
              ? indicatorOptions.error
              : indicatorOptions.success,
            transition: indicatorOptions.transition || '0.2s ease-in',
          },
          parentDom: query.node(indicator.placement.parent).dom,
        })}
      {children}
    </Fragment>
  );
};
