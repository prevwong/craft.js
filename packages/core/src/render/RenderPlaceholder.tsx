import React from 'react';

import { useEditor } from '../hooks';
import { Indicator } from '../interfaces';

export type RenderPlaceholderProps = {
  placeholder: Indicator;
  suggestedStyles: any;
};

export const RenderPlaceholder = ({
  placeholder,
  suggestedStyles,
}: RenderPlaceholderProps) => {
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
