import React from 'react';

import {
  rootNode,
  card,
  primaryButton,
  secondaryButton,
  documentWithCardState,
} from '../../tests/fixtures';
import { QueryMethods } from '../query';

let mockedResolveComponent = jest.fn().mockImplementation(() => null);
let mockedCreateNode = jest.fn().mockImplementation(() => null);
let mockedParsedNodeFromJsx = jest.fn().mockImplementation(() => null);
let mockedDeserializeNode = jest.fn().mockImplementation(() => null);

jest.mock('../../utils/resolveComponent', () => ({
  resolveComponent: (...args) => mockedResolveComponent(...args),
}));
jest.mock('../../utils/createNode', () => ({
  createNode: (...args) => mockedCreateNode(...args),
}));
jest.mock('../../utils/parseNodeFromJSX', () => ({
  parseNodeFromJSX: (...args) => mockedParsedNodeFromJsx(...args),
}));
jest.mock('../../utils/deserializeNode', () => ({
  deserializeNode: (...args) => mockedDeserializeNode(...args),
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
        linkedNodes: {},
        name: null,
        displayName: 'h2',
        hidden: false,
      };

      beforeEach(() => {
        mockedDeserializeNode = jest.fn().mockImplementation((...args) => {
          const { deserializeNode } = jest.requireActual(
            '../../utils/deserializeNode'
          );
          return deserializeNode(...args);
        });
        query.parseSerializedNode(data).toNode();
      });

      it('should call deserializeNode', () => {
        expect(mockedDeserializeNode).toBeCalledWith(
          data,
          state.options.resolver
        );
      });

      it('should call parseNodeFromJSX', () => {
        expect(mockedCreateNode).toHaveBeenCalledWith(
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
        query
          .parseFreshNode({
            data: {
              type: 'h1',
            },
          })
          .toNode();
      });

      it('should call createNode', () => {
        expect(mockedCreateNode).toHaveBeenCalledWith(
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

    describe('when we cant resolve a name', () => {
      it('should throw an error', () => {
        expect(() => query.parseReactElement(node).toNodeTree()).toThrow();
      });
    });

    describe('when we can resolve the type', () => {
      beforeEach(() => {
        mockedResolveComponent = jest.fn().mockImplementation(() => name);
        mockedParsedNodeFromJsx = jest.fn().mockImplementation(() => {
          return { ...rootNode.data, type: 'div' };
        });

        tree = query.parseReactElement(node).toNodeTree();
      });

      it('should have changed the displayName and name of the node', () => {
        expect(rootNode.data.name).toEqual(name);
      });

      describe('when there is a single node with no children', () => {
        const node = <button />;
        beforeEach(() => {
          mockedParsedNodeFromJsx = jest
            .fn()
            .mockImplementation(() => rootNode);
          tree = query.parseReactElement(node).toNodeTree();
        });

        it('should have called parseNodeFromJSX once', () => {
          expect(mockedParsedNodeFromJsx).toHaveBeenCalledTimes(1);
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
          mockedParsedNodeFromJsx = jest
            .fn()
            .mockImplementationOnce(() => rootNode)
            .mockImplementationOnce(() => card)
            .mockImplementationOnce(() => primaryButton)
            .mockImplementationOnce(() => secondaryButton);
          tree = query.parseReactElement(node).toNodeTree();
        });
        it('should have called parseNodeFromReactNode 4 times', () => {
          expect(mockedParsedNodeFromJsx).toHaveBeenCalledTimes(4);
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
