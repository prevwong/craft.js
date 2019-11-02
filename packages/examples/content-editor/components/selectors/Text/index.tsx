import React from 'react';
import { useNode, Canvas } from 'craftjs';
import { ToolbarSection } from '../../editor';
import { TextSettings } from "./TextSettings";

export const Text = ({ fontSize = 12, children} : any) => {
  const { connectTarget, connectDragHandler } = useNode();
  return connectTarget(
    connectDragHandler(<h2 style={{ fontSize: `${fontSize}px` }}>{children}</h2>)
  )
}

Text.related = {
  toolbar: TextSettings
}