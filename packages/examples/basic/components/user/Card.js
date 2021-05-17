import { Element, useNode, useEditor } from '@craftjs/core';
import React from 'react';

import { Button } from './Button';
import {
  Container,
  ContainerSettings,
  ContainerDefaultProps,
} from './Container';
import { Text } from './Text';

export const CardTop = ({ children, ...props }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      {...props}
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

export const CardBottom = ({ children, ...props }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div {...props} style={{ padding: '10px 0' }} ref={connect}>
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

export const Card = ({ background, padding = 20, ...props }) => {
  const { id } = useNode();
  const { isBeingDraggedOver } = useEditor((state, query) => {
    return {
      // we consider the card as being dragged over if one of its ancestors (CardTop or CardBottom)
      // is being dragged over. Attention: This only works because neither CardTop nor CardBottom accept other canvases (Card or Container)
      // as their children.
      //
      // Tip: for a more complex scenario have a look at the Container
      isBeingDraggedOver: query.getDraggedOverNodes().has(id),
    };
  });

  return (
    <Container
      {...props}
      background={background}
      padding={padding}
      outline={isBeingDraggedOver ? '2px dashed blue' : undefined}
    >
      <Element canvas id="text" is={CardTop} data-cy="card-top">
        <Text text="Only texts" fontSize={20} data-cy="card-top-text-1" />
        <Text
          text="are allowed up here"
          fontSize={15}
          data-cy="card-top-text-2"
        />
      </Element>
      <Element canvas id="buttons" is={CardBottom} data-cy="card-bottom">
        <Button
          size="small"
          text="Only buttons down here"
          data-cy="card-bottom-button"
        />
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
