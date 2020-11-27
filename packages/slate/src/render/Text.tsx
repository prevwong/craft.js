import React from 'react';
import { Dictionary } from 'lodash';
import fromPairs from 'lodash/fromPairs';

export const craftToSlateMarks = {
  B: 'bold',
  Em: 'italic',
  U: 'underline',
  InlineCode: 'code',
};

export const slateToCraftMarks: Dictionary<any> = fromPairs(
  Object.entries(craftToSlateMarks).map((entry) => entry.reverse())
);

const getSlateMarks = (marks: any): any => {
  if (!marks || !Array.isArray(marks) || marks.length < 1) {
    return {};
  }
  return fromPairs(
    marks.map((mark: keyof typeof craftToSlateMarks) => [
      craftToSlateMarks[mark],
      true,
    ])
  );
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

const getCraftMarks = (node: any) => {
  return Object.keys(node)
    .map((key) => slateToCraftMarks[key])
    .filter((mark) => !!mark);
};

Text.slate = {
  toCraftNode: (slateNode) => (craftNode) => {
    craftNode.data.custom.marks = getCraftMarks(slateNode);
  },
  toSlateNode: (craftNode) => (slateNode) => {
    Object.keys(getSlateMarks(craftNode.data.custom.marks)).forEach((mark) => {
      slateNode[mark] = true;
    });
  },
};
