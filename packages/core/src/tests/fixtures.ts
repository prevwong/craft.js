/**
 * Nodes
 */
import { createTestNode } from '../utils/createTestNode';

export const rootNode = createTestNode('ROOT', {
  name: 'Document',
  displayName: 'Document',
  type: 'Document',
  isCanvas: true,
  nodes: [],
});

export const leafNode = createTestNode('node-L1eGyOJ4m', {
  props: { childrenString: 'Header 1' },
  name: 'Text',
  displayName: 'Text',
});

export const primaryButton = createTestNode('node-primary-button', {
  props: { childrenString: 'Button one' },
  name: 'Button',
  displayName: 'Button',
});

export const secondaryButton = createTestNode('node-secondary-button', {
  props: { childrenString: 'Button two' },
  name: 'Button',
  displayName: 'Button',
});

export const card = createTestNode('node-card', {
  name: 'Card',
  displayName: 'Button',
  isCanvas: true,
});

/**
 * Editor states
 */
export const emptyState = {
  nodes: {},
  events: {
    dragged: null,
    selected: null,
    hovered: null,
    indicator: null,
  },
  options: {
    resolver: {
      Document: 'Document',
    },
  },
};

export const documentState = {
  ...emptyState,
  nodes: {
    [rootNode.id]: rootNode,
  },
};

export const documentWithLeafState = {
  ...emptyState,
  nodes: {
    [rootNode.id]: {
      ...rootNode,
      data: { ...rootNode.data, nodes: [leafNode.id] },
    },
    [leafNode.id]: {
      ...leafNode,
      data: { ...leafNode.data, parent: rootNode.id },
    },
  },
};

export const documentWithButtonsState = {
  ...emptyState,
  nodes: {
    [rootNode.id]: {
      ...rootNode,
      data: {
        ...rootNode.data,
        nodes: [primaryButton.id, secondaryButton.id],
      },
    },
    [primaryButton.id]: {
      ...primaryButton,
      data: { ...primaryButton.data, parent: rootNode.id },
    },
    [secondaryButton.id]: {
      ...secondaryButton,
      data: { ...secondaryButton.data, parent: rootNode.id },
    },
  },
};

export const documentWithCardState = {
  ...emptyState,
  nodes: {
    [rootNode.id]: {
      ...rootNode,
      data: { ...rootNode.data, nodes: [card.id] },
    },
    [card.id]: {
      ...card,
      data: {
        ...card.data,
        nodes: [primaryButton.id, secondaryButton.id],
        parent: rootNode.id,
      },
    },
    [primaryButton.id]: {
      ...primaryButton,
      data: { ...primaryButton.data, parent: card.id },
    },
    [secondaryButton.id]: {
      ...secondaryButton,
      data: { ...secondaryButton.data, parent: card.id },
    },
  },
};

// TODO: Find a better way to create test child nodes
export const documentWithVariousNodes = {
  ...documentWithCardState,
  nodes: {
    ...documentWithCardState.nodes,
    'canvas-node': createTestNode('canvas-node', {
      isCanvas: true,
      nodes: [
        'node-reject-dnd',
        'canvas-node-incoming-dnd',
        'canvas-node-reject-outgoing-dnd',
      ],
    }),
    'node-reject-dnd': createTestNode(
      'node-reject-dnd',
      {
        nodes: ['non-immediate-canvas-child'],
        parent: 'canvas-node',
      },
      {
        rules: {
          canDrag: () => false,
        },
      }
    ),
    'canvas-node-reject-incoming-dnd': createTestNode(
      'canvas-node-reject-incoming-dnd',
      {
        nodes: [],
        parent: 'canvas-node',
        isCanvas: true,
      },
      {
        rules: {
          canMoveIn: () => false,
        },
      }
    ),
    'canvas-node-reject-outgoing-dnd': createTestNode(
      'canvas-node-reject-outgoing-dnd',
      {
        nodes: ['fixed-child-node', 'parent-of-linked-node'],
        parent: 'canvas-node',
        isCanvas: true,
      },
      {
        rules: {
          canMoveOut: () => false,
        },
      }
    ),
    'non-immediate-canvas-child': createTestNode('non-immediate-canvas-child', {
      parent: 'node-reject-dnd',
    }),
    'fixed-child-node': createTestNode('fixed-child-node', {
      parent: 'canvas-node-reject-outgoing-dnd',
    }),
    'parent-of-linked-node': createTestNode('parent-of-linked-node', {
      isCanvas: true,
      parent: 'canvas-node-reject-outgoing-dnd',
      linkedNodes: {
        test: 'linked-node',
      },
    }),
    'linked-node': createTestNode('linked-node', {
      isCanvas: true,
      parent: 'parent-of-linked-node',
      nodes: ['linked-node-child-canvas'],
    }),
    'linked-node-child-canvas': createTestNode('linked-node-child-canvas', {
      isCanvas: true,
      parent: 'linked-node',
    }),
  },
};
