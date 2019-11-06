import React from 'react';
import { useNode, Canvas } from 'craftjs';
import { ToolbarSection } from '../../editor';
import { TextSettings } from "./TextSettings";
import ContentEditable from "react-contenteditable";

export const Text = ({ fontSize = 12, textAlign='left', fontWeight="400", color, shadow = 0, children} : any) => {
  const { connectTarget, actions } = useNode();
  return (
      <ContentEditable
        innerRef={connectTarget}
        html={children} // innerHTML of the editable div
        disabled={false} 
        onChange={(e) => {
          actions.setProp(prop => prop.children = e.target.value)
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
  related : {
    toolbar: TextSettings
  }
}