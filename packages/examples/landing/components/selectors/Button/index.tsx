import React from 'react';
import { UserComponent, useNode } from '@craftjs/core';
import { Text } from '../Text';
import { ButtonSettings } from './ButtonSettings';
import styled from 'styled-components';
import cx from 'classnames';

type ButtonProps = {
  background?: Record<'r' | 'g' | 'b' | 'a', number>;
  color?: Record<'r' | 'g' | 'b' | 'a', number>;
  buttonStyle?: string;
  margin?: any[];
  text?: string;
  textComponent?: any;
};

const StyledButton = styled.button<ButtonProps>`
  background: ${(props) =>
    props.buttonStyle == 'full'
      ? `rgba(${Object.values(props.background)})`
      : 'transparent'};
  border: 2px solid transparent;
  border-color: ${(props) =>
    props.buttonStyle == 'outline'
      ? `rgba(${Object.values(props.background)})`
      : 'transparent'};
  margin: ${({ margin }) =>
    `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`};
`;

export const Button: UserComponent<ButtonProps> = (props: any) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const { text, textComponent, color, ...otherProps } = props;
  return (
    <StyledButton
      ref={connect}
      className={cx([
        'rounded w-full px-4 py-2',
        {
          'shadow-lg': props.buttonStyle == 'full',
        },
      ])}
      {...otherProps}
    >
      <Text {...textComponent} text={text} color={props.color} />
    </StyledButton>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    background: { r: 255, g: 255, b: 255, a: 0.5 },
    color: { r: 92, g: 90, b: 90, a: 1 },
    buttonStyle: 'full',
    text: 'Button',
    margin: ['5', '0', '5', '0'],
    textComponent: {
      ...Text.craft.props,
      textAlign: 'center',
    },
  },
  related: {
    toolbar: ButtonSettings,
  },
};
