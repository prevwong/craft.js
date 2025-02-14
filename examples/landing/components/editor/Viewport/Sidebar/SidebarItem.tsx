import classNames from 'classnames';
import React from 'react';
import { styled } from 'styled-components';

import Arrow from '../../../../public/icons/arrow.svg';

const SidebarItemDiv = styled.div<{ $visible?: boolean; $height?: string }>`
  height: ${(props) =>
    props.$visible && props.$height && props.$height !== 'full'
      ? `${props.$height}`
      : 'auto'};
  flex: ${(props) =>
    props.$visible && props.$height && props.$height === 'full'
      ? `1`
      : 'unset'};
  color: #545454;
  border-bottom: 1px solid transparent;
  border-color: ${(props) => (props.$visible ? '#eee' : 'transparent')};
`;

const Chevron = styled.a<{ $visible: boolean }>`
  transform: rotate(${(props) => (props.$visible ? 180 : 0)}deg);
  svg {
    width: 10px;
    height: 10px;
  }
`;

export type SidebarItemProps = {
  title: string;
  height?: string;
  icon: string;
  visible?: boolean;
  onChange?: (bool: boolean) => void;
  children?: React.ReactNode;
  className?: string;
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
  className,
}) => {
  return (
    <SidebarItemDiv
      $visible={visible}
      $height={height}
      className={classNames('flex flex-col', className)}
    >
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
        <Chevron $visible={visible}>
          <Arrow viewBox="-2 -1 12 12" />
        </Chevron>
      </HeaderDiv>
      {visible ? (
        <div className="w-full flex-1 overflow-auto">{children}</div>
      ) : null}
    </SidebarItemDiv>
  );
};
