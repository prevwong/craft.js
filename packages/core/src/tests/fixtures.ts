/**
 * Nodes
 */
export const rootNode = {
  id: "canvas-ROOT",
  data: {
    props: {},
    name: "Document",
    displayName: "Document",
    custom: {},
    nodes: [],
    type: { resolvedName: "Document" },
  },
  related: {},
  events: { selected: false, dragged: false, hovered: false },
  rules: {},
};

export const leafNode = {
  id: "node-L1eGyOJ4m",
  data: {
    props: { childrenString: "Header 1" },
    name: "Text",
    displayName: "Text",
    custom: {},
  },
  related: {},
  events: { selected: false, dragged: false, hovered: false },
  rules: {},
};

export const primaryButton = {
  id: "node-primary-button",
  data: {
    props: { childrenString: "Button one" },
    name: "Button",
    displayName: "Button",
    custom: {},
  },
  related: {},
  events: { selected: false, dragged: false, hovered: false },
  rules: {},
};

export const secondaryButton = {
  id: "node-secondary-button",
  data: {
    props: { childrenString: "Button two" },
    name: "Button",
    displayName: "Button",
    custom: {},
  },
  related: {},
  events: { selected: false, dragged: false, hovered: false },
  rules: {},
};

export const card = {
  id: "card",
  data: {
    props: {},
    name: "Card",
    displayName: "Button",
    custom: {},
  },
  related: {},
  events: { selected: false, dragged: false, hovered: false },
  rules: {},
};

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
      Document: "div",
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
      data: { ...rootNode.data, nodes: [primaryButton.id, secondaryButton.id] },
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
