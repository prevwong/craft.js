import React from 'react';

import { isReactNative } from './isReactNative';

const ReactDOM = !isReactNative ? require('react-dom') : null;

export const RenderIndicator: React.FC<any> = ({ style, parentDom }) => {
  const indicator = (
    <div
      style={{
        position: 'fixed',
        display: 'block',
        opacity: 1,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'transparent',
        zIndex: 99999,
        ...style,
      }}
    ></div>
  );

  if (parentDom && parentDom.ownerDocument !== document) {
    return ReactDOM.createPortal(indicator, parentDom.ownerDocument.body);
  }

  return indicator;
};
