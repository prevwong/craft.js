import React, { Component } from "react";
import { useRenderer } from "./useRenderer";
import { PlaceholderInfo } from "../interfaces";

export type Placeholder = {
  placeholder: PlaceholderInfo
}

export const defaultPlaceholder: React.FC<Placeholder> = ({placeholder:{position}}) => {
  const {width, height, top, left } = position;

  return (
    <div
      style={{
        position: 'fixed',
        display: 'block',
        borderColor: height ? `rgb(98, 196, 98) rgba(0, 0, 0, 0)` : "rgba(0, 0, 0, 0)rgb(98, 196, 98)",
        left: left ? `${left}px` : "auto",
        top: top ? `${top}px` : "auto",
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        opacity: 1,
        borderStyle: 'solid',
        transition: 'top 0.2s, left 0.2s, width 0.2s, height 0.2s'
      }}
    >
      <div style={{
        backgroundColor: 'rgb(98, 196, 98)',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)',
        height: '100%',
        width: '100%',
        pointerEvents: 'none',
        padding: '1.5px',
        outline: 'none'
      }}></div>
    </div>
  )
}


export const RenderPlaceholder: React.FC<Placeholder> = ({ placeholder }) => {
  const { renderPlaceholder } = useRenderer();
  return React.createElement(renderPlaceholder, { placeholder });
}