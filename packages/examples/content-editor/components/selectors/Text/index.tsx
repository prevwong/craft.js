import React from 'react';
import { useNode, Canvas } from 'craftjs';
import { ToolbarSection } from '../../editor';
import { TextSettings } from "./TextSettings";
import ContentEditable from "react-contenteditable";

export const Text = ({ fontSize = 12, children} : any) => {
  const { connectTarget, connectDragHandler } = useNode();
  return (
      <ContentEditable
        innerRef={connectTarget}
        html={children} // innerHTML of the editable div
        disabled={false} 
        onChange={() => {

        }}      // use true to disable editing
        tagName='h2' // Use a custom HTML tag (uses a div by default)
      />
    )
}

Text.craft = {
  related : {
    toolbar: TextSettings
  }
}