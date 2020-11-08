import React, { Fragment } from 'react';

import { createNode } from '../createNode';
import { parseNodeFromJSX } from '../parseNodeFromJSX';

const Component = ({ href }) => <a href={href}>Hi</a>;

describe('parseNodeFromJSX', () => {
  const props = { href: 'href' };

  beforeEach(() => {
    createNode = jest.fn();
  });

  describe('Returns correct type and props', () => {
    it('should transform a link correctly', () => {
      // eslint-disable-next-line  jsx-a11y/anchor-has-content
      parseNodeFromJSX(<a {...props} />);

      expect(createNode).toBeCalledWith(
        {
          data: {
            type: 'a',
            props,
          },
        },
        expect.any(Function)
      );
    });
    it('should be able to parse a component correctly', () => {
      parseNodeFromJSX(<Component {...props} />);

      expect(createNode).toBeCalledWith(
        {
          data: {
            type: Component,
            props,
          },
        },
        expect.any(Function)
      );
    });
    it('should transform text with `div` correctly', () => {
      parseNodeFromJSX('div');

      expect(createNode).toBeCalledWith(
        {
          data: {
            type: Fragment,
            props: { children: 'div' },
          },
        },
        expect.any(Function)
      );
    });
    it('should be able to parse plain text correctly', () => {
      const text = 'hello there';
      parseNodeFromJSX(text);

      expect(createNode).toBeCalledWith(
        {
          data: {
            type: Fragment,
            props: { children: text },
          },
        },
        expect.any(Function)
      );
    });
  });
});
