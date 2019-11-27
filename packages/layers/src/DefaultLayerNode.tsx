import React from "react";
import {LayerOptions, LayerNodeProps} from "./interfaces";
import { useManager } from "craftjs";
import styled from "styled-components";
import logo from './eye.svg'

const StyledDiv = styled.div`
  display:flex;
  align-items: center;
  padding:0 10px;
  > span {
    flex:1;
  }
`;

const Chevron = styled.div`
width: 10px;
height: 10px;
display:block;
  &:before {
    border-style: solid;
    border-width: 0.05em 0.05em 0 0;
    content: '';
    display: inline-block;
    height: 100%;
    position: relative;
    transform: rotate(135deg);
    vertical-align: top;
    width: 100%;
    border-color:#000;
  }
`

export const DefaultLayerNode: React.FC<LayerNodeProps> = ({id, connectDrag, connectToggle}) => {
  const { displayName} = useManager((state) => ({
    displayName: state.nodes[id] && state.nodes[id].data.displayName
  }));

  return (
    <StyledDiv>
      <a></a>
      <span>{displayName}</span>
      <div>
        {connectToggle && (
          <a ref={connectToggle}>
            <Chevron />
            <img src={logo} />
          </a>
        )}
      </div>
    </StyledDiv>
  )
}