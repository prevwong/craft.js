import { createTestState } from '@craftjs/core';

import { wrapRogueElement } from '../wrapRogueElement';

let state;

const testWrapRogueElement = (state) => {
  return wrapRogueElement(
    createTestState({
      nodes: {
        id: 'ROOT',
        data: {
          type: 'Document',
          nodes: state,
        },
      },
    }),
    'SLATE',
    ['Typography', 'Text', 'List', 'ListItem']
  );
};

describe('wrapRogueElement', () => {
  beforeEach(() => {
    state = testWrapRogueElement([
      {
        id: 'B1',
        data: {
          type: 'Button',
        },
      },
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
        id: 'B2',
        data: {
          type: 'Button',
        },
      },
    ]);
  });
  it('should create new slate node in place of rogue node', () => {
    expect(state.nodes['ROOT'].data.nodes[0]).toEqual('B1');
    expect(state.nodes['ROOT'].data.nodes[1]).not.toEqual('T1');
    expect(state.nodes['ROOT'].data.nodes[2]).toEqual('B2');
  });
  it('should wrap rogue node in slate node', () => {
    const newSlateNodeId = state.nodes['ROOT'].data.nodes[1];
    expect(state.nodes[newSlateNodeId].data.nodes).toEqual(['T1']);
    expect(state.nodes['T1'].data.parent).toEqual(newSlateNodeId);
  });
});
