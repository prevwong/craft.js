import React from 'react';
import { Selector, Canvas } from 'craftjs';
import { Container } from '../selectors/Container';
import { Text } from "../selectors/Text";
import SquareSvg from '../../public/icons/square.svg';
import TypeSvg from '../../public/icons/type.svg';
import YoutubeSvg from '../../public/icons/youtube.svg';
import ButtonSvg from '../../public/icons/button.svg';
import { Video } from '../selectors/Video';
import { Button } from '../selectors/Button';


export const Toolbox = () => {
  return (
    <div className='flex flex-col items-center'>
      <Selector render={<Canvas is={Container} background={{ r: 78, g: 78, b: 78, a: 1 }} color={{ r: 0, g: 0, b: 0, a: 1 }}  height="100%" width="50%"></Canvas>}>
        <li className='m-2 cursor-pointer block'><SquareSvg /></li>
      </Selector>
      <Selector render={<Text fontSize="12" textAlign="left" text="Hi there" />}>
        <li className='m-2 cursor-pointer block'><TypeSvg /></li>
      </Selector> 
      <Selector render={<Button />}>
        <li className='m-2 cursor-pointer block'><ButtonSvg /></li>
      </Selector> 
      <Selector render={<Video videoId="jQctQKwMyl8" />}>
        <li className='m-2 cursor-pointer block'><YoutubeSvg /></li>
      </Selector> 
    </div>
  )
}
