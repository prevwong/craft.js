import { Node } from '../interfaces';

export const createTestNode = (id, data, config: Partial<Node> = {}) => {
  return {
    ...config,
    id,
    data: {
      props: {},
      custom: {},
      hidden: false,
      isCanvas: false,
      ...data,
    },
    related: {},
    events: {
      selected: false,
      dragged: false,
      hovered: false,
      ...config.events,
    },
    rules: {
      canMoveIn: () => true,
      canMoveOut: () => true,
      canDrag: () => true,
      ...config.rules,
    },
  };
};
