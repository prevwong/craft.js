import { Element } from '../../nodes';
import { createNode } from '../createNode';
import { createTestNode } from '../createTestNode';

const expectNode = (node, testData) => {
  const type = node.data.type;
  const isUserComponent = typeof type === 'function' && !!type.craft;

  const match = createTestNode(node.id, {
    ...testData,
    props: isUserComponent
      ? { ...(type.craft.props || {}), ...testData.props }
      : testData.props || {},
    custom: isUserComponent ? type.craft.custom : {},
    name: typeof type === 'string' ? type : type.name,
    displayName: typeof type === 'string' ? type : type.name,
  });

  expect(node.data).toEqual(match.data);

  if (!isUserComponent) {
    return;
  }

  if (type.craft.rules) {
    Object.keys(type.craft.rules).forEach((name) => {
      expect(node.rules[name]).toEqual(type.craft.rules[name]);
    });
  }

  if (type.craft.related) {
    Object.keys(type.craft.related).forEach((name) => {
      expect(node.related[name]).toEqual(expect.any(Function));
    });
  }
};

describe('createNode', () => {
  const props = { href: 'href' };

  describe('Returns correct type and props', () => {
    it('should create a Node object correctly', () => {
      const data = {
        type: 'a',
        parent: null,
        props,
      };

      const node = createNode({
        data,
      });

      expectNode(node, data);
    });
    it('should normalise data correctly', () => {
      const extraData = { props: { style: 'purple' } };

      const { data } = createNode(
        {
          data: { type: 'button', props },
        },
        (node) => {
          node.data.props = {
            ...node.data.props,
            ...extraData.props,
          };
        }
      );

      expect({ type: data.type, props: data.props }).toEqual({
        type: 'button',
        props: {
          ...props,
          ...extraData.props,
        },
      });
    });
    describe('When type=Element', () => {
      it('should parse Element props as node config', () => {
        const testNode = {
          data: {
            type: Element,
            parent: 'ROOT',
            props: {
              is: 'a',
              href: 'craft.js.org',
              style: { color: '#fff' },
            },
          },
        };
        const node = createNode(testNode);

        const { is: type, ...props } = testNode.data.props;

        expectNode(node, {
          type,
          props,
          parent: 'ROOT',
        });
      });
    });
    describe('when a User Component is passed', () => {
      let Component;

      beforeEach(() => {
        Component = () => {
          return null;
        };

        Component.craft = {
          custom: {
            css: {
              background: '#fff',
            },
          },
          rules: {
            canMoveIn: () => false,
          },
          props: {
            text: '#000',
          },
          related: {
            settings: () => {},
          },
        };
      });

      it('should return node with correct type and user component config', () => {
        const data = {
          type: Component,
          parent: null,
          props: {},
        };

        const node = createNode({
          data,
        });

        expectNode(node, data);
      });
    });
  });
});
