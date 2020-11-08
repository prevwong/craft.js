import { mount } from 'enzyme';
import identity from 'lodash/identity';
import React from 'react';

import { NodeElement } from '../../nodes/NodeElement';
import { RenderNodeToElement } from '../RenderNode';
import { SimpleElement } from '../SimpleElement';

let nodeContext = {
  id: 1,
  connectors: { connect: identity, drag: identity },
};

let node = {};
let onRender = jest.fn();

jest.mock('../../editor/useInternalEditor', () => ({
  useInternalEditor: () => ({ onRender }),
}));

jest.mock('../../nodes/useInternalNode', () => ({
  useInternalNode: () => ({
    ...node,
    ...nodeContext,
  }),
}));
jest.mock('../../nodes/Canvas', () => ({
  Canvas: () => null,
}));
jest.mock('../../nodes/NodeElement', () => ({
  NodeElement: () => null,
}));

jest.mock('../SimpleElement', () => ({
  SimpleElement: () => null,
}));

describe('<RenderNode />', () => {
  const injectedProps = { className: 'hi', style: { fontSize: 18 } };
  let component;

  beforeEach(() => {
    onRender = jest.fn().mockImplementation(({ render }) => render);
  });

  describe('When the node is hidden', () => {
    beforeEach(() => {
      node = { hidden: true, type: jest.fn() };
      component = mount(<RenderNodeToElement />);
    });
    it('should not have called onRender', () => {
      expect(onRender).not.toHaveBeenCalled();
    });
    it('should not have called type', () => {
      expect(node.type).not.toHaveBeenCalled();
    });
  });

  describe('When the component is a simple component', () => {
    const props = { className: 'hello' };
    beforeEach(() => {
      node = { type: 'h1', props };
      component = mount(<RenderNodeToElement {...injectedProps} />);
    });
    it('should contain a SimpleElement', () => {
      expect(component.find(SimpleElement)).toHaveLength(1);
    });
    it('should have called onRender', () => {
      expect(onRender).toHaveBeenCalled();
    });
  });

  describe('When the node has type and no nodes', () => {
    const type = () => (
      <p>
        <button />
      </p>
    );
    const props = { className: 'hello' };
    beforeEach(() => {
      node = { type, props };
      component = mount(<RenderNodeToElement {...injectedProps} />);
    });
    it('should have called onRender', () => {
      expect(onRender).toHaveBeenCalled();
    });
    it('should not contain a SimpleElement', () => {
      expect(component.find(SimpleElement)).toHaveLength(0);
    });
    it('should contain a button', () => {
      expect(component.find('button')).toHaveLength(1);
    });
  });

  describe('When the node has type and contains nodes', () => {
    const type = ({ children }) => (
      <p>
        <button />
        {children}
      </p>
    );
    const props = { className: 'hello' };
    const nodeId = '3910';

    beforeEach(() => {
      node = { type, props, nodes: [nodeId] };
      component = mount(<RenderNodeToElement />);
    });
    it('should have called onRender', () => {
      expect(onRender).toHaveBeenCalled();
    });
    it('should not contain a SimpleElement', () => {
      expect(component.find(SimpleElement)).toHaveLength(0);
    });
    it('should contain one node element with the right id', () => {
      expect(component.find(NodeElement)).toHaveLength(1);
      expect(component.contains(<NodeElement id={nodeId} />)).toBe(true);
    });
    it('should contain a button', () => {
      expect(component.find('button')).toHaveLength(1);
    });
  });
});
