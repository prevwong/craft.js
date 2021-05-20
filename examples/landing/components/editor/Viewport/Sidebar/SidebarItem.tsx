import React from 'react';
import styled from 'styled-components';

import Arrow from '../../../../public/icons/arrow.svg';

const SidebarItemDiv = styled.div<{ visible?: boolean; height?: string }>`
  height: ${(props) =>
    props.visible && props.height && props.height !== 'full'
      ? `${props.height}`
      : 'auto'};
  flex: ${(props) =>
    props.visible && props.height && props.height === 'full' ? `1` : 'unset'};
  color: #545454;
`;

const Chevron = styled.a<{ visible: boolean }>`
  transform: rotate(${(props) => (props.visible ? 180 : 0)}deg);
  svg {
    width: 8px;
    height: 8px;
  }
`;

export type SidebarItemProps = {
  title: string;
  height?: string;
  icon: string;
  visible?: boolean;
  onChange?: (bool: boolean) => void;
};

const HeaderDiv = styled.div`
  color: #615c5c;
  height: 45px;
  svg {
    fill: #707070;
  }
`;

export const SidebarItem: React.FC<SidebarItemProps> = ({
  visible,
  icon,
  title,
  children,
  height,
  onChange,
}) => {
  return (
    <SidebarItemDiv visible={visible} height={height} className="flex flex-col">
      <HeaderDiv
        onClick={() => {
          if (onChange) onChange(!visible);
        }}
        className={`cursor-pointer bg-white border-b last:border-b-0 flex items-center px-2 ${
          visible ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex-1 flex items-center">
          {React.createElement(icon, { className: 'w-4 h-4 mr-2' })}
          <h2 className="text-xs uppercase">{title}</h2>
        </div>
        <Chevron visible={visible}>
          <Arrow />
        </Chevron>
      </HeaderDiv>
      {visible ? (
        <div className="w-full flex-1 overflow-auto">{children}</div>
      ) : null}
    </SidebarItemDiv>
  );
};
