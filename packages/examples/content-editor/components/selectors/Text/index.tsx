import React, { Children } from 'react';
import { useNode, Canvas } from 'craftjs';
import { ToolbarSection } from '../../editor';
import { TextSettings } from "./TextSettings";
import ContentEditable from "react-contenteditable";

export type Text = {
  fontSize: string;
  textAlign: string;
  fontWeight: string;
  color: Record<"r" | "g" | "b" | "a", string>;
  shadow: number;
  text: string
}

export const Text = ({ fontSize , textAlign, fontWeight, color, shadow, text} : Partial<Text>) => {
  const { connectTarget, actions } = useNode();
  return (
      <ContentEditable
        innerRef={connectTarget}
        html={text} // innerHTML of the editable div
        disabled={false} 
        onChange={(e) => {
          actions.setProp(prop => prop.text = e.target.value)
        }}      // use true to disable editing
        tagName='h2' // Use a custom HTML tag (uses a div by default)
        style={{
          color: `rgba(${Object.values(color)})`,
          fontSize: `${fontSize}px`,
          textShadow: `0px 0px 2px rgba(0,0,0,${(shadow || 0)/100})`,
          fontWeight,
          textAlign
        }}
      />
    )
}

Text.craft = {
  defaultProps: {
    fontSize: "15",
    textAlign: "left", 
    fontWeight: "500",
    color: {r: 92,g: 90, b:90, a: 1},
    shadow: 0,
    text: "Text"
  },
  related : {
    toolbar: TextSettings
  }
}