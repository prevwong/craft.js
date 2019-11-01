import React from 'react';
import { Input } from "../Input"
import { EditorItem } from "../EditorItem"
import { EditorSection } from "../EditorSection"
import { useNode } from "craftjs";

export const ResizerEditorSection = () => {
  return (
    <EditorSection title="Dimensions">
        <EditorItem prefix="W" propKey="width"
            type="text"
          />
        <EditorItem prefix="H" propKey="height"
            type="text"
          />
    </EditorSection>
  )
}