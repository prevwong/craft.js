import React from 'react';
import styled from 'styled-components';
import { Selector, Canvas } from 'craftjs';
import { Container } from '../selectors/Container';
import { Text } from "../selectors/Text";

const ToolboxDiv = styled.ul`
   li {
     margin: 10px 0;
     cursor:pointer;
   }
`

export const Toolbox = () => {
  return (
    <ToolboxDiv className='flex flex-col items-center'>
      <Selector render={ <Canvas is={Container} background={{ r: 255, g: 255, b: 255, a: 1 }} height="100%" width="50%" paddingTop={2} paddingLeft={2} paddingBottom={2} paddingRight={2}></Canvas>}>
        <li><img src={require(`../icons/square.svg`)} /></li>
      </Selector>
      <Selector render={<Text>Hi there</Text>}>
        <li><img src={require(`../icons/type.svg`)} /></li>
      </Selector>
    </ToolboxDiv>
  )
}
