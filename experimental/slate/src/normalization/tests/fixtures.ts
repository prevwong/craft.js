import { createTestState } from '@craftjs/core';

export const rootTypographyNodes = {
  T1: {
    id: 'T1',
    data: {
      name: 'Typography',
      nodes: ['TT1'],
      parent: 'ROOT',
    },
  },
  TT1: {
    id: 'TT1',
    data: {
      name: 'Text',
      parent: 'T1',
    },
  },
  T2: {
    id: 'T2',
    data: {
      name: 'Typography',
      nodes: ['TT2'],
      parent: 'ROOT',
    },
  },
  TT2: {
    id: 'TT2',
    data: {
      name: 'Text',
      parent: 'T2',
    },
  },

  T3: {
    id: 'T3',
    data: {
      name: 'Typography',
      nodes: ['TT3'],
    },
  },
  TT3: {
    id: 'TT3',
    data: {
      name: 'Text',
      parent: 'T3',
    },
  },
};

export const createBaseSlateState = (nodes: any) =>
  createTestState({
    nodes: {
      id: 'ROOT',
      data: {
        type: 'Document',
        nodes: [
          {
            id: 'SLATE',
            data: {
              type: 'SLATE',
              nodes,
            },
          },
        ],
      },
    },
  });
