import React from 'react';
import { useNode, Canvas } from 'craftjs';
import { ToolbarSection } from '../../editor';

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
        <ToolbarSection title="Font">

        </ToolbarSection>
      </React.Fragment>
    )
  }
}