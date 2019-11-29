import React, { useEffect, Ref, useRef, useMemo } from 'react';
import { useManager } from 'craftjs';

export const EditorRenderer = ({children, ...props}) => {
  const { actions, connectors } = useManager();


  return (  
    <div
      className="craftjs-renderer bg-white h-full w-full overflow-auto"
      style={{ background: "rgb(224, 224, 224)", width: "100%", height: "100%" }}
      ref={ref => connectors.active(connectors.hover(ref, null), null)}
      >
      {/* <Indicator event="active" /> 
      <Indicator event="hover" />  */}
      <div className="p-4 relative flex-col flex items-center">
        {children}
      </div>
     
    </div>
  )
}