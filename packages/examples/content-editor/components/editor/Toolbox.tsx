import React from 'react';
import { Selector, Canvas, useEditor} from 'craftjs';
import { Container } from '../selectors/Container';
import { Text } from "../selectors/Text";
import SquareSvg from '../../public/icons/toolbox/rectangle.svg';
import TypeSvg from '../../public/icons/toolbox/text.svg';
import YoutubeSvg from '../../public/icons/toolbox/video-line.svg';
import ButtonSvg from '../../public/icons/toolbox/button.svg';
import { Video } from '../selectors/Video';
import { Button } from '../selectors/Button';
import styled from "styled-components";


const ToolboxDiv = styled.div<{enabled: boolean}>`
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  ${props => !props.enabled ? `width: 0;` : ""}
  ${props => !props.enabled ? `opacity: 0;` : ""}
`;

const Item = styled.div`
  svg {
    width: 22px;
    height: 22px;
    fill:#707070;
  }
`;


export const Toolbox = () => {
  const { enabled } = useEditor((state) => ({enabled: state.options.enabled}));

  return (
    <ToolboxDiv enabled={enabled && enabled} className="w-12 border-r bg-gray-100 h-screen bg-white">
      <div className='flex flex-col items-center pt-3'>
        <Selector render={<Canvas is={Container} background={{ r: 78, g: 78, b: 78, a: 1 }} color={{ r: 0, g: 0, b: 0, a: 1 }}  height="100%" width="50%"></Canvas>}>
          <Item className='m-2 pb-2 cursor-pointer block'><SquareSvg /></Item>
        </Selector>
        <Selector render={<Text fontSize="12" textAlign="left" text="Hi there" />}>
          <Item className='m-2 pb-2 cursor-pointer block'><TypeSvg /></Item>
        </Selector> 
        <Selector render={<Button />}>
          <Item className='m-2 pb-2 cursor-pointer block'><ButtonSvg /></Item>
        </Selector> 
        <Selector render={<Video videoId="jQctQKwMyl8" />}>
          <Item className='m-2 pb-2 cursor-pointer block'><YoutubeSvg /></Item>
        </Selector> 
      </div>
    </ToolboxDiv>
  )
}
