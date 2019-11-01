import React from 'react';
import { Selector, Canvas } from 'craftjs';
import { Container } from '../selectors/Container';
import { Text } from "../selectors/Text";
import {ReactComponent as SquareSvg} from '../icons/square.svg';
import {ReactComponent as TypeSvg} from '../icons/type.svg';


export const Toolbox = () => {
  return (
    <div className='flex flex-col items-center'>
      <Selector render={ <Canvas is={Container} background={{ r: 255, g: 255, b: 255, a: 1 }} height="100%" width="50%" paddingTop={2} paddingLeft={2} paddingBottom={2} paddingRight={2}></Canvas>}>
        <li className='m-2 cursor-pointer block'><SquareSvg /></li>
      </Selector>
      {/* <Selector render={<Text>Hi there</Text>}> */}
        {/* <li><TypeSvg /></li> */}
      {/* </Selector> */} 
      <TypeSvg />
    </div>
  )
}
