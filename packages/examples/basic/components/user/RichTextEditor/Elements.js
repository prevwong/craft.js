import React from 'react';

export const Typography = ({ element, attributes, children }) => {
  const Comp = element.data.variant || 'p';
  return <Comp {...attributes}>{children}</Comp>;
};

Typography.craft = {
  isCanvas: false,
};

Typography.slate = {
  toCraftNode: (slateNode) => (craftNode) => {
    craftNode.data.props.variant = slateNode.data.variant;
  },
  toSlateNode: (craftNode) => (slateNode) => {
    slateNode.data = {
      variant: craftNode.data.props.variant || 'h2',
    };
  },
};

export const List = ({ attributes, children }) => {
  return <ul {...attributes}>{children}</ul>;
};

List.craft = {
  isCanvas: true,
};

export const ListItem = ({ attributes, children }) => {
  return <li {...attributes}>{children}</li>;
};

ListItem.craft = {
  isCanvas: false,
};
