import React from 'react';

import {
  rootNode,
  card,
  primaryButton,
  secondaryButton,
  documentWithCardState,
} from '../../tests/fixtures';
import { createNode } from '../../utils/createNode';
import { deserializeNode } from '../../utils/deserializeNode';
import { parseNodeFromJSX } from '../../utils/parseNodeFromJSX';
import { resolveComponent } from '../../utils/resolveComponent';
import { QueryMethods } from '../query';

jest.mock('../../utils/resolveComponent', () => ({
  resolveComponent: () => null,
}));
jest.mock('../../utils/createNode', () => ({
  createNode: () => null,
}));
jest.mock('../../utils/parseNodeFromJSX', () => ({
  parseNodeFromJSX: () => null,
}));
jest.mock('../../utils/deserializeNode', () => ({
  deserializeNode: () => null,
}));

describe('query', () => {
  const resolver = { H1: () => null };
  let query;
  let state;

  beforeEach(() => {
    state = { options: { resolver } };
    query = QueryMethods(state);
  });

  describe('parseSerializedNode', () => {
    describe('toNode', () => {
      let data = {
        type: 'h2',
        props: { className: 'hello' },
        nodes: [],
        custom: {},
        isCanvas: false,
        parent: null,

        displayName: 'h2',
        hidden: false,
      };

      beforeEach(() => {
        deserializeNode = jest.fn().mockImplementation(() => data);
        createNode = jest.fn().mockImplementation(() => null);

        query.parseSerializedNode(data).toNode();
      });

      it('should call deserializeNode', () => {
        expect(deserializeNode).toBeCalledWith(data, state.options.resolver);
      });

      it('should call parseNodeFromJSX', () => {
        expect(createNode).toHaveBeenCalledWith(
          {
            data,
          },
          expect.any(Function)
        );
      });
    });
  });

  describe('parseFreshNode', () => {
    describe('toNode', () => {
      let data = {
        type: 'h1',
      };

      beforeEach(() => {
        createNode = jest.fn().mockImplementation(() => null);
        query
          .parseFreshNode({
            data: {
              type: 'h1',
            },
          })
          .toNode();
      });

      it('should call createNode', () => {
        expect(createNode).toHaveBeenCalledWith(
          {
            data,
          },
          expect.any(Function)
        );
      });
    });
  });

  describe('parseReactElement', () => {
    let tree;
    const node = <h1>Hello</h1>;
    const name = 'Document';
    const nodeData = { ...rootNode.data, type: 'div' };

    describe('when we cant resolve a name', () => {
      beforeEach(() => {
        parseNodeFromJSX = jest.fn().mockImplementation(() => {
          throw new Error();
        });
      });
      it('should throw an error', () => {
        expect(() => query.parseReactElement(node).toNodeTree()).toThrow();
      });
    });

    describe('when we can resolve the type', () => {
      beforeEach(() => {
        resolveComponent = jest.fn().mockImplementation(() => name);
        parseNodeFromJSX = jest.fn().mockImplementation(() => {
          resolveComponent(state.options.resolver, nodeData.type);
          return { ...rootNode.data, type: 'div' };
        });

        tree = query.parseReactElement(node).toNodeTree();
      });
      it('should have called the resolveComponent', () => {
        expect(resolveComponent).toHaveBeenCalledWith(
          state.options.resolver,
          nodeData.type
        );
      });
      it('should have changed the displayName and name of the node', () => {
        expect(rootNode.data.name).toEqual(name);
      });

      describe('when there is a single node with no children', () => {
        const node = <button />;
        beforeEach(() => {
          parseNodeFromJSX = jest.fn().mockImplementation(() => rootNode);
          tree = query.parseReactElement(node).toNodeTree();
        });

        it('should have called parseNodeFromJSX once', () => {
          expect(parseNodeFromJSX).toHaveBeenCalledTimes(1);
        });
        it('should have replied with the right payload', () => {
          expect(tree).toEqual({
            rootNodeId: rootNode.id,
            nodes: { [rootNode.id]: rootNode },
          });
        });
      });

      describe('when there is a complex tree', () => {
        const node = (
          <div id="root">
            <div id="card">
              <button>one</button>
              <button>two</button>
            </div>
          </div>
        );
        beforeEach(() => {
          parseNodeFromJSX = jest
            .fn()
            .mockImplementationOnce(() => rootNode)
            .mockImplementationOnce(() => card)
            .mockImplementationOnce(() => primaryButton)
            .mockImplementationOnce(() => secondaryButton);
          tree = query.parseReactElement(node).toNodeTree();
        });
        it('should have called parseNodeFromReactNode 4 times', () => {
          expect(parseNodeFromJSX).toHaveBeenCalledTimes(4);
        });
        it('should have replied with the right payload', () => {
          expect(tree).toEqual({
            rootNodeId: rootNode.id,
            nodes: documentWithCardState.nodes,
          });
        });
      });
    });
  });
  describe('getState', () => {
    it('should return the EditorState', () => {
      expect(query.getState()).toEqual(state);
    });
  });
});
