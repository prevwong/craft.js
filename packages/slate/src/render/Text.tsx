import React from 'react';

export const Text = ({ attributes, children, leaf }) => {
  let result = children;

  if (leaf.bold) {
    result = <strong>{result}</strong>;
  }

  if (leaf.code) {
    result = <code>{result}</code>;
  }

  if (leaf.italic) {
    result = <em>{result}</em>;
  }

  if (leaf.underline) {
    result = <u>{result}</u>;
  }

  return <span {...attributes}>{result}</span>;
};
