import React from "react";

export const RenderIndicator = ({style}) => {
  return (
    <div
      style={{
        position: 'fixed',
        display: 'block',
        opacity: 1,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: "transparent",
        zIndex: 99999,
        ...style,
      }}
    >
    </div>
  )
}