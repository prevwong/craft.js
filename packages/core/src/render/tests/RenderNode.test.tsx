import { render } from '@testing-library/react';
import identity from 'lodash/identity';
import React from 'react';

import { NodeData } from '../../interfaces';
import { RenderNodeToElement } from '../RenderNode';

let nodeContext = {
  id: 1,
  connectors: { connect: identity, drag: identity },
};

let node: Partial<NodeData> = {};
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
  let component;

  beforeEach(() => {
    onRender = jest.fn().mockImplementation(({ render }) => render);
  });

  describe('When the node is hidden', () => {
    beforeEach(() => {
      node = { hidden: true, type: jest.fn() };
      component = render(<RenderNodeToElement />);
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
      component = render(<RenderNodeToElement />);
    });
    it('should have called onRender', () => {
      expect(onRender).toHaveBeenCalled();
    });
  });

  describe('When the node has type and no nodes', () => {
    const type = () => (
      <p>
        <button data-testid="test-button" />
      </p>
    );
    const props = { className: 'hello' };
    beforeEach(() => {
      node = { type, props };
      component = render(<RenderNodeToElement />);
    });
    it('should have called onRender', () => {
      expect(onRender).toHaveBeenCalled();
    });
    it('should contain a button', () => {
      expect(component.getByTestId('test-button')).not.toEqual(null);
    });
  });

  describe('When the node has type and contains nodes', () => {
    const type = ({ children }) => (
      <p>
        <button data-testid="test-button" />
        {children}
      </p>
    );
    const props = { className: 'hello' };
    const nodeId = '3910';

    beforeEach(() => {
      node = { type, props, nodes: [nodeId] };
      component = render(<RenderNodeToElement />);
    });
    it('should have called onRender', () => {
      expect(onRender).toHaveBeenCalled();
    });
    it('should contain a button', () => {
      expect(component.getByTestId('test-button')).not.toEqual(null);
    });
  });
});
