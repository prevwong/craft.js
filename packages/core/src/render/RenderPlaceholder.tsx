import React, { useContext } from "react";
import { PlaceholderInfo } from "../events/interfaces";
import { useManager } from "../connectors";

export type Placeholder = {
  placeholder: PlaceholderInfo,
  suggestedStyles: any
}

export const defaultPlaceholder: React.FC<Placeholder> = ({ placeholder: { error }, suggestedStyles}) => {
  return (
    <div
      style={{
        position: 'fixed',
        display: 'block',
        opacity: 1,
        background: error ? 'red': 'rgb(98, 196, 98)',
        borderColor: 'rgb(98, 196, 98)',
        borderStyle: 'solid',
        borderWidth: '0px',
        zIndex: "99999",
        ...suggestedStyles
      }}
    >
    </div>
  )
}


export const RenderPlaceholder: React.FC<Placeholder> = ({ placeholder, suggestedStyles }) => {
  const { query: {getOptions} } = useManager();
  return React.createElement(getOptions().renderPlaceholder, {
    placeholder,
    suggestedStyles,
  });
}