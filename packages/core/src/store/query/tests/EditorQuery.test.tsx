import { ROOT_NODE } from '@craftjs/utils';
import React from 'react';

import { EditorStore } from '../../EditorStore';
import { EditorQuery } from '../EditorQuery';
import { EventQuery } from '../EventQuery';
import { NodeQuery } from '../NodeQuery';

const Button = () => null;
const NotInResolverComponent = () => null;
const nodes = {
  ROOT: {
    id: 'ROOT',
    type: 'div',
    displayName: 'div',
    isCanvas: true,
    nodes: ['nodeA'],
    linkedNodes: {},
    props: {},
    custom: {},
    hidden: false,
    parent: null,
  },
  nodeA: {
    id: 'nodeA',
    type: 'button',
    displayName: 'button',
    isCanvas: false,
    nodes: [],
    linkedNodes: {},
    props: { text: 'hello' },
    custom: {},
    hidden: false,
    parent: 'ROOT',
  },
  nodeB: {
    id: 'nodeB',
    type: 'Button',
    displayName: 'Button',
    isCanvas: false,
    nodes: [],
    linkedNodes: {},
    props: { color: 'primary' },
    custom: {},
    hidden: false,
    parent: 'ROOT',
  },
};

describe('EditorQuery', () => {
  const resolver = { Button };
  let store: EditorStore;
  let query: EditorQuery;

  beforeEach(() => {
    store = new EditorStore({
      resolver,
      state: {
        nodes,
        indicator: {
          error: null,
          placement: {
            parentNodeId: 'ROOT',
            currentNodeId: null,
            index: 0,
            where: 'after',
          },
        },
      },
    });
    query = new EditorQuery(store);
  });

  describe('isEnabled', () => {
    it('should return state.enabled', () => {
      expect(query.isEnabled()).toEqual(store.getState().enabled);
    });
  });

  describe('root', () => {
    it('should return a record of the ROOT NodeQuery', () => {
      expect(query.root instanceof NodeQuery).toEqual(true);
      expect(query.root.id).toEqual(ROOT_NODE);
    });
  });

  describe('node', () => {
    it('should return an instance of NodeQuery', () => {
      expect(query.node('ROOT') instanceof NodeQuery).toEqual(true);
    });
    it('should return null if non-existing node', () => {
      expect(query.node('node-non-existing')).toEqual(null);
    });
  });

  describe('event', () => {
    it('should returnan instance of EventQuery', () => {
      ['selected', 'hovered', 'dragged'].forEach((eventType: any) => {
        expect(query.event(eventType) instanceof EventQuery).toEqual(true);
      });
    });
  });

  describe('getState', () => {
    it('should return the EditorState', () => {
      expect(query.getState()).toEqual(store.getState());
    });
  });

  describe('Legacy State accessors', () => {
    it('should be able to access legacy EditorState', () => {
      expect({
        nodes: query.nodes,
        events: query.events,
        options: query.options,
        indicator: query.indicator,
      }).toEqual({
        nodes: Object.keys(nodes).reduce(
          (accum, id) => ({
            ...accum,
            [id]: expect.any(NodeQuery),
          }),
          {}
        ),
        events: store.getState().events,
        options: {
          ...store.config,
          enabled: store.getState().enabled,
        },
        indicator: {
          ...store.getState().indicator,
          placement: {
            ...store.getState().indicator.placement,
            currentNode: null,
            parent: expect.any(NodeQuery),
          },
        },
      });
    });
  });
  describe('serialize', () => {
    it('when version is latest', () => {
      expect(query.serialize()).toEqual(
        JSON.stringify(
          Object.keys(store.getState().nodes).reduce(
            (accum, id) => ({
              ...accum,
              [id]: new NodeQuery(store, id).getState(),
            }),
            {}
          )
        )
      );
    });
    it('when version is v1', () => {
      expect(query.serialize({ version: 'v1' })).toEqual(
        JSON.stringify(
          Object.keys(store.getState().nodes).reduce(
            (accum, id) => ({
              ...accum,
              [id]: new NodeQuery(store, id).toSerializedNode(),
            }),
            {}
          )
        )
      );
    });
  });

  describe('Legacy Queries', () => {
    describe('getSerializedNodes', () => {
      it('should return SerializedNodes', () => {
        expect(query.getSerializedNodes()).toEqual(
          Object.keys(store.getState().nodes).reduce(
            (accum, id) => ({
              ...accum,
              [id]: new NodeQuery(store, id).toSerializedNode(),
            }),
            {}
          )
        );
      });
    });
    describe('parseReactElement', () => {
      describe('toNodeTree', () => {
        it('should throw if return an unresolved type', () => {
          expect(() =>
            query.parseReactElement(<NotInResolverComponent />).toNodeTree()
          ).toThrow();
        });

        it('should be able to create a NodeTree', () => {
          const element = (
            <div id="root">
              <div id="card">
                <button>one</button>
                <button>two</button>
                <Button />
              </div>
            </div>
          );

          const tree = query.parseReactElement(element).toNodeTree();

          const validateTree = (id, element, parent = null) => {
            const nodeData = tree.nodes[id].data;
            const { nodes } = nodeData;

            const { children, ...props } = element.props;

            expect(nodeData).toEqual({
              props: {
                ...props,
                ...(nodes.length === 0 ? { children } : {}),
              },
              type: element.type,
              displayName:
                typeof element.type === 'string'
                  ? element.type
                  : element.type.name,
              linkedNodes: {},
              hidden: false,
              custom: {},
              parent,
              isCanvas: false,
              nodes,
              name:
                typeof element.type === 'string'
                  ? element.type
                  : element.type.name,
            });

            if (!element.props.children) {
              expect(nodes.length).toEqual(0);
              return id;
            }

            const childNodes = React.Children.map(
              element.props.children,
              (el, i) => {
                if (!React.isValidElement(el)) {
                  return;
                }

                return validateTree(nodes[i], el, id);
              }
            );

            expect(nodes).toEqual(childNodes);
            return id;
          };

          validateTree(tree.rootNodeId, element);
        });
      });
    });
    describe('parseFreshNode', () => {
      describe('toNode', () => {
        it('should throw if return an unresolved type', () => {
          expect(() =>
            query
              .parseFreshNode({
                data: {
                  type: NotInResolverComponent,
                },
              })
              .toNode()
          ).toThrow();
        });
        it('should be able to return a new Node object', () => {
          [
            {
              data: {
                type: 'h1',
              },
            },
            {
              data: {
                type: Button,
                props: { color: '#000' },
                custom: { value: 0 },
              },
            },
          ].forEach((input) => {
            expect(query.parseFreshNode(input).toNode()).toEqual({
              id: expect.any(String),
              data: {
                isCanvas: false,
                linkedNodes: {},
                nodes: [],
                parent: null,
                hidden: false,
                props: {},
                custom: {},
                ...input.data,
                type: input.data.type,
                displayName:
                  typeof input.data.type === 'string'
                    ? input.data.type
                    : input.data.type.name,
                name:
                  typeof input.data.type === 'string'
                    ? input.data.type
                    : input.data.type.name,
              },
              dom: null,
              events: {
                dragged: false,
                hovered: false,
                selected: false,
              },
              related: {},
              rules: {
                canDrag: expect.any(Function),
                canDrop: expect.any(Function),
                canMoveIn: expect.any(Function),
                canMoveOut: expect.any(Function),
              },
            });
          });
        });
      });
    });
    describe('parseSerializedNode', () => {
      describe('toNode', () => {
        let data = {
          type: 'h2',
          name: 'h2',
          props: { className: 'hello' },
          nodes: [],
          custom: {},
          linkedNodes: {},
          isCanvas: false,
          parent: null,
          displayName: 'h2',
          hidden: false,
        };

        beforeEach(() => {
          jest.spyOn(query, 'parseFreshNode');
          query.parseSerializedNode(data).toNode();
        });

        it('should call parseNodeFromJSX', () => {
          expect(query.parseFreshNode).toHaveBeenCalledWith({
            data,
          });
        });
      });
    });
  });
});
