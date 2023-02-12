import React, { Fragment } from 'react';

import { parseNodeFromJSX } from '../parseNodeFromJSX';

const Component = ({ href }) => <a href={href}>Hi</a>;

let mockedCreateNode = jest.fn();

jest.mock('../createNode', () => ({
  __esModule: true,
  createNode: jest
    .fn()
    .mockImplementation((...args) => mockedCreateNode(...args)),
}));

describe('parseNodeFromJSX', () => {
  const props = { href: 'href' };

  describe('Returns correct type and props', () => {
    it('should transform a link correctly', () => {
      // eslint-disable-next-line  jsx-a11y/anchor-has-content
      parseNodeFromJSX(<a {...props} />);

      expect(mockedCreateNode).toBeCalledWith(
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

      expect(mockedCreateNode).toBeCalledWith(
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

      expect(mockedCreateNode).toBeCalledWith(
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

      expect(mockedCreateNode).toBeCalledWith(
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
