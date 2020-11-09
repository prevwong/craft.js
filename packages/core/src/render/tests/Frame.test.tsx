import { mount } from 'enzyme';
import React from 'react';

import { useInternalEditor } from '../../editor/useInternalEditor';
import { Frame } from '../Frame';

jest.mock('tiny-invariant');
jest.mock('../../editor/useInternalEditor');
jest.mock('../../nodes/NodeElement', () => ({
  NodeElement: () => null,
}));

const mockEditor = useInternalEditor as jest.Mock<any>;

describe('<Frame />', () => {
  const data = {};
  const addNodeTree = jest.fn();
  const deserialize = jest.fn();

  let actions;
  let query;

  beforeEach(() => {
    actions = {
      history: {
        ignore: jest.fn().mockImplementation(() => ({
          addNodeTree,
          deserialize,
        })),
      },
    };
    query = { createNode: jest.fn(), parseTreeFromReactNode: jest.fn() };
    mockEditor.mockImplementation(() => ({ actions, query }));
  });

  describe('When rendering using `data`', () => {
    beforeEach(() => {
      mount(<Frame data={data} />);
    });
    it('should deserialize the nodes', () => {
      expect(deserialize).toHaveBeenCalledWith(data);
    });
  });
});
