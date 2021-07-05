import { createBaseSlateState } from './fixtures';

import { getSplitOperations } from '../getSplitOperations';

let operations;

const testSplitState = (state) => {
  return getSplitOperations(createBaseSlateState(state), 'SLATE', 'SLATE', [
    'Typography',
    'List',
    'ListItem',
    'Text',
  ]);
};

describe('splitSlate', () => {
  beforeAll(() => {
    operations = testSplitState([
      {
        id: 'T1',
        data: {
          type: 'Typography',
          nodes: [
            {
              id: 'TT1',
              data: {
                type: 'Text',
                props: {
                  text: 'Hello',
                },
              },
            },
          ],
        },
      },
      {
        id: 'B1',
        data: {
          type: 'Button',
        },
      },
      {
        id: 'L1',
        data: {
          type: 'List',
          nodes: [
            {
              id: 'LL1',
              data: {
                type: 'ListItem',
                nodes: [
                  {
                    id: 'TT2',
                    data: {
                      type: 'Text',
                      props: {
                        text: 'ListItem-Text',
                      },
                    },
                  },
                  {
                    id: 'L2',
                    data: {
                      type: 'List',
                      nodes: [
                        {
                          id: 'LL2',
                          data: {
                            type: 'ListItem',
                            nodes: [
                              {
                                id: 'TT3',
                                data: {
                                  type: 'Text',
                                  props: {
                                    text: 'ListItem-ListItem-Text',
                                  },
                                },
                              },
                              {
                                id: 'B2',
                                data: {
                                  type: 'Button',
                                },
                              },
                              {
                                id: 'TT4',
                                data: {
                                  type: 'Text',
                                  props: {
                                    text: 'ListItem-ListItem-Text2',
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: 'SLATE2',
        data: {
          type: 'SLATE',
          nodes: [
            {
              id: 'S2T1',
              data: {
                type: 'Typography',
                nodes: [
                  {
                    id: 'S2C1',
                    data: {
                      type: 'Card',
                      nodes: [
                        {
                          id: 'SLATE3',
                          data: {
                            type: 'SLATE',
                            nodes: [
                              {
                                id: 'S3T1',
                                data: {
                                  type: 'Typography',
                                  nodes: [
                                    {
                                      id: 'S3TT1',
                                      data: {
                                        type: 'Text',
                                        props: {
                                          text: 'Hello',
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    id: 'S2TT1',
                    data: {
                      type: 'Text',
                      props: {
                        text: 'Hello',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });
  it('should have expelled non-Slate node', () => {
    expect(operations[0]).toEqual({
      type: 'expel',
      id: 'B1',
    });
  });
  it('should have created a new Slate tree for next Slate nodes', () => {
    expect(operations[1]).toEqual({
      type: 'insert_tree',
      tree: {
        SLATE: {
          id: 'SLATE',
          expelled: false,
          nodes: ['L1'],
        },
        L1: {
          id: 'L1',
          expelled: true,
          nodes: ['LL1'],
        },
        LL1: {
          id: 'LL1',
          expelled: true,
          nodes: ['TT2', 'L2'],
        },
        TT2: {
          id: 'TT2',
          expelled: true,
          nodes: [],
        },
        L2: {
          id: 'L2',
          expelled: true,
          nodes: ['LL2'],
        },
        LL2: {
          id: 'LL2',
          expelled: true,
          nodes: ['TT3'],
        },
        TT3: {
          id: 'TT3',
          expelled: true,
          nodes: [],
        },
      },
    });
  });
  it('should expel nested non-Slate node', () => {
    expect(operations[2]).toEqual({
      type: 'expel',
      id: 'B2',
    });
  });
  it('should have created a new Slate tree for the remaining Slate nodes', () => {
    expect(operations[3]).toEqual({
      type: 'insert_tree',
      tree: {
        SLATE: {
          id: 'SLATE',
          expelled: false,
          nodes: ['L1'],
        },
        L1: {
          id: 'L1',
          expelled: true,
          nodes: ['LL1'],
        },
        LL1: {
          id: 'LL1',
          expelled: true,
          nodes: ['L2'],
        },

        L2: {
          id: 'L2',
          expelled: true,
          nodes: ['LL2'],
        },
        LL2: {
          id: 'LL2',
          expelled: true,
          nodes: ['TT4'],
        },
        TT4: {
          id: 'TT4',
          expelled: true,
          nodes: [],
        },
      },
    });
  });
  it('should have expand nested Slate node', () => {
    expect(operations[4]).toEqual({
      type: 'expand',
      id: 'SLATE2',
    });
  });
  it('should expel nested non-Slate node from nested Slate node', () => {
    expect(operations[5]).toEqual({
      type: 'expel',
      id: 'S2C1',
    });
  });
  it('should have created a new Slate tree for the remaining Slate nodes', () => {
    expect(operations[6]).toEqual({
      type: 'insert_tree',
      tree: {
        SLATE: {
          id: 'SLATE',
          expelled: false,
          nodes: ['S2T1'],
        },
        S2T1: {
          id: 'S2T1',
          expelled: true,
          nodes: ['S2TT1'],
        },
        S2TT1: {
          id: 'S2TT1',
          expelled: true,
          nodes: [],
        },
      },
    });
  });
});
