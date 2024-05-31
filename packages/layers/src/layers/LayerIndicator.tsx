import { Indicator, useEditor } from '@craftjs/core';
import React from 'react';

export type LayerIndicatorProps = {
  placeholder: Indicator;
  suggestedStyles: any;
};

export const LayerIndicator = ({
  placeholder,
  suggestedStyles,
}: LayerIndicatorProps) => {
  const { indicator } = useEditor((state) => ({
    indicator: state.options.indicator,
  }));

  return (
    <div
      style={{
        position: 'fixed',
        display: 'block',
        opacity: 1,
        borderColor: placeholder.error ? indicator.error : indicator.success,
        borderStyle: 'solid',
        borderWidth: '1px',
        zIndex: '99999',
        ...suggestedStyles,
      }}
    ></div>
  );
};
