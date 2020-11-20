import React from 'react';

export const Text = ({ text }) => {
  return text || '';
};

Text.craft = {
  isCanvas: false,
};

export const Typography = ({ variant, children }) => {
  return React.createElement(variant, { children });
};

Typography.craft = {
  isCanvas: false,
};

export const List = ({ children }) => {
  return React.createElement('ul', { children });
};

List.craft = {
  isCanvas: true,
};

export const ListItem = ({ children }) => {
  return React.createElement('li', { children });
};

ListItem.craft = {
  isCanvas: false,
};

export const resolvers = {
  Text,
  Typography,
  List,
  ListItem,
};
