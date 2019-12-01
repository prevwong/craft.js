import React from "react";
import styled from "styled-components";
import { useLayer } from "../useLayer";
import { DefaultLayerHeader } from "./index";


const LayerNodeDiv = styled.div<{hover: boolean}>`
  background: ${props => props.hover ? '#f1f1f1' : 'transparent'};
  display:block;

`

export const DefaultLayer: React.FC = ({children}) => {
  const {id, hover, connectLayer} = useLayer((layer) => ({
    hover: layer.event.hover
  }));
  

  return (
    <LayerNodeDiv ref={connectLayer} hover={hover}>
        <DefaultLayerHeader />
        {children ? (
          <div className="craft-layer-children">
            {children}
          </div>
        ) : null}
    </LayerNodeDiv>
  )
}