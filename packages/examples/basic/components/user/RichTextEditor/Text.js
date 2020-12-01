import React from 'react';
import fromPairs from 'lodash/fromPairs';

export const craftToSlateMarks = {
  B: 'bold',
  Em: 'italic',
  U: 'underline',
  InlineCode: 'code',
};

export const slateToCraftMarks = fromPairs(
  Object.entries(craftToSlateMarks).map((entry) => entry.reverse())
);

const getSlateMarks = (marks) => {
  if (!marks || !Array.isArray(marks) || marks.length < 1) {
    return {};
  }
  return fromPairs(marks.map((mark) => [craftToSlateMarks[mark], true]));
};

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

const getCraftMarks = (node) => {
  return Object.keys(node)
    .map((key) => slateToCraftMarks[key])
    .filter((mark) => !!mark);
};

Text.slate = {
  toCraftNode: (slateNode) => (craftNode) => {
    craftNode.data.custom.marks = getCraftMarks(slateNode);
    craftNode.data.props.text = slateNode.text;
  },
  toSlateNode: (craftNode) => (slateNode) => {
    Object.keys(getSlateMarks(craftNode.data.custom.marks)).forEach((mark) => {
      slateNode[mark] = true;
    });
    slateNode.text = craftNode.data.props.text;
  },
};
