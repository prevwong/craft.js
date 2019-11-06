import React from 'react';
import { Selector, Canvas } from 'craftjs';
import { Container } from '../selectors/Container';
import { Text } from "../selectors/Text";
import SquareSvg from '../../public/icons/square.svg';
import TypeSvg from '../../public/icons/type.svg';


export const Toolbox = () => {
  return (
    <div className='flex flex-col items-center'>
      <Selector render={<Canvas is={Container} background={{ r: 78, g: 78, b: 78, a: 1 }} color={{ r: 0, g: 0, b: 0, a: 1 }}  height="100%" width="50%" paddingTop={2} paddingLeft={2} paddingBottom={2} paddingRight={2}></Canvas>}>
        <li className='m-2 cursor-pointer block'><SquareSvg /></li>
      </Selector>
      <Selector render={<Text fontSize={12} textAlign="left">Hi there</Text>}>
        <li className='m-2 cursor-pointer block'><TypeSvg /></li>
      </Selector> 
    </div>
  )
}
