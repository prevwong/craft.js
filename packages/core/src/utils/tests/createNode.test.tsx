import { createNode } from '../createNode';
import { createTestNode } from '../createTestNode';

const expectNode = (node, testData) => {
  const type = node.data.type;
  const isUserComponent = typeof type === 'function' && !!type.craft;

  const match = createTestNode(node.id, {
    ...testData,
    props: isUserComponent
      ? { ...(type.craft.defaultProps || {}), ...testData.props }
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
    it('should transform a link correctly', () => {
      const data = {
        type: 'a',
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

    describe('when a User Component is passed', () => {
      const Component = () => {};
      Component.craft = {
        custom: {
          css: {
            background: '#fff',
          },
        },
        rules: {
          canMoveIn: () => false,
        },
        defaultProps: {
          text: '#000',
        },
        related: {
          settings: () => {},
        },
      };

      it('should return node with correct type and user component config', () => {
        const data = {
          type: Component,
        };

        const node = createNode({
          data,
        });

        expectNode(node, data);
      });
    });
  });
});
