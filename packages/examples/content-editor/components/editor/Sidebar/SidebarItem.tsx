import React, { useState, useEffect } from "react";
import Arrow from "./arrow.svg";
import styled from "styled-components";

const SidebarItemDiv = styled.div<{visible?: boolean; height?: string}>`
  height: ${props => props.visible && props.height && props.height !== "full" ? `${props.height}` : "auto"};
  flex: ${props =>  props.visible &&props.height && props.height == "full" ? `1` : "unset"};
  color:#323232;
`;

const Chevron = styled.a<{visible: boolean}>`
  transform: rotate(${props => props.visible ? 180 : 0}deg);
  svg {
    width: 15px;
    height: 15px;
  }
`;

export type SidebarItem = {
  title: string;
  height?: string;
  icon: React.ElementType;
  onChange?: (bool: boolean) => void;
}

export const SidebarItem: React.FC<SidebarItem> = ({ icon, title, children, height, onChange}) => {
  const [visible, setVisible] = useState();
 
  return (
    <SidebarItemDiv visible={visible} height={height} className="flex flex-col">
      <div className={`bg-white border-b last:border-b-0 flex items-center px-2 py-2 ${visible ? 'shadow-sm' : ''}`}> 
        <div className='flex-1 flex items-center'>
          {
            React.createElement(icon, { className: "w-4 h-4 mr-2"})
          }
          <h2 className="text-sm">{title}</h2>
        </div>
        <Chevron visible={visible} onClick={() => {
          if (onChange) onChange(!visible);
          setVisible(!visible)
        }}><Arrow /></Chevron>
      </div>
      {
        visible ? (
          <div className="w-full flex-1 overflow-auto">
              {children}
          </div>
        ) : null
      }
    </SidebarItemDiv>
  )
}