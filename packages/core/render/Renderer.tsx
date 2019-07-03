import React, { useEffect, useContext } from "react";
import { NodeElement, Canvas, mapChildrenToNodes } from "../nodes";
import { ManagerContext } from "../manager";
import { RenderContext, RenderContextProvider } from "./RenderContext";


export const Renderer: React.FC<RenderContext> = ({ 
  children, 
  onRender = ({render}) => render
}) => {
  const [state, methods] = useContext(ManagerContext);
  useEffect(() => {
    let node = mapChildrenToNodes(<Canvas id="rootCanvas" style={{background:"#ccc", padding:"20px 0"}}>{children}</Canvas>, null, "rootNode");
    methods.add(null, node);
  }, []);

  return (
    <RenderContextProvider onRender={onRender}>
     {
        state.nodes["rootNode"] ? (
          <NodeElement id="rootNode" />
        ) : null
     }
    </RenderContextProvider>
  )
}

