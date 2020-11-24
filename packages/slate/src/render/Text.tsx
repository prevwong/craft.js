import React from 'react';

export const Text = ({ attributes, children, leaf }) => {
  return <span {...attributes}>{children}</span>;
};
