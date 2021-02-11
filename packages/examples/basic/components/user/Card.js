import { Element, useNode, useEditor } from '@craftjs/core';
import React from 'react';

import { Button } from './Button';
import {
  Container,
  ContainerSettings,
  ContainerDefaultProps,
} from './Container';
import { Text } from './Text';

export const CardTop = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      ref={connect}
      className="text-only"
      style={{
        padding: '10px',
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {children}
    </div>
  );
};

CardTop.craft = {
  rules: {
    canMoveIn: (incomingNodes) =>
      incomingNodes.every((incomingNode) => incomingNode.data.type === Text),
  },
};

export const CardBottom = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div style={{ padding: '10px 0' }} ref={connect}>
      {children}
    </div>
  );
};

CardBottom.craft = {
  rules: {
    canMoveIn: (incomingNodes) =>
      incomingNodes.every((incomingNode) => incomingNode.data.type === Button),
  },
};

export const Card = ({ background, padding = 20 }) => {
  const { id } = useNode();
  const { isDraggedOver } = useEditor((state) => {
    return {
      // we consider the card as being dragged over if one of its ancestors (CardTop or CardBottom)
      // is being dragged over. This only works because neither CardTop nor CardBottom accept other canvases (Card or Container)
      // as their children.
      isDraggedOver: state.events.draggedOver.has(id),
    };
  });

  return (
    <Container
      background={background}
      padding={padding}
      outline={isDraggedOver ? '2px dashed blue' : undefined}
    >
      <Element canvas id="text" is={CardTop}>
        <Text text="Only texts" fontSize={20} />
        <Text text="are allowed up here" fontSize={15} />
      </Element>
      <Element canvas id="buttons" is={CardBottom}>
        <Button size="small" text="Only buttons down here" />
      </Element>
    </Container>
  );
};

Card.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
