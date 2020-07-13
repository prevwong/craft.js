import React from 'react';
import { mount } from 'enzyme';
import { Element } from '../Element';
import { createTestNode } from '../../utils/createTestNode';

let parentNode;
let existingLinkedNode;
let newLinkedNode = createTestNode('newLinkedNode');

let toNodeTree = jest.fn().mockImplementation(() => ({
  rootNodeId: newLinkedNode.id,
}));

let addLinkedNodeFromTree = jest.fn();
let setProp = jest.fn();
let parseReactElement = jest.fn().mockImplementation(() => ({
  toNodeTree,
}));

jest.mock('../../editor/useInternalEditor', () => ({
  useInternalEditor: () => ({
    actions: {
      addLinkedNodeFromTree,
      setProp,
    },
    query: {
      parseReactElement,
      node: jest.fn().mockImplementation((id) => ({
        get() {
          if (id === 'parent-node') return parentNode;
          else return existingLinkedNode;
        },
      })),
    },
  }),
}));

jest.mock('../useInternalNode', () => ({
  useInternalNode: () => ({
    node: parentNode,
    inNodeContext: true,
  }),
}));

const NodeElementTest = jest.fn().mockImplementation(() => null);

jest.mock('../NodeElement', () => ({
  NodeElement: jest.fn().mockImplementation((props) => NodeElementTest(props)),
}));

describe('<Element />', () => {
  beforeEach(() => {
    parentNode = createTestNode('test');
  });

  describe('when no id is passed', () => {
    it('should throw error', () => {
      expect(() => mount(<Element />)).toThrow();
    });
  });

  describe('when there is no existing node', () => {
    let elementProps, children;
    beforeEach(() => {
      elementProps = {
        color: '#fff',
      };

      children = <h1>Child</h1>;
      mount(
        <Element id="test" {...elementProps}>
          {children}
        </Element>
      );
    });

    it('should call query.parseReactElement()', () => {
      expect(parseReactElement).toHaveBeenCalledWith(
        <Element {...elementProps}>{children}</Element>
      );
    });
    it('should call actions.addLinkedNodeFromTree()', () => {
      expect(addLinkedNodeFromTree).toHaveBeenCalled();
    });
    it('should render a new linked Node', () => {
      expect(NodeElementTest).toHaveBeenCalledWith({
        id: newLinkedNode.id,
      });
    });
  });

  describe('when there is an existing node', () => {
    beforeEach(() => {
      existingLinkedNode = createTestNode('existing-linked-node', {
        type: 'div',
      });

      parentNode = createTestNode('parent-node', {
        linkedNodes: {
          test: existingLinkedNode.id,
        },
      });
    });
    describe('when type is the same as JSX', () => {
      beforeEach(() => {
        mount(<Element id="test" />);
      });

      it('should render existing Node', () => {
        expect(NodeElementTest).toHaveBeenCalledWith({
          id: existingLinkedNode.id,
        });
      });
    });
    describe('when type is the different from JSX', () => {
      beforeEach(() => {
        mount(<Element id="test" is="h1" />);
      });

      it('should render a new linked Node', () => {
        expect(NodeElementTest).toHaveBeenCalledWith({
          id: newLinkedNode.id,
        });
      });
    });
  });
});
