import React from 'react';
import ReactDOM from 'react-dom';

type RenderIndicatorProps = {
  style: React.CSSProperties;
  parentDom?: HTMLElement;
};

export const RenderIndicator = ({ style, parentDom }: RenderIndicatorProps) => {
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
