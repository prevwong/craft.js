import { createBaseSlateState } from './fixtures';

import { splitSlate } from '../splitSlate';

let state;

const testSplitState = (state) => {
  return splitSlate(createBaseSlateState(state), 'SlateEditor', [
    'Typography',
    'Text',
    'List',
    'ListItem',
  ]);
};

describe('splitSlate', () => {
  beforeEach(() => {
    state = testSplitState([
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
        id: 'T2',
        data: {
          type: 'Typography',
          nodes: [
            {
              id: 'TT2',
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
        id: 'T3',
        data: {
          type: 'Typography',
          nodes: [
            {
              id: 'TT3',
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
                    id: 'TT4',
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
                                id: 'TT5',
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
                                id: 'TT6',
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
    ]);
  });

  it('should have expelled non-Slate node to parent', () => {
    expect(state.nodes['SLATE'].data.nodes).toEqual(['T1']);
    expect(state.nodes['ROOT'].data.nodes[1]).toEqual('B1');
    expect(state.nodes['B1'].data.parent).toEqual('ROOT');
  });
  it('should have wrapped remaining Slate nodes in a new SlateEditor', () => {
    const newSlateNodeId = state.nodes['ROOT'].data.nodes[2];
    expect(state.nodes[newSlateNodeId].data.name).toEqual('SlateEditor');
    expect(state.nodes[newSlateNodeId].data.nodes).toEqual(['T2', 'T3', 'L1']);
    expect(state.nodes['T2'].data.parent).toEqual(newSlateNodeId);
    expect(state.nodes['T3'].data.parent).toEqual(newSlateNodeId);
    expect(state.nodes['T2'].data.nodes).toEqual(['TT2']);
    expect(state.nodes['T3'].data.nodes).toEqual(['TT3']);
  });
  describe('nested', () => {
    it('should have expelled non-Slate node to parent', () => {
      expect(state.nodes['LL2'].data.nodes).toEqual(['TT5']);
      expect(state.nodes['ROOT'].data.nodes[3]).toEqual('B2');
    });
    it('should have wrapped remaining Slate nodes in a new SlateEditor and maintain nested structure', () => {
      const newSlateNodeId = state.nodes['ROOT'].data.nodes[4];
      expect(state.nodes[newSlateNodeId].data.name).toEqual('SlateEditor');
      expect(state.nodes[newSlateNodeId].data.nodes.length).toEqual(1);

      const childListId = state.nodes[newSlateNodeId].data.nodes[0];
      expect(state.nodes[childListId].data.name).toEqual('List');
      expect(state.nodes[childListId].data.nodes.length).toEqual(1);

      const childListItemId = state.nodes[childListId].data.nodes[0];
      expect(state.nodes[childListItemId].data.name).toEqual('ListItem');
      expect(state.nodes[childListItemId].data.nodes.length).toEqual(1);

      const nestedListId = state.nodes[childListItemId].data.nodes[0];
      expect(state.nodes[nestedListId].data.name).toEqual('List');
      expect(state.nodes[nestedListId].data.nodes.length).toEqual(1);

      const nestedChildListItemId = state.nodes[nestedListId].data.nodes[0];
      expect(state.nodes[nestedChildListItemId].data.name).toEqual('ListItem');
      expect(state.nodes[nestedChildListItemId].data.nodes).toEqual(['TT6']);
    });
  });
});
