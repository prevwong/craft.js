import React from 'react';
import { useNode, Canvas } from 'craftjs';
import { EditorSection } from '../components/EditorSection';

export const Text = ({ children} : any) => {
  const { connectTarget, connectDragHandler } = useNode();
  return connectTarget(
    connectDragHandler(
      <div>
        <h2>{children}</h2>
        <Canvas id="main">
          <h4>wow</h4>
        </Canvas>
      </div>
    )
  )
}

Text.related = {
  toolbar: () => {
    return (
      <React.Fragment>
        <EditorSection title="Font">

        </EditorSection>
      </React.Fragment>
    )
  }
}